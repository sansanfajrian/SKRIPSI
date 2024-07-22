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
public class DailyReportResponseDTO {
    private int dailyReportId;

    private String taskDetails;

    private String notes;

    private String status;

    private float addEffort;

    private float actEffort;

    private float estEffort;

    private float acmAddEffort;

    private float acmActEffort;

    private float currTaskProgress;

    private float initTaskProgress;

    private int userId;

    private String userName;

    private int projectId;

    private String projectName;

    private int sprintId;

    private String sprintName;

    private int backlogId;

    private String backlogCode;

    private String backlogName;
}
