package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.Services.DocumentService;
import com.nehemiah.studyapp.dto.document.CreateDocumentRequest;
import com.nehemiah.studyapp.dto.document.DocumentResponse;
import com.nehemiah.studyapp.dto.document.UpdateDocumentRequest;
import com.nehemiah.studyapp.Repositories.UserRepository;
import com.nehemiah.studyapp.models.User;
import com.nehemiah.studyapp.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    public DocumentController(
            DocumentService documentService,
            UserRepository userRepository) {

        this.documentService = documentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/tank/{tankId}")
    public DocumentResponse createDocument(
            @PathVariable Long tankId,
            @Valid @RequestBody CreateDocumentRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Authenticated user not found"
                )
        );

        return documentService.createDocument(
                tankId,
                request,
                user.getId(),
                user.getUsername()
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