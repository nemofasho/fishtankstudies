package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.Services.TimerSessionService;
import com.nehemiah.studyapp.dto.timer.CreateTimerRequest;
import com.nehemiah.studyapp.dto.timer.TimerResponse;
import com.nehemiah.studyapp.dto.timer.UpdateTimerRequest;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timers/tank/{tankId}")
@CrossOrigin(origins = "http://localhost:5173")
public class TimerSessionController {

    private final TimerSessionService timerSessionService;
    private final UserRepository userRepository;

    public TimerSessionController(
            TimerSessionService timerSessionService,
            UserRepository userRepository) {

        this.timerSessionService = timerSessionService;
        this.userRepository = userRepository;
    }

    /*
     * Create a timer
     */
    @PostMapping
    public TimerResponse createTimer(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateTimerRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return timerSessionService.createTimer(
                tankId,
                request,
                user.getId(),
                user.getUsername()
        );
    }

    /*
     * Get all timers for a tank
     */
    @GetMapping
    public List<TimerResponse> getTankTimers(
            @PathVariable Long tankId) {

        return timerSessionService.getTankTimers(tankId);
    }

    /*
     * Get a single timer
     */
    @GetMapping("/{timerId}")
    public TimerResponse getTimerById(
            @PathVariable Long tankId,
            @PathVariable Long timerId) {

        return timerSessionService.getTimerById(timerId);
    }

    /*
     * Update / pause / resume a timer
     */
    @PutMapping("/{timerId}")
    public TimerResponse updateTimer(
            @PathVariable Long tankId,
            @PathVariable Long timerId,
            @Valid @RequestBody UpdateTimerRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return timerSessionService.updateTimer(
                timerId,
                request,
                user.getId(),
                user.getUsername()
        );
    }

    /*
     * Delete a timer
     */
    @DeleteMapping("/{timerId}")
    public void deleteTimer(
            @PathVariable Long tankId,
            @PathVariable Long timerId) {

        timerSessionService.deleteTimer(timerId);
    }

    /*
     * Get the currently authenticated user.
     */
    private User getAuthenticatedUser(
            Authentication authentication) {

        return userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Authenticated user not found"
                )
        );
    }
}