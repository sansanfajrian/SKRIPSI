package com.taskmanagement.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanagement.entity.Issue;

public interface IssueDao extends JpaRepository<Issue, Integer>{
    Page<Issue> findByIssuerIdOrAssigneeId(Integer issuerId, Integer assigneeId, Pageable pageable);
}
