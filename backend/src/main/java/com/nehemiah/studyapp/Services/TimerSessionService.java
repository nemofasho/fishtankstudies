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
import org.springframework.security.core.Authentication;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimerSessionService {

    private final TimerSessionRepository timerSessionRepository;
    private final TankRepository tankRepository;
    private final ActivityService activityService;

    public TimerSessionService(
            TimerSessionRepository timerSessionRepository,
            TankRepository tankRepository,
            ActivityService activityService) {

        this.timerSessionRepository = timerSessionRepository;
        this.tankRepository = tankRepository;
        this.activityService = activityService;
    }

    /*
     * Create a new timer.
     */
    public TimerResponse createTimer(
            Long tankId,
            CreateTimerRequest request,
            Long userId,
            String username) {

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

        long totalSeconds =
                request.getDuration() * 60L;

        timer.setRemainingSeconds(totalSeconds);

        timer.setTank(tank);

        /*
         * Timers are designed to start immediately
         * when created if active is true.
         */
        if (request.isActive()) {

            LocalDateTime now =
                    LocalDateTime.now();

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

        /*
         * Record timer creation activity.
         */
        activityService.recordActivity(
                userId,
                tankId,
                "TIMER_CREATED",
                username
                        + " created the timer \""
                        + savedTimer.getName()
                        + "\"."
        );

        return mapToResponse(savedTimer);
    }

    /*
     * Get all timers for a tank.
     */
    public List<TimerResponse> getTankTimers(
            Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        return timerSessionRepository.findByTank(tank)
                .stream()
                .map(this::syncAndMapTimer)
                .toList();
    }

    /*
     * Get a single timer.
     */
    public TimerResponse getTimerById(
            Long timerId) {

        TimerSession timer =
                timerSessionRepository.findById(timerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Timer session not found with id: "
                                                + timerId));

        return syncAndMapTimer(timer);
    }

    /*
     * Update a timer.
     */
    public TimerResponse updateTimer(
            Long timerId,
            UpdateTimerRequest request,
            Long userId,
            String username) {

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

            timer.setName(
                    request.getName().trim()
            );
        }

        /*
         * If the timer is currently running,
         * calculate the actual remaining time first.
         */
        if (timer.isActive()) {

            updateRemainingTime(
                    timer,
                    userId,
                    username
            );
        }

        boolean requestedActive =
                request.isActive();

        /*
         * PAUSE
         */
        if (timer.isActive() &&
                !requestedActive) {

            timer.setActive(false);

            /*
             * Keep the current remainingSeconds.
             */
            timer.setEndTime(null);
        }

        /*
         * RESUME
         */
        else if (!timer.isActive() &&
                requestedActive) {

            long remaining =
                    timer.getRemainingSeconds();

            if (remaining > 0) {

                LocalDateTime now =
                        LocalDateTime.now();

                timer.setActive(true);

                timer.setStartTime(now);

                timer.setEndTime(
                        now.plusSeconds(remaining)
                );

            } else {

                /*
                 * Timer has already finished.
                 */
                timer.setActive(false);
                timer.setEndTime(null);
            }
        }

        /*
         * Update duration only if it has changed.
         */
        if (request.getDuration() > 0 &&
                request.getDuration()
                        != timer.getDuration()) {

            timer.setDuration(
                    request.getDuration()
            );

            /*
             * If paused, changing the duration
             * resets the remaining time.
             */
            if (!timer.isActive()) {

                long newRemaining =
                        request.getDuration() * 60L;

                timer.setRemainingSeconds(
                        newRemaining
                );
            }
        }

        TimerSession updatedTimer =
                timerSessionRepository.save(timer);

        return mapToResponse(updatedTimer);
    }

    /*
     * Delete a timer.
     */
    public void deleteTimer(
            Long timerId) {

        TimerSession timer =
                timerSessionRepository.findById(timerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Timer session not found with id: "
                                                + timerId));

        timerSessionRepository.delete(timer);
    }

    /*
     * Calculates the remaining time for a running timer
     * using its server-side endTime.
     *
     * If the timer reaches zero, a TIMER_COMPLETED
     * activity is recorded.
     */
    private void updateRemainingTime(
            TimerSession timer,
            Long userId,
            String username) {

        if (!timer.isActive() ||
                timer.getEndTime() == null) {

            return;
        }

        LocalDateTime now =
                LocalDateTime.now();

        long remaining =
                Duration.between(
                        now,
                        timer.getEndTime()
                ).getSeconds();

        if (remaining <= 0) {

            /*
             * Timer has finished.
             */
            timer.setRemainingSeconds(0);

            timer.setActive(false);

            timer.setEndTime(null);

            /*
             * Record the completion activity.
             */
            if (userId != null &&
                    username != null) {

                Long tankId =
                        timer.getTank() != null
                                ? timer.getTank().getId()
                                : null;

                if (tankId != null) {

                    activityService.recordActivity(
                            userId,
                            tankId,
                            "TIMER_COMPLETED",
                            username
                                    + " completed the timer \""
                                    + timer.getName()
                                    + "\"."
                    );
                }
            }

        } else {

            timer.setRemainingSeconds(
                    remaining
            );
        }
    }

    /*
     * Synchronizes a timer with the current
     * server time before returning it.
     */
    private TimerResponse syncAndMapTimer(
            TimerSession timer) {

        if (timer.isActive()) {

            /*
             * For GET requests, we do not have the
             * authenticated user's information here.
             *
             * The timer will still be synchronized,
             * but completion activity is handled when
             * the timer is updated through the
             * authenticated update endpoint.
             */
            updateRemainingTimeWithoutActivity(
                    timer
            );

            /*
             * Save the updated timer state.
             */
            timerSessionRepository.save(timer);
        }

        return mapToResponse(timer);
    }

    /*
     * Synchronizes the timer without creating an
     * activity record.
     *
     * This prevents duplicate TIMER_COMPLETED
     * activities when the frontend repeatedly
     * polls the timer.
     */
    private void updateRemainingTimeWithoutActivity(
            TimerSession timer) {

        if (!timer.isActive() ||
                timer.getEndTime() == null) {

            return;
        }

        LocalDateTime now =
                LocalDateTime.now();

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

            timer.setRemainingSeconds(
                    remaining
            );
        }
    }

    /*
     * Convert TimerSession entity into
     * TimerResponse.
     */
    private TimerResponse mapToResponse(
            TimerSession timer) {

        TimerResponse response =
                new TimerResponse();

        response.setId(
                timer.getId()
        );

        response.setName(
                timer.getName()
        );

        response.setDuration(
                timer.getDuration()
        );

        response.setActive(
                timer.isActive()
        );

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