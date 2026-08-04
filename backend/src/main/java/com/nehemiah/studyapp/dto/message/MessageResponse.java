package com.nehemiah.studyapp.dto.message;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageResponse {

    private Long id;

    private String content;

    private LocalDateTime timestamp;

    private Long senderId;

    private String senderUsername;

    private Long tankId;
}
