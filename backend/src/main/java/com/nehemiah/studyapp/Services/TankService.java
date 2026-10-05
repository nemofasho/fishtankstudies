package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.dto.tank.CreateTankRequest;
import com.nehemiah.studyapp.dto.tank.UpdateTankRequest;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.dto.tank.TankResponse;
import com.nehemiah.studyapp.dto.tank.MemberResponse;
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

    public TankService(
            TankRepository tankRepository,
            UserRepository userRepository) {

        this.tankRepository = tankRepository;
        this.userRepository = userRepository;
    }


    /* =========================
       CREATE TANK
    ========================= */

    public TankResponse createTank(
            CreateTankRequest request,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        Tank tank = new Tank();

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        // Automatically make creator a member
        tank.getMembers().add(user);

        Tank savedTank =
                tankRepository.save(tank);

        return mapToResponse(savedTank);
    }


    /* =========================
       GET USER'S TANKS
    ========================= */

    public List<TankResponse> getMyTanks(
            Long userId) {

        return tankRepository
                .findByMembersId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    /* =========================
       GET ALL TANKS
       Used later for discovery
    ========================= */

    public List<TankResponse> getAllTanks() {

        return tankRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    /* =========================
       GET TANK BY ID
    ========================= */

    public TankResponse getTankById(Long tankId, Long userId) {
        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                new ResourceNotFoundException("Tank not found with id: " + tankId)
                );

        boolean isMember = tank.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));

        if (!isMember) {
                throw new RuntimeException("You are not a member of this tank");
        }

        return mapToResponse(tank);
        }


    /* =========================
       UPDATE TANK
    ========================= */

    public TankResponse updateTank(
            Long id,
            UpdateTankRequest request) {

        Tank tank =
                tankRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Tank not found with id: " + id
                                )
                        );

        tank.setName(request.getName());
        tank.setSubject(request.getSubject());
        tank.setClassName(request.getClassName());

        Tank updatedTank =
                tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }


    /* =========================
       JOIN TANK
    ========================= */

    public TankResponse addUserToTank(
            Long tankId,
            Long userId) {

        Tank tank =
                tankRepository.findById(tankId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Tank not found with id: " + tankId
                                )
                        );

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with id: " + userId
                                )
                        );

        if (!tank.getMembers().contains(user)) {
            tank.getMembers().add(user);
        }

        Tank updatedTank =
                tankRepository.save(tank);

        return mapToResponse(updatedTank);
    }


    /* =========================
       DELETE TANK
    ========================= */

    public void deleteTank(Long id) {

        Tank tank =
                tankRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Tank not found with id: " + id
                                )
                        );

        tankRepository.delete(tank);
    }

    public Long getUserIdByEmail(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Authenticated user not found"
                                )
                        );

        return user.getId();
        }


    /* =========================
       MAP RESPONSE
    ========================= */

    private TankResponse mapToResponse(
            Tank tank) {

        TankResponse response =
                new TankResponse();

        response.setId(tank.getId());

        response.setName(
                tank.getName()
        );

        response.setSubject(
                tank.getSubject()
        );

        response.setClassName(
                tank.getClassName()
        );

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

                                    member.setId(
                                            user.getId()
                                    );

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