package com.taskmanagement.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.DocMetadataDao;
import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.StoryDao;
import com.taskmanagement.dto.StoryResponseDTO;
import com.taskmanagement.dto.UsersResponseDto;
import com.taskmanagement.entity.DocMetadata;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Story;
import com.taskmanagement.entity.User;

@Service
public class ProjectService {
	
	@Autowired
	private ProjectDao projectDao;

	@Autowired
	private DocMetadataDao docMetadataDao;

	@Autowired
    private StoryDao storyRepository;
	
	@Autowired
	private ModelMapper modelMapper;

	@Transactional
	public Project addProject(Project project) {
		// docMetadataDao.saveAll(project.getDocMetadata());
		return projectDao.save(project);
	}
	
	@Transactional
	public Project updateProject(Project project) {
		// docMetadataDao.saveAll(project.getDocMetadata());
		return projectDao.save(project);
	}
	
	@Transactional
	public void deleteProjectById(int id){
		projectDao.deleteById(id);
	}
	public List<Project> getAllProjects() {
		return projectDao.findAll();
	}
	
	public Project getProjectById(int projectId) {
		Optional<Project> projectOptional = projectDao.findById(projectId);
        return projectOptional.orElse(null);
	}
	
	public List<Project> getAllProjectsByProjectName(String projectName) {
		return projectDao.findByNameContainingIgnoreCase(projectName);
	}


	public List<DocMetadata> getAllProjectDocMetadata(Integer[] docMetadataIds) {
		return docMetadataDao.findAllById(Arrays.asList(docMetadataIds));
	}

	@Transactional
	public void deleteProjectDocuments(Integer[] deletedDocumentsId) {
		docMetadataDao.deleteByIdIn(Arrays.asList(deletedDocumentsId));
	}

	public List<UsersResponseDto> getProjectMembers(int projectId) {
        Project project = projectDao.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project not found"));

			List<UsersResponseDto> membersDto = project.getTeamMember().stream()
            .map(teamMember -> {
                User user = teamMember.getUser();
                if (user == null) {
                    throw new EntityNotFoundException("User not found for team member: " + teamMember.getId());
                }

				UsersResponseDto dto = new UsersResponseDto();
				dto.setId(user.getId());
				dto.setName(user.getName());
                return modelMapper.map(user, UsersResponseDto.class);
            })
            .collect(Collectors.toList());

        return membersDto;
	}

	public List<StoryResponseDTO> getProjectStories(int projectId) {
        // Contoh implementasi, sesuaikan dengan struktur proyek Anda
        Project project = projectDao.findById(projectId).orElseThrow(() -> new EntityNotFoundException("Project not found"));
        List<Story> stories = storyRepository.findByProject(project);
		return stories.stream()
                .map(story -> {
                    StoryResponseDTO dto = modelMapper.map(story, StoryResponseDTO.class);
                    if (story.getProject() != null) {
                        dto.setStoryId(story.getId());
                        dto.setProjectName(story.getProject().getName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
