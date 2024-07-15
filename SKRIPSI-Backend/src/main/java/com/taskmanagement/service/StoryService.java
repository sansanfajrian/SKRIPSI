package com.taskmanagement.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.StoryDao;
import com.taskmanagement.dto.StoryDropdownResponseDTO;
import com.taskmanagement.dto.StoryRequestDTO;
import com.taskmanagement.dto.StoryResponseDTO;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Story;

@Service
public class StoryService {
    @Autowired
    private StoryDao storyRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<StoryResponseDTO> getAllStory(Pageable page) {
        Page<Story> storyPage = storyRepository.findAll(page);
        List<StoryResponseDTO> storyDTOList = storyPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return storyDTOList;
    }

    @Transactional
    public StoryRequestDTO createStory(StoryRequestDTO storyDTO) {
        Story newStory = modelMapper.map(storyDTO, Story.class);
        newStory.setProject(findProjectById(storyDTO.getProjectId()));
        newStory = storyRepository.save(newStory);
        return modelMapper.map(newStory, StoryRequestDTO.class);
    }

    public StoryRequestDTO getStory(int storyId){
        Story story = storyRepository.findById(storyId).orElseThrow(() -> new RuntimeException("Story not found"));
    
        // Map the entity to StoryRequestDTO
        StoryRequestDTO storyRequestDTO = modelMapper.map(story, StoryRequestDTO.class);
        
        // Set the storyId and projectId manually
        storyRequestDTO.setStoryId(story.getId());
        storyRequestDTO.setProjectId(story.getProject().getId());
        
        return storyRequestDTO;
    }

    @Transactional
    public StoryRequestDTO editStory(int storyId, StoryRequestDTO storyDTO){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Story story = storyRepository.findById(storyId).get();
        story.setName(storyDTO.getName());
        story.setCode(storyDTO.getCode());
        story.setStatus(storyDTO.getStatus());
        story.setProject(findProjectById(storyDTO.getProjectId()));
        story = storyRepository.save(story);
        return modelMapper.map(story, StoryRequestDTO.class);
    }

    @Transactional
    public void deleteStory(int storyId){
        storyRepository.deleteById(storyId);
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not Found"));
    }

    public List<StoryResponseDTO> getAllStoriesForCurrentUser(Pageable pageable, Integer userId) {
        Page<Story> storiesPage = storyRepository.findByTeamMembersUserId(userId, pageable);
        return storiesPage.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private StoryResponseDTO convertToDTO(Story story) {
        StoryResponseDTO dto = modelMapper.map(story, StoryResponseDTO.class);
        if (story.getProject() != null) {
            dto.setStoryId(story.getId());
            dto.setProjectId(story.getProject().getId());
            dto.setProjectName(story.getProject().getName());
        }
        return dto;
    }

     public List<StoryDropdownResponseDTO> findDropdownsByProjectId(int projectId) {
        List<Story> stories = storyRepository.findByProjectId(projectId);

        return stories.stream()
                .map(story -> {
                    StoryDropdownResponseDTO dto = new StoryDropdownResponseDTO();
                    dto.setStoryId(story.getId());
                    dto.setStoryCode(story.getCode());
                    dto.setStoryName(story.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
