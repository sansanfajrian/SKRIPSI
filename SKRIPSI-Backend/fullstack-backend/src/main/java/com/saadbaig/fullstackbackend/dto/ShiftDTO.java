package com.saadbaig.fullstackbackend.dto;
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
public class ShiftDTO {
    private UUID id;

    private LocalTime startTime;

    private LocalTime endTime;
}
