package com.nehemiah.studyapp.dto.tank;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTankRequest {

    @NotBlank(message = "Tank name is required")
    private String name;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Class name is required")
    private String className;
}