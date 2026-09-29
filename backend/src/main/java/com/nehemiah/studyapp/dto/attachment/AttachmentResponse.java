package com.nehemiah.studyapp.dto.attachment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachmentResponse {

    private Long id;

    private String fileName;

    private String contentType;

    private Long fileSize;

    private String url;
}