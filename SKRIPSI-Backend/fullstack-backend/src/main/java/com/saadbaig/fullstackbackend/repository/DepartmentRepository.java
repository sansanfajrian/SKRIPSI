package com.saadbaig.fullstackbackend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saadbaig.fullstackbackend.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {



}
