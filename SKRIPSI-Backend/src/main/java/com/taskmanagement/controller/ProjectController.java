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
import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.dto.ProjectDto;
import com.taskmanagement.dto.ProjectFetchDTO;
import com.taskmanagement.dto.ProjectResponseDto;
import com.taskmanagement.dto.SprintResponseDTO;
import com.taskmanagement.dto.TeamMemberProjectResponseDTO;
import com.taskmanagement.dto.UsersResponseDto;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.TeamMember;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.CalendarService;
import com.taskmanagement.service.ProjectService;
import com.taskmanagement.service.SprintService;
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
    private TeamMemberService teamMemberService;

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



    // @PostMapping("add")
    // @ApiOperation(value = "Api to add project")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<CommonApiResponse> addProject(MultipartFile[] documents, String name, String description, String requirement, String startDate, String startTime, String deadlineDate, String deadlineTime, Integer reminderEmail, Integer reminderPopup) {

    //     LOG.info("Received request for adding the project");

    //     CommonApiResponse response = new CommonApiResponse();

    //     // Get today's date
    //     LocalDate today = LocalDate.now();

    //     // Define the desired format yyyy-MM-dd
    //     String desiredFormat = "yyyy-MM-dd"; // Change this format as needed

    //     // Create a DateTimeFormatter with the desired format
    //     DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);

    //     // Format the date to the desired format
    //     String formattedTodaysDate = today.format(formatter);

    //     Project project = Project.builder()
    //             .name(name)
    //             .description(description)
    //             .requirement(requirement)
    //             .startDate(startDate)
    //             .startTime(startTime)
    //             .deadlineDate(deadlineDate)
    //             .deadlineTime(deadlineTime)
    //             .reminderEmail(reminderEmail)
    //             .reminderPopup(reminderPopup)
    //             .build();

    //     if (project == null) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("bad request, missing project data");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     project.setAssignStatus(ProjectAssignStatus.NOT_ASSIGNED.value());
    //     project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());
    //     project.setCreatedDate(formattedTodaysDate);

    //     Set<DocMetadata> docMetadataSet = new HashSet<>();
    //     Arrays.stream(documents).forEach(document -> {
    //         String docId = UUID.randomUUID().toString();
    //         minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
    //         docMetadataSet.add(
    //                 DocMetadata.builder()
    //                         .name(document.getOriginalFilename())
    //                         .size(document.getSize())
    //                         .httpContentType(document.getContentType())
    //                         .docId(docId)
    //                         .build()
    //         );
    //     });
    //     project.setDocMetadata(docMetadataSet);

    //     Project addedProduct = this.projectService.addProject(project);

    //     if (addedProduct != null) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("Project Added Successfully");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //     } else {
    //         response.setSuccess(true);
    //         response.setResponseMessage("Failed to add project");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // @GetMapping("fetch")
    // @ApiOperation(value = "Api to fetch all projects")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjects() {
    //     LOG.info("Recieved request for Fetching all the projects");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjects();

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         List<DocMetadataDto> documents = new ArrayList<>();
    //         project.getDocMetadata().forEach(docMetadata -> {
    //             DocMetadataDto docMetadataDto = new DocMetadataDto();
    //             docMetadataDto.setId(docMetadata.getId());
    //             docMetadataDto.setDocId(docMetadata.getDocId());
    //             docMetadataDto.setName(docMetadata.getName());
    //             docMetadataDto.setSize(docMetadata.getSize());
    //             docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
    //             docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

    //             documents.add(docMetadataDto);
    //         });
    //         projectDto.setDocuments(documents);

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @GetMapping("search")
    // @ApiOperation(value = "Api to fetch all projects by name")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByName(@RequestParam("projectName") String projectName) {
    //     LOG.info("Recieved request for Fetch all projects by name");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjectsByProjectName(projectName);

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         List<DocMetadataDto> documents = new ArrayList<>();
    //         project.getDocMetadata().forEach(docMetadata -> {
    //             DocMetadataDto docMetadataDto = new DocMetadataDto();
    //             docMetadataDto.setId(docMetadata.getId());
    //             docMetadataDto.setDocId(docMetadata.getDocId());
    //             docMetadataDto.setName(docMetadata.getName());
    //             docMetadataDto.setSize(docMetadata.getSize());
    //             docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
    //             docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

    //             documents.add(docMetadataDto);
    //         });
    //         projectDto.setDocuments(documents);

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @GetMapping("search/id")
    // @ApiOperation(value = "Api to fetch all projects by id")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByName(@RequestParam("projectId") int projectId) {
    //     LOG.info("Recieved request for Fetch project by id");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     List<Project> projects = new ArrayList<>();

    //     if (projectId == 0) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Project not found using this Id");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     Project p = this.projectService.getProjectById(projectId);

    //     if (p != null) {
    //         projects.add(p);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         List<DocMetadataDto> documents = new ArrayList<>();
    //         project.getDocMetadata().forEach(docMetadata -> {
    //             DocMetadataDto docMetadataDto = new DocMetadataDto();
    //             docMetadataDto.setId(docMetadata.getId());
    //             docMetadataDto.setDocId(docMetadata.getDocId());
    //             docMetadataDto.setName(docMetadata.getName());
    //             docMetadataDto.setSize(docMetadata.getSize());
    //             docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
    //             docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

    //             documents.add(docMetadataDto);
    //         });
    //         projectDto.setDocuments(documents);

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @PostMapping("update")
    // @ApiOperation(value = "Api to update the project status")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<CommonApiResponse> updateProject(MultipartFile[] documents, Integer id, String name, String description, String requirement, String startDate, String startTime, String deadlineDate, String deadlineTime, Integer[] deletedDocumentIds, String projectStatus, Integer employeeId, Integer managerId, Integer reminderEmail, Integer reminderPopup) {
    //     LOG.info("Received request for updating the project");

    //     CommonApiResponse response = new CommonApiResponse();

    //     UpdateProjectRequestDto updateProjectRequest = new UpdateProjectRequestDto();
    //     updateProjectRequest.setProjectId(id);
    //     updateProjectRequest.setProjectStatus(projectStatus);
    //     updateProjectRequest.setEmployeeId(Optional.ofNullable(employeeId).orElseGet(() -> 0));
    //     updateProjectRequest.setManagerId(Optional.ofNullable(managerId).orElseGet(() -> 0));

    //     if (updateProjectRequest.getProjectId() == 0) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("request data is missing");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     // Get today's date
    //     LocalDate today = LocalDate.now();
    //     String desiredFormat = "yyyy-MM-dd";
    //     DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);
    //     String formattedTodaysDate = today.format(formatter);

    //     Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

    //     if (updateProjectRequest.getManagerId() != 0) { // admin is assigning the project to manager
    //         User manager = this.userService.getUserById(updateProjectRequest.getManagerId());

    //         if (manager == null || !manager.getRole().equals(UserRole.MANAGER.value())) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to assign the project to manager");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         }

    //         project.setManagerId(manager.getId());
    //         project.setAssignedDate(formattedTodaysDate);
    //         project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_EMPLOYEE.value());

    //         Project updatedProject = this.projectService.updateProject(project);

    //         if (updatedProject == null) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to update the project status");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         } else {
    //             response.setSuccess(true);
    //             response.setResponseMessage("assigned project to manager successfully");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //         }

    //     } else if (updateProjectRequest.getEmployeeId() != 0) { // admin is assigning the project to employee
    //         User employee = this.userService.getUserById(updateProjectRequest.getEmployeeId());

    //         if (employee == null || !employee.getRole().equals(UserRole.EMPLOYEE.value())) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to assign the project to employee");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         }

    //         project.setEmployeeId(employee.getId());
    //         project.setStatus(ProjectStatus.PENDING.value());

    //         Project updatedProject = this.projectService.updateProject(project);

    //         if (updatedProject == null) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to assign the project to employee");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         } else {
    //             response.setSuccess(true);
    //             response.setResponseMessage("assigned project to employee successfully");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //         }
    //     } else if (updateProjectRequest.getProjectStatus() != null && !StringUtils.isEmpty(updateProjectRequest.getProjectStatus())) { // employee is updating the project status

    //         project.setStatus(updateProjectRequest.getProjectStatus());

    //         Project updatedProject = this.projectService.updateProject(project);

    //         if (updatedProject == null) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to update the project status");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         } else {
    //             response.setSuccess(true);
    //             response.setResponseMessage("project status updated successfully");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //         }
    //     } else { // update project
    //         project.setName(name);
    //         project.setDescription(description);
    //         project.setRequirement(requirement);
    //         project.setStartDate(startDate);
    //         project.setStartTime(startTime);
    //         project.setDeadlineDate(deadlineDate);
    //         project.setDeadlineTime(deadlineTime);
    //         project.setReminderEmail(reminderEmail);
    //         project.setReminderPopup(reminderPopup);

    //         Set<DocMetadata> docMetadataSet = new HashSet<>();
    //         Arrays.stream(documents).forEach(document -> {
    //             String docId = UUID.randomUUID().toString();
    //             minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
    //             docMetadataSet.add(
    //                     DocMetadata.builder()
    //                             .name(document.getOriginalFilename())
    //                             .size(document.getSize())
    //                             .httpContentType(document.getContentType())
    //                             .docId(docId)
    //                             .build()
    //             );
    //         });
    //         project.getDocMetadata().addAll(docMetadataSet);
    //         project.getDocMetadata().removeIf(docMetadata -> Arrays.asList(deletedDocumentIds).contains(docMetadata.getId()));

    //         Project updatedProject = this.projectService.updateProject(project);

    //         if (deletedDocumentIds != null && deletedDocumentIds.length > 0) {
    //             List<DocMetadata> allProjectDocMetadata = this.projectService.getAllProjectDocMetadata(deletedDocumentIds);
    //             allProjectDocMetadata.forEach(docMetadata -> {
    //                 minioUtils.removeFile(minioConfig.getBucketName(), docMetadata.getDocId());
    //             });
    //             this.projectService.deleteProjectDocuments(deletedDocumentIds);
    //         }

    //         if (updatedProject == null) {
    //             response.setSuccess(true);
    //             response.setResponseMessage("failed to update the project data");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //         } else {
    //             response.setSuccess(true);
    //             response.setResponseMessage("project data updated successfully");
    //             return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //         }
    //     }

    // }

    // @PostMapping("assignToManager")
    // @ApiOperation(value = "Api to assign project to manager")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<CommonApiResponse> assignToManager(@RequestBody UpdateProjectRequestDto updateProjectRequest, @CurrentUser UserPrincipal userPrincipal) throws GeneralSecurityException, IOException {
    //     LOG.info("Received request for assigning project to manager");

    //     CommonApiResponse response = new CommonApiResponse();

    //     if (updateProjectRequest == null) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("request data is missing");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     // Get today's date
    //     LocalDate today = LocalDate.now();
    //     String desiredFormat = "yyyy-MM-dd";
    //     DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);
    //     String formattedTodaysDate = today.format(formatter);

    //     Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

    //     User manager = this.userService.getUserById(updateProjectRequest.getManagerId());

    //     if (manager == null || !manager.getRole().equals(UserRole.MANAGER.value())) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("failed to assign the project to manager");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     project.setManagerId(manager.getId());
    //     project.setAssignedDate(formattedTodaysDate);
    //     project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_EMPLOYEE.value());

    //     Project updatedProject = this.projectService.updateProject(project);

    //     response.setSuccess(true);
    //     if (updatedProject == null) {
    //         response.setResponseMessage("failed to update the project status");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     } else {
    //         calendarService.addProjectToEvent(project, userPrincipal, UserRole.MANAGER);

    //         response.setResponseMessage("assigned project to manager successfully");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //     }
    // }

    // @PostMapping("assignToEmployee")
    // @ApiOperation(value = "Api to assign project to employee")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<CommonApiResponse> assignToEmployee(@RequestBody UpdateProjectRequestDto updateProjectRequest, @CurrentUser UserPrincipal userPrincipal) throws GeneralSecurityException, IOException {

    //     LOG.info("Received request for assigning project to employee");

    //     CommonApiResponse response = new CommonApiResponse();

    //     if (updateProjectRequest == null) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("request data is missing");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

    //     User employee = this.userService.getUserById(updateProjectRequest.getEmployeeId());

    //     if (employee == null || !employee.getRole().equals(UserRole.EMPLOYEE.value())) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("failed to assign the project to employee");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     project.setEmployeeId(employee.getId());
    //     project.setStatus(ProjectStatus.PENDING.value());

    //     Project updatedProject = this.projectService.updateProject(project);

    //     response.setSuccess(true);
    //     if (updatedProject == null) {
    //         response.setResponseMessage("failed to assign the project to employee");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     } else {
    //         calendarService.addProjectToEvent(project, userPrincipal, UserRole.EMPLOYEE);

    //         response.setResponseMessage("assigned project to employee successfully");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //     }
    // }

    // @PostMapping("updateStatus")
    // @ApiOperation(value = "Api to update project status")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<CommonApiResponse> updateStatus(@RequestBody UpdateProjectRequestDto updateProjectRequest) {
    //     LOG.info("Received request for updating the project status");

    //     CommonApiResponse response = new CommonApiResponse();

    //     if (updateProjectRequest == null) {
    //         response.setSuccess(true);
    //         response.setResponseMessage("request data is missing");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

    //     project.setStatus(updateProjectRequest.getProjectStatus());

    //     Project updatedProject = this.projectService.updateProject(project);

    //     response.setSuccess(true);
    //     if (updatedProject == null) {
    //         response.setResponseMessage("failed to update the project status");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
    //     } else {
    //         response.setResponseMessage("project status updated successfully");
    //         return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
    //     }
    // }

    // @GetMapping("fetch/manager")
    // @ApiOperation(value = "Api to fetch all projects by manager id")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByManagerId(@RequestParam("managerId") int managerId) {
    //     LOG.info("Received request for Fetch projects by using manager Id");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjectsByManagerId(managerId);

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);


    // }

    // @GetMapping("fetch/employee")
    // @ApiOperation(value = "Api to fetch all projects by manager id")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByEmployeeId(@RequestParam("employeeId") int employeeId) {
    //     LOG.info("Received request for Fetch projects by using employee Id");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjectsByEmployeeId(employeeId);

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @GetMapping("manager/search")
    // @ApiOperation(value = "Api to fetch all projects by name")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByNameAndManger(@RequestParam("projectName") String projectName, @RequestParam("managerId") int managerId) {
    //     LOG.info("Received request for searching the project by using project name and manager id");

    //     ProjectResponseDto response = new ProjectResponseDto();
    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     if (projectName == null || managerId == 0) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("bad request, request data is missing");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjectsByProjectNameAndManagerId(projectName, managerId);

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @GetMapping("employee/search")
    // @ApiOperation(value = "Api to fetch all projects by name")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<ProjectResponseDto> fetchAllProjectsByNameAndEmployee(@RequestParam("projectName") String projectName, @RequestParam("employeeId") int employeeId) {
    //     LOG.info("Received request for searching the project by using project name and manager id");

    //     ProjectResponseDto response = new ProjectResponseDto();

    //     List<ProjectDto> projectDtos = new ArrayList<>();

    //     if (projectName == null || employeeId == 0) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("bad request, request data is missing");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.BAD_REQUEST);
    //     }

    //     List<Project> projects = new ArrayList<>();

    //     projects = this.projectService.getAllProjectsByProjectNameAndEmployeeId(projectName, employeeId);

    //     if (projects == null) {
    //         response.setProjects(projectDtos);
    //         response.setSuccess(true);
    //         response.setResponseMessage("Projects fetched successful");
    //         return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
    //     }

    //     for (Project project : projects) {
    //         ProjectDto projectDto = new ProjectDto();
    //         projectDto.setId(project.getId());
    //         projectDto.setName(project.getName());
    //         projectDto.setDescription(project.getDescription());
    //         projectDto.setCreatedDate(project.getCreatedDate());
    //         projectDto.setRequirement(project.getRequirement());
    //         projectDto.setStartDate(project.getStartDate());
    //         projectDto.setStartTime(project.getStartTime());
    //         projectDto.setDeadlineDate(project.getDeadlineDate());
    //         projectDto.setDeadlineTime(project.getDeadlineTime());
    //         projectDto.setReminderEmail(project.getReminderEmail());
    //         projectDto.setReminderPopup(project.getReminderPopup());
    //         projectDto.setProjectStatus(project.getStatus());

    //         if (project.getManagerId() == 0) {

    //             projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User manager = this.userService.getUserById(project.getManagerId());

    //             projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
    //             projectDto.setManagerId(manager.getId());
    //             projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
    //             projectDto.setAssignedDate(project.getAssignedDate());

    //         }

    //         if (project.getEmployeeId() == 0) {
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
    //             projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

    //             projectDtos.add(projectDto);

    //             continue;
    //         } else {
    //             User employee = this.userService.getUserById(project.getEmployeeId());

    //             projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
    //             projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

    //             projectDtos.add(projectDto);
    //         }

    //     }

    //     response.setProjects(projectDtos);
    //     response.setSuccess(true);
    //     response.setResponseMessage("Projects fetched successful");
    //     return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    // }

    // @GetMapping("allStatus")
    // @ApiOperation(value = "Api to fetch all projects by name")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<List<String>> fetchAllProjectStatus() {
    //     LOG.info("Received request for Fecth all the project status");

    //     List<String> allStatus = new ArrayList<>();

    //     for (ProjectStatus status : ProjectStatus.values()) {
    //         allStatus.add(status.value());
    //     }

    //     return new ResponseEntity<List<String>>(allStatus, HttpStatus.OK);

    // }

}
