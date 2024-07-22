package com.taskmanagement.service;

import java.util.Optional;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.BacklogDao;
import com.taskmanagement.dao.IssueDao;
import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.SprintDao;
import com.taskmanagement.dao.UserDao;
import com.taskmanagement.dto.IssueRequestDTO;
import com.taskmanagement.dto.IssueResponseDTO;
import com.taskmanagement.entity.Backlog;
import com.taskmanagement.entity.Issue;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Sprint;
import com.taskmanagement.entity.User;

@Service
public class IssueService {

    @Autowired
    private IssueDao issueRepository;

    @Autowired
    private BacklogDao backlogRepository;

    @Autowired
    private SprintDao sprintRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public IssueResponseDTO createIssue(IssueRequestDTO issueRequestDTO) {
        Issue issue = modelMapper.map(issueRequestDTO, Issue.class);
        issue.setProject(findProjectById(issueRequestDTO.getProjectId()));
        issue.setSprint(findSprintById(issueRequestDTO.getSprintId()));
        issue.setBacklog(findBacklogById(issueRequestDTO.getBacklogId()));
        issue.setIssuerId(findUserById(issueRequestDTO.getIssuerId()).getId());
        issue.setAssigneeId(findUserById(issueRequestDTO.getAssigneeId()).getId());

        Issue savedIssue = issueRepository.save(issue);

        return convertToResponseDTO(savedIssue);
    }

    public IssueResponseDTO getIssueById(int id) {
        Optional<Issue> issueOptional = issueRepository.findById(id);
        if (issueOptional.isPresent()) {
            return convertToResponseDTO(issueOptional.get());
        }
        throw new RuntimeException("Issue not found with id: " + id);
    }

    @Transactional
    public IssueResponseDTO updateIssue(int id, IssueRequestDTO issueRequestDTO) {
        Optional<Issue> issueOptional = issueRepository.findById(id);
        if (issueOptional.isPresent()) {
            Issue issue = issueOptional.get();
            modelMapper.map(issueRequestDTO, issue);
            issue.setProject(findProjectById(issueRequestDTO.getProjectId()));
            issue.setSprint(findSprintById(issueRequestDTO.getSprintId()));
            issue.setBacklog(findBacklogById(issueRequestDTO.getBacklogId()));
            issue.setIssuerId(findUserById(issueRequestDTO.getIssuerId()).getId());
            issue.setAssigneeId(findUserById(issueRequestDTO.getAssigneeId()).getId());
            Issue updatedIssue = issueRepository.save(issue);

            return convertToResponseDTO(updatedIssue);
        }
        throw new RuntimeException("Issue not found with id: " + id);
    }

    @Transactional
    public void deleteIssue(int issueId) {
        if (issueRepository.existsById(issueId)) {
            issueRepository.deleteById(issueId);
        } else {
            throw new RuntimeException("Issue not found with id: " + issueId);
        }
    }
    public Page<IssueResponseDTO> getAllIssues(Pageable pageable) {
        Page<Issue> issues = issueRepository.findAll(pageable);
        return issues.map(this::convertToResponseDTO);
    }

    public Page<IssueResponseDTO> getIssuesByCurrentUser(Pageable pageable, Integer userId) {
        Page<Issue> issues = issueRepository.findByIssuerIdOrAssigneeId(userId, userId, pageable);
        return issues.map(this::convertToResponseDTO);
    }

    private IssueResponseDTO convertToResponseDTO(Issue issue) {
        IssueResponseDTO issueResponseDTO = modelMapper.map(issue, IssueResponseDTO.class);
        issueResponseDTO.setIssuerName(userRepository.findById(issue.getIssuerId()).orElse(new User()).getName());
        issueResponseDTO.setAssigneeName(userRepository.findById(issue.getAssigneeId()).orElse(new User()).getName());
        issueResponseDTO.setBacklogId(issue.getBacklog().getId());
        issueResponseDTO.setBacklogCode(issue.getBacklog().getCode());
        issueResponseDTO.setBacklogName(issue.getBacklog().getName());
        issueResponseDTO.setSprintId(issue.getSprint().getId());
        issueResponseDTO.setSprintName(issue.getSprint().getName());
        issueResponseDTO.setProjectId(issue.getProject().getId());
        issueResponseDTO.setProjectName(issue.getProject().getName());
        return issueResponseDTO;
    }

    private Backlog findBacklogById(int id) {
        return backlogRepository.findById(id).orElseThrow(() -> new RuntimeException("Backlog not found with id: " + id));
    }

    private Sprint findSprintById(int id) {
        return sprintRepository.findById(id).orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    private User findUserById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
