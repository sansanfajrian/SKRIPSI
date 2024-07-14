package com.taskmanagement.dto;

import java.util.List;

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
public class BacklogRequestDTO {
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
    private int rlzPicId;
    private List<DocMetadataDto> documents;
    private int storyId;
    private int sprintId;
    private int projectId;
}
