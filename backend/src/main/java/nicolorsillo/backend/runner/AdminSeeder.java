package nicolorsillo.backend.runner;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.repositories.RoleRepository;
import nicolorsillo.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@Slf4j
@Order(3)
public class AdminSeeder implements CommandLineRunner {

    private static final String ADMIN_ROLE_NAME = "ADMIN";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder bcrypt;
    private final String adminEmail;
    private final String adminPassword;

    public AdminSeeder(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder bcrypt,
                       @Value("${admin.email}") String adminEmail,
                       @Value("${admin.password}") String adminPassword) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bcrypt = bcrypt;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Role adminRole = this.roleRepository.findByName(ADMIN_ROLE_NAME).orElse(null);
        if (adminRole == null) {
            log.warn("Ruolo '{}' non trovato: impossibile creare l'admin. RoleSeeder deve girare prima di questo runner", ADMIN_ROLE_NAME);
            return;
        }

        Optional<User> existing = this.userRepository.findByEmail(this.adminEmail);

        if (existing.isPresent()) {
            User user = existing.get();
            boolean alreadyAdmin = user.getRoles().stream().anyMatch(r -> r.getId().equals(adminRole.getId()));
            if (!alreadyAdmin) {
                user.getRoles().add(adminRole);
                this.userRepository.save(user);
                log.info("Ruolo ADMIN aggiunto all'utente già esistente '{}'", this.adminEmail);
            }
            return;
        }

        User admin = new User(this.adminEmail, this.bcrypt.encode(this.adminPassword), "Giuseppe", "Orsillo");
        admin.getRoles().add(adminRole);
        this.userRepository.save(admin);

        log.info("Utente ADMIN creato: {}", this.adminEmail);
    }
}