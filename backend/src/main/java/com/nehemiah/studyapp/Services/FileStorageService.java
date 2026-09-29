package com.nehemiah.studyapp.Services;

import com.nehemiah.studyapp.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    public static final long MAX_FILE_SIZE =
            25L * 1024L * 1024L;

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of(
                    "jpg", "jpeg", "png", "gif", "webp",
                    "mp4", "webm", "mov",
                    "pdf", "doc", "docx", "txt", "csv",
                    "xls", "xlsx", "ppt", "pptx"
            );

    private final Path uploadDirectory =
            Paths.get("uploads", "chat")
                    .toAbsolutePath()
                    .normalize();

    public FileStorageService() {

        try {
            Files.createDirectories(
                    uploadDirectory
            );

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Could not create upload directory",
                    exception
            );
        }
    }

    public StoredFile store(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {

            throw new BadRequestException(
                    "Attachment cannot be empty"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new BadRequestException(
                    "Each attachment must be 25 MB or smaller"
            );
        }

        String originalName =
                StringUtils.cleanPath(
                        file.getOriginalFilename() == null
                                ? "attachment"
                                : file.getOriginalFilename()
                );

        String extension =
                getExtension(originalName);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {

            throw new BadRequestException(
                    "Unsupported file type: " + extension
            );
        }

        String storedName =
                UUID.randomUUID()
                        + (extension.isBlank()
                                ? ""
                                : "." + extension);

        Path target =
                uploadDirectory
                        .resolve(storedName)
                        .normalize();

        if (!target.getParent().equals(
                uploadDirectory
        )) {

            throw new BadRequestException(
                    "Invalid attachment name"
            );
        }

        try (
                InputStream inputStream =
                        file.getInputStream()
        ) {

            Files.copy(
                    inputStream,
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Could not store attachment",
                    exception
            );
        }

        return new StoredFile(
                originalName,
                storedName,
                file.getContentType(),
                file.getSize(),
                target.toString()
        );
    }

    public void delete(
            String storagePath
    ) {

        if (
                storagePath == null
                        || storagePath.isBlank()
        ) {
            return;
        }

        try {

            Path target =
                    Paths.get(storagePath)
                            .toAbsolutePath()
                            .normalize();

            if (
                    target.getParent()
                            .equals(uploadDirectory)
            ) {

                Files.deleteIfExists(target);
            }

        } catch (IOException exception) {

            System.err.println(
                    "Could not delete attachment file: "
                            + exception.getMessage()
            );
        }
    }

    public Path getPath(
            String storagePath
    ) {

        Path target =
                Paths.get(storagePath)
                        .toAbsolutePath()
                        .normalize();

        if (
                !target.getParent()
                        .equals(uploadDirectory)
        ) {

            throw new BadRequestException(
                    "Invalid attachment path"
            );
        }

        return target;
    }

    private String getExtension(
            String fileName
    ) {

        int lastDot =
                fileName.lastIndexOf('.');

        if (
                lastDot < 0
                        || lastDot == fileName.length() - 1
        ) {

            return "";
        }

        return fileName
                .substring(lastDot + 1)
                .toLowerCase(Locale.ROOT);
    }

    public record StoredFile(
            String originalFileName,
            String storedFileName,
            String contentType,
            long fileSize,
            String storagePath
    ) {}
}