package com.taskmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanagement.entity.TeamMember;

public interface TeamMemberDao  extends JpaRepository<TeamMember, Integer> {
    List<TeamMember> findByProjectId(Integer projectId);
}
