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
import com.taskmanagement.dto.StoryRequestDTO;
import com.taskmanagement.dto.StoryResponseDTO;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.StoryService;

@RestController
@RequestMapping("/api/story/")
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @GetMapping("fetch")
    ResponseEntity<List<StoryResponseDTO>> getAllStories(Pageable page, @CurrentUser UserPrincipal currentUser) {
        try {
            List<StoryResponseDTO> getAllStories = storyService.getAllStory(page);
            return ResponseEntity.ok(getAllStories);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetch/employee")
    public ResponseEntity<List<StoryResponseDTO>> getAllStoriesForCurrentUser(Pageable pageable, @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            List<StoryResponseDTO> stories = storyService.getAllStoriesForCurrentUser(pageable, currentUser.getId());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("add")
    ResponseEntity<CommonApiResponse> createStory(@RequestBody StoryRequestDTO storyDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            StoryRequestDTO createdStory = storyService.createStory(storyDTO);
            response.setSuccess(true);
            response.setResponseMessage("Story added successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while adding the story. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get/{id}")
    ResponseEntity<StoryRequestDTO> getStory(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        try {
            StoryRequestDTO getStory = storyService.getStory(id);
            return ResponseEntity.ok(getStory);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("edit/{id}")
    ResponseEntity<CommonApiResponse> editStory(@PathVariable("id") int id, @RequestBody StoryRequestDTO storyDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            StoryRequestDTO editedStory = storyService.editStory(id, storyDTO);
            response.setSuccess(true);
            response.setResponseMessage("Story edited successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while editing the story. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<CommonApiResponse> deleteStory(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            storyService.deleteStory(id);
            response.setSuccess(true);
            response.setResponseMessage("Story deleted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while deleting the story. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
