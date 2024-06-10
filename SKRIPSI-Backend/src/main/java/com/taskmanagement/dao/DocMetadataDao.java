package com.taskmanagement.dao;

import com.taskmanagement.entity.DocMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocMetadataDao extends JpaRepository<DocMetadata, Integer> {

    void deleteByIdIn(List<Integer> ids);
}
