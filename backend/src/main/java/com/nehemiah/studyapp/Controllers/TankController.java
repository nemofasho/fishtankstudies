package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.TankService;
import com.nehemiah.studyapp.dto.tank.CreateTankRequest;
import com.nehemiah.studyapp.dto.tank.TankResponse;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/tanks")
@CrossOrigin(origins = "http://localhost:5173")
public class TankController {

    private final TankService tankService;

    public TankController(
            TankService tankService) {

        this.tankService = tankService;
    }


    /* =========================
       CREATE TANK
    ========================= */

    @PostMapping
    public TankResponse createTank(
            @Valid @RequestBody CreateTankRequest request,
            Authentication authentication) {

        Long userId =
                getAuthenticatedUserId(authentication);

        return tankService.createTank(
                request,
                userId
        );
    }


    /* =========================
       MY TANKS
    ========================= */

    @GetMapping("/my")
    public List<TankResponse> getMyTanks(
            Authentication authentication) {

        Long userId =
                getAuthenticatedUserId(authentication);

        return tankService.getMyTanks(userId);
    }


    /* =========================
       ALL TANKS
       Future discovery page
    ========================= */

    @GetMapping
    public List<TankResponse> getAllTanks() {

        return tankService.getAllTanks();
    }


    /* =========================
       GET TANK
    ========================= */

    @GetMapping("/{id}")
    public TankResponse getTankById(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = getAuthenticatedUserId(authentication);
        return tankService.getTankById(id, userId);
    }


    /* =========================
       JOIN TANK
       Temporary version
    ========================= */

    @PostMapping("/{tankId}/join")
    public TankResponse joinTank(
            @PathVariable Long tankId,
            Authentication authentication) {

        Long userId = getAuthenticatedUserId(authentication);

        return tankService.addUserToTank(
                tankId,
                userId
        );
    }


    /* =========================
       DELETE TANK
    ========================= */

    @DeleteMapping("/{id}")
    public String deleteTank(
            @PathVariable Long id) {

        tankService.deleteTank(id);

        return "Tank deleted successfully";
    }


    /* =========================
       AUTHENTICATED USER
    ========================= */

    private Long getAuthenticatedUserId(
            Authentication authentication) {

        String email =
                authentication.getName();

        return tankService.getUserIdByEmail(email);
    }
}