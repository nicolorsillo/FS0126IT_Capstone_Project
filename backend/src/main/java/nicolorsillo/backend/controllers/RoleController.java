package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.payloads.RoleDTO;
import nicolorsillo.backend.payloads.RoleReadDTO;
import nicolorsillo.backend.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    public RoleReadDTO create(@RequestBody @Valid RoleDTO payload) {
        return RoleReadDTO.from(this.roleService.save(payload));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_ROLE')")
    public List<RoleReadDTO> getAll() {
        return this.roleService.getAll().stream().map(RoleReadDTO::from).toList();
    }

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('SEARCH_ROLE_BY_ID')")
    public RoleReadDTO getById(@PathVariable UUID roleId) {
        return RoleReadDTO.from(this.roleService.findById(roleId));
    }

    @PutMapping("/{roleId}")
    @PreAuthorize("hasAuthority('MODIFY_ROLE')")
    public RoleReadDTO update(@PathVariable UUID roleId, @RequestBody @Valid RoleDTO payload) {
        return RoleReadDTO.from(this.roleService.findByIdAndUpdate(roleId, payload));
    }

    @DeleteMapping("/{roleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_ROLE_BY_ID')")
    public void delete(@PathVariable UUID roleId) {
        this.roleService.findByIdAndDelete(roleId);
    }
}