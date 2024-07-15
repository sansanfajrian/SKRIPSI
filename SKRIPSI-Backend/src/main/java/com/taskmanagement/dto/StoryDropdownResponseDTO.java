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
public class StoryDropdownResponseDTO {
    private int storyId;
    private String storyCode;
    private String storyName;
}
