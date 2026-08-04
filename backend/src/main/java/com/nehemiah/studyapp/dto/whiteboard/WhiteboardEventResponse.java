package com.nehemiah.studyapp.dto.whiteboard;

import com.nehemiah.studyapp.models.WhiteboardEventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class WhiteboardEventResponse {

    private Long id;

    private WhiteboardEventType eventType;

    private String objectId;

    private String data;

    private LocalDateTime timestamp;

    private Long tankId;

    private Long userId;

    private String username;
}