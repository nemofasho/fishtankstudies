package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.Repositories.DocumentRepository;
import com.nehemiah.studyapp.Repositories.TankRepository;
import com.nehemiah.studyapp.dto.document.CreateDocumentRequest;
import com.nehemiah.studyapp.dto.document.DocumentResponse;
import com.nehemiah.studyapp.dto.document.UpdateDocumentRequest;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;
import com.nehemiah.studyapp.models.Document;
import com.nehemiah.studyapp.models.Tank;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TankRepository tankRepository;
    private final ActivityService activityService;

    public DocumentService(
            DocumentRepository documentRepository,
            TankRepository tankRepository,
            ActivityService activityService) {

        this.documentRepository = documentRepository;
        this.tankRepository = tankRepository;
        this.activityService = activityService;
    }

    public DocumentResponse createDocument(
            Long tankId,
            CreateDocumentRequest request,
            Long userId,
            String username) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: "
                                        + tankId));

        Document document = new Document();

        document.setTitle(
                request.getTitle().trim()
        );

        document.setContent(
                request.getContent() == null
                        ? ""
                        : request.getContent()
        );

        document.setTank(tank);

        LocalDateTime now =
                LocalDateTime.now();

        document.setCreatedAt(now);
        document.setUpdatedAt(now);

        Document savedDocument = documentRepository.save(document);
        
        activityService.recordActivity(userId, tankId, "DOCUMENT_CREATED", username + " created the document \"" + savedDocument.getTitle() + "\".");
        
        return mapToResponse(savedDocument);
    }

    public List<DocumentResponse> getTankDocuments(
        Long tankId) {

        Tank tank = tankRepository.findById(tankId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tank not found with id: "
                                        + tankId));

        return documentRepository
                .findByTankOrderByUpdatedAtDesc(tank)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DocumentResponse getDocumentById(
            Long documentId) {

        Document document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found with id: "
                                                + documentId));

        return mapToResponse(document);
    }

    public DocumentResponse updateDocument(
            Long documentId,
            UpdateDocumentRequest request) {

        Document document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found with id: "
                                                + documentId));

        document.setTitle(
                request.getTitle().trim()
        );

        document.setContent(
                request.getContent() == null
                        ? ""
                        : request.getContent()
        );

        document.setUpdatedAt(
                LocalDateTime.now()
        );

        Document updatedDocument =
                documentRepository.save(document);

        return mapToResponse(updatedDocument);
    }

    public void deleteDocument(
            Long documentId) {

        Document document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found with id: "
                                                + documentId));

        documentRepository.delete(document);
    }

    private DocumentResponse mapToResponse(
            Document document) {

        DocumentResponse response =
                new DocumentResponse();

        response.setId(document.getId());
        response.setTitle(document.getTitle());
        response.setContent(document.getContent());
        response.setCreatedAt(document.getCreatedAt());
        response.setUpdatedAt(document.getUpdatedAt());

        if (document.getTank() != null) {
            response.setTankId(
                    document.getTank().getId()
            );
        }

        return response;
    }
}