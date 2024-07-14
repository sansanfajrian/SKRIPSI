package com.taskmanagement.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taskmanagement.dto.BacklogRequestDTO;
import com.taskmanagement.dto.BacklogResponseDTO;
import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.BacklogService;

@RestController
@RequestMapping("/api/backlog/")
@CrossOrigin(origins = "http://localhost:3000")
public class BacklogController {

    Logger LOG = LoggerFactory.getLogger(BacklogController.class);

    @Autowired
    private BacklogService backlogService;

    @GetMapping("fetch")
    public ResponseEntity<List<BacklogResponseDTO>> getAllBacklogs(@CurrentUser UserPrincipal currentUser) {
        List<BacklogResponseDTO> backlogs = backlogService.getAllBacklogs();
        return ResponseEntity.ok(backlogs);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<BacklogResponseDTO> getBacklog(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        BacklogResponseDTO backlogResponseDTO = backlogService.getBacklogById(id);
        if (backlogResponseDTO != null) {
            return ResponseEntity.ok(backlogResponseDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("add")
    public ResponseEntity<CommonApiResponse> addBacklog(String code, String name, String notes, Float estEffort, String status, String startDate, String planEndDate, Integer plannedPicId, Integer storyId, Integer sprintId, Integer projectId, MultipartFile[] documents) {
        CommonApiResponse response = new CommonApiResponse();
        BacklogRequestDTO backlogRequestDTO = new BacklogRequestDTO();
        backlogRequestDTO.setCode(code);
        backlogRequestDTO.setName(name);
        backlogRequestDTO.setNotes(notes);
        backlogRequestDTO.setEstEffort(estEffort);
        backlogRequestDTO.setStatus(status);
        backlogRequestDTO.setStartDate(startDate);
        backlogRequestDTO.setPlanEndDate(planEndDate);
        backlogRequestDTO.setPlannedPicId(plannedPicId);
        backlogRequestDTO.setStoryId(storyId);
        backlogRequestDTO.setSprintId(sprintId);
        backlogRequestDTO.setProjectId(projectId);
        LOG.info("Received request for adding the backlog" + backlogRequestDTO);
        
        // try {
            BacklogResponseDTO responseDTO = backlogService.addBacklog(backlogRequestDTO, documents);
            response.setSuccess(true);
            response.setResponseMessage("Backlog Added Successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        // } catch (Exception e) {
        //     response.setSuccess(false);
        //     response.setResponseMessage("An error occurred while adding the backlog."+ e.getMessage());
        //     return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        // }
    }

    @PutMapping("edit/{id}")
    public ResponseEntity<CommonApiResponse> editBacklog(@PathVariable("id") int id,
        @RequestParam String code,
        @RequestParam String name,
        @RequestParam String notes,
        @RequestParam Float estEffort,
        @RequestParam String status,
        @RequestParam String startDate,
        @RequestParam String planEndDate,
        @RequestParam Integer plannedPicId,
        @RequestParam Integer storyId,
        @RequestParam Integer sprintId,
        @RequestParam Integer projectId,
        @RequestParam("documents") MultipartFile[] documents,
        @RequestParam(value = "deletedDocumentIds", required = false) List<Integer> deletedDocumentIds) {
        BacklogRequestDTO backlogRequestDTO = new BacklogRequestDTO();
        backlogRequestDTO.setCode(code);
        backlogRequestDTO.setName(name);
        backlogRequestDTO.setNotes(notes);
        backlogRequestDTO.setEstEffort(estEffort);
        backlogRequestDTO.setStatus(status);
        backlogRequestDTO.setStartDate(startDate);
        backlogRequestDTO.setPlanEndDate(planEndDate);
        backlogRequestDTO.setPlannedPicId(plannedPicId);
        backlogRequestDTO.setStoryId(storyId);
        backlogRequestDTO.setSprintId(sprintId);
        backlogRequestDTO.setProjectId(projectId);

        CommonApiResponse response = new CommonApiResponse();
        // try {
            BacklogResponseDTO responseDTO = backlogService.updateBacklog(id, backlogRequestDTO, documents, deletedDocumentIds);
            response.setSuccess(true);
            response.setResponseMessage("Backlog edited Successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        // } catch (Exception e) {
        //     response.setSuccess(false);
        //     response.setResponseMessage("An error occurred while editing the backlog."+ e.getMessage());
        //     return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        // }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteBacklog(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        backlogService.deleteBacklogById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
