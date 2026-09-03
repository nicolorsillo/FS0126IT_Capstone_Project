package nicolorsillo.backend.controllers;

import nicolorsillo.backend.payloads.PermissionReadDTO;
import nicolorsillo.backend.services.PermissionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_PERMISSION')")
    public List<PermissionReadDTO> getAll() {
        return this.permissionService.getAll().stream().map(PermissionReadDTO::from).toList();
    }
}