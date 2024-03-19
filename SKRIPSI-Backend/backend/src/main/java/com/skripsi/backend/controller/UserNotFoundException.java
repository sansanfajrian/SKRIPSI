package com.skripsi.backend.controller;
import java.util.UUID;
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(UUID id) {
        super("Could not find the user with id " + id);
    }
}
