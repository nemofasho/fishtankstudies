package com.nehemiah.studyapp.dto.task;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private boolean completed;

    private LocalDate dueDate;

    private Long tankId;
}
