package com.taskmanagement.entity;


import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.springframework.beans.BeanUtils;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskmanagement.dto.UserLoginResponse;
import com.taskmanagement.listener.AuditLoggingListener;

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
@Entity
@EntityListeners(value = { AuditingEntityListener.class, AuditLoggingListener.class })
@Table(name = "user")
public class User {
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;

	@Column(length = 100)
	private String name;

	@Column(length = 100)
	private String emailId;
	
	@Column(length = 100)
	private String password;
	
	@Column
	private String role;
	
	@Column
	private boolean status;

	@Column
	private String imageUrl;

	@Column(nullable = false)
	private Boolean emailVerified = false;

	@NotNull
	@Enumerated(EnumType.STRING)
	private AuthProvider provider;

	@Column
	private String providerId;

	@CreatedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date createdTime;

    @LastModifiedDate
    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date lastModifiedTime;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private TeamMember teamMember;

	public static UserLoginResponse toUserLoginResponse(User user) {
		UserLoginResponse userLoginResponse=new UserLoginResponse();
		BeanUtils.copyProperties(user, userLoginResponse, "password");		
		return userLoginResponse;
	}
	
}
