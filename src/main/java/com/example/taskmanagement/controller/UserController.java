package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.LoginResponseDto;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registration endpoint.
     * Accepts name, email, and password; returns created user (password excluded via @JsonProperty).
     * Returns 400 BAD REQUEST if required fields are missing.
     * Returns 409 CONFLICT if email is already registered.
     * Password is NEVER returned in the response (enforced by @JsonProperty WRITE_ONLY on User entity).
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User createdUser = userService.registerUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (ResponseStatusException ex) {
            // Return structured error with 'message' field so the frontend can display it
            Map<String, Object> errorBody = new LinkedHashMap<>();
            errorBody.put("status", ex.getStatusCode().value());
            errorBody.put("message", ex.getReason());
            return new ResponseEntity<>(errorBody, ex.getStatusCode());
        }
    }

    /**
     * Login endpoint.
     * Accepts email + password, returns safe user info (id, name, email) on success.
     * Returns 401 Unauthorized on invalid credentials.
     * Password is NEVER returned in the response.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(@RequestBody LoginRequest loginRequest) {
        LoginResponseDto responseDto = userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully with id: " + id);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Simple inner class for login request body.
     * Accepts email and password only.
     */
    static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
