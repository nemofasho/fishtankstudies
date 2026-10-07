package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findTop20ByTank_Members_IdInOrderByCreatedAtDesc(
            List<Long> userIds
    );

    List<Activity> findTop20ByTankIdInOrderByCreatedAtDesc(
            List<Long> tankIds
    );
}