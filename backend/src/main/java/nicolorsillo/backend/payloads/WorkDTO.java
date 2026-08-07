package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import nicolorsillo.backend.enums.WorkType;

public record WorkDTO(
        @NotNull(message = "Il tipo di lavoro è obbligatorio")
        WorkType type,

        @NotBlank(message = "La descrizione è obbligatoria e non può essere una stringa vuota")
        String description
) {
}