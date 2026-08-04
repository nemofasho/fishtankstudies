package com.nehemiah.studyapp.dto.timer;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTimerRequest {

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private int duration;

    private boolean active;
}
