package com.nehemiah.studyapp.dto.tank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TankResponse {

    private Long id;

    private String name;

    private String subject;

    private String className;

    private int memberCount;

    private int taskCount;
}
