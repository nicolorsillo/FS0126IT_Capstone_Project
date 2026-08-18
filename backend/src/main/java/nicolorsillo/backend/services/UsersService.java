package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Role;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.EmailCheckStatus;
import nicolorsillo.backend.events.HrRoleAssignedEvent;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.*;
import nicolorsillo.backend.repositories.RoleRepository;
import nicolorsillo.backend.repositories.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class UsersService {

    private static final String HR_ROLE_NAME = "HR";
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("name", "surname", "email");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder bcrypt;
    private final ApplicationEventPublisher eventPublisher;

    public UsersService(UserRepository userRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder bcrypt,
                        ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bcrypt = bcrypt;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public User save(UserDTO payload) {
        Role role = roleRepository.findByName(payload.role())
                .orElseThrow(() -> new NotFoundException("Ruolo " + payload.role() + " non trovato"));

        Optional<User> existing = this.userRepository.findByEmail(payload.email());

        if (existing.isPresent()) {
            User found = existing.get();

            if (!this.bcrypt.matches(payload.password(), found.getPassword())) {
                throw new BadRequestException("L'indirizzo email " + payload.email() + " è già utilizzato con una password diversa!");
            }

            boolean alreadyHasRole = found.getRoles().stream().anyMatch(r -> r.getId().equals(role.getId()));
            if (alreadyHasRole) {
                throw new BadRequestException("Sei già registrato con il ruolo " + payload.role());
            }

            found.getRoles().add(role);
            return this.userRepository.save(found);
        }

        User newUser = new User(payload.email(), this.bcrypt.encode(payload.password()), payload.name(), payload.surname());
        newUser.getRoles().add(role);

        return this.userRepository.save(newUser);
    }

    @Transactional
    public EmailCheckStatus checkEmail(EmailCheckDTO payload, String roleName) {
        Optional<User> existing = this.userRepository.findByEmail(payload.email());
        if (existing.isEmpty()) {
            return EmailCheckStatus.NEW_EMAIL;
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new NotFoundException("Ruolo " + roleName + " non trovato"));

        boolean hasRole = existing.get().getRoles().stream().anyMatch(r -> r.getId().equals(role.getId()));
        return hasRole ? EmailCheckStatus.ROLE_MATCH : EmailCheckStatus.ROLE_MISMATCH;
    }

    public Page<User> getAll(String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.userRepository.search(search, pageable);
    }

    public User findById(UUID userId) {
        return this.userRepository.findById(userId).orElseThrow(() -> new NotFoundException(userId));
    }

    @Transactional(readOnly = true)
    public User findByIdWithAuthorities(UUID userId) {
        User user = this.userRepository.findByIdWithRoles(userId).orElseThrow(() -> new NotFoundException(userId));
        user.getRoles().forEach(role -> role.getPermissions().size());
        return user;
    }

    public User findByIdAndUpdate(UUID userId, UserUpdateDTO payload) {

        User found = this.findById(userId);

        if (!found.getEmail().equals(payload.email()))
            if (this.userRepository.existsByEmail(payload.email()))
                throw new BadRequestException("L'indirizzo email " + payload.email() + " è già utilizzato!");

        found.setName(payload.name());
        found.setSurname(payload.surname());
        found.setEmail(payload.email());

        return this.userRepository.save(found);
    }

    public void findByIdAndDelete(UUID userId) {
        User found = this.findById(userId);
        this.userRepository.delete(found);
    }

    @Transactional
    public void updatePassword(UUID userId, PasswordChangeDTO payload) {
        User found = this.findById(userId);


        if (!this.bcrypt.matches(payload.oldPassword(), found.getPassword()))
            throw new BadRequestException("Le password non corrispondono!");

        found.setPassword(this.bcrypt.encode(payload.password()));

        this.userRepository.save(found);
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("L'utente con email " + email + " non è stato trovato!"));
    }

    @Transactional
    public User findByEmailAndUpdateRole(RoleAssignmentDTO payload) {
        User user = this.findByEmail(payload.email());

        Role role = roleRepository.findByName(payload.role())
                .orElseThrow(() -> new NotFoundException("Ruolo " + payload.role() + " non trovato"));

        boolean alreadyHasRole = user.getRoles().stream().anyMatch(r -> r.getId().equals(role.getId()));
        if (!alreadyHasRole) {
            user.getRoles().add(role);
        }

        User saved = this.userRepository.save(user);

        if (!alreadyHasRole && HR_ROLE_NAME.equals(role.getName())) {
            this.eventPublisher.publishEvent(new HrRoleAssignedEvent(saved.getId()));
        }

        return saved;
    }

    @Transactional
    public User findByEmailAndRemoveRole(RoleAssignmentDTO payload) {
        User user = this.findByEmail(payload.email());

        Role role = roleRepository.findByName(payload.role())
                .orElseThrow(() -> new NotFoundException("Ruolo " + payload.role() + " non trovato"));

        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getId().equals(role.getId()));
        if (!hasRole) {
            throw new BadRequestException("L'utente non ha il ruolo " + payload.role());
        }

        if (user.getRoles().size() == 1) {
            throw new BadRequestException("Non puoi rimuovere l'unico ruolo rimasto a un utente");
        }

        user.getRoles().removeIf(r -> r.getId().equals(role.getId()));
        return this.userRepository.save(user);
    }
}