package com.taskmanagement.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Retrospective;


@Repository
public interface RetrospectiveDao extends JpaRepository<Retrospective, Integer> {
    List<Retrospective> findAll();
}
