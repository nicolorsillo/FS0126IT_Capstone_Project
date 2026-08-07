package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordChangeDTO(
        @NotBlank(message = "La password è obbligatoria, non può neanche essere una stringa vuota")
        @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "La password deve contenere almeno 1 maiuscola, 1 minuscola e 1 numero")
        String oldPassword,
        @NotBlank(message = "La password è obbligatoria, non può neanche essere una stringa vuota")
        @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "La password deve contenere almeno 1 maiuscola, 1 minuscola e 1 numero")
        String password) {
}