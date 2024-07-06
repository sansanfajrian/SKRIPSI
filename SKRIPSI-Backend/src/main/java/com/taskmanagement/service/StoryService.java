package com.taskmanagement.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.StoryDao;
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

    public StoryRequestDTO createStory(StoryRequestDTO storyDTO) {
        Story newStory = modelMapper.map(storyDTO, Story.class);
        newStory.setProject(findProjectById(storyDTO.getProjectId()));
        newStory = storyRepository.save(newStory);
        return modelMapper.map(newStory, StoryRequestDTO.class);
    }

    public StoryRequestDTO getStory(int storyId){
        Story story = storyRepository.findById(storyId).get();
        return modelMapper.map(story, StoryRequestDTO.class);
    }

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

    public void deleteStory(int storyId){
        storyRepository.deleteById(storyId);
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not Found"));
    }

    private StoryResponseDTO convertToDTO(Story story) {
        StoryResponseDTO dto = modelMapper.map(story, StoryResponseDTO.class);
        if (story.getProject() != null) {
            dto.setStoryId(story.getId());
            dto.setProjectName(story.getProject().getName());
        }
        return dto;
    }
}
