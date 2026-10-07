package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.Repositories.ActivityRepository;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.dto.activity.ActivityResponse;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.models.Activity;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final TankRepository tankRepository;

    public ActivityService(
            ActivityRepository activityRepository,
            UserRepository userRepository,
            TankRepository tankRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.tankRepository = tankRepository;
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                )
                .getId();
    }

    public void recordActivity(
            Long userId,
            Long tankId,
            String type,
            String description
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId
                        )
                );

        Activity activity = new Activity();

        activity.setUser(user);
        activity.setTank(tank);
        activity.setType(type);
        activity.setDescription(description);
        activity.setCreatedAt(LocalDateTime.now());

        activityRepository.save(activity);
    }

    public List<ActivityResponse> getRecentActivities(Long userId) {

        List<Long> tankIds = tankRepository
                .findByMembersId(userId)
                .stream()
                .map(Tank::getId)
                .toList();

        if (tankIds.isEmpty()) {
            return List.of();
        }

        return activityRepository
                .findTop20ByTankIdInOrderByCreatedAtDesc(tankIds)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ActivityResponse mapToResponse(Activity activity) {

        ActivityResponse response = new ActivityResponse();

        response.setId(activity.getId());
        response.setType(activity.getType());
        response.setDescription(activity.getDescription());

        response.setCreatedAt(activity.getCreatedAt());

        response.setUserId(activity.getUser().getId());
        response.setUsername(activity.getUser().getUsername());

        response.setTankId(activity.getTank().getId());
        response.setTankName(activity.getTank().getName());

        return response;
    }
}