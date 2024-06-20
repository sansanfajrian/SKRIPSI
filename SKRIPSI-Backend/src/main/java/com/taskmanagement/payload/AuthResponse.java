package com.taskmanagement.payload;

import com.taskmanagement.dto.UserLoginResponse;
import lombok.Data;

@Data
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserLoginResponse user;

    public AuthResponse(String accessToken, UserLoginResponse user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
