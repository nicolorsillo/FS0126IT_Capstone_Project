package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginDTO(
        @NotBlank(message = "L'email è obbligatoria, non può neanche essere una stringa vuota")
        @Email(message = "L'email deve essere nel formato corretto")
        String email,

        @NotBlank(message = "La password è obbligatoria, non può neanche essere una stringa vuota")
        @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
        @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", message = "La password deve contenere almeno 1 maiuscola, 1 minuscola e 1 numero")
        String password
) {
}