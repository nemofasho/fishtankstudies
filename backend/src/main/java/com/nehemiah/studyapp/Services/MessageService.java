package com.nehemiah.studyapp.Services;

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

    public MessageService(MessageRepository messageRepository,
                          TankRepository tankRepository,
                          UserRepository userRepository) {

        this.messageRepository = messageRepository;
        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(Long tankId,
                               Long userId,
                               Message message){

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        message.setTank(tank);
        message.setUsersender(user);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getMessages(Long tankId){

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        return messageRepository.findByTankOrderByTimestampAsc(tank);
    }

}