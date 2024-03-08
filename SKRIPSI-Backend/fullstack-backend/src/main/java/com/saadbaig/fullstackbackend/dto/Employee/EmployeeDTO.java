package com.saadbaig.fullstackbackend.dto.Employee;
import java.util.Date;
import java.util.UUID;

import com.saadbaig.fullstackbackend.dto.DepartmentDTO;
import com.saadbaig.fullstackbackend.dto.ShiftDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private UUID id;

    private String name;

    private String email;

    private String gender;

    private String image;

    private Date birthDate;

    private Date hireDate;

    private ShiftDTO shift;

    private DepartmentDTO department;
}
