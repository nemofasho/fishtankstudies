package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.dto.tank.TankResponse;
import com.nehemiah.studyapp.dto.tank.MemberResponse;
import com.nehemiah.studyapp.dto.user.UpdateProfileRequest;
import com.nehemiah.studyapp.dto.user.UserProfileResponse;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.models.User;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final TankRepository tankRepository;

    public UserProfileService(
            UserRepository userRepository,
            TankRepository tankRepository) {

        this.userRepository = userRepository;
        this.tankRepository = tankRepository;
    }

    public UserProfileResponse getProfile(String email) {

        User user = getUserByEmail(email);

        return mapToResponse(user);
    }

    public UserProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = getUserByEmail(email);

        if (request.getUsername() != null &&
                !request.getUsername().isBlank()) {

            String newUsername =
                    request.getUsername().trim();

            if (!newUsername.equals(user.getUsername())) {

                userRepository.findByUsername(newUsername)
                        .ifPresent(existingUser -> {
                            if (!existingUser.getId()
                                    .equals(user.getId())) {

                                throw new IllegalArgumentException(
                                        "Username is already taken"
                                );
                            }
                        });

                user.setUsername(newUsername);
            }
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    private User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                );
    }

    private UserProfileResponse mapToResponse(User user) {

        UserProfileResponse response =
                new UserProfileResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setCreatedAt(user.getCreatedAt());

        List<TankResponse> tanks =
                tankRepository.findByMembersId(user.getId())
                        .stream()
                        .map(this::mapTankToResponse)
                        .toList();

        response.setTanks(tanks);

        return response;
    }

    private TankResponse mapTankToResponse(Tank tank) {

        TankResponse response =
                new TankResponse();

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