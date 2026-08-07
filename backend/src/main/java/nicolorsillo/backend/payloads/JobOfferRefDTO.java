package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.enums.JobOfferStatus;

import java.util.UUID;

public record JobOfferRefDTO(UUID id, String title, JobOfferStatus status) {
    public static JobOfferRefDTO from(JobOffer jobOffer) {
        return new JobOfferRefDTO(jobOffer.getId(), jobOffer.getTitle(), jobOffer.getStatus());
    }
}
