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
public class RetrospectiveResponseDTO {
    private int retrospectiveId;

    private String status;

    private String description;

    private int fromId;

    private int toId;

    private int projectId;

    private int sprintId;

    private String from;

    private String to;

    private String projectName;

    private String sprintName;
}
