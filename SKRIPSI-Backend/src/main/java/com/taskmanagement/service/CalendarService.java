package com.taskmanagement.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.CalendarList;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.TeamMember;
import com.taskmanagement.entity.User;

@Service
public class CalendarService {

    @Autowired
    private UserService userService;

    @Autowired
    private TeamMemberService teamMemberService;

    private static final String APPLICATION_NAME = "Task Management System Calendar";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

    private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT)
            throws IOException {
        // Load client secrets.
        InputStream in = CalendarService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8088).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
        //returns an authorized Credential object.
        return credential;
    }

    private Calendar getCalendarService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public List<CalendarListEntry> getAllCalendars() throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService();
        CalendarList calendarList = service.calendarList().list().execute();
        return calendarList.getItems();
    }

    public void addProjectToEvent(Project project) throws IOException, GeneralSecurityException {
        User user = userService.getUserId(project.getManagerId());
        Calendar service = getCalendarService();

        Event event = new Event()
                .setSummary("Project: " + project.getName())
                .setDescription("Description: " + project.getDescription());

        DateTime startDateTime = new DateTime(project.getStartDate() + "T" + project.getStartTime() + ":00+07:00");
        EventDateTime start = new EventDateTime()
                .setDateTime(startDateTime)
                .setTimeZone("Asia/Jakarta");
        event.setStart(start);

        DateTime endDateTime = new DateTime(project.getDeadlineDate() + "T" + project.getDeadlineTime() + ":00+07:00");
        EventDateTime end = new EventDateTime()
                .setDateTime(endDateTime)
                .setTimeZone("Asia/Jakarta");
        event.setEnd(end);

        // Fetch team members using TeamMemberService
        List<TeamMember> teamMembers = teamMemberService.findByProjectId(project.getId());

        // Map team members to EventAttendee
        List<EventAttendee> attendees = teamMembers.stream()
                .map(member -> new EventAttendee().setEmail(member.getUser().getEmailId()))
                .collect(Collectors.toList());
        attendees.add(new EventAttendee().setEmail(user.getEmailId()));
        event.setAttendees(attendees);

        EventReminder[] reminderOverrides = new EventReminder[]{
                new EventReminder().setMethod("email").setMinutes(project.getReminderEmail()),
                new EventReminder().setMethod("popup").setMinutes(project.getReminderPopup())
        };
        Event.Reminders reminders = new Event.Reminders()
                .setUseDefault(false)
                .setOverrides(Arrays.asList(reminderOverrides));
        event.setReminders(reminders);

        String calendarId = "primary";
        service.events().insert(calendarId, event).execute();
    }

    public void updateProjectEvent(Project project) throws IOException, GeneralSecurityException {
        User user = userService.getUserId(project.getManagerId());
        Calendar service = getCalendarService();
        
        String calendarId = "primary";
        String eventId = "Project_" + project.getId(); // Example: You can define an eventId for your project
        
        // Fetch existing event from calendar
        Event event = service.events().get(calendarId, eventId).execute();
    
        if (event != null) {
            event.setSummary("Project: " + project.getName());
            event.setDescription("Description: " + project.getDescription());
    
            DateTime startDateTime = new DateTime(project.getStartDate() + "T" + project.getStartTime() + ":00+07:00");
            EventDateTime start = new EventDateTime()
                    .setDateTime(startDateTime)
                    .setTimeZone("Asia/Jakarta");
            event.setStart(start);
    
            DateTime endDateTime = new DateTime(project.getDeadlineDate() + "T" + project.getDeadlineTime() + ":00+07:00");
            EventDateTime end = new EventDateTime()
                    .setDateTime(endDateTime)
                    .setTimeZone("Asia/Jakarta");
            event.setEnd(end);
    
            // Fetch team members using TeamMemberService
            List<TeamMember> teamMembers = teamMemberService.findByProjectId(project.getId());
    
            // Map team members to EventAttendee
            List<EventAttendee> attendees = teamMembers.stream()
                    .map(member -> new EventAttendee().setEmail(member.getUser().getEmailId()))
                    .collect(Collectors.toList());
            attendees.add(new EventAttendee().setEmail(user.getEmailId()));
            event.setAttendees(attendees);
    
            EventReminder[] reminderOverrides = new EventReminder[]{
                    new EventReminder().setMethod("email").setMinutes(project.getReminderEmail()),
                    new EventReminder().setMethod("popup").setMinutes(project.getReminderPopup())
            };
            Event.Reminders reminders = new Event.Reminders()
                    .setUseDefault(false)
                    .setOverrides(Arrays.asList(reminderOverrides));
            event.setReminders(reminders);
            
            service.events().update(calendarId, event.getId(), event).execute();
        }
    }
}
