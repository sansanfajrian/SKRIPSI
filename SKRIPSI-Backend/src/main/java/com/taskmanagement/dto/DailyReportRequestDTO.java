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
public class DailyReportRequestDTO {
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

    private int projectId;

    private int sprintId;

    private int backlogId;
}
