package nicolorsillo.backend.runner;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@Order(1)
public class RoleSeeder implements CommandLineRunner {

    private static final List<String> ROLES_TO_SEED = List.of("CLIENTE", "CANDIDATO", "USER", "HR", "ADMIN", "GEOMETRA");

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        for (String roleName : ROLES_TO_SEED) {
            if (!this.roleRepository.existsByName(roleName)) {
                this.roleRepository.save(new Role(roleName));
                log.info("Ruolo '{}' creato", roleName);
            }
        }
    }
}