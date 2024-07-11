package com.taskmanagement.dto;

import lombok.Data;

@Data
public class UserLoginResponse {

	private int id;
	
	private String name;

	private String emailId;
	
	private String role;
	
	private String jwtToken;

	private String imageUrl;
}
