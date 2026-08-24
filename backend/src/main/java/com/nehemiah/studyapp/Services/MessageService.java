package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.message.MessageResponse;
import com.nehemiah.studyapp.dto.message.SendMessageRequest;
import com.nehemiah.studyapp.models.Message;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.Repositories.MessageRepository;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final TankRepository tankRepository;
    private final UserRepository userRepository;

    public MessageService(
            MessageRepository messageRepository,
            TankRepository tankRepository,
            UserRepository userRepository) {

        this.messageRepository = messageRepository;
        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }


    public MessageResponse sendMessage(
            Long tankId,
            Long userId,
            SendMessageRequest request) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + tankId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Message message = new Message();

        message.setContent(request.getContent());

        message.setTank(tank);

        message.setUsersender(user);

        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        return mapToResponse(savedMessage);
    }


    public List<MessageResponse> getTankMessages(Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + tankId));

        return messageRepository
                .findByTankOrderByTimestampAsc(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public void deleteMessage(Long messageId) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));

        messageRepository.delete(message);
    }


    private MessageResponse mapToResponse(Message message) {

        MessageResponse response = new MessageResponse();

        response.setId(message.getId());
        response.setContent(message.getContent());
        response.setTimestamp(message.getTimestamp());

        if (message.getUsersender() != null) {

            response.setSenderId(
                    message.getUsersender().getId()
            );

            response.setSenderUsername(
                    message.getUsersender().getUsername()
            );
        }

        if (message.getTank() != null) {

            response.setTankId(
                    message.getTank().getId()
            );
        }

        return response;
    }
}