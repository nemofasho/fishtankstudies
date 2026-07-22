package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.Tank;
import com.nehemiah.studyapp.Services.TankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tanks")
public class TankController {

    @Autowired
    private TankService tankService;

    @PostMapping
    public Tank createTank(@RequestBody Tank tank) {
        return tankService.createTank(tank);
    }

    @GetMapping
    public List<Tank> getAllTanks() {
        return tankService.getAllTanks();
    }

    @GetMapping("/{id}")
    public Tank getTankById(@PathVariable Long id) {
        return tankService.getTankById(id);
    }

    @PostMapping("/{tankId}/join/{userId}")
    public Tank joinTank(
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