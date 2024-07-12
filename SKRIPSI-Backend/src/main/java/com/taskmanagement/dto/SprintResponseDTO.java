package com.taskmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintResponseDTO {
    private int sprintId;

    private String name;

    private String startDate;

    private String endDate;
    
    private int projectId;

    private String projectName;
}
