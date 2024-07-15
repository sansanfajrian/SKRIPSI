package com.taskmanagement.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Backlog;

@Repository
public interface BacklogDao extends JpaRepository<Backlog, Integer> {
    List<Backlog> findByProjectId(int projectId);

    @Query("SELECT b FROM Backlog b JOIN b.project p JOIN p.teamMember tm WHERE tm.user.id = :userId")
    Page<Backlog> findBacklogsByTeamMembersUserId(@Param("userId") Integer userId, Pageable pageable);
}
