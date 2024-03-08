package com.saadbaig.fullstackbackend.dto.Attendance;
import java.util.List;
import java.util.UUID;

import com.saadbaig.fullstackbackend.dto.DepartmentDTO;
import com.saadbaig.fullstackbackend.dto.LocationDTO;
import com.saadbaig.fullstackbackend.dto.ShiftDTO;
import com.saadbaig.fullstackbackend.dto.Employee.EmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private UUID id;

    private String username;

    private List<EmployeeDTO> employee;

    private List<DepartmentDTO> department;

    private List<ShiftDTO> shift;

    private List<LocationDTO> location;

    private Long inTime;
}
