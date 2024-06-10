package com.taskmanagement.dto;

import lombok.Data;

@Data
public class DocMetadataDto {

    private int id;

    private String docId;

    private String name;

    private long size;

    private String httpContentType;

    private boolean isDeleted;

    private String presignedUrl;
}
