package com.saadbaig.fullstackbackend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saadbaig.fullstackbackend.dto.UserDTO;
import com.saadbaig.fullstackbackend.service.UserService;


@RestController
@CrossOrigin("*")
@RequestMapping("/users")
public class UserController {


    @Autowired
    private UserService userService;

    @GetMapping
    ResponseEntity<List<UserDTO>> getAllUsers(Pageable page) {
        List<UserDTO> getAllUsers = userService.getAllUser(page);
        return ResponseEntity.ok(getAllUsers);
    }

    @PostMapping
    ResponseEntity <UserDTO> createUsers(@RequestBody UserDTO userDTO){
        UserDTO createUser = userService.createUser(userDTO);
        return ResponseEntity.ok(createUser);
    }

    @GetMapping("/{id}")
    ResponseEntity<UserDTO> get(@PathVariable("id") UUID id) {
        UserDTO getUser = userService.getUser(id);
        
        return ResponseEntity.ok(getUser);
    }

    @PutMapping("/{id}")
    ResponseEntity <UserDTO> editUsers(@PathVariable("id") UUID id, @RequestBody UserDTO userDTO){
        UserDTO editUser = userService.editUser(id, userDTO);
        return ResponseEntity.ok(editUser);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteUsers(@PathVariable("id") UUID id){
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
