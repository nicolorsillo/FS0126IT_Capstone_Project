package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.JobOfferStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.JobOfferDTO;
import nicolorsillo.backend.repositories.JobOfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class JobOfferService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "title", "minSalary", "maxSalary", "position", "createdAt", "expiresAt", "status"
    );

    private final JobOfferRepository jobOfferRepository;
    private final UsersService usersService;

    public JobOfferService(JobOfferRepository jobOfferRepository, UsersService usersService) {
        this.jobOfferRepository = jobOfferRepository;
        this.usersService = usersService;
    }

    public JobOffer save(JobOfferDTO payload, UUID creatorId) {
        if (payload.minSalary() >= payload.maxSalary()) {
            throw new BadRequestException("La retribuzione minima deve essere inferiore alla retribuzione massima");
        }

        User creator = this.usersService.findById(creatorId);

        JobOffer newJobOffer = new JobOffer(
                payload.title(),
                payload.description(),
                payload.minSalary(),
                payload.maxSalary(),
                creator,
                JobOfferStatus.DRAFT,
                payload.position(),
                LocalDate.now(),
                payload.expiresAt()
        );

        return this.jobOfferRepository.save(newJobOffer);
    }

    public Page<JobOffer> getAll(JobOfferStatus status, String search, int page, int size, String orderBy, User currentUser) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        if (!this.canBrowseAllStatuses(currentUser)) {
            status = JobOfferStatus.OPEN;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.jobOfferRepository.search(status, search, pageable);
    }

    public JobOffer findById(UUID jobOfferId) {
        return this.jobOfferRepository.findById(jobOfferId).orElseThrow(() -> new NotFoundException(jobOfferId));
    }

    public JobOffer findByIdForPublic(UUID jobOfferId, User currentUser) {
        JobOffer found = this.findById(jobOfferId);
        if (found.getStatus() != JobOfferStatus.OPEN && !this.canBrowseAllStatuses(currentUser)) {
            throw new NotFoundException(jobOfferId);
        }
        return found;
    }

    private boolean canBrowseAllStatuses(User currentUser) {
        if (currentUser == null) return false;
        return currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("GET_ALL_JOBOFFERS"));
    }

    public JobOffer findByIdAndUpdate(UUID jobOfferId, JobOfferDTO payload) {
        JobOffer found = this.findById(jobOfferId);

        if (payload.minSalary() >= payload.maxSalary()) {
            throw new BadRequestException("La retribuzione minima deve essere inferiore alla retribuzione massima");
        }

        found.setTitle(payload.title());
        found.setDescription(payload.description());
        found.setMinSalary(payload.minSalary());
        found.setMaxSalary(payload.maxSalary());
        found.setPosition(payload.position());
        found.setExpiresAt(payload.expiresAt());

        return this.jobOfferRepository.save(found);
    }

    public JobOffer findByIdAndUpdateStatus(UUID jobOfferId, JobOfferStatus status) {
        JobOffer found = this.findById(jobOfferId);
        found.setStatus(status);
        return this.jobOfferRepository.save(found);
    }

    public void findByIdAndDelete(UUID jobOfferId) {
        JobOffer found = this.findById(jobOfferId);
        this.jobOfferRepository.delete(found);
    }
}