package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteDTO(
        @NotNull(message = "La data è obbligatoria")
        LocalDateTime date,

        @NotNull(message = "L'importo è obbligatorio")
        @Positive(message = "L'importo deve essere un numero positivo")
        Long amount,

        @NotNull(message = "L'id del lavoro è obbligatorio")
        UUID workId
) {
}
