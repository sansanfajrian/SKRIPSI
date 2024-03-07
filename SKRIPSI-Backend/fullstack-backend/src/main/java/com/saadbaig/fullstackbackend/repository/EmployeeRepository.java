package com.saadbaig.fullstackbackend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saadbaig.fullstackbackend.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {



}
