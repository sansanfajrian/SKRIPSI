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
public class IssueRequestDTO {
    private String code;
    private String title;
    private String description;
    private String status;
    private String issuedDate;
    private String closedDate;
    private int issuerId;
    private int assigneeId;
    private int backlogId;
    private int sprintId;
    private int projectId;
}
