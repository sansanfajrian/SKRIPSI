package com.saadbaig.fullstackbackend.dto;
import java.sql.Timestamp;
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

    private Timestamp startTime;

    private Timestamp endTime;
}
