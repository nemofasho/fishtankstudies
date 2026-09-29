package com.nehemiah.studyapp.dto.message;

import lombok.Getter;
import lombok.Setter;

import com.nehemiah.studyapp.dto.attachment.AttachmentResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MessageResponse {

    private Long id;

    private String content;

    private LocalDateTime timestamp;

    private Long senderId;

    private String senderUsername;

    private Long tankId;

    private List<AttachmentResponse> attachments =
            new ArrayList<>();
            
}
