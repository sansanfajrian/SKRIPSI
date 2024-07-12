package com.taskmanagement.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Sprint;


@Repository
public interface SprintDao extends JpaRepository<Sprint, Integer> {
    List<Sprint> findAll();
    List<Sprint> findByProjectId(Integer projectId);
}
