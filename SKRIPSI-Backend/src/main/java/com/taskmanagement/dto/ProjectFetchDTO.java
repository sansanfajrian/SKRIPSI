package com.taskmanagement.dto;

import java.util.List;

import lombok.Data;


@Data
public class ProjectFetchDTO {
    private List<ProjectResponseDto> projects;
    private boolean success;
    private String responseMessage;
}
