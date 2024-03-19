package com.skripsi.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skripsi.backend.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {



}
