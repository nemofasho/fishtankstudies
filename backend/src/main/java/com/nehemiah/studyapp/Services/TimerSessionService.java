package com.nehemiah.studyapp.Services;

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

    public TimerSessionService(TimerSessionRepository timerSessionRepository,
                               TankRepository tankRepository) {
        this.timerSessionRepository = timerSessionRepository;
        this.tankRepository = tankRepository;
    }

    public TimerSession createTimer(Long tankId, TimerSession timerSession) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        timerSession.setTank(tank);

        return timerSessionRepository.save(timerSession);
    }

    public List<TimerSession> getTankTimers(Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        return timerSessionRepository.findByTank(tank);
    }

    public TimerSession getTimerById(Long id) {
        return timerSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timer session not found"));
    }

    public TimerSession updateTimer(Long id, TimerSession updatedTimer) {

        TimerSession timer = timerSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timer session not found"));

        timer.setDuration(updatedTimer.getDuration());
        timer.setActive(updatedTimer.isActive());

        return timerSessionRepository.save(timer);
    }

    public void deleteTimer(Long id) {

        TimerSession timer = timerSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timer session not found"));

        timerSessionRepository.delete(timer);
    }

}
