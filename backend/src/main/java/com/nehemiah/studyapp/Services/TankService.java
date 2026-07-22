package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TankService {

    @Autowired
    private TankRepository tankRepository;

    @Autowired
    private UserRepository userRepository;

    public Tank createTank(Tank tank) {
        return tankRepository.save(tank);
    }

    public List<Tank> getAllTanks() {
        return tankRepository.findAll();
    }

    public Tank getTankById(Long id) {

        return tankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tank not found"));
    }

    public Tank addUserToTank(Long tankId, Long userId) {

        Tank tank = getTankById(tankId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!tank.getMembers().contains(user)) {
            tank.getMembers().add(user);
        }

        return tankRepository.save(tank);
    }

    public void deleteTank(Long id) {
        tankRepository.deleteById(id);
    }

}
