package com.taskmanagement.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.dto.DropdownSprintItemDTO;
import com.taskmanagement.dto.SprintDTO;
import com.taskmanagement.dto.SprintResponseDTO;
import com.taskmanagement.entity.Sprint;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.SprintService;

@RestController
@RequestMapping("/api/sprint/")
@CrossOrigin(origins = "http://localhost:3000")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @GetMapping("fetch")
    ResponseEntity<List<SprintResponseDTO>> getAllSprints(Pageable page, @CurrentUser UserPrincipal currentUser) {
        try {
            List<SprintResponseDTO> getAllSprints = sprintService.getAllSprint(page);
            return ResponseEntity.ok(getAllSprints);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetch/employee")
    public ResponseEntity<List<SprintResponseDTO>> getAllSprintsForCurrentUser(Pageable page, @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            List<SprintResponseDTO> sprints = sprintService.getAllSprintsForCurrentUser(page, currentUser.getId());
            return ResponseEntity.ok(sprints);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("add")
    ResponseEntity<CommonApiResponse> createSprint(@RequestBody SprintDTO sprintDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            SprintDTO createdSprint = sprintService.createSprint(sprintDTO);
            response.setSuccess(true);
            response.setResponseMessage("Sprint added successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while adding the sprint. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get/{id}")
    ResponseEntity<SprintDTO> getSprint(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        try {
            SprintDTO getSprint = sprintService.getSprint(id);
            return ResponseEntity.ok(getSprint);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("edit/{id}")
    ResponseEntity<CommonApiResponse> editSprint(@PathVariable("id") int id, @RequestBody SprintDTO sprintDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            SprintDTO editedSprint = sprintService.editSprint(id, sprintDTO);
            response.setSuccess(true);
            response.setResponseMessage("Sprint edited successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while editing the sprint. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<CommonApiResponse> deleteSprint(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            sprintService.deleteSprint(id);
            response.setSuccess(true);
            response.setResponseMessage("Sprint deleted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while deleting the sprint. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{projectId}/backlog/{backlogId}/sprints")
    public ResponseEntity<List<DropdownSprintItemDTO>> getSprintsByProjectAndBacklog(
            @PathVariable int projectId,
            @PathVariable int backlogId
    ) {
        List<Sprint> sprints = sprintService.findByProjectIdAndBacklogId(projectId, backlogId);
        
        // Convert List<Sprint> to List<DropdownItemDTO>
        List<DropdownSprintItemDTO> dropdownItems = sprints.stream()
                .map(sprint -> new DropdownSprintItemDTO(sprint.getId(), sprint.getName()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(dropdownItems, HttpStatus.OK);
    }
}
