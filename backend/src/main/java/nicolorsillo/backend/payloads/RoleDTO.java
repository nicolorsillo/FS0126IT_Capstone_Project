package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RoleDTO(
        @NotBlank(message = "Il nome del ruolo è obbligatorio e non può essere una stringa vuota")
        String name,

        @NotNull(message = "La lista dei permessi è obbligatoria (può essere vuota)")
        List<String> permissions
) {
}