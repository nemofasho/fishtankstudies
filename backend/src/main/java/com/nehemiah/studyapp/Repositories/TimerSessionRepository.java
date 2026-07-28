package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.TimerSession;
import com.nehemiah.studyapp.models.Tank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimerSessionRepository extends JpaRepository<TimerSession, Long> {

    List<TimerSession> findByTank(Tank tank);

}
