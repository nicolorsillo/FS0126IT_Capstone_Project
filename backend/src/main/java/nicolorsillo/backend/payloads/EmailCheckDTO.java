package nicolorsillo.backend.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailCheckDTO(
        @NotBlank(message = "L'email è obbligatoria e non può essere una stringa vuota")
        @Email(message = "L'email deve essere nel formato corretto")
        String email
) {
}