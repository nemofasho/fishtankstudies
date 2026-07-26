package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Message;
import com.nehemiah.studyapp.models.Tank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByTankOrderByTimestampAsc(Tank tank);

}
