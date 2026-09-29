package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.Repositories.AttachmentRepository;
import com.nehemiah.studyapp.Repositories.MessageRepository;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;

import com.nehemiah.studyapp.dto.attachment.AttachmentResponse;
import com.nehemiah.studyapp.dto.message.MessageResponse;
import com.nehemiah.studyapp.dto.message.SendMessageRequest;
import com.nehemiah.studyapp.dto.message.UpdateMessageRequest;

import com.nehemiah.studyapp.exception.BadRequestException;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;

import com.nehemiah.studyapp.models.Attachment;
import com.nehemiah.studyapp.models.Message;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    private final TankRepository tankRepository;

    private final UserRepository userRepository;

    private final AttachmentRepository attachmentRepository;

    private final FileStorageService fileStorageService;

    public MessageService(
            MessageRepository messageRepository,
            TankRepository tankRepository,
            UserRepository userRepository,
            AttachmentRepository attachmentRepository,
            FileStorageService fileStorageService
    ) {

        this.messageRepository =
                messageRepository;

        this.tankRepository =
                tankRepository;

        this.userRepository =
                userRepository;

        this.attachmentRepository =
                attachmentRepository;

        this.fileStorageService =
                fileStorageService;
    }

    public MessageResponse sendMessage(
            Long tankId,
            Long userId,
            SendMessageRequest request
    ) {

        String content =
                request.getContent() == null
                        ? ""
                        : request.getContent().trim();

        if (content.isBlank()) {

            throw new BadRequestException(
                    "Message content cannot be empty"
            );
        }

        Message message =
                createMessage(
                        tankId,
                        userId,
                        content
                );

        return mapToResponse(message);
    }

    public MessageResponse sendMessageWithAttachments(
            Long tankId,
            Long userId,
            String content,
            List<MultipartFile> files
    ) {

        List<MultipartFile> uploadedFiles =
                files == null
                        ? Collections.emptyList()
                        : files.stream()
                                .filter(
                                        file ->
                                                file != null
                                                        && !file.isEmpty()
                                )
                                .toList();

        String safeContent =
                content == null
                        ? ""
                        : content.trim();

        if (
                safeContent.isBlank()
                        && uploadedFiles.isEmpty()
        ) {

            throw new BadRequestException(
                    "Add a message or an attachment before sending"
            );
        }

        if (uploadedFiles.size() > 10) {

            throw new BadRequestException(
                    "You can attach up to 10 files per message"
            );
        }

        Message message =
                createMessage(
                        tankId,
                        userId,
                        safeContent
                );

        try {

            for (
                    MultipartFile file :
                    uploadedFiles
            ) {

                FileStorageService.StoredFile storedFile =
                        fileStorageService.store(file);

                Attachment attachment =
                        new Attachment();

                attachment.setOriginalFileName(
                        storedFile.originalFileName()
                );

                attachment.setStoredFileName(
                        storedFile.storedFileName()
                );

                attachment.setContentType(
                        storedFile.contentType()
                );

                attachment.setFileSize(
                        storedFile.fileSize()
                );

                attachment.setStoragePath(
                        storedFile.storagePath()
                );

                attachment.setMessage(
                        message
                );

                attachmentRepository.save(
                        attachment
                );
            }

        } catch (RuntimeException exception) {

            List<Attachment> attachments =
                    attachmentRepository
                            .findByMessageOrderByIdAsc(
                                    message
                            );

            for (
                    Attachment attachment :
                    attachments
            ) {

                fileStorageService.delete(
                        attachment.getStoragePath()
                );
            }

            attachmentRepository.deleteAll(
                    attachments
            );

            messageRepository.delete(
                    message
            );

            throw exception;
        }

        return mapToResponse(message);
    }

    private Message createMessage(
            Long tankId,
            Long userId,
            String content
    ) {

        Tank tank =
                tankRepository
                        .findById(tankId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Tank not found with id: "
                                                        + tankId
                                        )
                        );

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "User not found with id: "
                                                        + userId
                                        )
                        );

        Message message =
                new Message();

        message.setContent(content);

        message.setTank(tank);

        message.setUsersender(user);

        message.setTimestamp(
                LocalDateTime.now()
        );

        return messageRepository.save(
                message
        );
    }

    public List<MessageResponse> getTankMessages(
            Long tankId
    ) {

        Tank tank =
                tankRepository
                        .findById(tankId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Tank not found with id: "
                                                        + tankId
                                        )
                        );

        return messageRepository
                .findByTankOrderByTimestampAsc(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MessageResponse updateMessage(
            Long messageId,
            UpdateMessageRequest request
    ) {

        Message message =
                messageRepository
                        .findById(messageId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Message not found with id: "
                                                        + messageId
                                        )
                        );

        message.setContent(
                request
                        .getContent()
                        .trim()
        );

        return mapToResponse(
                messageRepository.save(message)
        );
    }

    public void deleteMessage(
            Long messageId
    ) {

        Message message =
                messageRepository
                        .findById(messageId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Message not found with id: "
                                                        + messageId
                                        )
                        );

        List<Attachment> attachments =
                attachmentRepository
                        .findByMessageOrderByIdAsc(
                                message
                        );

        for (
                Attachment attachment :
                attachments
        ) {

            fileStorageService.delete(
                    attachment.getStoragePath()
            );
        }

        attachmentRepository.deleteAll(
                attachments
        );

        messageRepository.delete(
                message
        );
    }

    public Attachment getAttachmentForTank(
            Long tankId,
            Long attachmentId
    ) {

        Attachment attachment =
                attachmentRepository
                        .findById(attachmentId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Attachment not found with id: "
                                                        + attachmentId
                                        )
                        );

        Message message =
                attachment.getMessage();

        if (
                message == null
                        || message.getTank() == null
                        || !message
                                .getTank()
                                .getId()
                                .equals(tankId)
        ) {

            throw new ResourceNotFoundException(
                    "Attachment not found in this Tank"
            );
        }

        return attachment;
    }

    private MessageResponse mapToResponse(
            Message message
    ) {

        MessageResponse response =
                new MessageResponse();

        response.setId(
                message.getId()
        );

        response.setContent(
                message.getContent()
        );

        response.setTimestamp(
                message.getTimestamp()
        );

        if (
                message.getUsersender()
                        != null
        ) {

            response.setSenderId(
                    message
                            .getUsersender()
                            .getId()
            );

            response.setSenderUsername(
                    message
                            .getUsersender()
                            .getUsername()
            );
        }

        if (
                message.getTank()
                        != null
        ) {

            response.setTankId(
                    message
                            .getTank()
                            .getId()
            );
        }

        response.setAttachments(
                attachmentRepository
                        .findByMessageOrderByIdAsc(
                                message
                        )
                        .stream()
                        .map(
                                this::mapAttachmentToResponse
                        )
                        .toList()
        );

        return response;
    }

    private AttachmentResponse mapAttachmentToResponse(
            Attachment attachment
    ) {

        AttachmentResponse response =
                new AttachmentResponse();

        response.setId(
                attachment.getId()
        );

        response.setFileName(
                attachment.getOriginalFileName()
        );

        response.setContentType(
                attachment.getContentType()
        );

        response.setFileSize(
                attachment.getFileSize()
        );

        response.setUrl(
                "/messages/tank/"
                        + attachment
                                .getMessage()
                                .getTank()
                                .getId()
                        + "/attachments/"
                        + attachment.getId()
        );

        return response;
    }
}