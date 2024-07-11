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
public class ProjectResponseDto extends CommonApiResponse {
	private int id;
	private String name;
    private String description;
    private Integer managerId;
    private String startDate;
	private String startTime;
    private String deadlineDate;
	private String deadlineTime;
    private Integer reminderEmail;
    private Integer reminderPopup;
    private String projectStatus;
	private boolean status;
	private String managerName;
	private String managerImage;
    private List<TeamMemberProjectResponseDTO> teamMembers;
}

