package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.*;

public record UserDTO(
        @NotBlank(message = "Il nome proprio è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 40, message = "Il nome proprio deve avere un numero di caratteri compreso tra 2 e 40")
        String name,
        @NotBlank(message = "Il cognome è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 40, message = "Il cognome deve avere un numero di caratteri compreso tra 2 e 40")
        String surname,
        @NotBlank(message = "L'email è obbligatoria e non può essere una stringa vuota")
        @Email(message = "L'email deve essere nel formato corretto")
        String email,
        @NotBlank(message = "La password è obbligatoria, non può neanche essere una stringa vuota")
        @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "La password deve contenere almeno 1 maiuscola, 1 minuscola e 1 numero")
        String password,
        @NotNull(message = "Il tipo non può essere nullo")
        @Pattern(regexp = "^(CLIENTE|CANDIDATO|USER)$", message = "Il valore deve essere esattamente 'CLIENTE' o 'CANDIDATO' o 'USER'")
        String role
) {
}