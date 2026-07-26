package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.Task;
import com.nehemiah.studyapp.Services.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @PostMapping("/{tankId}")
    public Task createTask(@PathVariable Long tankId,
                           @RequestBody Task task){

        return taskService.createTask(tankId, task);
    }

    @GetMapping("/{tankId}")
    public List<Task> getTasks(@PathVariable Long tankId){

        return taskService.getTankTasks(tankId);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable Long taskId,
                           @RequestBody Task task){

        return taskService.updateTask(taskId, task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId){

        taskService.deleteTask(taskId);
    }

}
