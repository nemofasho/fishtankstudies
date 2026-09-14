package com.nehemiah.studyapp.dto.message;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;
}