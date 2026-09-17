package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Document;
import com.nehemiah.studyapp.models.Tank;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository
        extends JpaRepository<Document, Long> {

    List<Document> findByTankOrderByUpdatedAtDesc(
            Tank tank
    );
}