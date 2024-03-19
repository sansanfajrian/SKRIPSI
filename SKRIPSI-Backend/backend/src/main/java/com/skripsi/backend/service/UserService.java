package com.skripsi.backend.service;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.skripsi.backend.dto.UserDTO;
import com.skripsi.backend.model.User;
import com.skripsi.backend.repository.UserRepository;


@Service
public class UserService {
    @Autowired
    UserRepository userRepo;

    @Autowired
    ModelMapper modelMapper;

    public List<UserDTO> getAllUser(Pageable page) {
        List<User> userList = userRepo.findAll(page).toList();
        List<UserDTO> userDTO = userList.stream().map((o)->{
            return modelMapper.map(o, UserDTO.class);
        }).toList();
        return userDTO;
    }

    public UserDTO createUser(UserDTO userDTO) {
        User newUser = modelMapper.map(userDTO, User.class);
        newUser.setId(UUID.randomUUID());
        newUser = userRepo.save(newUser);
        return modelMapper.map(newUser, UserDTO.class);
    }

    public UserDTO getUser(UUID id){
        User user = userRepo.findById(id).orElse(null);
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO editUser(UUID id, UserDTO userDTO){
        User user = userRepo.findById(id).orElse(null);
        if(user != null){
            user.setName(userDTO.getName());
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user = userRepo.save(user);
        }
        return modelMapper.map(user, UserDTO.class);
    }

    public void deleteUser(UUID id){
        userRepo.deleteById(id);
    }
}
