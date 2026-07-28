package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.TimerSession;
import com.nehemiah.studyapp.Services.TimerSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timers")
public class TimerSessionController {

    private final TimerSessionService timerSessionService;

    public TimerSessionController(TimerSessionService timerSessionService) {
        this.timerSessionService = timerSessionService;
    }

    @PostMapping("/{tankId}")
    public TimerSession createTimer(@PathVariable Long tankId,
                                    @RequestBody TimerSession timerSession) {

        return timerSessionService.createTimer(tankId, timerSession);
    }

    @GetMapping("/{tankId}")
    public List<TimerSession> getTankTimers(@PathVariable Long tankId) {

        return timerSessionService.getTankTimers(tankId);
    }

    @GetMapping("/session/{id}")
    public TimerSession getTimer(@PathVariable Long id) {

        return timerSessionService.getTimerById(id);
    }

    @PutMapping("/{id}")
    public TimerSession updateTimer(@PathVariable Long id,
                                    @RequestBody TimerSession timerSession) {

        return timerSessionService.updateTimer(id, timerSession);
    }

    @DeleteMapping("/{id}")
    public void deleteTimer(@PathVariable Long id) {

        timerSessionService.deleteTimer(id);
    }

}
