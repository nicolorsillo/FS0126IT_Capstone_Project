package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Project;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.ProjectStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.ProjectDTO;
import nicolorsillo.backend.repositories.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class ProjectService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "status");

    private final ProjectRepository projectRepository;
    private final UsersService usersService;
    private final WorkService workService;
    private final CloudinaryService cloudinaryService;

    public ProjectService(ProjectRepository projectRepository,
                          UsersService usersService,
                          WorkService workService,
                          CloudinaryService cloudinaryService) {
        this.projectRepository = projectRepository;
        this.usersService = usersService;
        this.workService = workService;
        this.cloudinaryService = cloudinaryService;
    }

    public Project save(ProjectDTO payload, MultipartFile projectFile) {
        User surveyor = this.usersService.findById(payload.surveyorId());
        Work work = this.workService.findById(payload.workId());

        String projectUrl = this.cloudinaryService.uploadProjectFile(projectFile, "capstone/projects");

        Project newProject = new Project(surveyor, projectUrl, ProjectStatus.IN_PROGRESS, work);
        return this.projectRepository.save(newProject);
    }

    public Page<Project> getAll(ProjectStatus status, String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.projectRepository.search(status, search, pageable);
    }

    public List<Project> findByWork(UUID workId) {
        Work work = this.workService.findById(workId);
        return this.projectRepository.findByWork(work);
    }

    public List<Project> findBySurveyor(UUID surveyorId) {
        User surveyor = this.usersService.findById(surveyorId);
        return this.projectRepository.findBySurveyor(surveyor);
    }

    public Project findById(UUID projectId) {
        return this.projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException(projectId));
    }

    public List<Project> findByWorkForCaller(UUID workId, User currentUser) {
        Work work = this.workService.findByIdForCaller(workId, currentUser);
        return this.projectRepository.findByWork(work);
    }

    public Project findByIdForCaller(UUID projectId, User currentUser) {
        Project found = this.findById(projectId);

        boolean isOwner = found.getWork().getClient().getId().equals(currentUser.getId());
        boolean canManageAnyProject = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyProject) {
            throw new ForbiddenException("Non puoi accedere all'elaborato di un altro cliente");
        }
        return found;
    }

    public Project findByIdAndUpdateStatus(UUID projectId, ProjectStatus status) {
        Project found = this.findById(projectId);
        found.setStatus(status);
        return this.projectRepository.save(found);
    }

    public Project findByIdAndUpdateStatusForCaller(UUID projectId, ProjectStatus status, String reason, User currentUser) {
        Project found = this.findById(projectId);

        boolean isOwner = found.getWork().getClient().getId().equals(currentUser.getId());
        boolean canManageAnyProject = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyProject) {
            throw new ForbiddenException("Non puoi accedere all'elaborato di un altro cliente");
        }

        if (status == ProjectStatus.REJECTED) {
            if (reason == null || reason.isBlank()) {
                throw new BadRequestException("La motivazione del rifiuto è obbligatoria");
            }
            found.setRejectionReason(reason);
        }

        found.setStatus(status);
        return this.projectRepository.save(found);
    }

    public void findByIdAndDelete(UUID projectId) {
        Project found = this.findById(projectId);
        this.projectRepository.delete(found);
    }

    private boolean hasStaffRole(User user) {
        return user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("GEOMETRA"));
    }
}