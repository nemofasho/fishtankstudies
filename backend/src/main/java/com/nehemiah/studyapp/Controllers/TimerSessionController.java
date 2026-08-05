package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.dto.timer.CreateTimerRequest;
import com.nehemiah.studyapp.dto.timer.UpdateTimerRequest;
import com.nehemiah.studyapp.dto.timer.TimerResponse;
import com.nehemiah.studyapp.Services.TimerSessionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timers")
@CrossOrigin(origins = "http://localhost:5173")
public class TimerSessionController {

    private final TimerSessionService timerSessionService;

    public TimerSessionController(
            TimerSessionService timerSessionService) {

        this.timerSessionService = timerSessionService;
    }


    @PostMapping("/{tankId}")
    public TimerResponse createTimer(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateTimerRequest request) {

        return timerSessionService.createTimer(tankId, request);
    }


    @GetMapping("/tank/{tankId}")
    public List<TimerResponse> getTankTimers(
            @PathVariable Long tankId) {

        return timerSessionService.getTankTimers(tankId);
    }


    @GetMapping("/{timerId}")
    public TimerResponse getTimer(
            @PathVariable Long timerId) {

        return timerSessionService.getTimerById(timerId);
    }


    @PutMapping("/{timerId}")
    public TimerResponse updateTimer(
            @PathVariable Long timerId,
            @Valid @RequestBody UpdateTimerRequest request) {

        return timerSessionService.updateTimer(timerId, request);
    }


    // DELETE TIMER
    @DeleteMapping("/{timerId}")
    public void deleteTimer(
            @PathVariable Long timerId) {

        timerSessionService.deleteTimer(timerId);
    }
}
