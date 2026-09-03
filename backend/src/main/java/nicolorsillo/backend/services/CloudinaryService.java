package nicolorsillo.backend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.exceptions.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryService {

    private static final long MAX_FILE_SIZE_BYTES = 100L * 1024 * 1024;

    private static final List<String> ALLOWED_PROJECT_CONTENT_TYPES = List.of(
            "image/png", "image/jpeg", "image/webp", "application/pdf"
    );
    private static final List<String> ALLOWED_PROJECT_3D_EXTENSIONS = List.of(".glb");

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadProjectFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Il file è obbligatorio e non può essere vuoto");
        }

        String contentType = file.getContentType();
        if (contentType != null && ALLOWED_PROJECT_CONTENT_TYPES.contains(contentType)) {
            return uploadFile(file, folder, ALLOWED_PROJECT_CONTENT_TYPES);
        }

        String extension = extractExtension(file.getOriginalFilename());
        if (ALLOWED_PROJECT_3D_EXTENSIONS.stream().anyMatch(ext -> ext.equalsIgnoreCase(extension))) {
            return uploadRawFileByExtension(file, folder, ALLOWED_PROJECT_3D_EXTENSIONS);
        }

        throw new BadRequestException("Formato file non ammesso. Ammessi: immagini (PNG/JPEG/WEBP), PDF, modelli 3D (.glb)");
    }

    public String uploadFile(MultipartFile file, String folder, List<String> allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Il file è obbligatorio e non può essere vuoto");
        }
        checkFileSize(file);

        if (allowedContentTypes != null && !allowedContentTypes.contains(file.getContentType())) {
            throw new BadRequestException("Tipo di file non ammesso: " + file.getContentType()
                    + ". Tipi ammessi: " + allowedContentTypes);
        }

        try {
            Map<?, ?> uploadResult = this.cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("asset_folder", folder, "resource_type", "auto")
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Upload su Cloudinary fallito", e);
            throw new BadRequestException("Caricamento del file fallito, riprova");
        }
    }

    public String uploadRawFileByExtension(MultipartFile file, String folder, List<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Il file è obbligatorio e non può essere vuoto");
        }
        checkFileSize(file);

        String originalFilename = file.getOriginalFilename();
        String extension = extractExtension(originalFilename);

        boolean allowed = allowedExtensions.stream().anyMatch(ext -> ext.equalsIgnoreCase(extension));
        if (originalFilename == null || extension.isEmpty() || !allowed) {
            throw new BadRequestException("Estensione file non ammessa. Estensioni ammesse: " + allowedExtensions);
        }

        String publicId = UUID.randomUUID() + extension;
        File tempFile = null;

        try {
            tempFile = File.createTempFile("upload-", extension);
            file.transferTo(tempFile);

            Map<?, ?> uploadResult = this.cloudinary.uploader().uploadLarge(
                    tempFile,
                    ObjectUtils.asMap("public_id", publicId, "asset_folder", folder, "resource_type", "raw")
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Upload su Cloudinary fallito", e);
            throw new BadRequestException("Caricamento del file fallito, riprova");
        } finally {
            if (tempFile != null && !tempFile.delete()) {
                log.warn("Impossibile cancellare il file temporaneo {}", tempFile.getAbsolutePath());
            }
        }
    }

    private void checkFileSize(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Il file supera i 100MB consentiti dal piano Cloudinary attuale");
        }
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}