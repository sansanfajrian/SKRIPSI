package com.skripsi.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.skripsi.backend.dto.Attendance.AttendanceDTO;
import com.skripsi.backend.dto.Attendance.AttendanceRequestDTO;
import com.skripsi.backend.model.Attendance;
import com.skripsi.backend.model.Department;
import com.skripsi.backend.model.Employee;
import com.skripsi.backend.model.Location;
import com.skripsi.backend.model.Shift;
import com.skripsi.backend.repository.AttendanceRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<AttendanceDTO> getAllAttendances(Pageable pageable) {
        List<Attendance> attendances = attendanceRepository.findAll(pageable).toList();
        return attendances.stream()
                .map(attendance -> modelMapper.map(attendance, AttendanceDTO.class))
                .collect(Collectors.toList());
    }

    public AttendanceDTO getAttendanceById(UUID id) {
        Attendance attendance = attendanceRepository.findById(id).orElse(null);
        return modelMapper.map(attendance, AttendanceDTO.class);
    }

    public AttendanceDTO createAttendance(AttendanceRequestDTO requestDTO) {
        Attendance attendance = convertToEntity(requestDTO);
        attendance.setId(UUID.randomUUID());
        attendance = attendanceRepository.save(attendance);
        if(attendance.getInTime().compareTo(attendance.getShift().getStartTime()) > 0){
            attendance.setInTimeStatus("Late");
        } else{
            attendance.setInTimeStatus("On Time");
        }

        if(attendance.getOutTime().compareTo(attendance.getShift().getEndTime()) > 0){
            attendance.setOutTimeStatus("Overtime");
        } else{
            attendance.setOutTimeStatus("On Time");
        }
        attendance = attendanceRepository.save(attendance);
        return modelMapper.map(attendance, AttendanceDTO.class);
    }

    public AttendanceDTO updateAttendance(UUID id, AttendanceRequestDTO requestDTO) {
        Attendance existingAttendance = attendanceRepository.findById(id).orElse(null);
        if (existingAttendance != null) {
            Attendance updatedAttendance = convertToEntity(requestDTO);
            updatedAttendance.setId(id);
            updatedAttendance = attendanceRepository.save(updatedAttendance);
            return modelMapper.map(updatedAttendance, AttendanceDTO.class);
        }
        return null; // or throw exception indicating attendance not found
    }

    public void deleteAttendance(UUID id) {
        attendanceRepository.deleteById(id);
    }

    private Attendance convertToEntity(AttendanceRequestDTO requestDTO) {
        var modelData = modelMapper.map(requestDTO, Attendance.class);
        modelData.setEmployee(Employee.builder().id(requestDTO.getEmployeeId()).build());
        modelData.setShift(Shift.builder().id(requestDTO.getShiftId()).build());
        modelData.setDepartment(Department.builder().id(requestDTO.getDepartmentId()).build());
        modelData.setLocation(Location.builder().id(requestDTO.getLocationId()).build());
        return modelData;
    }
}
