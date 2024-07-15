package com.taskmanagement.controller;

import java.util.List;

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
import com.taskmanagement.dto.RetrospectiveRequestDTO;
import com.taskmanagement.dto.RetrospectiveResponseDTO;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.RetrospectiveService;

@RestController
@RequestMapping("/api/retrospective/")
@CrossOrigin(origins = "http://localhost:3000")
public class RetrospectiveController {

    @Autowired
    private RetrospectiveService retrospectiveService;

    @GetMapping("fetch")
    ResponseEntity<List<RetrospectiveResponseDTO>> getAllRetrospectives(Pageable page, @CurrentUser UserPrincipal currentUser) {
        try {
            List<RetrospectiveResponseDTO> getAllRetrospectives = retrospectiveService.getAllRetrospectives(page);
            return ResponseEntity.ok(getAllRetrospectives);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetch/employee")
    ResponseEntity<List<RetrospectiveResponseDTO>> getAllRetrospectivesForCurrentUser(Pageable page, @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            List<RetrospectiveResponseDTO> getAllRetrospectives = retrospectiveService.getAllRetrospectivesForCurrentUser(page, currentUser.getId());
            return ResponseEntity.ok(getAllRetrospectives);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("add")
    ResponseEntity<CommonApiResponse> createRetrospective(@RequestBody RetrospectiveRequestDTO retrospectiveDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            RetrospectiveResponseDTO createdRetrospective = retrospectiveService.createRetrospective(retrospectiveDTO);
            response.setSuccess(true);
            response.setResponseMessage("Retrospective added successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while adding the retrospective. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get/{id}")
    ResponseEntity<RetrospectiveResponseDTO> getRetrospective(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        try {
            RetrospectiveResponseDTO getRetrospective = retrospectiveService.getRetrospective(id);
            return ResponseEntity.ok(getRetrospective);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("edit/{id}")
    ResponseEntity<CommonApiResponse> editRetrospective(@PathVariable("id") int id, @RequestBody RetrospectiveRequestDTO retrospectiveDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            RetrospectiveResponseDTO editedRetrospective = retrospectiveService.editRetrospective(id, retrospectiveDTO);
            response.setSuccess(true);
            response.setResponseMessage("Retrospective edited successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while editing the retrospective. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<CommonApiResponse> deleteRetrospective(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            retrospectiveService.deleteRetrospective(id);
            response.setSuccess(true);
            response.setResponseMessage("Retrospective deleted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while deleting the retrospective. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
