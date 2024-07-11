package com.taskmanagement.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.dto.UserLoginRequest;
import com.taskmanagement.dto.UserLoginResponse;
import com.taskmanagement.dto.UserRoleResponse;
import com.taskmanagement.dto.UsersResponseDto;
import com.taskmanagement.entity.AuthProvider;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.payload.AuthResponse;
import com.taskmanagement.payload.LoginRequest;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.CustomUserDetailsService;
import com.taskmanagement.security.TokenProvider;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.UserService;
import com.taskmanagement.utility.Constants.Sex;
import com.taskmanagement.utility.Constants.UserRole;
import com.taskmanagement.utility.JwtUtil;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("api/user/")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    Logger LOG = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenProvider tokenProvider;

    @GetMapping("me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        User user = userService.getUserId(userPrincipal.getId());

        if (user == null) {
            throw new ResourceNotFoundException("User", "id", userPrincipal.getId());
        }

        return user;
    }

    @GetMapping("gender")
    @ApiOperation(value = "Api to get all user gender")
    public ResponseEntity<?> getAllUserGender() {
        LOG.info("Received request for getting all the user gender");

        UserRoleResponse response = new UserRoleResponse();
        List<String> genders = new ArrayList<>();

        for (Sex gender : Sex.values()) {
            genders.add(gender.value());
        }

        if (genders.isEmpty()) {

            response.setResponseMessage("Failed to Fetch User Genders");
            return new ResponseEntity(response, HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            response.setGenders(genders);
            response.setResponseMessage("User Genders Fetched success");
            return new ResponseEntity(response, HttpStatus.OK);
        }

    }

    @PostMapping("admin/register")
    @ApiOperation(value = "Api to register Admin User")
    public ResponseEntity<CommonApiResponse> adminRegister(@RequestBody User user) {
        LOG.info("Received request for Admin register");

        CommonApiResponse response = new CommonApiResponse();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        user.setStatus(true);
        user.setProvider(AuthProvider.local);

        User registerUser = userService.registerUser(user);

        if (registerUser != null) {
            response.setSuccess(true);
            response.setResponseMessage(user.getRole() + " Registered Successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }

        response.setSuccess(true);
        response.setResponseMessage("Failed to Register " + user.getRole() + " User");
        return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @PostMapping("manager/register")
    @ApiOperation(value = "Api to register Manager User")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> mangaerRegister(@RequestBody User user) {
        LOG.info("Received request for Manager register");

        CommonApiResponse response = new CommonApiResponse();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        user.setStatus(true);
        user.setProvider(AuthProvider.local);

        User registerUser = userService.registerUser(user);

        if (registerUser != null) {
            response.setSuccess(true);
            response.setResponseMessage(user.getRole() + " Registered Successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }

        response.setSuccess(true);
        response.setResponseMessage("Failed to Register " + user.getRole() + " User");
        return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @PostMapping("employee/register")
    @ApiOperation(value = "Api to register Employee User")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> employeeRegister(@RequestBody User user) {
        LOG.info("Received request for Employee register");

        CommonApiResponse response = new CommonApiResponse();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        user.setStatus(true);
        user.setProvider(AuthProvider.local);

        User registerUser = userService.registerUser(user);

        if (registerUser != null) {
            response.setSuccess(true);
            response.setResponseMessage(user.getRole() + " Registered Successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }

        response.setSuccess(true);
        response.setResponseMessage("Failed to Register " + user.getRole() + " User");
        return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @PostMapping("login")
    @ApiOperation(value = "Api to login any User")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        LOG.info("Received request for User Login");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userService.getUserByEmailId(loginRequest.getEmail());
        UserLoginResponse useLoginResponse = User.toUserLoginResponse(user);

        String token = tokenProvider.createToken(authentication);
        return ResponseEntity.ok(new AuthResponse(token, useLoginResponse));
    }

    @PostMapping("changePassword")
    @ApiOperation(value = "Api to change the user password")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> userChangePassword(@RequestBody UserLoginRequest user) {
        LOG.info("Received request for changing the user password");

        CommonApiResponse response = new CommonApiResponse();

        if (user == null) {
            response.setSuccess(true);
            response.setResponseMessage("Failed to change the password");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());

        User existingUser = this.userService.getUserId(user.getUserId());
        existingUser.setPassword(encodedPassword);

        User updatedUser = userService.registerUser(existingUser);

        if (updatedUser != null) {
            response.setSuccess(true);
            response.setResponseMessage("password changed successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        } else {
            response.setSuccess(true);
            response.setResponseMessage("failed to change the password");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping("delete")
    @ApiOperation(value = "Api to delete the user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommonApiResponse> deleteUser(@RequestParam("userId") int userId) {
        LOG.info("Received request for deleting the user");

        CommonApiResponse response = new CommonApiResponse();

        User user = this.userService.getUserId(userId);
        user.setStatus(false);

        User updatedUser = userService.registerUser(user);  // this will update the entry

        if (updatedUser != null) {
            response.setSuccess(true);
            response.setResponseMessage("user deleted successfully");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        } else {
            response.setSuccess(true);
            response.setResponseMessage("failed to delete the user");
            return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
        }
    }

    @GetMapping("manager/all")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UsersResponseDto> getAllManager() {

        LOG.info("Received request for getting ALL Managers!!!");

        UsersResponseDto response = new UsersResponseDto();

        List<User> managers = this.userService.getUsersByRoleAndStatus(UserRole.ADMIN.value(), true);

        response.setUsers(managers);
        response.setSuccess(true);
        response.setResponseMessage("managers fetched successfully");
        return new ResponseEntity<UsersResponseDto>(response, HttpStatus.OK);
    }

    @GetMapping("employee/all")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UsersResponseDto> getAllEmployee() {
        System.out.println("Received request for getting ALL Employees!!!");

        UsersResponseDto response = new UsersResponseDto();
        List<User> employees = this.userService.getUsersByRoleAndStatus(UserRole.EMPLOYEE.value(), true);

        response.setUsers(employees);
        response.setSuccess(true);
        response.setResponseMessage("employees fetched successfully");
        return new ResponseEntity<UsersResponseDto>(response, HttpStatus.OK);
    }
}
