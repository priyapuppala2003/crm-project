package com.crm.crm_backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("SALES");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User existingUser = userRepository
                .findByUsername(user.getUsername())
                .orElse(null);

        if (existingUser == null) {
            return ResponseEntity.status(401)
                    .body("Invalid username or password");
        }

        if (!passwordEncoder.matches(
                user.getPassword(),
                existingUser.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid username or password");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("username", existingUser.getUsername());
        response.put("role", existingUser.getRole());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}