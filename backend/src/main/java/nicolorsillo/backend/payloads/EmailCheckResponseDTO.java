package nicolorsillo.backend.payloads;

import nicolorsillo.backend.enums.EmailCheckStatus;

public record EmailCheckResponseDTO(EmailCheckStatus status) {
}