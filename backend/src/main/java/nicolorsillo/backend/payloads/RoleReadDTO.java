package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Permission;
import nicolorsillo.backend.entities.Role;

import java.util.List;
import java.util.UUID;

public record RoleReadDTO(UUID id, String name, List<String> permissions) {
    public static RoleReadDTO from(Role role) {
        return new RoleReadDTO(
                role.getId(),
                role.getName(),
                role.getPermissions().stream().map(Permission::getName).toList()
        );
    }
}
