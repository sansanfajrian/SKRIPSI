package com.skripsi.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skripsi.backend.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {



}
