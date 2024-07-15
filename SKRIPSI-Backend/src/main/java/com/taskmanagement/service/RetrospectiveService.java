package com.taskmanagement.service;

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
import com.taskmanagement.dao.RetrospectiveDao;
import com.taskmanagement.dao.SprintDao;
import com.taskmanagement.dao.UserDao;
import com.taskmanagement.dto.RetrospectiveRequestDTO;
import com.taskmanagement.dto.RetrospectiveResponseDTO;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Retrospective;
import com.taskmanagement.entity.Sprint;
import com.taskmanagement.entity.User;


@Service
public class RetrospectiveService {
    @Autowired
    private RetrospectiveDao retrospectiveRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    private SprintDao sprintRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<RetrospectiveResponseDTO> getAllRetrospectives(Pageable page) {
        Page<Retrospective> retrospectivePage = retrospectiveRepository.findAll(page);
        List<RetrospectiveResponseDTO> retrospectiveDTOList = retrospectivePage.getContent().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return retrospectiveDTOList;
    }

    @Transactional
    public RetrospectiveResponseDTO createRetrospective(RetrospectiveRequestDTO retrospectiveDTO) {
        Retrospective newRetrospective = modelMapper.map(retrospectiveDTO, Retrospective.class);
        newRetrospective.setProject(findProjectById(retrospectiveDTO.getProjectId()));
        newRetrospective.setSprint(findSprintById(retrospectiveDTO.getSprintId()));
        newRetrospective.setFromId(findUserById(retrospectiveDTO.getFromId()).getId());
        newRetrospective.setToId(findUserById(retrospectiveDTO.getToId()).getId());
        newRetrospective = retrospectiveRepository.save(newRetrospective);
        return convertToResponseDTO(newRetrospective);
    }

    public RetrospectiveResponseDTO getRetrospective(int retrospectiveId) {
        Retrospective retrospective = retrospectiveRepository.findById(retrospectiveId)
                .orElseThrow(() -> new EntityNotFoundException("Retrospective not found"));
        return convertToResponseDTO(retrospective);
    }

    @Transactional
    public RetrospectiveResponseDTO editRetrospective(int retrospectiveId, RetrospectiveRequestDTO retrospectiveDTO) {
        Retrospective retrospective = retrospectiveRepository.findById(retrospectiveId)
                .orElseThrow(() -> new EntityNotFoundException("Retrospective not found"));
        retrospective.setStatus(retrospectiveDTO.getStatus());
        retrospective.setDescription(retrospectiveDTO.getDescription());
        retrospective.setProject(findProjectById(retrospectiveDTO.getProjectId()));
        retrospective.setSprint(findSprintById(retrospectiveDTO.getSprintId()));
        retrospective.setFromId(findUserById(retrospectiveDTO.getFromId()).getId());
        retrospective.setToId(findUserById(retrospectiveDTO.getToId()).getId());
        retrospective = retrospectiveRepository.save(retrospective);
        return convertToResponseDTO(retrospective);
    }

    public void deleteRetrospective(int retrospectiveId) {
        retrospectiveRepository.deleteById(retrospectiveId);
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    private Sprint findSprintById(int id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sprint not found"));
    }

    private User findUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private RetrospectiveResponseDTO convertToResponseDTO(Retrospective retrospective) {
        RetrospectiveResponseDTO dto = modelMapper.map(retrospective, RetrospectiveResponseDTO.class);
        dto.setRetrospectiveId(retrospective.getId());
        dto.setProjectId(retrospective.getProject().getId());
        dto.setSprintId(retrospective.getSprint().getId());
        dto.setProjectName(retrospective.getProject().getName());
        dto.setSprintName(retrospective.getSprint().getName());
        dto.setFrom(userRepository.findById(retrospective.getFromId()).orElse(new User()).getName());
        dto.setTo(userRepository.findById(retrospective.getToId()).orElse(new User()).getName());
        return dto;
    }

    public List<RetrospectiveResponseDTO> getAllRetrospectivesForCurrentUser(Pageable pageable, Integer userId) {
        // Assuming you have SprintRepository that can fetch sprints based on team members' userId
        Page<Retrospective> retrospectivePage = retrospectiveRepository.findByTeamMembersUserId(userId, pageable);
        return retrospectivePage.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
}
