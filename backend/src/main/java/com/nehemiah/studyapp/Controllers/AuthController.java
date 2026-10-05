package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.Services.AuthService;
import com.nehemiah.studyapp.dto.auth.AuthResponse;
import com.nehemiah.studyapp.dto.auth.LoginRequest;
import com.nehemiah.studyapp.dto.auth.RegisterRequest;
import com.nehemiah.studyapp.models.User;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository
    ) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.register(request)
                );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return ResponseEntity.ok(
                new AuthResponse(
                        null,
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                )
        );
    }
}