package com.nehemiah.studyapp.models;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimerSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int duration; // Duration in minutes

    private String name;

    private boolean active;

    private long remainingSeconds;
    
    private LocalDateTime startTime;

    private LocalDateTime endTime;


    @ManyToOne
    private Tank tank;
}