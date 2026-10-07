package com.nehemiah.studyapp.dto.activity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ActivityResponse {

    private Long id;
    private String type;
    private String description;
    private LocalDateTime createdAt;

    private Long userId;
    private String username;

    private Long tankId;
    private String tankName;
}