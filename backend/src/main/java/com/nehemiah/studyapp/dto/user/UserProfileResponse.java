package com.nehemiah.studyapp.dto.user;

import com.nehemiah.studyapp.dto.tank.TankResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UserProfileResponse {

    private Long id;

    private String username;

    private String email;

    private String bio;

    private LocalDateTime createdAt;

    private List<TankResponse> tanks;
}