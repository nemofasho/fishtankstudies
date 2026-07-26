package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.Message;
import com.nehemiah.studyapp.Services.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping("/{tankId}/{userId}")
    public Message sendMessage(@PathVariable Long tankId,
                               @PathVariable Long userId,
                               @RequestBody Message message){

        return messageService.sendMessage(tankId,
                                          userId,
                                          message);
    }

    @GetMapping("/{tankId}")
    public List<Message> getMessages(@PathVariable Long tankId){

        return messageService.getMessages(tankId);
    }

}
