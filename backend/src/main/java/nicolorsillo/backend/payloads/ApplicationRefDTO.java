package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.enums.ApplicationStatus;

import java.util.UUID;

public record ApplicationRefDTO(UUID id, ApplicationStatus status) {
    public static ApplicationRefDTO from(Application application) {
        return new ApplicationRefDTO(application.getId(), application.getStatus());
    }
}
