package com.taskmanagement.dao;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Sprint;


@Repository
public interface SprintDao extends JpaRepository<Sprint, Integer> {
    List<Sprint> findAll();
    List<Sprint> findByProjectId(Integer projectId);

    List<Sprint> findByProjectIdAndBacklogId(Integer backlogId, Integer projectId);

    @Query("SELECT s FROM Sprint s JOIN s.project p JOIN p.teamMember tm WHERE tm.user.id = :userId")
    List<Sprint> findSprintsByTeamMembersUserId(@Param("userId") Integer userId, Pageable pageable);
}
