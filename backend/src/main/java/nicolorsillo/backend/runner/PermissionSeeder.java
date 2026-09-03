package nicolorsillo.backend.runner;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Permission;
import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.repositories.PermissionRepository;
import nicolorsillo.backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Component
@Slf4j
@Order(2)
public class PermissionSeeder implements CommandLineRunner {

    private static final List<String> SELF_SERVICE_PERMISSIONS = List.of(
            "MY_PROFILE", "MODIFY_MY_PROFILE", "DELETE_MY_PROFILE", "MODIFY_MY_PASSWORD"
    );

    private static final List<String> CANDIDATO_PERMISSIONS = concat(SELF_SERVICE_PERMISSIONS, List.of(
            "CREATE_APPLICATION", "MY_APPLICATIONS", "SEARCH_APPLICATION_BY_ID", "DELETE_APPLICATION_BY_ID",
            "AVAILABLE_INTERVIEW_SLOTS", "SEARCH_INTERVIEW_SLOT_BY_ID",
            "CREATE_INTERVIEW", "SEARCH_INTERVIEW_BY_ID", "DELETE_INTERVIEW_BY_ID"
    ));

    private static final List<String> CLIENTE_PERMISSIONS = concat(SELF_SERVICE_PERMISSIONS, List.of(
            "CREATE_WORK", "CLIENT_WORKS", "SEARCH_WORK_BY_ID",
            "WORK_QUOTES", "SEARCH_QUOTE_BY_ID", "MODIFY_QUOTE_STATUS",
            "WORK_PROJECTS", "SEARCH_PROJECT_BY_ID", "MODIFY_PROJECT_STATUS",
            "WORK_INVOICES", "SEARCH_INVOICE_BY_ID"
    ));

    private static final List<String> HR_PERMISSIONS = concat(SELF_SERVICE_PERMISSIONS, List.of(
            "CREATE_JOBOFFER", "GET_ALL_JOBOFFERS", "MODIFY_JOBOFFER", "MODIFY_JOBOFFER_STATUS", "DELETE_JOBOFFER_BY_ID",
            "GET_ALL_APPLICATIONS", "JOBOFFER_APPLICATIONS", "SEARCH_APPLICATION_BY_ID", "MODIFY_APPLICATION_STATUS", "DELETE_APPLICATION_BY_ID",
            "CREATE_INTERVIEW_SLOT", "MY_INTERVIEW_SLOTS", "SEARCH_INTERVIEW_SLOT_BY_ID", "DELETE_INTERVIEW_SLOT_BY_ID",
            "SEARCH_INTERVIEW_BY_ID", "MODIFY_INTERVIEW_STATUS", "DELETE_INTERVIEW_BY_ID"
    ));

    private static final List<String> GEOMETRA_PERMISSIONS = concat(SELF_SERVICE_PERMISSIONS, List.of(
            "GET_ALL_WORKS", "CLIENT_WORKS", "SEARCH_WORK_BY_ID", "MODIFY_WORK_STATUS", "DELETE_WORK_BY_ID",
            "CREATE_QUOTE", "GET_ALL_QUOTES", "WORK_QUOTES", "SEARCH_QUOTE_BY_ID", "MODIFY_QUOTE_STATUS", "DELETE_QUOTE_BY_ID",
            "CREATE_INVOICE", "GET_ALL_INVOICES", "WORK_INVOICES", "SEARCH_INVOICE_BY_ID", "MODIFY_INVOICE_STATUS", "DELETE_INVOICE_BY_ID",
            "CREATE_PROJECT", "GET_ALL_PROJECTS", "WORK_PROJECTS", "SURVEYOR_PROJECTS", "SEARCH_PROJECT_BY_ID", "MODIFY_PROJECT_STATUS", "DELETE_PROJECT_BY_ID"
    ));
    private static final List<String> ADMIN_ONLY_PERMISSIONS = List.of(
            "GET_ALL_PERMISSION",
            "CREATE_ROLE", "GET_ALL_ROLE", "SEARCH_ROLE_BY_ID", "MODIFY_ROLE", "DELETE_ROLE_BY_ID",
            "GET_ALL_USERS", "SEARCH_USER_BY_ID", "MODIFY_USER_ROLE", "REMOVE_USER_ROLE", "RUN_INTERVIEW_SLOT_JOB"
    );

    private static final List<String> ADMIN_PERMISSIONS = Stream.of(
                    ADMIN_ONLY_PERMISSIONS,
                    CANDIDATO_PERMISSIONS,
                    CLIENTE_PERMISSIONS,
                    HR_PERMISSIONS,
                    GEOMETRA_PERMISSIONS
            )
            .flatMap(List::stream)
            .distinct()
            .toList();
    private static final Map<String, List<String>> PERMISSIONS_BY_ROLE = Map.of(
            "CANDIDATO", CANDIDATO_PERMISSIONS,
            "CLIENTE", CLIENTE_PERMISSIONS,
            "USER", SELF_SERVICE_PERMISSIONS,
            "HR", HR_PERMISSIONS,
            "ADMIN", ADMIN_PERMISSIONS,
            "GEOMETRA", GEOMETRA_PERMISSIONS
    );
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public PermissionSeeder(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    private static List<String> concat(List<String> a, List<String> b) {
        return java.util.stream.Stream.concat(a.stream(), b.stream()).toList();
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (Map.Entry<String, List<String>> entry : PERMISSIONS_BY_ROLE.entrySet()) {
            String roleName = entry.getKey();
            List<String> permissionNames = entry.getValue();

            Role role = this.roleRepository.findByName(roleName).orElse(null);
            if (role == null) {
                log.warn("Ruolo '{}' non trovato: permessi non assegnati. RoleSeeder deve girare prima di PermissionSeeder", roleName);
                continue;
            }

            for (String permissionName : permissionNames) {
                Permission permission = this.permissionRepository.findByName(permissionName)
                        .orElseGet(() -> {
                            Permission created = this.permissionRepository.save(new Permission(permissionName));
                            log.info("Permission '{}' creata", permissionName);
                            return created;
                        });

                boolean alreadyAssigned = role.getPermissions().stream()
                        .anyMatch(p -> p.getId().equals(permission.getId()));

                if (!alreadyAssigned) {
                    role.getPermissions().add(permission);
                }
            }

            this.roleRepository.save(role);
        }
    }
}
