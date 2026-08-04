package com.nehemiah.studyapp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "whiteboard_event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WhiteboardEventType eventType;

    /*
     * Unique identifier for the object being changed.
     *
     * Examples:
     * stroke-123
     * text-456
     * image-789
     */
    private String objectId;

    /*
     * JSON containing the actual whiteboard information.
     *
     * This can contain:
     * coordinates
     * colors
     * font information
     * image URLs
     * dimensions
     * etc.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String data;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tank_id", nullable = false)
    private Tank tank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
