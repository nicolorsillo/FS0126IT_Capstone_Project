package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.payloads.PasswordChangeDTO;
import nicolorsillo.backend.payloads.RoleAssignmentDTO;
import nicolorsillo.backend.payloads.UserReadDTO;
import nicolorsillo.backend.payloads.UserUpdateDTO;
import nicolorsillo.backend.services.UsersService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('MY_PROFILE')")
    public UserReadDTO getProfile(@AuthenticationPrincipal User currentUser) {
        return UserReadDTO.from(currentUser);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('MODIFY_MY_PROFILE')")
    public UserReadDTO updateProfile(@AuthenticationPrincipal User currentUser, @RequestBody @Valid UserUpdateDTO payload) {
        return UserReadDTO.from(this.usersService.findByIdAndUpdate(currentUser.getId(), payload));
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_MY_PROFILE')")
    public void deleteProfile(@AuthenticationPrincipal User currentUser) {
        this.usersService.findByIdAndDelete(currentUser.getId());
    }

    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('MODIFY_MY_PASSWORD')")
    public void changePassword(@AuthenticationPrincipal User currentUser, @RequestBody @Valid PasswordChangeDTO payload) {
        this.usersService.updatePassword(currentUser.getId(), payload);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_USERS')")
    public Page<UserReadDTO> getAll(@RequestParam(required = false) String search,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(defaultValue = "name") String orderBy) {
        return this.usersService.getAll(search, page, size, orderBy).map(UserReadDTO::from);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('SEARCH_USER_BY_ID')")
    public UserReadDTO getById(@PathVariable UUID userId) {
        return UserReadDTO.from(this.usersService.findById(userId));
    }

    @PatchMapping("/role")
    @PreAuthorize("hasAuthority('MODIFY_USER_ROLE')")
    public UserReadDTO updateRole(@RequestBody @Valid RoleAssignmentDTO payload) {
        return UserReadDTO.from(this.usersService.findByEmailAndUpdateRole(payload));
    }

    @DeleteMapping("/role")
    @PreAuthorize("hasAuthority('REMOVE_USER_ROLE')")
    public UserReadDTO removeRole(@RequestBody @Valid RoleAssignmentDTO payload) {
        return UserReadDTO.from(this.usersService.findByEmailAndRemoveRole(payload));
    }
}