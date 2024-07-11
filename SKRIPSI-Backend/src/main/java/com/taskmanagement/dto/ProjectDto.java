package com.taskmanagement.dto;

import java.util.List;

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
public class ProjectDto {
	
	private String name;
    private String description;
    private Integer managerId;
    private String projectStatus;
    private String startDate;
    private String startTime;
    private String deadlineDate;
    private String deadlineTime;
    private Integer reminderEmail;
    private Integer reminderPopup;
    private List<Integer> memberIds;

}
