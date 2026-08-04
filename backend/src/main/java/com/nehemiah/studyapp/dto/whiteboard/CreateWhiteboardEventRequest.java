package com.nehemiah.studyapp.dto.whiteboard;

import com.nehemiah.studyapp.models.WhiteboardEventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateWhiteboardEventRequest {

    @NotNull(message = "Event type is required")
    private WhiteboardEventType eventType;

    private String objectId;

    @NotBlank(message = "Event data is required")
    private String data;
}
