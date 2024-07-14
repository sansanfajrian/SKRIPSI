package com.taskmanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Backlog;

@Repository
public interface BacklogDao extends JpaRepository<Backlog, Integer> {
    
}
