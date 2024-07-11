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
        List<StoryResponseDTO> getAllStories = storyService.getAllStory(page);
        return ResponseEntity.ok(getAllStories);
    }

    @PostMapping("add")
    ResponseEntity<StoryRequestDTO> createStory(@RequestBody StoryRequestDTO storyDTO, @CurrentUser UserPrincipal currentUser) {
        StoryRequestDTO createdStory = storyService.createStory(storyDTO);
        return new ResponseEntity<StoryRequestDTO>(createdStory, HttpStatus.OK);
    }

    @GetMapping("get/{id}")
    ResponseEntity<StoryRequestDTO> getStory(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        StoryRequestDTO getStory = storyService.getStory(id);
        return ResponseEntity.ok(getStory);
    }

    @PutMapping("edit/{id}")
    ResponseEntity<StoryRequestDTO> editStory(@PathVariable("id") int id, @RequestBody StoryRequestDTO storyDTO, @CurrentUser UserPrincipal currentUser) {
        StoryRequestDTO editedStory = storyService.editStory(id, storyDTO);
        return new ResponseEntity<StoryRequestDTO>(editedStory, HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<?> deleteStory(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        storyService.deleteStory(id);
        return new ResponseEntity<>("Story deleted succesfuly", HttpStatus.OK);
    }
}
