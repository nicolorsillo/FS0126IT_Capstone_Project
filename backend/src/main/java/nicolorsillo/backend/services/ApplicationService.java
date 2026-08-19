package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.ApplicationStatus;
import nicolorsillo.backend.enums.JobOfferStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.repositories.ApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class ApplicationService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("status", "appliedAt");

    private final ApplicationRepository applicationRepository;
    private final UsersService usersService;
    private final JobOfferService jobOfferService;
    private final CloudinaryService cloudinaryService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UsersService usersService,
                              JobOfferService jobOfferService,
                              CloudinaryService cloudinaryService) {
        this.applicationRepository = applicationRepository;
        this.usersService = usersService;
        this.jobOfferService = jobOfferService;
        this.cloudinaryService = cloudinaryService;
    }

    public Application save(UUID jobOfferId, MultipartFile cv, UUID userId) {
        User user = this.usersService.findById(userId);
        JobOffer jobOffer = this.jobOfferService.findById(jobOfferId);

        if (jobOffer.getStatus() != JobOfferStatus.OPEN) {
            throw new BadRequestException("Non è possibile candidarsi a un'offerta non aperta");
        }

        if (this.applicationRepository.existsByUserAndJobOffer(user, jobOffer)) {
            throw new BadRequestException("Ti sei già candidato a questa offerta");
        }

        String cvUrl = this.cloudinaryService.uploadFile(cv, "capstone/cv",
                List.of("application/pdf", "image/png", "image/jpeg", "image/webp"));

        Application newApplication = new Application(
                user,
                jobOffer,
                cvUrl,
                ApplicationStatus.SUBMITTED,
                LocalDateTime.now()
        );

        return this.applicationRepository.save(newApplication);
    }

    public Page<Application> getAll(ApplicationStatus status, String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.applicationRepository.search(status, search, pageable);
    }

    public List<Application> findByUser(UUID userId) {
        User user = this.usersService.findById(userId);
        return this.applicationRepository.findByUser(user);
    }

    public List<Application> findByJobOffer(UUID jobOfferId) {
        JobOffer jobOffer = this.jobOfferService.findById(jobOfferId);
        return this.applicationRepository.findByJobOffer(jobOffer);
    }

    public Application findById(UUID applicationId) {
        return this.applicationRepository.findById(applicationId).orElseThrow(() -> new NotFoundException(applicationId));
    }

    public Application findByIdForCaller(UUID applicationId, User currentUser) {
        Application found = this.findById(applicationId);

        boolean isOwner = found.getUser().getId().equals(currentUser.getId());
        boolean isHr = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("HR"));

        if (!isOwner && !isHr) {
            throw new ForbiddenException("Non puoi accedere alla candidatura di un altro utente");
        }
        return found;
    }

    public Application findByIdAndUpdateStatus(UUID applicationId, ApplicationStatus status) {
        Application found = this.findById(applicationId);
        found.setStatus(status);
        return this.applicationRepository.save(found);
    }

    public void findByIdAndDeleteForCaller(UUID applicationId, User currentUser) {
        Application found = this.findByIdForCaller(applicationId, currentUser);
        this.applicationRepository.delete(found);
    }
}