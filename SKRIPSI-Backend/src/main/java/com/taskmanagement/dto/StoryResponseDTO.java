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
public class StoryResponseDTO {
    private int storyId;

    private String code;

    private String name;

    private String status;

    private String projectName;
}
