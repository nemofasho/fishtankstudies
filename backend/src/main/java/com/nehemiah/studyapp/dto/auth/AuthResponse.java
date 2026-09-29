package com.nehemiah.studyapp.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long id;
    private String username;
    private String email;
}