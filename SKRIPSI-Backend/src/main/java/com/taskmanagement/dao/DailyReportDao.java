package com.taskmanagement.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.DailyReport;

@Repository
public interface DailyReportDao extends JpaRepository<DailyReport, Integer>{
    Page<DailyReport> findByUserId(int userId, Pageable pageable);

    List<DailyReport> findByBacklogId(int backlogId);
}
