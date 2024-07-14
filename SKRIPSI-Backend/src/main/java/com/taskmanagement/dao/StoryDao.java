package com.taskmanagement.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Story;

@Repository
public interface StoryDao extends JpaRepository<Story, Integer>{
    List<Story> findAll();

    List<Story> findByProject(Project project);
}
