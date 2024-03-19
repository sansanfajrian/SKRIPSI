package com.skripsi.backend.dto.Employee;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDTO {
    private UUID id;

    private String name;

    private String email;

    private String gender;

    private String image;

    private Date birthDate;

    private Date hireDate;

    private UUID shiftId;

    private UUID departmentId;
}
