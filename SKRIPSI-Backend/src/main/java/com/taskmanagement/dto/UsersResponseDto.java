package com.taskmanagement.dto;

import java.util.List;

import com.taskmanagement.entity.User;

import lombok.Data;

@Data
public class UsersResponseDto extends CommonApiResponse {
	
	private int id;

	private String name;

	private String emailId;
	
	private String password;
	
	private String role;
	
	private boolean status;

	private String imageUrl;

	private List<User> users;
}
