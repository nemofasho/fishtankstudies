package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.timer.CreateTimerRequest;
import com.nehemiah.studyapp.dto.timer.UpdateTimerRequest;
import com.nehemiah.studyapp.dto.timer.TimerResponse;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.TimerSession;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.TimerSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimerSessionService {

    private final TimerSessionRepository timerSessionRepository;
    private final TankRepository tankRepository;

    public TimerSessionService(
            TimerSessionRepository timerSessionRepository,
            TankRepository tankRepository) {

        this.timerSessionRepository = timerSessionRepository;
        this.tankRepository = tankRepository;
    }


    public TimerResponse createTimer(
            Long tankId,
            CreateTimerRequest request) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + tankId));

        TimerSession timer = new TimerSession();

        timer.setDuration(request.getDuration());
        timer.setActive(request.isActive());
        timer.setTank(tank);

        TimerSession savedTimer = timerSessionRepository.save(timer);

        return mapToResponse(savedTimer);
    }


    public List<TimerResponse> getTankTimers(Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + tankId));

        return timerSessionRepository.findByTank(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public TimerResponse getTimerById(Long timerId) {

        TimerSession timer = timerSessionRepository.findById(timerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timer session not found with id: " + timerId));

        return mapToResponse(timer);
    }


    public TimerResponse updateTimer(
            Long timerId,
            UpdateTimerRequest request) {

        TimerSession timer = timerSessionRepository.findById(timerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timer session not found with id: " + timerId));

        timer.setDuration(request.getDuration());
        timer.setActive(request.isActive());

        TimerSession updatedTimer =
                timerSessionRepository.save(timer);

        return mapToResponse(updatedTimer);
    }


    public void deleteTimer(Long timerId) {

        TimerSession timer = timerSessionRepository.findById(timerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timer session not found with id: " + timerId));

        timerSessionRepository.delete(timer);
    }


    private TimerResponse mapToResponse(TimerSession timer) {

        TimerResponse response = new TimerResponse();

        response.setId(timer.getId());
        response.setDuration(timer.getDuration());
        response.setActive(timer.isActive());

        if (timer.getTank() != null) {
            response.setTankId(timer.getTank().getId());
        }

        return response;
    }
}
