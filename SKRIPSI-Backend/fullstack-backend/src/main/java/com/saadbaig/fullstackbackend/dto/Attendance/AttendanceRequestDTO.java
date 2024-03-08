package com.saadbaig.fullstackbackend.dto.Attendance;
import java.util.List;
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

    private String username;

    private List<UUID> employeeId;

    private List<UUID> departmentId;

    private List<UUID> shiftId;

    private List<UUID> locationId;

    private Long inTime;
}
