package com.nehemiah.studyapp.dto.document;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDocumentRequest {

    @NotBlank(message = "Document title is required")
    private String title;

    private String content;
}