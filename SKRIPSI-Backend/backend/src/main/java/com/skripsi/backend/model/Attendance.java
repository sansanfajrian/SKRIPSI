package com.skripsi.backend.model;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.skripsi.backend.listener.AuditLoggingListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(value = { AuditingEntityListener.class, AuditLoggingListener.class })
@Table(name = "attendance")
@Entity
public class Attendance {
    @Id
    @Column(columnDefinition = "BINARY(16)", name = "id")
    @NotNull(message = "attendance id cannot be null")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "inTime")
    private LocalTime inTime;

    @Column
    private String inTimeStatus;

    @Column(name = "outTime")
    private LocalTime outTime;

    @Column
    private String outTimeStatus;

    @Column
    private String notes;

    @Column
    private String image;

    @Column(length = 50)
    private String createdBy;

    @CreatedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date createdTime;

    @Column(length = 50)
    private String lastModifiedBy;

    @LastModifiedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date lastModifiedTime;
}
