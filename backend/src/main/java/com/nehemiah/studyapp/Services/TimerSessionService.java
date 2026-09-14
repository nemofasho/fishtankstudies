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

import java.time.Duration;
import java.time.LocalDateTime;
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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        TimerSession timer = new TimerSession();

        timer.setName(
                request.getName() == null || request.getName().isBlank()
                        ? "Study Timer"
                        : request.getName().trim()
        );

        timer.setDuration(request.getDuration());

        long totalSeconds = request.getDuration() * 60L;

        timer.setRemainingSeconds(totalSeconds);

        timer.setTank(tank);

        /*
         * Timers are designed to start immediately when created.
         */
        if (request.isActive()) {

            LocalDateTime now = LocalDateTime.now();

            timer.setActive(true);
            timer.setStartTime(now);
            timer.setEndTime(
                    now.plusSeconds(totalSeconds)
            );

        } else {

            timer.setActive(false);
            timer.setStartTime(null);
            timer.setEndTime(null);
        }

        TimerSession savedTimer =
                timerSessionRepository.save(timer);

        return mapToResponse(savedTimer);
    }

    public List<TimerResponse> getTankTimers(Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        return timerSessionRepository.findByTank(tank)
                .stream()
                .map(this::syncAndMapTimer)
                .toList();
    }

    public TimerResponse getTimerById(Long timerId) {

        TimerSession timer =
                timerSessionRepository.findById(timerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Timer session not found with id: "
                                                + timerId));

        return syncAndMapTimer(timer);
    }

    public TimerResponse updateTimer(
            Long timerId,
            UpdateTimerRequest request) {

        TimerSession timer =
                timerSessionRepository.findById(timerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Timer session not found with id: "
                                                + timerId));

        /*
         * Update the name if supplied.
         */
        if (request.getName() != null &&
                !request.getName().isBlank()) {

            timer.setName(request.getName().trim());
        }

        /*
         * If the timer is currently running, first calculate
         * how much time is actually left.
         */
        if (timer.isActive()) {
            updateRemainingTime(timer);
        }

        boolean requestedActive = request.isActive();

        /*
         * PAUSE
         */
        if (timer.isActive() && !requestedActive) {

            timer.setActive(false);

            /*
             * remainingSeconds was already calculated above.
             */
            timer.setEndTime(null);

        }

        /*
         * RESUME
         */
        else if (!timer.isActive() && requestedActive) {

            long remaining = timer.getRemainingSeconds();

            if (remaining > 0) {

                LocalDateTime now = LocalDateTime.now();

                timer.setActive(true);
                timer.setStartTime(now);
                timer.setEndTime(
                        now.plusSeconds(remaining)
                );

            } else {

                /*
                 * If the timer has finished, don't resume it.
                 */
                timer.setActive(false);
                timer.setEndTime(null);
            }
        }

        /*
         * Update duration only if it has changed.
         *
         * This is mainly useful if the timer is still paused.
         */
        if (request.getDuration() > 0 &&
                request.getDuration() != timer.getDuration()) {

            timer.setDuration(request.getDuration());

            /*
             * If paused, changing duration resets the
             * remaining time to the new duration.
             */
            if (!timer.isActive()) {

                long newRemaining =
                        request.getDuration() * 60L;

                timer.setRemainingSeconds(newRemaining);
            }
        }

        TimerSession updatedTimer =
                timerSessionRepository.save(timer);

        return mapToResponse(updatedTimer);
    }

    public void deleteTimer(Long timerId) {

        TimerSession timer =
                timerSessionRepository.findById(timerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Timer session not found with id: "
                                                + timerId));

        timerSessionRepository.delete(timer);
    }

    /**
     * Calculates the remaining time for a running timer
     * using its server-side endTime.
     */
    private void updateRemainingTime(TimerSession timer) {

        if (!timer.isActive() || timer.getEndTime() == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        long remaining =
                Duration.between(
                        now,
                        timer.getEndTime()
                ).getSeconds();

        if (remaining <= 0) {

            timer.setRemainingSeconds(0);
            timer.setActive(false);
            timer.setEndTime(null);

        } else {

            timer.setRemainingSeconds(remaining);
        }
    }

    /**
     * Synchronizes a timer with the current server time
     * before returning it to the frontend.
     */
    private TimerResponse syncAndMapTimer(TimerSession timer) {

        if (timer.isActive()) {

            updateRemainingTime(timer);

            /*
             * Save if the timer finished.
             */
            timerSessionRepository.save(timer);
        }

        return mapToResponse(timer);
    }

    private TimerResponse mapToResponse(
            TimerSession timer) {

        TimerResponse response =
                new TimerResponse();

        response.setId(timer.getId());
        response.setName(timer.getName());
        response.setDuration(timer.getDuration());
        response.setActive(timer.isActive());

        response.setRemainingSeconds(
                timer.getRemainingSeconds()
        );

        if (timer.getTank() != null) {

            response.setTankId(
                    timer.getTank().getId()
            );
        }

        return response;
    }
}