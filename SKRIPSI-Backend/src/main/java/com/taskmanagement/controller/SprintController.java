package com.taskmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.SprintDTO;
import com.taskmanagement.dto.SprintResponseDTO;
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
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<List<SprintResponseDTO>> getAllStories(Pageable page, @CurrentUser UserPrincipal currentUser) {
        List<SprintResponseDTO> getAllStories = sprintService.getAllSprint(page);
        return ResponseEntity.ok(getAllStories);
    }

    @PostMapping("add")
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO, @CurrentUser UserPrincipal currentUser) {
        SprintDTO createdSprint = sprintService.createSprint(sprintDTO);
        return new ResponseEntity<SprintDTO>(createdSprint, HttpStatus.OK);
    }

    @GetMapping("get/{id}")
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<SprintDTO> getSprint(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        SprintDTO getSprint = sprintService.getSprint(id);
        return ResponseEntity.ok(getSprint);
    }

    @PutMapping("edit/{id}")
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<SprintDTO> editSprint(@PathVariable("id") int id, @RequestBody SprintDTO sprintDTO, @CurrentUser UserPrincipal currentUser) {
        SprintDTO editedSprint = sprintService.editSprint(id, sprintDTO);
        return new ResponseEntity<SprintDTO>(editedSprint, HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<?> deleteSprint(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        sprintService.deleteSprint(id);
        return new ResponseEntity<>("Sprint deleted succesfuly", HttpStatus.OK);
    }
}
