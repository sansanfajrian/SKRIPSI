package com.saadbaig.fullstackbackend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saadbaig.fullstackbackend.model.Shift;

public interface ShiftRepository extends JpaRepository<Shift, UUID> {



}
