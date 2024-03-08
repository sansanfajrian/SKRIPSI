package com.saadbaig.fullstackbackend.dto.Attendance;
import java.time.LocalTime;
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

    private EmployeeDTO employee;

    private DepartmentDTO department;

    private ShiftDTO shift;

    private LocationDTO location;

    private LocalTime inTime;

    private String inTimeStatus;

    private LocalTime outTime;

    private String outTimeStatus;

    private String notes;

    private String image;
}
