package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.User;
import com.collegeerp.college_erp_system.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User login(String username, String password) {

        User user = repository.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }
}