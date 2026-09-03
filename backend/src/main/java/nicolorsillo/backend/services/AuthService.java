package nicolorsillo.backend.services;

import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.exceptions.UnauthorizedException;
import nicolorsillo.backend.payloads.LoginDTO;
import nicolorsillo.backend.security.JWTTools;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsersService usersService;
    private final JWTTools jwtTools;
    private final PasswordEncoder bcrypt;

    public AuthService(UsersService usersService, JWTTools jwtTools, PasswordEncoder bcrypt) {
        this.usersService = usersService;
        this.jwtTools = jwtTools;
        this.bcrypt = bcrypt;
    }

    public String checkCredentialsAndGenerateToken(LoginDTO body) {

        User found;
        try {
            found = this.usersService.findByEmail(body.email());
        } catch (NotFoundException ex) {
            throw new UnauthorizedException("Credenziali errate");
        }

        if (this.bcrypt.matches(body.password(), found.getPassword())) {

            return this.jwtTools.generateToken(found);

        } else {

            throw new UnauthorizedException("Credenziali errate");

        }
    }
}