package com.skripsi.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skripsi.backend.model.Role;

public interface RoleRepository extends JpaRepository<Role, UUID> {



}
