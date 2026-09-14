package com.nehemiah.studyapp.dto.timer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimerResponse {

    private Long id;

    private String name;

    private int duration;

    private boolean active;

    private long remainingSeconds;

    private Long tankId;
}
