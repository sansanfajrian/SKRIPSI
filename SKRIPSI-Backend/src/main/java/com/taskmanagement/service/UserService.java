package com.taskmanagement.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.UserDao;
import com.taskmanagement.entity.User;


@Service
public class UserService {
	
	@Autowired
	private UserDao userDao;
	
	@Transactional
	public User registerUser(User user) {
		User registeredUser = null;
		if(user != null) {
			registeredUser = this.userDao.save(user);
		}
		
		return registeredUser;
	}
	
	public User getUserByEmailIdAndPassword(String emailId, String password) {
		return this.userDao.findByEmailIdAndPassword(emailId, password);
	}
	
	public User getUserByEmailIdAndPasswordAndRole(String emailId, String password, String role) {
		return this.userDao.findByEmailIdAndPasswordAndRole(emailId, password, role);
	}
	
	public User getUserByEmailIdAndRole(String emailId, String role) {
		return this.userDao.findByEmailIdAndRole(emailId, role);
	}
	
	public User getUserByEmailId(String emailId) {
		return this.userDao.findByEmailId(emailId);
	}
	
	public List<User> getUsersByRoleAndStatus(String role, boolean status) {
		return this.userDao.findByRoleAndStatus(role, status);
	}
	
	public User getUserId(int userId) {
		return this.userDao.findById(userId).get();
	}
	
	public Optional<User> getUserById(int userId) {
        return this.userDao.findById(userId);
    }

	public boolean existsByEmail(String email) {
        return this.userDao.existsByEmailId(email);
    }
}
