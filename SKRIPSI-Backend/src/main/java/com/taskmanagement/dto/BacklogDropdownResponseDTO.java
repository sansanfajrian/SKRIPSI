package com.taskmanagement.dto;

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
public class BacklogDropdownResponseDTO {
    private int backlogId;
    private String code;
    private String name;
    private int projectId;
    private int sprintId;
}
