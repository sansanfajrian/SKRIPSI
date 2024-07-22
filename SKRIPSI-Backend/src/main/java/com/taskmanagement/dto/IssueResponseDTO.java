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
public class IssueResponseDTO {
    private int id;
    private String code;
    private String title;
    private String description;
    private String status;
    private String issuedDate;
    private String closedDate;
    private int issuerId;
    private String IssuerName;
    private int assigneeId;
    private String assigneeName;
    private int backlogId;
    private String backlogCode;
    private String backlogName;
    private int sprintId;
    private String sprintName;
    private int projectId;
    private String projectName;
}