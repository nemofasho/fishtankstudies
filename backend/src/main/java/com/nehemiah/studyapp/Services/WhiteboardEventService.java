package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.whiteboard.CreateWhiteboardEventRequest;
import com.nehemiah.studyapp.dto.whiteboard.WhiteboardEventResponse;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.models.WhiteboardEvent;
import com.nehemiah.studyapp.models.WhiteboardEventType;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.Repositories.WhiteboardEventRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WhiteboardEventService {

    private final WhiteboardEventRepository whiteboardEventRepository;
    private final TankRepository tankRepository;
    private final UserRepository userRepository;

    public WhiteboardEventService(
            WhiteboardEventRepository whiteboardEventRepository,
            TankRepository tankRepository,
            UserRepository userRepository) {

        this.whiteboardEventRepository = whiteboardEventRepository;
        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }


    // CREATE EVENT
    public WhiteboardEventResponse createEvent(
            Long tankId,
            Long userId,
            CreateWhiteboardEventRequest request) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tank not found with id: " + tankId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));

        WhiteboardEvent event = new WhiteboardEvent();

        event.setEventType(request.getEventType());
        event.setObjectId(request.getObjectId());
        event.setData(request.getData());

        event.setTimestamp(LocalDateTime.now());

        event.setTank(tank);
        event.setUser(user);

        WhiteboardEvent savedEvent =
                whiteboardEventRepository.save(event);

        return mapToResponse(savedEvent);
    }


    // GET WHITEBOARD HISTORY
    public List<WhiteboardEventResponse> getTankEvents(
            Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tank not found with id: " + tankId));

        return whiteboardEventRepository
                .findByTankOrderByTimestampAsc(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // GET ONE EVENT
    public WhiteboardEventResponse getEventById(
            Long eventId) {

        WhiteboardEvent event =
                whiteboardEventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Whiteboard event not found with id: " + eventId));

        return mapToResponse(event);
    }


    // DELETE EVENT
    public void deleteEvent(Long eventId) {

        WhiteboardEvent event =
                whiteboardEventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Whiteboard event not found with id: " + eventId));

        whiteboardEventRepository.delete(event);
    }


    // CLEAR WHITEBOARD
    @Transactional
    public void clearWhiteboard(Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tank not found with id: " + tankId));

        whiteboardEventRepository.deleteByTank(tank);
    }


    // ENTITY -> DTO
    private WhiteboardEventResponse mapToResponse(
            WhiteboardEvent event) {

        WhiteboardEventResponse response =
                new WhiteboardEventResponse();

        response.setId(event.getId());
        response.setEventType(event.getEventType());
        response.setObjectId(event.getObjectId());
        response.setData(event.getData());
        response.setTimestamp(event.getTimestamp());

        if (event.getTank() != null) {
            response.setTankId(
                    event.getTank().getId()
            );
        }

        if (event.getUser() != null) {

            response.setUserId(
                    event.getUser().getId()
            );

            response.setUsername(
                    event.getUser().getUsername()
            );
        }

        return response;
    }
}
