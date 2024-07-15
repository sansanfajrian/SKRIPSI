package com.taskmanagement.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.services.calendar.model.CalendarListEntry;
import com.taskmanagement.config.MinioConfig;
import com.taskmanagement.dto.BacklogDropdownResponseDTO;
import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.dto.ProjectDto;
import com.taskmanagement.dto.ProjectFetchDTO;
import com.taskmanagement.dto.ProjectResponseDto;
import com.taskmanagement.dto.SprintResponseDTO;
import com.taskmanagement.dto.StoryDropdownResponseDTO;
import com.taskmanagement.dto.TeamMemberProjectResponseDTO;
import com.taskmanagement.dto.UsersResponseDto;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.TeamMember;
import com.taskmanagement.entity.User;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.BacklogService;
import com.taskmanagement.service.CalendarService;
import com.taskmanagement.service.ProjectService;
import com.taskmanagement.service.SprintService;
import com.taskmanagement.service.StoryService;
import com.taskmanagement.service.TeamMemberService;
import com.taskmanagement.service.UserService;
import com.taskmanagement.utility.Constants.ProjectStatus;
import com.taskmanagement.utility.MinioUtils;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Authorization;

@RestController
@RequestMapping("api/project/")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    Logger LOG = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private SprintService sprintService;

    @Autowired
    private StoryService storyService;

    @Autowired
    private TeamMemberService teamMemberService;

    @Autowired
    private BacklogService backlogService;

    @Autowired
    private CalendarService calendarService;
    

    @Autowired
    private MinioUtils minioUtils;

    @Autowired
    private MinioConfig minioConfig;

    @GetMapping("fetch")
    @ApiOperation(value = "Api to fetch project")
    public ResponseEntity<ProjectFetchDTO> fetchAllProjects() {
        try {
            ProjectFetchDTO response = new ProjectFetchDTO();
            List<Project> projects = projectService.getAllProjects();
            List<ProjectResponseDto> projectDtos = projects.stream().map(project -> {
                ProjectResponseDto projectDto = new ProjectResponseDto();
                projectDto.setId(project.getId());
                projectDto.setName(project.getName());
                projectDto.setDescription(project.getDescription());
                projectDto.setStartDate(project.getStartDate());
                projectDto.setStartTime(project.getStartTime());
                projectDto.setDeadlineDate(project.getDeadlineDate());
                projectDto.setDeadlineTime(project.getDeadlineTime());
                projectDto.setReminderEmail(project.getReminderEmail());
                projectDto.setReminderPopup(project.getReminderPopup());
                projectDto.setProjectStatus(project.getStatus());
                projectDto.setManagerId(project.getManagerId());
    
                if (project.getManagerId() != 0) {
                    User manager = userService.getUserId(project.getManagerId());
                    projectDto.setManagerName(manager.getName());
                    projectDto.setManagerImage(manager.getImageUrl());
                }
    
                List<TeamMember> teamMembersByTeam = teamMemberService.findByProjectId(project.getId());
                List<TeamMemberProjectResponseDTO> teamMembers = teamMembersByTeam.stream().map(member -> {
                    User user = member.getUser();
                    TeamMemberProjectResponseDTO memberDto = new TeamMemberProjectResponseDTO();
                    memberDto.setName(user.getName());
                    memberDto.setImageUrl(user.getImageUrl());
                    return memberDto;
                }).collect(Collectors.toList());
    
                projectDto.setTeamMembers(teamMembers);
                return projectDto;
            }).collect(Collectors.toList());
    
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successfully");
    
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ProjectFetchDTO errorResponse = new ProjectFetchDTO();
            errorResponse.setSuccess(false);
            errorResponse.setResponseMessage("An error occurred while fetching project details.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/fetch/employee")
    @ApiOperation(value = "API to fetch projects for current employee")
    public ResponseEntity<ProjectFetchDTO> fetchEmployeeProjects(@CurrentUser UserPrincipal currentUser) {
        try {
            ProjectFetchDTO response = new ProjectFetchDTO();
            
            // Retrieve team member ID for the current user
            int currentUserId = currentUser.getId();
            List<TeamMember> teamMembers = teamMemberService.findByUserId(currentUserId);
            
            // Fetch projects related to the team members of the current user
            List<Project> projects = teamMembers.stream()
                    .map(TeamMember::getProject)
                    .distinct() // Ensure unique projects
                    .collect(Collectors.toList());

            // Map projects to ProjectResponseDto
            List<ProjectResponseDto> projectDtos = projects.stream().map(project -> {
                ProjectResponseDto projectDto = new ProjectResponseDto();
                projectDto.setId(project.getId());
                projectDto.setName(project.getName());
                projectDto.setDescription(project.getDescription());
                projectDto.setStartDate(project.getStartDate());
                projectDto.setStartTime(project.getStartTime());
                projectDto.setDeadlineDate(project.getDeadlineDate());
                projectDto.setDeadlineTime(project.getDeadlineTime());
                projectDto.setReminderEmail(project.getReminderEmail());
                projectDto.setReminderPopup(project.getReminderPopup());
                projectDto.setProjectStatus(project.getStatus());
                projectDto.setManagerId(project.getManagerId());

                if (project.getManagerId() != 0) {
                    User manager = userService.getUserId(project.getManagerId());
                    projectDto.setManagerName(manager.getName());
                    projectDto.setManagerImage(manager.getImageUrl());
                }

                // Fetch team members for the project
                List<TeamMember> teamMembersByProject = teamMemberService.findByProjectId(project.getId());
                List<TeamMemberProjectResponseDTO> teamMemberDtos = teamMembersByProject.stream().map(member -> {
                    User user = member.getUser();
                    TeamMemberProjectResponseDTO memberDto = new TeamMemberProjectResponseDTO();
                    memberDto.setName(user.getName());
                    memberDto.setImageUrl(user.getImageUrl());
                    return memberDto;
                }).collect(Collectors.toList());

                projectDto.setTeamMembers(teamMemberDtos); // Set all team members for this project
                return projectDto;
            }).collect(Collectors.toList());

            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ProjectFetchDTO errorResponse = new ProjectFetchDTO();
            errorResponse.setSuccess(false);
            errorResponse.setResponseMessage("An error occurred while fetching project details.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    @ApiOperation(value = "Get project details by ID", authorizations = { @Authorization(value="jwtToken") })
    public ResponseEntity<ProjectResponseDto> fetchProjectById(@PathVariable Integer id) {
        try {
            Project project = projectService.getProjectById(id);
    
            if (project == null) {
                ProjectResponseDto errorResponse = new ProjectResponseDto();
                errorResponse.setSuccess(false);
                errorResponse.setStatus(false);
                errorResponse.setResponseMessage("Project with ID " + id + " not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
    
            ProjectResponseDto projectDto = new ProjectResponseDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setStartDate(project.getStartDate());
            projectDto.setStartTime(project.getStartTime());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setDeadlineTime(project.getDeadlineTime());
            projectDto.setReminderEmail(project.getReminderEmail());
            projectDto.setReminderPopup(project.getReminderPopup());
            projectDto.setProjectStatus(project.getStatus());
            projectDto.setManagerId(project.getManagerId());
    
            Integer managerId = project.getManagerId();
            if (managerId != null && managerId != 0) {
                User manager = userService.getUserId(managerId);
                if (manager != null) {
                    projectDto.setManagerName(manager.getName());
                    projectDto.setManagerImage(manager.getImageUrl());
                }
            }
    
            // Fetch team members and create DTOs
            List<TeamMember> teamMembersByTeam = teamMemberService.findByProjectId(project.getId());
            List<TeamMemberProjectResponseDTO> teamMembers = teamMembersByTeam.stream().map(member -> {
                User user = member.getUser();
                TeamMemberProjectResponseDTO memberDto = new TeamMemberProjectResponseDTO();
                memberDto.setId(user.getId());
                memberDto.setName(user.getName());
                memberDto.setImageUrl(user.getImageUrl());
                return memberDto;
            }).collect(Collectors.toList());
    
            projectDto.setTeamMembers(teamMembers);
            projectDto.setSuccess(true);
            projectDto.setStatus(true);
            projectDto.setResponseMessage("Project fetched by ID successfully");
    
            return new ResponseEntity<>(projectDto, HttpStatus.OK);
        } catch (Exception e) {
            ProjectResponseDto errorResponse = new ProjectResponseDto();
            errorResponse.setSuccess(false);
            errorResponse.setStatus(false);
            errorResponse.setResponseMessage("An error occurred while fetching project details.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("add")
    @ApiOperation(value = "Api to add project")
    public ResponseEntity<CommonApiResponse> addProject(@RequestBody ProjectDto addProjectRequest) {
        LOG.info("Received request for adding the project" + addProjectRequest);
        try {
            CommonApiResponse response = new CommonApiResponse();
            Project project = buildProjectFromDto(addProjectRequest);
            project.setStatus(ProjectStatus.STARTED.value());

            // Add project using project service
            Project addedProject = projectService.addProject(project);

            // Handle response based on success or failure
            if (addedProject != null) {
                List<Integer> memberIds = addProjectRequest.getMemberIds();
                for (Integer memberId : memberIds) {
                    User userOptional = userService.getUserId(memberId);
                    TeamMember teamMember = new TeamMember();
                    teamMember.setUser(userOptional);
                    teamMember.setProject(addedProject);
                    teamMember.setActive(true);
                    teamMemberService.saveTeamMember(teamMember);
                }
                try {
                    calendarService.addProjectToEvent(addedProject);
                    response.setSuccess(true);
                    response.setResponseMessage("Project Added Successfully");
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } catch (IOException | GeneralSecurityException e) {
                    // Handle calendar integration failure
                    response.setSuccess(false);
                    response.setResponseMessage("Project added but failed to integrate with Google Calendar");
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                // Handle project addition failure
                response.setSuccess(false);
                response.setResponseMessage("Failed to add project");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            CommonApiResponse errorResponse = new CommonApiResponse();
            errorResponse.setSuccess(false);
            errorResponse.setResponseMessage("An error occurred while adding the project.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("edit/{id}")
    @ApiOperation(value = "API to update project")
    public ResponseEntity<CommonApiResponse> updateProject(@PathVariable("id") int id, @RequestBody ProjectDto updateProjectRequest) {
        LOG.info("Received request for updating the project: {}", updateProjectRequest);
        CommonApiResponse response = new CommonApiResponse();
        try {
            Project existingProject = projectService.getProjectById(id);
            if (existingProject == null) {
                response.setSuccess(false);
                response.setResponseMessage("Project not found for id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Update project details
            existingProject.setName(updateProjectRequest.getName());
            existingProject.setDescription(updateProjectRequest.getDescription());
            existingProject.setManagerId(updateProjectRequest.getManagerId());
            existingProject.setStatus(updateProjectRequest.getProjectStatus());
            existingProject.setStartDate(updateProjectRequest.getStartDate());
            existingProject.setDeadlineDate(updateProjectRequest.getDeadlineDate());

            
            Project savedProject = projectService.updateProject(existingProject);
            // Update team members
            if (updateProjectRequest != null && updateProjectRequest.getMemberIds() != null && savedProject != null) {
                List<Integer> newMemberIds = updateProjectRequest.getMemberIds();
                List<TeamMember> existingTeamMembers = teamMemberService.findByProjectId(id);

                // Remove team members not in the new list
                List<TeamMember> teamMembersToDelete = existingTeamMembers.stream()
                        .filter(member -> !newMemberIds.contains(member.getUser().getId()))
                        .collect(Collectors.toList());
                teamMemberService.deleteAll(teamMembersToDelete);

                // Add or update new team members
                List<TeamMember> teamMembersToAddOrUpdate = newMemberIds.stream()
                        .filter(userId -> existingTeamMembers.stream().noneMatch(member -> member.getUser().getId() == userId))
                        .map(userId -> new TeamMember(savedProject, userService.getUserId(userId), true))
                        .collect(Collectors.toList());
                teamMemberService.saveAll(teamMembersToAddOrUpdate);
            } else {
                // Handle case where updateProjectRequest or memberIds is null
                throw new IllegalArgumentException("MemberIds cannot be null in updateProjectRequest");
            }
            
            // Update calendar event
            if(savedProject != null){
                calendarService.updateProjectEvent(savedProject);
                response.setSuccess(true);
                response.setResponseMessage("Project Updated Successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else{
                response.setSuccess(false);
                response.setResponseMessage("Project Update Failed");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException | GeneralSecurityException e) {
            // Handle any unexpected exception
            response.setSuccess(false);
            response.setResponseMessage("Failed to update project: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("delete/{id}")
    @ApiOperation(value = "API to delete project")
    public ResponseEntity<CommonApiResponse> deleteProject(@PathVariable("id") int id) {
        LOG.info("Received request for deleting the project with id: {}", id);
        
        CommonApiResponse response = new CommonApiResponse();
        try {
            Project existingProject = projectService.getProjectById(id);
            if (existingProject == null) {
                response.setSuccess(false);
                response.setResponseMessage("Project not found for id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
    
            // Delete project from database
            projectService.deleteProjectById(id);
    
            // Delete event from Google Calendar if eventId is present
            if (existingProject.getGoogleCalendarEventId() != null) {
                calendarService.deleteEvent(existingProject.getGoogleCalendarEventId());
            }
    
            response.setSuccess(true);
            response.setResponseMessage("Project Deleted Successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException | GeneralSecurityException e) {
            // Log the exception details for debugging
            LOG.error("Failed to delete project with id: {}", id, e);
    
            // Handle any unexpected exception
            response.setSuccess(false);
            response.setResponseMessage("Failed to delete project: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<UsersResponseDto>> getProjectMembers(@PathVariable int projectId) {
        List<UsersResponseDto> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{projectId}/sprints")
    public ResponseEntity<List<SprintResponseDTO>> getProjectSprints(@PathVariable int projectId) {
        List<SprintResponseDTO> sprints = sprintService.getProjectSprints(projectId);
        return ResponseEntity.ok(sprints);
    }

    @GetMapping("/{projectId}/stories")
    public ResponseEntity<List<StoryDropdownResponseDTO>> getProjectStories(@PathVariable int projectId) {
        try {
            List<StoryDropdownResponseDTO> stories = storyService.findDropdownsByProjectId(projectId);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{projectId}/backlog")
    public ResponseEntity<List<BacklogDropdownResponseDTO>> getBacklogsByProjectId(@PathVariable int projectId) {
        try {
            List<BacklogDropdownResponseDTO> backlogs = backlogService.findDropdownsByProjectId(projectId);
            return ResponseEntity.ok(backlogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/calendars")
    @ApiOperation(value = "API to fetch all calendars")
    public ResponseEntity<List<CalendarListEntry>> getAllCalendars() {
        try {
            List<CalendarListEntry> items = calendarService.getAllCalendars();
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (GeneralSecurityException | IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Project buildProjectFromDto(ProjectDto projectDto) {
        // Build project from DTO
        return Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .managerId(projectDto.getManagerId())
                .status(projectDto.getProjectStatus())
                .startDate(projectDto.getStartDate())
                .startTime(projectDto.getStartTime())
                .deadlineDate(projectDto.getDeadlineDate())
                .deadlineTime(projectDto.getDeadlineTime())
                .reminderEmail(projectDto.getReminderEmail())
                .reminderPopup(projectDto.getReminderPopup())
                .build();
    }

}
