package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.Tank;

import jakarta.validation.Valid;

import com.nehemiah.studyapp.Services.TankService;
import com.nehemiah.studyapp.dto.tank.CreateTankRequest;
import com.nehemiah.studyapp.dto.tank.TankResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tanks")
public class TankController {

    @Autowired
    private TankService tankService;

    @PostMapping
    public TankResponse createTank(@Valid @RequestBody CreateTankRequest request) {
    return tankService.createTank(request);
    }

    @GetMapping
    public List<TankResponse> getAllTanks() {
        return tankService.getAllTanks();
    }

    @GetMapping("/{id}")
    public TankResponse getTankById(@PathVariable Long id) {
        return tankService.getTankById(id);
    }

    @PostMapping("/{tankId}/join/{userId}")
    public TankResponse joinTank(
            @PathVariable Long tankId,
            @PathVariable Long userId) {

        return tankService.addUserToTank(tankId, userId);
    }

    @DeleteMapping("/{id}")
    public String deleteTank(@PathVariable Long id) {

        tankService.deleteTank(id);

        return "Tank deleted successfully";
    }
}