package com.taskmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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
        List<RetrospectiveResponseDTO> getAllRetrospectives = retrospectiveService.getAllRetrospectives(page);
        return ResponseEntity.ok(getAllRetrospectives);
    }

    @PostMapping("add")
    ResponseEntity<RetrospectiveResponseDTO> createRetrospective(@RequestBody RetrospectiveRequestDTO retrospectiveDTO, @CurrentUser UserPrincipal currentUser) {
        RetrospectiveResponseDTO createdRetrospective = retrospectiveService.createRetrospective(retrospectiveDTO);
        return new ResponseEntity<>(createdRetrospective, HttpStatus.OK);
    }

    @GetMapping("get/{id}")
    ResponseEntity<RetrospectiveResponseDTO> getRetrospective(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        RetrospectiveResponseDTO getRetrospective = retrospectiveService.getRetrospective(id);
        return ResponseEntity.ok(getRetrospective);
    }

    @PutMapping("edit/{id}")
    ResponseEntity<RetrospectiveResponseDTO> editRetrospective(@PathVariable("id") int id, @RequestBody RetrospectiveRequestDTO retrospectiveDTO, @CurrentUser UserPrincipal currentUser) {
        RetrospectiveResponseDTO editedRetrospective = retrospectiveService.editRetrospective(id, retrospectiveDTO);
        return new ResponseEntity<>(editedRetrospective, HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<?> deleteRetrospective(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        retrospectiveService.deleteRetrospective(id);
        return new ResponseEntity<>("Retrospective deleted successfully", HttpStatus.OK);
    }
}
