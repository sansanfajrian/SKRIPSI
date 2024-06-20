package com.taskmanagement.entity;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	private String name;
	
	private String description;
	
	private String requirement;
	
	private int employeeId;
	
	private int managerId;
	
	private String status;
	
	private String assignStatus;
	
	private String createdDate;
	
	private String assignedDate;

	private String startDate;

	private String startTime;
	
	private String deadlineDate;

	private String deadlineTime;

	private int reminderEmail;

	private int reminderPopup;

	@OneToMany
	private Set<DocMetadata> docMetadata;
	
}
