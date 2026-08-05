package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.dto.whiteboard.CreateWhiteboardEventRequest;
import com.nehemiah.studyapp.dto.whiteboard.WhiteboardEventResponse;
import com.nehemiah.studyapp.Services.WhiteboardEventService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/whiteboard")
@CrossOrigin(origins = "http://localhost:5173")
public class WhiteboardEventController {

    private final WhiteboardEventService whiteboardEventService;

    public WhiteboardEventController(
            WhiteboardEventService whiteboardEventService) {

        this.whiteboardEventService =
                whiteboardEventService;
    }


    @PostMapping("/{tankId}/{userId}")
    public WhiteboardEventResponse createEvent(
            @PathVariable Long tankId,
            @PathVariable Long userId,
            @Valid @RequestBody
            CreateWhiteboardEventRequest request) {

        return whiteboardEventService.createEvent(
                tankId,
                userId,
                request
        );
    }


    @GetMapping("/tank/{tankId}")
    public List<WhiteboardEventResponse> getTankEvents(
            @PathVariable Long tankId) {

        return whiteboardEventService
                .getTankEvents(tankId);
    }


    @GetMapping("/{eventId}")
    public WhiteboardEventResponse getEvent(
            @PathVariable Long eventId) {

        return whiteboardEventService
                .getEventById(eventId);
    }


    @DeleteMapping("/{eventId}")
    public void deleteEvent(
            @PathVariable Long eventId) {

        whiteboardEventService
                .deleteEvent(eventId);
    }


    @DeleteMapping("/tank/{tankId}/clear")
    public void clearWhiteboard(
            @PathVariable Long tankId) {

        whiteboardEventService
                .clearWhiteboard(tankId);
    }
}
