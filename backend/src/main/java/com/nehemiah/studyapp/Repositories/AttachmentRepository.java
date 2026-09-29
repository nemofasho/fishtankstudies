package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Attachment;
import com.nehemiah.studyapp.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository
        extends JpaRepository<Attachment, Long> {

    List<Attachment> findByMessageOrderByIdAsc(
            Message message
    );
}