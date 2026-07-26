package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Task;
import com.nehemiah.studyapp.models.Tank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTank(Tank tank);
    
}