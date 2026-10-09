package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.UserProfileService;
import com.nehemiah.studyapp.dto.user.UpdateProfileRequest;
import com.nehemiah.studyapp.dto.user.UserProfileResponse;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(
            UserProfileService userProfileService) {

        this.userProfileService = userProfileService;
    }

    @GetMapping
    public UserProfileResponse getProfile(
            Authentication authentication) {

        return userProfileService.getProfile(
                authentication.getName()
        );
    }

    @PutMapping
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        return userProfileService.updateProfile(
                authentication.getName(),
                request
        );
    }
}