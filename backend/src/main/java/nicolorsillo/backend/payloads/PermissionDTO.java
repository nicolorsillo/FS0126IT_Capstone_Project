package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotBlank;

public record PermissionDTO(
        @NotBlank(message = "Il nome dell'autorizzazione è obbligatorio e non può essere una stringa vuota")
        String name
) {
}
