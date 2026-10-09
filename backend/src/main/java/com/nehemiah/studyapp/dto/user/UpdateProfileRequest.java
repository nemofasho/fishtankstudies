package com.nehemiah.studyapp.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(
        min = 3,
        max = 50,
        message = "Username must be between 3 and 50 characters"
    )
    private String username;

    @Size(
        max = 500,
        message = "Bio cannot exceed 500 characters"
    )
    private String bio;
}