package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.User;

import java.util.UUID;

public record UserRefDTO(UUID id, String name, String surname, String email) {
    public static UserRefDTO from(User user) {
        return new UserRefDTO(user.getId(), user.getName(), user.getSurname(), user.getEmail());
    }
}
