package com.taskmanagement.dao;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Retrospective;


@Repository
public interface RetrospectiveDao extends JpaRepository<Retrospective, Integer> {
    List<Retrospective> findAll();

    @Query("SELECT r FROM Retrospective r JOIN r.project p JOIN p.teamMember tm WHERE tm.user.id = :userId")
    Page<Retrospective> findByTeamMembersUserId(@Param("userId") Integer userId, Pageable pageable);
}
