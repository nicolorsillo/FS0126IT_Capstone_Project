package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Permission;

import java.util.UUID;

public record PermissionReadDTO(UUID id, String name) {
    public static PermissionReadDTO from(Permission permission) {
        return new PermissionReadDTO(permission.getId(), permission.getName());
    }
}
