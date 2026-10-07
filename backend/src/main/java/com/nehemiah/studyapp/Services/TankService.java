package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.dto.tank.CreateTankRequest;
import com.nehemiah.studyapp.dto.tank.UpdateTankRequest;
import com.nehemiah.studyapp.dto.tank.TankResponse;
import com.nehemiah.studyapp.dto.tank.MemberResponse;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TankService {

    private final TankRepository tankRepository;
    private final UserRepository userRepository;

    public TankService(
            TankRepository tankRepository,
            UserRepository userRepository) {

        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }

    // Create a tank and automatically make the creator a member
    public TankResponse createTank(
            CreateTankRequest request,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        Tank tank = new Tank();

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        // Creator automatically becomes a member
        tank.getMembers().add(user);

        Tank savedTank = tankRepository.save(tank);

        return mapToResponse(savedTank);
    }

    // Get all tanks
    // This can later be used by the "Find a Tank" page
    public List<TankResponse> getAllTanks() {

        return tankRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get only tanks that the current user belongs to
    public List<TankResponse> getMyTanks(Long userId) {

        return tankRepository.findByMembersId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get a single tank
    public TankResponse getTankById(
                Long tankId,
                Long userId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        boolean isMember =
                tank.getMembers()
                        .stream()
                        .anyMatch(user ->
                                user.getId().equals(userId));

        if (!isMember) {
                throw new ResourceNotFoundException(
                        "Tank not found with id: " + tankId);
        }

        return mapToResponse(tank);
        }

    // Update a tank
    public TankResponse updateTank(
            Long id,
            UpdateTankRequest request) {

        Tank tank = tankRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + id));

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        Tank updatedTank = tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }

    // Add a user to a tank
    public TankResponse addUserToTank(
            Long tankId,
            Long userId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + tankId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        // Avoid adding the same user twice
        if (!tank.getMembers().contains(user)) {
            tank.getMembers().add(user);
        }

        Tank updatedTank = tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }

    // Delete a tank
    public void deleteTank(Long id) {

        Tank tank = tankRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: " + id));

        tankRepository.delete(tank);
    }

    // Get a user's ID from their authenticated email
    public Long getUserIdByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"));

        return user.getId();
    }

    // Convert Tank entity into TankResponse
    private TankResponse mapToResponse(Tank tank) {

        TankResponse response = new TankResponse();

        response.setId(tank.getId());
        response.setName(tank.getName());
        response.setSubject(tank.getSubject());
        response.setClassName(tank.getClassName());

        response.setMemberCount(
                tank.getMembers() == null
                        ? 0
                        : tank.getMembers().size()
        );

        response.setTaskCount(
                tank.getTasks() == null
                        ? 0
                        : tank.getTasks().size()
        );

        List<MemberResponse> members =
                tank.getMembers() == null
                        ? List.of()
                        : tank.getMembers()
                            .stream()
                            .map(user -> {

                                MemberResponse member =
                                        new MemberResponse();

                                member.setId(user.getId());
                                member.setUsername(
                                        user.getUsername()
                                );

                                return member;
                            })
                            .toList();

        response.setMembers(members);

        return response;
    }
}