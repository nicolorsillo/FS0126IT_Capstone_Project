package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.enums.JobOfferStatus;

import java.time.LocalDate;
import java.util.UUID;

public record JobOfferReadDTO(
        UUID id,
        String title,
        String description,
        Long minSalary,
        Long maxSalary,
        String position,
        JobOfferStatus status,
        LocalDate createdAt,
        LocalDate expiresAt,
        UserRefDTO creator
) {
    public static JobOfferReadDTO from(JobOffer jobOffer) {
        return new JobOfferReadDTO(
                jobOffer.getId(),
                jobOffer.getTitle(),
                jobOffer.getDescription(),
                jobOffer.getMinSalary(),
                jobOffer.getMaxSalary(),
                jobOffer.getPosition(),
                jobOffer.getStatus(),
                jobOffer.getCreatedAt(),
                jobOffer.getExpiresAt(),
                UserRefDTO.from(jobOffer.getCreator())
        );
    }
}
