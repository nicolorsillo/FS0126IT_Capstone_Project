package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Permission;
import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.RoleDTO;
import nicolorsillo.backend.repositories.PermissionRepository;
import nicolorsillo.backend.repositories.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Transactional
    public Role save(RoleDTO payload) {
        if (this.roleRepository.existsByName(payload.name())) {
            throw new BadRequestException("Il ruolo " + payload.name() + " esiste già!");
        }

        Role newRole = new Role(payload.name());
        newRole.setPermissions(resolvePermissions(payload.permissions()));

        return this.roleRepository.save(newRole);
    }

    public List<Role> getAll() {
        return this.roleRepository.findAll();
    }

    public Role findById(UUID roleId) {
        return this.roleRepository.findById(roleId).orElseThrow(() -> new NotFoundException(roleId));
    }

    @Transactional
    public Role findByIdAndUpdate(UUID roleId, RoleDTO payload) {
        Role found = this.findById(roleId);

        if (!found.getName().equals(payload.name()) && this.roleRepository.existsByName(payload.name())) {
            throw new BadRequestException("Il ruolo " + payload.name() + " esiste già!");
        }

        found.setName(payload.name());
        found.setPermissions(resolvePermissions(payload.permissions()));

        return this.roleRepository.save(found);
    }

    @Transactional
    public void findByIdAndDelete(UUID roleId) {
        Role found = this.findById(roleId);
        this.roleRepository.delete(found);
    }

    private List<Permission> resolvePermissions(List<String> permissionNames) {
        return permissionNames.stream()
                .map(name -> this.permissionRepository.findByName(name)
                        .orElseThrow(() -> new NotFoundException("Permesso '" + name + "' non trovato")))
                .collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));
    }
}