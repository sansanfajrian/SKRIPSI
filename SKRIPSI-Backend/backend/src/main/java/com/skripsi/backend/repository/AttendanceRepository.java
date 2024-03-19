package com.skripsi.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skripsi.backend.model.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {



}
