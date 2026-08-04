package com.nehemiah.studyapp.dto.task;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private boolean completed;

    private Long tankId;
}
