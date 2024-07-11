package com.taskmanagement.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskmanagement.listener.AuditLoggingListener;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@EntityListeners(value = { AuditingEntityListener.class, AuditLoggingListener.class })
@Table(name = "retrospective")
public class Retrospective {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "retrospectiveId")
    private int id; 

    @Column(length = 50)
    private String status;

    @Column
    private String description;

    @CreatedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date createdTime;

    @LastModifiedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date lastModifiedTime;


    @OneToOne
    @JoinColumn(name = "from_id", referencedColumnName = "team_member_id")
    private TeamMember fromId;

    @OneToOne
    @JoinColumn(name = "to_id", referencedColumnName = "team_member_id")
    private TeamMember toId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
}

