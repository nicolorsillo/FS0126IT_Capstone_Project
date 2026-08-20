package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.WorkStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.WorkDTO;
import nicolorsillo.backend.repositories.WorkRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class WorkService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "type", "status", "description");

    private final WorkRepository workRepository;
    private final UsersService usersService;

    public WorkService(WorkRepository workRepository, UsersService usersService) {
        this.workRepository = workRepository;
        this.usersService = usersService;
    }

    public Work save(WorkDTO payload, UUID clientId) {
        User client = this.usersService.findById(clientId);

        Work newWork = new Work(payload.type(), client, payload.description(), WorkStatus.OPEN);
        return this.workRepository.save(newWork);
    }

    public Page<Work> getAll(WorkStatus status, String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.workRepository.search(status, search, pageable);
    }

    public List<Work> findByClientForCaller(UUID clientId, User currentUser) {
        boolean isSelf = clientId.equals(currentUser.getId());
        boolean canManageAnyWork = hasStaffRole(currentUser);

        if (!isSelf && !canManageAnyWork) {
            throw new ForbiddenException("Non puoi vedere i lavori di un altro cliente");
        }

        User client = this.usersService.findById(clientId);
        return this.workRepository.findByClient(client);
    }

    public Work findById(UUID workId) {
        return this.workRepository.findById(workId).orElseThrow(() -> new NotFoundException(workId));
    }

    public Work findByIdForCaller(UUID workId, User currentUser) {
        Work found = this.findById(workId);

        boolean isOwner = found.getClient().getId().equals(currentUser.getId());
        boolean canManageAnyWork = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyWork) {
            throw new ForbiddenException("Non puoi accedere al lavoro di un altro cliente");
        }
        return found;
    }

    public Work findByIdAndUpdateStatus(UUID workId, WorkStatus status) {
        Work found = this.findById(workId);
        found.setStatus(status);
        return this.workRepository.save(found);
    }

    public void findByIdAndDelete(UUID workId) {
        Work found = this.findById(workId);
        this.workRepository.delete(found);
    }

    private boolean hasStaffRole(User user) {
        return user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("GEOMETRA"));
    }
}