package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.entities.User;

import java.util.List;
import java.util.UUID;

public record UserReadDTO(UUID id, String name, String surname, String email, List<String> roles) {
    public static UserReadDTO from(User user) {
        return new UserReadDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getName).toList()
        );
    }
}
