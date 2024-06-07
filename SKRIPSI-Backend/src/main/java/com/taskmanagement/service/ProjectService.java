package com.taskmanagement.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.taskmanagement.dao.DocMetadataDao;
import javax.transaction.Transactional;

import com.taskmanagement.entity.DocMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.entity.Project;

@Service
public class ProjectService {
	
	@Autowired
	private ProjectDao projectDao;

	@Autowired
	private DocMetadataDao docMetadataDao;

	public Project addProject(Project project) {
		docMetadataDao.saveAll(project.getDocMetadata());
		return projectDao.save(project);
	}
	
	public Project updateProject(Project project) {
		docMetadataDao.saveAll(project.getDocMetadata());
		return projectDao.save(project);
	}
	
	public List<Project> getAllProjects() {
		return projectDao.findAll();
	}
	
	public Project getProjectById(int projectId) {
		
		Project p = null;
		
		Optional<Project> oP = projectDao.findById(projectId);
		
		if(oP.isPresent()) {
			p = oP.get();
		}
		
		return p;
	}
	
	public List<Project> getAllProjectsByProjectName(String projectName) {
		return projectDao.findByNameContainingIgnoreCase(projectName);
	}
	
	public List<Project> getAllProjectsByProjectNameAndManagerId(String projectName, int managerId) {
		return projectDao.findByNameContainingIgnoreCaseAndManagerId(projectName, managerId);
	}
	
	public List<Project> getAllProjectsByProjectNameAndEmployeeId(String projectName, int employeeId) {
		return projectDao.findByNameContainingIgnoreCaseAndEmployeeId(projectName, employeeId);
	}
	
	public List<Project> getAllProjectsByEmployeeId(int employeeId) {
		return projectDao.findByEmployeeId(employeeId);
	}
	
	public List<Project> getAllProjectsByManagerId(int managerId) {
		return projectDao.findByManagerId(managerId);
	}

	public List<DocMetadata> getAllProjectDocMetadata(Integer[] docMetadataIds) {
		return docMetadataDao.findAllById(Arrays.asList(docMetadataIds));
	}

	@Transactional
	public void deleteProjectDocuments(Integer[] deletedDocumentsId) {
		docMetadataDao.deleteByIdIn(Arrays.asList(deletedDocumentsId));
	}
}
