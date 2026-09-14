package com.nehemiah.studyapp.dto.tank;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class TankResponse {

    private Long id;

    private String name;

    private String subject;

    private String className;

    private int memberCount;

    private int taskCount;

    private List<MemberResponse> members;

}
