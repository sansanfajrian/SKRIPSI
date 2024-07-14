package com.taskmanagement.dto;

import java.util.List;

import com.taskmanagement.entity.Backlog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BacklogResponseDTO {
    private int backlogId;
    private String code;
    private String name;
    private String notes;
    private float estEffort;
    private float addEffort;
    private float actEffort;
    private float prog;
    private String status;
    private String startDate;
    private String planEndDate;
    private String doneDate;
    private int plannedPicId;
    private String plannedPicName;
    private int rlzPicId;
    private String rlzPicName;
    private List<DocMetadataDto> documents;
    private int storyId;
    private String storyName;
    private int sprintId;
    private String sprintName;
    private int projectId;
    private String projectName;

    private List<Backlog> backlog;
}
