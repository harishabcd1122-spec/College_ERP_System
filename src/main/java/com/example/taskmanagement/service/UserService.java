package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.LoginResponseDto;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user with BCrypt password hashing.
     * Validates required fields, checks for duplicate email (returns 409 CONFLICT),
     * and hashes the plaintext password before persisting to the database.
     *
     * @param user User entity containing name, email, and plaintext password
     * @return Saved User entity with hashed password (password is write-only in JSON)
     * @throws ResponseStatusException 400 if required fields are missing
     * @throws ResponseStatusException 409 if email is already registered
     */
    public User registerUser(User user) {
        // Validate required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        // Normalize email to lowercase to avoid case-sensitive duplicates
        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setName(user.getName().trim());

        // Check for duplicate email BEFORE saving to avoid DataIntegrityViolationException (HTTP 500)
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This email is already registered. Please sign in or use another email.");
        }

        // Hash the plaintext password with BCrypt
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    /**
     * Authenticate a user by email and password using BCrypt.
     * Compares the supplied password against the stored BCrypt hash.
     * Returns a safe DTO (id, name, email) — password is NEVER returned.
     *
     * @param email    the user's email address
     * @param password the plaintext password supplied by the user
     * @return LoginResponseDto containing id, name, and email
     * @throws ResponseStatusException 401 if email not found or password incorrect
     */
    public LoginResponseDto loginUser(String email, String password) {
        // Look up user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        // Compare entered password with stored BCrypt hash safely
        boolean passwordMatches = false;
        try {
            passwordMatches = passwordEncoder.matches(password, user.getPassword());
        } catch (Exception e) {
            // Handles any legacy plain-text or invalid hash formats safely
            passwordMatches = false;
        }

        if (!passwordMatches) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Return only safe fields — never the password
        return new LoginResponseDto(user.getId(), user.getName(), user.getEmail());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
