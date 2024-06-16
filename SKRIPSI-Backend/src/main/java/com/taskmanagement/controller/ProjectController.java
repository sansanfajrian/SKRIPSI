package com.taskmanagement.controller;

import com.taskmanagement.config.MinioConfig;
import com.taskmanagement.dto.*;
import com.taskmanagement.entity.DocMetadata;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.ProjectService;
import com.taskmanagement.service.UserService;
import com.taskmanagement.utility.Constants.ProjectAssignStatus;
import com.taskmanagement.utility.Constants.ProjectStatus;
import com.taskmanagement.utility.Constants.UserRole;
import com.taskmanagement.utility.MinioUtils;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

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
    private MinioUtils minioUtils;

    @Autowired
    private MinioConfig minioConfig;

    @PostMapping("add")
    @ApiOperation(value = "Api to add project")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> addProject(MultipartFile[] documents, String name, String description, String requirement, String deadlineDate) {

        LOG.info("Received request for adding the project");

        CommonApiResponse response = new CommonApiResponse();

        // Get today's date
        LocalDate today = LocalDate.now();

        // Define the desired format yyyy-MM-dd
        String desiredFormat = "yyyy-MM-dd"; // Change this format as needed

        // Create a DateTimeFormatter with the desired format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);

        // Format the date to the desired format
        String formattedTodaysDate = today.format(formatter);

        Project project = Project.builder()
                .name(name)
                .description(description)
                .requirement(requirement)
                .deadlineDate(deadlineDate)
                .build();

        if (project == null) {
            response.setSuccess(true);
            response.setResponseMessage("bad request, missing project data");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        project.setAssignStatus(ProjectAssignStatus.NOT_ASSIGNED.value());
        project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());
        project.setCreatedDate(formattedTodaysDate);

        Set<DocMetadata> docMetadataSet = new HashSet<>();
        Arrays.stream(documents).forEach(document -> {
            String docId = UUID.randomUUID().toString();
            minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
            docMetadataSet.add(
                    DocMetadata.builder()
                            .name(document.getOriginalFilename())
                            .size(document.getSize())
                            .httpContentType(document.getContentType())
                            .docId(docId)
                            .build()
            );
        });
        project.setDocMetadata(docMetadataSet);

        Project addedProduct = this.projectService.addProject(project);

        if (addedProduct != null) {
            response.setSuccess(true);
            response.setResponseMessage("Project Added Successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        } else {
            response.setSuccess(true);
            response.setResponseMessage("Failed to add project");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetch")
    @ApiOperation(value = "Api to fetch all projects")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjects() {
        LOG.info("Recieved request for Fetching all the projects");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjects();

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            List<DocMetadataDto> documents = new ArrayList<>();
            project.getDocMetadata().forEach(docMetadata -> {
                DocMetadataDto docMetadataDto = new DocMetadataDto();
                docMetadataDto.setId(docMetadata.getId());
                docMetadataDto.setDocId(docMetadata.getDocId());
                docMetadataDto.setName(docMetadata.getName());
                docMetadataDto.setSize(docMetadata.getSize());
                docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
                docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

                documents.add(docMetadataDto);
            });
            projectDto.setDocuments(documents);

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @GetMapping("search")
    @ApiOperation(value = "Api to fetch all projects by name")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByName(@RequestParam("projectName") String projectName) {
        LOG.info("Recieved request for Fetch all projects by name");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjectsByProjectName(projectName);

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            List<DocMetadataDto> documents = new ArrayList<>();
            project.getDocMetadata().forEach(docMetadata -> {
                DocMetadataDto docMetadataDto = new DocMetadataDto();
                docMetadataDto.setId(docMetadata.getId());
                docMetadataDto.setDocId(docMetadata.getDocId());
                docMetadataDto.setName(docMetadata.getName());
                docMetadataDto.setSize(docMetadata.getSize());
                docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
                docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

                documents.add(docMetadataDto);
            });
            projectDto.setDocuments(documents);

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @GetMapping("search/id")
    @ApiOperation(value = "Api to fetch all projects by id")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByName(@RequestParam("projectId") int projectId) {
        LOG.info("Recieved request for Fetch project by id");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        List<Project> projects = new ArrayList<>();

        if (projectId == 0) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Project not found using this Id");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        Project p = this.projectService.getProjectById(projectId);

        if (p != null) {
            projects.add(p);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            List<DocMetadataDto> documents = new ArrayList<>();
            project.getDocMetadata().forEach(docMetadata -> {
                DocMetadataDto docMetadataDto = new DocMetadataDto();
                docMetadataDto.setId(docMetadata.getId());
                docMetadataDto.setDocId(docMetadata.getDocId());
                docMetadataDto.setName(docMetadata.getName());
                docMetadataDto.setSize(docMetadata.getSize());
                docMetadataDto.setHttpContentType(docMetadata.getHttpContentType());
                docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));

                documents.add(docMetadataDto);
            });
            projectDto.setDocuments(documents);

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @PostMapping("update")
    @ApiOperation(value = "Api to update the project status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> updateProject(MultipartFile[] documents, Integer id, String name, String description, String requirement, String deadlineDate, Integer[] deletedDocumentIds, String projectStatus, Integer employeeId, Integer managerId) {
        LOG.info("Received request for updating the project");

        CommonApiResponse response = new CommonApiResponse();

        UpdateProjectRequestDto updateProjectRequest = new UpdateProjectRequestDto();
        updateProjectRequest.setProjectId(id);
        updateProjectRequest.setProjectStatus(projectStatus);
        updateProjectRequest.setEmployeeId(Optional.ofNullable(employeeId).orElseGet(() -> 0));
        updateProjectRequest.setManagerId(Optional.ofNullable(managerId).orElseGet(() -> 0));

        if (updateProjectRequest.getProjectId() == 0) {
            response.setSuccess(true);
            response.setResponseMessage("request data is missing");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        // Get today's date
        LocalDate today = LocalDate.now();
        String desiredFormat = "yyyy-MM-dd";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);
        String formattedTodaysDate = today.format(formatter);

        Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

        if (updateProjectRequest.getManagerId() != 0) { // admin is assigning the project to manager
            User manager = this.userService.getUserById(updateProjectRequest.getManagerId());

            if (manager == null || !manager.getRole().equals(UserRole.MANAGER.value())) {
                response.setSuccess(true);
                response.setResponseMessage("failed to assign the project to manager");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            }

            project.setManagerId(manager.getId());
            project.setAssignedDate(formattedTodaysDate);
            project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_EMPLOYEE.value());

            Project updatedProject = this.projectService.updateProject(project);

            if (updatedProject == null) {
                response.setSuccess(true);
                response.setResponseMessage("failed to update the project status");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.setSuccess(true);
                response.setResponseMessage("assigned project to manager successfully");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
            }

        } else if (updateProjectRequest.getEmployeeId() != 0) { // admin is assigning the project to employee
            User employee = this.userService.getUserById(updateProjectRequest.getEmployeeId());

            if (employee == null || !employee.getRole().equals(UserRole.EMPLOYEE.value())) {
                response.setSuccess(true);
                response.setResponseMessage("failed to assign the project to employee");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            }

            project.setEmployeeId(employee.getId());
            project.setStatus(ProjectStatus.PENDING.value());

            Project updatedProject = this.projectService.updateProject(project);

            if (updatedProject == null) {
                response.setSuccess(true);
                response.setResponseMessage("failed to assign the project to employee");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.setSuccess(true);
                response.setResponseMessage("assigned project to employee successfully");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
            }
        } else if (updateProjectRequest.getProjectStatus() != null && !StringUtils.isEmpty(updateProjectRequest.getProjectStatus())) { // employee is updating the project status

            project.setStatus(updateProjectRequest.getProjectStatus());

            Project updatedProject = this.projectService.updateProject(project);

            if (updatedProject == null) {
                response.setSuccess(true);
                response.setResponseMessage("failed to update the project status");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.setSuccess(true);
                response.setResponseMessage("project status updated successfully");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
            }
        } else { // update project
            project.setName(name);
            project.setDescription(description);
            project.setRequirement(requirement);
            project.setDeadlineDate(deadlineDate);

            Set<DocMetadata> docMetadataSet = new HashSet<>();
            Arrays.stream(documents).forEach(document -> {
                String docId = UUID.randomUUID().toString();
                minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
                docMetadataSet.add(
                        DocMetadata.builder()
                                .name(document.getOriginalFilename())
                                .size(document.getSize())
                                .httpContentType(document.getContentType())
                                .docId(docId)
                                .build()
                );
            });
            project.getDocMetadata().addAll(docMetadataSet);
            project.getDocMetadata().removeIf(docMetadata -> Arrays.asList(deletedDocumentIds).contains(docMetadata.getId()));

            Project updatedProject = this.projectService.updateProject(project);

            if (deletedDocumentIds != null && deletedDocumentIds.length > 0) {
                List<DocMetadata> allProjectDocMetadata = this.projectService.getAllProjectDocMetadata(deletedDocumentIds);
                allProjectDocMetadata.forEach(docMetadata -> {
                    minioUtils.removeFile(minioConfig.getBucketName(), docMetadata.getDocId());
                });
                this.projectService.deleteProjectDocuments(deletedDocumentIds);
            }

            if (updatedProject == null) {
                response.setSuccess(true);
                response.setResponseMessage("failed to update the project data");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.setSuccess(true);
                response.setResponseMessage("project data updated successfully");
                return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
            }
        }

    }

    @PostMapping("assignToManager")
    @ApiOperation(value = "Api to assign project to manager")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> assignToManager(@RequestBody UpdateProjectRequestDto updateProjectRequest) {
        LOG.info("Received request for assigning project to manager");

        CommonApiResponse response = new CommonApiResponse();

        if (updateProjectRequest == null) {
            response.setSuccess(true);
            response.setResponseMessage("request data is missing");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        // Get today's date
        LocalDate today = LocalDate.now();
        String desiredFormat = "yyyy-MM-dd";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(desiredFormat);
        String formattedTodaysDate = today.format(formatter);

        Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

        User manager = this.userService.getUserById(updateProjectRequest.getManagerId());

        if (manager == null || !manager.getRole().equals(UserRole.MANAGER.value())) {
            response.setSuccess(true);
            response.setResponseMessage("failed to assign the project to manager");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        project.setManagerId(manager.getId());
        project.setAssignedDate(formattedTodaysDate);
        project.setStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_EMPLOYEE.value());

        Project updatedProject = this.projectService.updateProject(project);

        response.setSuccess(true);
        if (updatedProject == null) {
            response.setResponseMessage("failed to update the project status");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.setResponseMessage("assigned project to manager successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }
    }

    @PostMapping("assignToEmployee")
    @ApiOperation(value = "Api to assign project to employee")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> assignToEmployee(@RequestBody UpdateProjectRequestDto updateProjectRequest) {

        LOG.info("Received request for assigning project to employee");

        CommonApiResponse response = new CommonApiResponse();

        if (updateProjectRequest == null) {
            response.setSuccess(true);
            response.setResponseMessage("request data is missing");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

        User employee = this.userService.getUserById(updateProjectRequest.getEmployeeId());

        if (employee == null || !employee.getRole().equals(UserRole.EMPLOYEE.value())) {
            response.setSuccess(true);
            response.setResponseMessage("failed to assign the project to employee");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        project.setEmployeeId(employee.getId());
        project.setStatus(ProjectStatus.PENDING.value());

        Project updatedProject = this.projectService.updateProject(project);

        response.setSuccess(true);
        if (updatedProject == null) {
            response.setResponseMessage("failed to assign the project to employee");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.setResponseMessage("assigned project to employee successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }
    }

    @PostMapping("updateStatus")
    @ApiOperation(value = "Api to update project status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> updateStatus(@RequestBody UpdateProjectRequestDto updateProjectRequest) {
        LOG.info("Received request for updating the project status");

        CommonApiResponse response = new CommonApiResponse();

        if (updateProjectRequest == null) {
            response.setSuccess(true);
            response.setResponseMessage("request data is missing");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        }

        Project project = this.projectService.getProjectById(updateProjectRequest.getProjectId());

        project.setStatus(updateProjectRequest.getProjectStatus());

        Project updatedProject = this.projectService.updateProject(project);

        response.setSuccess(true);
        if (updatedProject == null) {
            response.setResponseMessage("failed to update the project status");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.setResponseMessage("project status updated successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }
    }

    @GetMapping("fetch/manager")
    @ApiOperation(value = "Api to fetch all projects by manager id")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByManagerId(@RequestParam("managerId") int managerId) {
        LOG.info("Received request for Fetch projects by using manager Id");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjectsByManagerId(managerId);

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);


    }

    @GetMapping("fetch/employee")
    @ApiOperation(value = "Api to fetch all projects by manager id")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByEmployeeId(@RequestParam("employeeId") int employeeId) {
        LOG.info("Received request for Fetch projects by using employee Id");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjectsByEmployeeId(employeeId);

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @GetMapping("manager/search")
    @ApiOperation(value = "Api to fetch all projects by name")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByNameAndManger(@RequestParam("projectName") String projectName, @RequestParam("managerId") int managerId) {
        LOG.info("Received request for searching the project by using project name and manager id");

        ProjectResponseDto response = new ProjectResponseDto();
        List<ProjectDto> projectDtos = new ArrayList<>();

        if (projectName == null || managerId == 0) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("bad request, request data is missing");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.BAD_REQUEST);
        }

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjectsByProjectNameAndManagerId(projectName, managerId);

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @GetMapping("employee/search")
    @ApiOperation(value = "Api to fetch all projects by name")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProjectResponseDto> fetchAllProjectsByNameAndEmployee(@RequestParam("projectName") String projectName, @RequestParam("employeeId") int employeeId) {
        LOG.info("Received request for searching the project by using project name and manager id");

        ProjectResponseDto response = new ProjectResponseDto();

        List<ProjectDto> projectDtos = new ArrayList<>();

        if (projectName == null || employeeId == 0) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("bad request, request data is missing");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.BAD_REQUEST);
        }

        List<Project> projects = new ArrayList<>();

        projects = this.projectService.getAllProjectsByProjectNameAndEmployeeId(projectName, employeeId);

        if (projects == null) {
            response.setProjects(projectDtos);
            response.setSuccess(true);
            response.setResponseMessage("Projects fetched successful");
            return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);
        }

        for (Project project : projects) {
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setName(project.getName());
            projectDto.setDescription(project.getDescription());
            projectDto.setCreatedDate(project.getCreatedDate());
            projectDto.setRequirement(project.getRequirement());
            projectDto.setDeadlineDate(project.getDeadlineDate());
            projectDto.setProjectStatus(project.getStatus());

            if (project.getManagerId() == 0) {

                projectDto.setAssignedToManager(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setAssignedDate(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setManagerName(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setProjectStatus(ProjectAssignStatus.NOT_ASSIGNED_TO_MANAGER.value());

                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User manager = this.userService.getUserById(project.getManagerId());

                projectDto.setManagerName(manager.getFirstName() + " " + manager.getLastName());
                projectDto.setManagerId(manager.getId());
                projectDto.setAssignedToManager(ProjectAssignStatus.ASSIGNED_TO_MANAGER.value());
                projectDto.setAssignedDate(project.getAssignedDate());

            }

            if (project.getEmployeeId() == 0) {
                projectDto.setAssignedToEmployee(ProjectAssignStatus.NOT_ASSIGNED.value());
                projectDto.setEmployeeName(ProjectAssignStatus.NOT_ASSIGNED.value());

                projectDtos.add(projectDto);

                continue;
            } else {
                User employee = this.userService.getUserById(project.getEmployeeId());

                projectDto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                projectDto.setAssignedToEmployee(ProjectAssignStatus.ASSIGNED_TO_EMPLOYEE.value());

                projectDtos.add(projectDto);
            }

        }

        response.setProjects(projectDtos);
        response.setSuccess(true);
        response.setResponseMessage("Projects fetched successful");
        return new ResponseEntity<ProjectResponseDto>(response, HttpStatus.OK);

    }

    @GetMapping("allStatus")
    @ApiOperation(value = "Api to fetch all projects by name")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<String>> fetchAllProjectStatus() {
        LOG.info("Received request for Fecth all the project status");

        List<String> allStatus = new ArrayList<>();

        for (ProjectStatus status : ProjectStatus.values()) {
            allStatus.add(status.value());
        }

        return new ResponseEntity<List<String>>(allStatus, HttpStatus.OK);

    }

}
