package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.EmailCheckStatus;
import nicolorsillo.backend.payloads.*;
import nicolorsillo.backend.services.AuthService;
import nicolorsillo.backend.services.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthService authService;
    private final UsersService usersService;

    public AuthController(AuthService authService, UsersService usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Validated LoginDTO payload) {
        String token = this.authService.checkCredentialsAndGenerateToken(payload);
        return new LoginResponseDTO(token);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO register(@RequestBody @Valid UserDTO payload) {
        User saved = this.usersService.save(payload);
        return new UserResponseDTO(saved.getId());
    }

    @PostMapping("/check-email")
    public EmailCheckResponseDTO checkEmail(
            @RequestBody @Validated EmailCheckDTO payload,
            @RequestParam @Pattern(regexp = "^(CLIENTE|CANDIDATO|USER)$", message = "Il ruolo deve essere CLIENTE, CANDIDATO o USER") String role
    ) {
        EmailCheckStatus status = this.usersService.checkEmail(payload, role);
        return new EmailCheckResponseDTO(status);
    }
}