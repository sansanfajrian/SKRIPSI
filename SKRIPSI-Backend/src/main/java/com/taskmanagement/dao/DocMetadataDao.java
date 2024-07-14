package com.taskmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.DocMetadata;

@Repository
public interface DocMetadataDao extends JpaRepository<DocMetadata, Integer> {

    void deleteByIdIn(List<Integer> ids);

    List<DocMetadata> findAllByDocIdIn(List<Integer> docIds);
}
