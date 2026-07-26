package com.nehemiah.studyapp.Services;

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

    public TaskService(TaskRepository taskRepository,
                       TankRepository tankRepository) {
        this.taskRepository = taskRepository;
        this.tankRepository = tankRepository;
    }

    public Task createTask(Long tankId, Task task) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        task.setTank(tank);

        return taskRepository.save(task);
    }

    public List<Task> getTankTasks(Long tankId){

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Tank not found"));

        return taskRepository.findByTank(tank);
    }

    public Task updateTask(Long id, Task updatedTask){

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(updatedTask.getTitle());
        task.setCompleted(updatedTask.isCompleted());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id){
        taskRepository.deleteById(id);
    }

}
