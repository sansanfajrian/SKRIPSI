package com.skripsi.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skripsi.backend.dto.Attendance.AttendanceDTO;
import com.skripsi.backend.dto.Attendance.AttendanceRequestDTO;
import com.skripsi.backend.service.AttendanceService;

@RestController
@RequestMapping("/attendances")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> getAllAttendances(Pageable pageable) {
        List<AttendanceDTO> attendances = attendanceService.getAllAttendances(pageable);
        return new ResponseEntity<>(attendances, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable UUID id) {
        AttendanceDTO attendance = attendanceService.getAttendanceById(id);
        if (attendance != null) {
            return new ResponseEntity<>(attendance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<AttendanceDTO> createAttendance(@RequestBody AttendanceRequestDTO requestDTO) {
        AttendanceDTO createdAttendance = attendanceService.createAttendance(requestDTO);
        return new ResponseEntity<>(createdAttendance, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDTO> updateAttendance(@PathVariable UUID id, @RequestBody AttendanceRequestDTO requestDTO) {
        AttendanceDTO updatedAttendance = attendanceService.updateAttendance(id, requestDTO);
        if (updatedAttendance != null) {
            return new ResponseEntity<>(updatedAttendance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable UUID id) {
        attendanceService.deleteAttendance(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
