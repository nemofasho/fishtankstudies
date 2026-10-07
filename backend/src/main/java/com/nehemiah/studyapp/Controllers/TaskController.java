package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.dto.task.CreateTaskRequest;
import com.nehemiah.studyapp.dto.task.UpdateTaskRequest;
import com.nehemiah.studyapp.dto.task.TaskResponse;
import com.nehemiah.studyapp.Services.TaskService;
import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(
            TaskService taskService,
            UserRepository userRepository) {

        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{tankId}")
    public TaskResponse createTask(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Authenticated user not found"
                )
        );

        return taskService.createTask(
                tankId,
                request,
                user.getId(),
                user.getUsername()
        );
    }

    @GetMapping("/tank/{tankId}")
    public List<TaskResponse> getTankTasks(
            @PathVariable Long tankId) {

        return taskService.getTankTasks(tankId);
    }

    @GetMapping("/{taskId}")
    public TaskResponse getTask(
            @PathVariable Long taskId) {

        return taskService.getTaskById(taskId);
    }

    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Authenticated user not found"
                )
        );

        return taskService.updateTask(taskId, request, user.getId(), user.getUsername());
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);
    }
}