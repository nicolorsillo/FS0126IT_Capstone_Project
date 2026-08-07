package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record InterviewDTO(
        @NotNull(message = "L'id della candidatura è obbligatorio")
        UUID applicationId,

        @NotNull(message = "L'id dello slot colloquio è obbligatorio")
        UUID interviewSlotId
) {
}
