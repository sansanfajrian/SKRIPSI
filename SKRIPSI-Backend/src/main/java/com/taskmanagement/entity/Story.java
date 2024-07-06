package com.taskmanagement.entity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.taskmanagement.listener.AuditLoggingListener;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(value = { AuditingEntityListener.class, AuditLoggingListener.class })
@Table(name = "story")
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sprintId")
    private int id; 
    
    private String code;

    private String name;

    private String status;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
