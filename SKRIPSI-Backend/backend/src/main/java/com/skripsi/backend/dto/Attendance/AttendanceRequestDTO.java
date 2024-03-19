package com.skripsi.backend.dto.Attendance;
import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestDTO {
    private UUID id;

    private UUID employeeId;

    private UUID departmentId;

    private UUID shiftId;

    private UUID locationId;

    private LocalTime inTime;

    private LocalTime outTime;

    private String notes;

    private String image;
}
