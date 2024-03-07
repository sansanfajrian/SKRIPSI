package com.saadbaig.fullstackbackend.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.UserRepository;


@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // private MinioClient minioClient;

    @PostMapping("/user")
    User newUser(@RequestBody User newUser) {
        try {
            // Convert String data to InputStream
            InputStream dataStream = new ByteArrayInputStream(newUser.toString().getBytes());

            // minioClient.putObject(
            //         PutObjectArgs.builder()
            //                 .bucket("bucket-sansan")
            //                 .object(newUser.getUsername() + ".json") // Use a unique identifier for each user
            //                 .stream(dataStream, dataStream.available(), -1) // Use available() to get the length of the stream
            //                 .build()
            // );

            // Return the saved user after successful MinIO upload
            return userRepository.save(newUser);
        } catch (Exception e) {
            // Handle MinIO upload exception
            e.printStackTrace();
            
            // Handle the case where MinIO upload fails - you might want to throw an exception or return a specific response
            return null; // Adjust this accordingly based on your error handling strategy
        }
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setName(newUser.getName());
                    user.setEmail(newUser.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(() ->new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
        return "User with the id " + id + " has been successfully deleted.";
    }




}
