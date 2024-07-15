package com.taskmanagement.dao;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Story;

@Repository
public interface StoryDao extends JpaRepository<Story, Integer>{
    List<Story> findAll();

    List<Story> findByProject(Project project);

    List<Story> findByProjectId(Integer projectId);

    @Query("SELECT s FROM Story s JOIN s.project p JOIN p.teamMember tm WHERE tm.user.id = :userId")
    Page<Story> findByTeamMembersUserId(@Param("userId") Integer userId, Pageable pageable);
}
