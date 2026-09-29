package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.dto.auth.AuthResponse;
import com.nehemiah.studyapp.dto.auth.LoginRequest;
import com.nehemiah.studyapp.dto.auth.RegisterRequest;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.util.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager =
                authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(
            RegisterRequest request
    ) {

        String username =
                request.getUsername()
                        .trim();

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (
                userRepository
                        .findByUsername(username)
                        .isPresent()
        ) {
            throw new IllegalArgumentException(
                    "Username is already in use"
            );
        }

        if (
                userRepository
                        .findByEmail(email)
                        .isPresent()
        ) {
            throw new IllegalArgumentException(
                    "Email is already in use"
            );
        }

        User user = new User();

        user.setUsername(username);

        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        String token =
                jwtUtil.generateToken(
                        savedUser.getEmail()
                );

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }

    public AuthResponse login(
            LoginRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.getPassword()
                        )
                );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        String token =
                jwtUtil.generateToken(
                        authentication
                                .getName()
                );

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}