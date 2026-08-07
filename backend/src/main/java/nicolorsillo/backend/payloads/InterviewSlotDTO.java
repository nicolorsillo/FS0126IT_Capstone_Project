package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record InterviewSlotDTO(
        @NotNull(message = "La data dello slot è obbligatoria")
        @FutureOrPresent(message = "La data dello slot non può essere nel passato")
        LocalDateTime slotDate
) {
}
