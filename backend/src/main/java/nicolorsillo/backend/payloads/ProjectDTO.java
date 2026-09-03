package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectDTO(
        @NotNull(message = "L'id del geometra è obbligatorio")
        UUID surveyorId,

        @NotNull(message = "L'id del lavoro è obbligatorio")
        UUID workId
) {
}