package com.taskmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocMetadata {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    private String docId;

    private String name;

    private long size;

    private String httpContentType;
}
