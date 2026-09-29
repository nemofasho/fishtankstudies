package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.DocumentService;
import com.nehemiah.studyapp.dto.document.CreateDocumentRequest;
import com.nehemiah.studyapp.dto.document.DocumentResponse;
import com.nehemiah.studyapp.dto.document.UpdateDocumentRequest;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(
            DocumentService documentService) {

        this.documentService = documentService;
    }

    @PostMapping("/tank/{tankId}")
    public DocumentResponse createDocument(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateDocumentRequest request) {

        return documentService.createDocument(
                tankId,
                request
        );
    }

    @GetMapping("/tank/{tankId}")
    public List<DocumentResponse> getTankDocuments(
            @PathVariable Long tankId) {

        return documentService.getTankDocuments(
                tankId
        );
    }

    @GetMapping("/{documentId}")
    public DocumentResponse getDocument(
            @PathVariable Long documentId) {

        return documentService.getDocumentById(
                documentId
        );
    }

    @PutMapping("/{documentId}")
    public DocumentResponse updateDocument(
            @PathVariable Long documentId,
            @Valid @RequestBody UpdateDocumentRequest request) {

        return documentService.updateDocument(
                documentId,
                request
        );
    }

    @DeleteMapping("/{documentId}")
    public void deleteDocument(
            @PathVariable Long documentId) {

        documentService.deleteDocument(
                documentId
        );
    }
}