package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.dto.message.MessageResponse;
import com.nehemiah.studyapp.dto.message.SendMessageRequest;
import com.nehemiah.studyapp.Services.MessageService;
import com.nehemiah.studyapp.dto.message.UpdateMessageRequest;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }


    @PostMapping("/{tankId}/{userId}")
    public MessageResponse sendMessage(
            @PathVariable Long tankId,
            @PathVariable Long userId,
            @Valid @RequestBody SendMessageRequest request) {

        return messageService.sendMessage(
                tankId,
                userId,
                request
        );
    }


    @GetMapping("/tank/{tankId}")
    public List<MessageResponse> getTankMessages(
            @PathVariable Long tankId) {

        return messageService.getTankMessages(tankId);
    }

    @PutMapping("/{messageId}")
    public MessageResponse updateMessage(
            @PathVariable Long messageId,
            @Valid @RequestBody UpdateMessageRequest request) {

        return messageService.updateMessage(
                messageId,
                request
        );
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(
            @PathVariable Long messageId) {

        messageService.deleteMessage(messageId);
    }
}