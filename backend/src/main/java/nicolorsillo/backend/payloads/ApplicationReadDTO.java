package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.enums.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ApplicationReadDTO(
        UUID id,
        String cvUrl,
        ApplicationStatus status,
        LocalDateTime appliedAt,
        UserRefDTO user,
        JobOfferRefDTO jobOffer
) {
    public static ApplicationReadDTO from(Application application) {
        return new ApplicationReadDTO(
                application.getId(),
                application.getCvUrl(),
                application.getStatus(),
                application.getAppliedAt(),
                UserRefDTO.from(application.getUser()),
                JobOfferRefDTO.from(application.getJobOffer())
        );
    }
}
