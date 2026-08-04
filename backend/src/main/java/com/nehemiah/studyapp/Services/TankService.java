package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.dto.tank.CreateTankRequest;
import com.nehemiah.studyapp.dto.tank.UpdateTankRequest;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.tank.TankResponse;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TankService {

    private final TankRepository tankRepository;
    private final UserRepository userRepository;

    public TankService(TankRepository tankRepository,
                       UserRepository userRepository) {

        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }

    public TankResponse createTank(CreateTankRequest request) {

        Tank tank = new Tank();

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        Tank savedTank = tankRepository.save(tank);

        return mapToResponse(savedTank);
    }

    public List<TankResponse> getAllTanks() {

        return tankRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TankResponse getTankById(Long id) {

        Tank tank = tankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + id));

        return mapToResponse(tank);
    }

    public TankResponse updateTank(Long id,
                                   UpdateTankRequest request) {

        Tank tank = tankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + id));

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        Tank updatedTank = tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }

    public TankResponse addUserToTank(Long tankId,
                                      Long userId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + tankId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        tank.getMembers().add(user);

        Tank updatedTank = tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }

    public void deleteTank(Long id) {

        Tank tank = tankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tank not found with id: " + id));

        tankRepository.delete(tank);
    }

    private TankResponse mapToResponse(Tank tank) {

        TankResponse response = new TankResponse();

        response.setId(tank.getId());
        response.setName(tank.getName());
        response.setSubject(tank.getSubject());
        response.setClassName(tank.getClassName());

        response.setMemberCount(
                tank.getMembers() == null ? 0 : tank.getMembers().size()
        );

        response.setTaskCount(
                tank.getTasks() == null ? 0 : tank.getTasks().size()
        );

        return response;
    }
}