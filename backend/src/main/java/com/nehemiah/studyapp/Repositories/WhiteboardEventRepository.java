package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.WhiteboardEvent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WhiteboardEventRepository
        extends JpaRepository<WhiteboardEvent, Long> {

    List<WhiteboardEvent> findByTankOrderByTimestampAsc(Tank tank);

    void deleteByTank(Tank tank);
}
