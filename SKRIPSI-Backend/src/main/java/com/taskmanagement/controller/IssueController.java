package com.taskmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.IssueRequestDTO;
import com.taskmanagement.dto.IssueResponseDTO;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.IssueService;

@RestController
@RequestMapping("/api/issue")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping("fetch")
    public ResponseEntity<Page<IssueResponseDTO>> getAllIssues(Pageable pageable) {
        try {
            Page<IssueResponseDTO> issues = issueService.getAllIssues(pageable);
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("fetch/employee")
    public ResponseEntity<Page<IssueResponseDTO>> getIssuesByCurrentUser(Pageable pageable, @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            Page<IssueResponseDTO> issues = issueService.getIssuesByCurrentUser(pageable, currentUser.getId());
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<IssueResponseDTO> createIssue(@RequestBody IssueRequestDTO issueRequestDTO) {
        try {
            IssueResponseDTO issueResponseDTO = issueService.createIssue(issueRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(issueResponseDTO);
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<IssueResponseDTO> getIssueById(@PathVariable int id) {
        try {
            IssueResponseDTO issueResponseDTO = issueService.getIssueById(id);
            return ResponseEntity.ok(issueResponseDTO);
        } catch (RuntimeException e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<IssueResponseDTO> updateIssue(@PathVariable int id, @RequestBody IssueRequestDTO issueRequestDTO) {
        try {
            IssueResponseDTO issueResponseDTO = issueService.updateIssue(id, issueRequestDTO);
            return ResponseEntity.ok(issueResponseDTO);
        } catch (RuntimeException e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable int id) {
        try {
            issueService.deleteIssue(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            // Log the error (optional)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
