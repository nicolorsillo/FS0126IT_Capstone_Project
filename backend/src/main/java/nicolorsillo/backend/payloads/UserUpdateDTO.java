package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        @NotBlank(message = "Il nome proprio è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 40, message = "Il nome proprio deve avere un numero di caratteri compreso tra 2 e 40")
        String name,
        @NotBlank(message = "Il cognome è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 40, message = "Il cognome deve avere un numero di caratteri compreso tra 2 e 40")
        String surname,
        @NotBlank(message = "L'email è obbligatoria e non può essere una stringa vuota")
        @Email(message = "L'email deve essere nel formato corretto")
        String email
) {
}