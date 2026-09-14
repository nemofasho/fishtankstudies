package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.task.CreateTaskRequest;
import com.nehemiah.studyapp.dto.task.UpdateTaskRequest;
import com.nehemiah.studyapp.dto.task.TaskResponse;
import com.nehemiah.studyapp.dto.tank.MemberResponse;
import com.nehemiah.studyapp.models.Task;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.Repositories.TaskRepository;
import com.nehemiah.studyapp.Repositories.TankRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TankRepository tankRepository;

    public TaskService(
            TaskRepository taskRepository,
            TankRepository tankRepository) {

        this.taskRepository = taskRepository;
        this.tankRepository = tankRepository;
    }

    public TaskResponse createTask(
            Long tankId,
            CreateTaskRequest request) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        task.setDueDate(request.getDueDate());
        task.setTank(tank);

        Task savedTask =
                taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    public List<TaskResponse> getTankTasks(
            Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        return taskRepository.findByTank(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse getTaskById(
            Long taskId) {

        Task task =
                taskRepository.findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found with id: "
                                                + taskId));

        return mapToResponse(task);
    }

    public TaskResponse updateTask(
            Long taskId,
            UpdateTaskRequest request) {

        Task task =
                taskRepository.findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found with id: "
                                                + taskId));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        task.setDueDate(request.getDueDate());

        Task updatedTask =
                taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    public void deleteTask(Long taskId) {

        Task task =
                taskRepository.findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found with id: "
                                                + taskId));

        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(
            Task task) {

        TaskResponse response =
                new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(
                task.getDescription()
        );
        response.setCompleted(
                task.isCompleted()
        );
        response.setDueDate(
                task.getDueDate()
        );

        if (task.getTank() != null) {
            response.setTankId(
                    task.getTank().getId()
            );
        }

        return response;
    }
}