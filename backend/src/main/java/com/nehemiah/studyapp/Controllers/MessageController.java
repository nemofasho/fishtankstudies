package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.FileStorageService;
import com.nehemiah.studyapp.Services.MessageService;
import com.nehemiah.studyapp.dto.message.MessageResponse;
import com.nehemiah.studyapp.dto.message.SendMessageRequest;
import com.nehemiah.studyapp.dto.message.UpdateMessageRequest;
import com.nehemiah.studyapp.models.Attachment;

import jakarta.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService messageService;

    private final FileStorageService fileStorageService;

    public MessageController(
            MessageService messageService,
            FileStorageService fileStorageService
    ) {

        this.messageService =
                messageService;

        this.fileStorageService =
                fileStorageService;
    }

    @PostMapping("/{tankId}/{userId}")
    public MessageResponse sendMessage(
            @PathVariable Long tankId,
            @PathVariable Long userId,
            @Valid @RequestBody SendMessageRequest request
    ) {

        return messageService.sendMessage(
                tankId,
                userId,
                request
        );
    }

    @PostMapping(
            value = "/{tankId}/{userId}/attachments",
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public MessageResponse sendMessageWithAttachments(
            @PathVariable Long tankId,
            @PathVariable Long userId,

            @RequestPart(
                    value = "content",
                    required = false
            )
            String content,

            @RequestPart(
                    value = "files",
                    required = false
            )
            List<MultipartFile> files
    ) {

        return messageService
                .sendMessageWithAttachments(
                        tankId,
                        userId,
                        content,
                        files
                );
    }

    @GetMapping("/tank/{tankId}")
    public List<MessageResponse> getTankMessages(
            @PathVariable Long tankId
    ) {

        return messageService
                .getTankMessages(tankId);
    }

    @GetMapping(
            "/tank/{tankId}/attachments/{attachmentId}"
    )
    public ResponseEntity<Resource> getAttachment(
            @PathVariable Long tankId,
            @PathVariable Long attachmentId
    ) throws IOException {

        Attachment attachment =
                messageService.getAttachmentForTank(
                        tankId,
                        attachmentId
                );

        Resource resource =
                new UrlResource(
                        fileStorageService
                                .getPath(
                                        attachment.getStoragePath()
                                )
                                .toUri()
                );

        if (
                !resource.exists()
                        || !resource.isReadable()
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        MediaType mediaType =
                MediaType.APPLICATION_OCTET_STREAM;

        if (
                attachment.getContentType()
                        != null
        ) {

            try {

                mediaType =
                        MediaType.parseMediaType(
                                attachment.getContentType()
                        );

            } catch (IllegalArgumentException ignored) {
                // Use default binary type.
            }

        } else {

            String detectedType =
                    Files.probeContentType(
                            resource.getFile().toPath()
                    );

            if (detectedType != null) {

                mediaType =
                        MediaType.parseMediaType(
                                detectedType
                        );
            }
        }

        boolean inline =
                mediaType.getType().equals("image")
                        || mediaType.getType().equals("video");

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(
                        attachment.getFileSize()
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        (
                                inline
                                        ? "inline"
                                        : "attachment"
                        )
                                + "; filename*=UTF-8''"
                                + java.net.URLEncoder
                                        .encode(
                                                attachment
                                                        .getOriginalFileName(),
                                                java.nio.charset.StandardCharsets.UTF_8
                                        )
                                        .replace(
                                                "+",
                                                "%20"
                                        )
                )
                .body(resource);
    }

    @PutMapping("/{messageId}")
    public MessageResponse updateMessage(
            @PathVariable Long messageId,
            @Valid @RequestBody UpdateMessageRequest request
    ) {

        return messageService.updateMessage(
                messageId,
                request
        );
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(
            @PathVariable Long messageId
    ) {

        messageService.deleteMessage(
                messageId
        );
    }
}