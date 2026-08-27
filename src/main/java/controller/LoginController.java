package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.entity.User;
import com.collegeerp.college_erp_system.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin("*")
public class LoginController {

    private final UserService service;

    public LoginController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody User request) {

        User user = service.login(request.getUsername(), request.getPassword());

        if (user != null) {
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Username or Password");
    }
}