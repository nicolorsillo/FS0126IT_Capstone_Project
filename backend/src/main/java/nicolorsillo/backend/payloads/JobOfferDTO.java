package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record JobOfferDTO(
        @NotBlank(message = "Il titolo è obbligatorio e non può essere una stringa vuota")
        String title,

        @NotBlank(message = "La descrizione è obbligatoria e non può essere una stringa vuota")
        String description,

        @NotNull(message = "La retribuzione minima è obbligatoria")
        @Positive(message = "La retribuzione minima deve essere un numero positivo")
        Long minSalary,

        @NotNull(message = "La retribuzione massima è obbligatoria")
        @Positive(message = "La retribuzione massima deve essere un numero positivo")
        Long maxSalary,

        @NotBlank(message = "La posizione è obbligatoria e non può essere una stringa vuota")
        String position,

        @NotNull(message = "La data di scadenza è obbligatoria")
        @Future(message = "La data di scadenza deve essere nel futuro")
        LocalDate expiresAt
) {
}
