package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.ActivityService;
import com.nehemiah.studyapp.dto.activity.ActivityResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/recent")
    public List<ActivityResponse> getRecentActivities(
            Authentication authentication
    ) {
        Long userId =
                activityService.getUserIdByEmail(
                        authentication.getName()
                );

        return activityService.getRecentActivities(userId);
    }
}