package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Permission;
import nicolorsillo.backend.repositories.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> getAll() {
        return this.permissionRepository.findAll();
    }
}