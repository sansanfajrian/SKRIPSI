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
import com.taskmanagement.dao.SprintDao;
import com.taskmanagement.dto.SprintDTO;
import com.taskmanagement.dto.SprintResponseDTO;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Sprint;

@Service
public class SprintService {
    @Autowired
    private SprintDao sprintRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<SprintResponseDTO> getAllSprint(Pageable page) {
        Page<Sprint> sprintPage = sprintRepository.findAll(page);
        List<SprintResponseDTO> sprintDTOList = sprintPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return sprintDTOList;
    }

    @Transactional
    public SprintDTO createSprint(SprintDTO sprintDTO) {
        Sprint newSprint = modelMapper.map(sprintDTO, Sprint.class);
        newSprint.setProject(findProjectById(sprintDTO.getProjectId()));
        newSprint = sprintRepository.save(newSprint);
        return modelMapper.map(newSprint, SprintDTO.class);
    }

    public SprintDTO getSprint(int sprintId){
        Sprint sprint = sprintRepository.findById(sprintId).get();
        SprintDTO sprintDTO = modelMapper.map(sprint, SprintDTO.class);
    
        sprintDTO.setSprintId(sprint.getId());
        sprintDTO.setProjectId(sprint.getProject().getId());
        
        return sprintDTO;
    }

    @Transactional
    public SprintDTO editSprint(int sprintId, SprintDTO sprintDTO){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Sprint sprint = sprintRepository.findById(sprintId).get();
        sprint.setName(sprintDTO.getName());
        sprint.setStartDate(sprintDTO.getStartDate());
        sprint.setEndDate(sprintDTO.getEndDate());
        sprint.setProject(findProjectById(sprintDTO.getProjectId()));
        sprint = sprintRepository.save(sprint);
        return modelMapper.map(sprint, SprintDTO.class);
    }

    public void deleteSprint(int sprintId){
        sprintRepository.deleteById(sprintId);
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not Found"));
    }

    public List<SprintResponseDTO> getProjectSprints(int projectId) {
        List<Sprint> sprints = sprintRepository.findByProjectId(projectId);
        return sprints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SprintResponseDTO convertToDTO(Sprint sprint) {
        SprintResponseDTO dto = modelMapper.map(sprint, SprintResponseDTO.class);
        if (sprint.getProject() != null) {
            dto.setSprintId(sprint.getId());
            dto.setProjectName(sprint.getProject().getName());
        }
        return dto;
    }
}
