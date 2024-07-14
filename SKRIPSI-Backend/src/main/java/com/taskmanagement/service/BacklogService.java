package com.taskmanagement.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taskmanagement.config.MinioConfig;
import com.taskmanagement.dao.BacklogDao;
import com.taskmanagement.dao.DocMetadataDao;
import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.SprintDao;
import com.taskmanagement.dao.StoryDao;
import com.taskmanagement.dao.UserDao;
import com.taskmanagement.dto.BacklogRequestDTO;
import com.taskmanagement.dto.BacklogResponseDTO;
import com.taskmanagement.dto.DocMetadataDto;
import com.taskmanagement.entity.Backlog;
import com.taskmanagement.entity.DocMetadata;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Sprint;
import com.taskmanagement.entity.Story;
import com.taskmanagement.entity.User;
import com.taskmanagement.utility.MinioUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BacklogService {

    @Autowired
    private BacklogDao backlogRepository;

    @Autowired
    private SprintDao sprintRepository;

    @Autowired
    private StoryDao storyRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private DocMetadataDao docMetadataDao;

    @Autowired
    private MinioUtils minioUtils;

    @Autowired
    private MinioConfig minioConfig;

    @Autowired
    ModelMapper modelMapper;

    public List<BacklogResponseDTO> getAllBacklogs() {
        List<Backlog> backlogs = backlogRepository.findAll();
        return backlogs.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public BacklogResponseDTO getBacklogById(int id) {
        Backlog backlog = backlogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Backlog not found with id: " + id));
        return mapToResponseDTO(backlog);
    }

    @Transactional
    public BacklogResponseDTO addBacklog(BacklogRequestDTO backlogRequestDTO, MultipartFile[] documents) {
        Backlog newBacklog = modelMapper.map(backlogRequestDTO, Backlog.class);
        newBacklog.setProject(findProjectById(backlogRequestDTO.getProjectId()));
        newBacklog.setSprint(findBySprintId(backlogRequestDTO.getSprintId()));
        newBacklog.setStory(findByStoryId(backlogRequestDTO.getStoryId()));
        
        if(documents != null){
            Set<DocMetadata> docMetadataSet = new HashSet<>();
            Arrays.stream(documents).forEach(document -> {
                String docId = UUID.randomUUID().toString();
                try {
                    minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
                    docMetadataSet.add(
                            DocMetadata.builder()
                                    .name(document.getOriginalFilename())
                                    .size(document.getSize())
                                    .httpContentType(document.getContentType())
                                    .docId(docId)
                                    .build()
                    );
                } catch (Exception e) {
                    log.error("Error uploading file: {}", document.getOriginalFilename(), e);
                }
            });
            newBacklog.setDocMetadata(docMetadataSet);
            docMetadataDao.saveAll(docMetadataSet);
        }
        newBacklog = backlogRepository.save(newBacklog);
        return mapToResponseDTO(newBacklog);
    }
    
    @Transactional
    public BacklogResponseDTO updateBacklog(int id, BacklogRequestDTO backlogRequestDTO, MultipartFile[] documents, List<Integer> deletedDocumentIds) {
        Backlog existingBacklog = backlogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Backlog not found with id: " + id));

        modelMapper.map(backlogRequestDTO, existingBacklog);

        if(documents != null){
            Set<DocMetadata> docMetadataSet = new HashSet<>();
            Arrays.stream(documents).forEach(document -> {
                String docId = UUID.randomUUID().toString();
                try {
                    minioUtils.uploadFile(minioConfig.getBucketName(), document, docId, document.getContentType());
                    DocMetadata docMetadata = DocMetadata.builder()
                            .name(document.getOriginalFilename().replaceAll("\\s+", "_"))
                            .size(document.getSize())
                            .httpContentType(document.getContentType())
                            .docId(docId)
                            .build();
                    docMetadata = docMetadataDao.save(docMetadata); // Save DocMetadata immediately
                    docMetadataSet.add(docMetadata);
                } catch (Exception e) {
                    log.error("Error uploading file: {}", document.getOriginalFilename(), e);
                }
            });
            existingBacklog.getDocMetadata().addAll(docMetadataSet);
            existingBacklog.getDocMetadata().removeIf(docMetadata -> Arrays.asList(deletedDocumentIds).contains(docMetadata.getId()));
        }
        
        if (deletedDocumentIds != null && !deletedDocumentIds.isEmpty()) {
            List<DocMetadata> deletedMetadatas = docMetadataDao.findAllById(deletedDocumentIds);
            deleteDocuments(deletedMetadatas);
            existingBacklog.getDocMetadata().removeAll(deletedMetadatas);
        }
        Backlog savedBacklog = backlogRepository.save(existingBacklog);
        return mapToResponseDTO(savedBacklog);
    }

    @Transactional
    public void deleteBacklogById(int id) {
        Backlog backlog = backlogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Backlog not found with id: " + id));

        deleteDocuments(backlog.getDocMetadata());

        backlogRepository.deleteById(id);
    }

    private void deleteDocuments(Collection<DocMetadata> docMetadataSet) {
        docMetadataSet.forEach(docMetadata -> {
            try {
                if (docMetadata.getDocId() != null) {
                    minioUtils.removeFile(minioConfig.getBucketName(), docMetadata.getDocId());
                }
            } catch (Exception e) {
                log.error("Error deleting file with docId: {}", docMetadata.getDocId(), e);
            }
        });
        docMetadataDao.deleteAll(docMetadataSet);
    }

    private BacklogResponseDTO mapToResponseDTO(Backlog backlog) {
        BacklogResponseDTO backlogResponseDTO = modelMapper.map(backlog, BacklogResponseDTO.class);
    
        backlogResponseDTO.setBacklogId(backlog.getId());
        if(backlog.getDocMetadata() != null){
            List<DocMetadataDto> documents = backlog.getDocMetadata().stream()
                .map(docMetadata -> {
                    DocMetadataDto docMetadataDto = modelMapper.map(docMetadata, DocMetadataDto.class);
                    if (docMetadata.getDocId() != null) {
                        try {
                            docMetadataDto.setPresignedUrl(minioUtils.getPresignedObjectUrl(minioConfig.getBucketName(), docMetadata.getDocId()));
                        } catch (Exception e) {
                            log.error("Error generating presigned URL for docId: {}", docMetadata.getDocId(), e);
                        }
                    }
                    return docMetadataDto;
                })
                .collect(Collectors.toList());
             backlogResponseDTO.setDocuments(documents);
        }
    
        if (backlog.getPlannedPicId() != 0) {
            User plannedPic = userRepository.findById(backlog.getPlannedPicId())
                    .orElseThrow(() -> new EntityNotFoundException("Planned PIC not found with id: " + backlog.getPlannedPicId()));
            backlogResponseDTO.setPlannedPicId(plannedPic.getId());
            backlogResponseDTO.setPlannedPicName(plannedPic.getName());
        }
    
        if (backlog.getRlzPicId() != 0) {
            User rlzPic = userRepository.findById(backlog.getRlzPicId())
                    .orElseThrow(() -> new EntityNotFoundException("Release PIC not found with id: " + backlog.getRlzPicId()));
            backlogResponseDTO.setRlzPicId(rlzPic.getId());
            backlogResponseDTO.setRlzPicName(rlzPic.getName());
        }
    
        if (backlog.getStory() != null) {
            backlogResponseDTO.setStoryId(backlog.getStory().getId());
            backlogResponseDTO.setStoryName(backlog.getStory().getName());
        }
    
        if (backlog.getSprint() != null) {
            backlogResponseDTO.setSprintId(backlog.getSprint().getId());
            backlogResponseDTO.setSprintName(backlog.getSprint().getName());
        }
    
        if (backlog.getProject() != null) {
            backlogResponseDTO.setProjectId(backlog.getProject().getId());
            backlogResponseDTO.setProjectName(backlog.getProject().getName());
        }
    
        return backlogResponseDTO;
    }

    private Project findProjectById(int id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }

    private Story findByStoryId(int id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));
    }

    private Sprint findBySprintId(int id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sprint not found with id: " + id));
    }
}