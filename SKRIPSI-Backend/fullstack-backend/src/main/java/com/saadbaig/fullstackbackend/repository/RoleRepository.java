package com.saadbaig.fullstackbackend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saadbaig.fullstackbackend.model.Role;

public interface RoleRepository extends JpaRepository<Role, UUID> {



}
