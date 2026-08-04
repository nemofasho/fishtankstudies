package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.dto.task.CreateTaskRequest;
import com.nehemiah.studyapp.dto.task.UpdateTaskRequest;
import com.nehemiah.studyapp.dto.task.TaskResponse;
import com.nehemiah.studyapp.Services.TaskService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping("/{tankId}")
    public TaskResponse createTask(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateTaskRequest request) {

        return taskService.createTask(tankId, request);
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
            @Valid @RequestBody UpdateTaskRequest request) {

        return taskService.updateTask(taskId, request);
    }


    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);
    }
}