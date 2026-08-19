package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.entities.Interview;
import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InterviewSlotStatus;
import nicolorsillo.backend.enums.InterviewStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.InterviewDTO;
import nicolorsillo.backend.repositories.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationService applicationService;
    private final InterviewSlotService interviewSlotService;

    public InterviewService(InterviewRepository interviewRepository,
                            ApplicationService applicationService,
                            InterviewSlotService interviewSlotService) {
        this.interviewRepository = interviewRepository;
        this.applicationService = applicationService;
        this.interviewSlotService = interviewSlotService;
    }

    @Transactional
    public Interview save(InterviewDTO payload, User currentUser) {
        Application application = this.applicationService.findById(payload.applicationId());
        InterviewSlot interviewSlot = this.interviewSlotService.findById(payload.interviewSlotId());

        if (!application.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Non puoi prenotare un colloquio per la candidatura di un altro utente");
        }

        if (interviewSlot.getStatus() != InterviewSlotStatus.AVAILABLE) {
            throw new BadRequestException("Lo slot selezionato non è disponibile");
        }

        if (interviewSlot.getSlotDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Lo slot selezionato è nel passato");
        }

        if (this.interviewRepository.existsByApplication(application)) {
            throw new BadRequestException("Questa candidatura ha già un colloquio associato");
        }

        if (this.interviewRepository.existsByInterviewSlot(interviewSlot)) {
            throw new BadRequestException("Questo slot è già stato prenotato");
        }

        Interview newInterview = new Interview(application, interviewSlot, InterviewStatus.SCHEDULED);
        Interview saved = this.interviewRepository.save(newInterview);

        this.interviewSlotService.findByIdAndUpdateStatus(interviewSlot.getId(), InterviewSlotStatus.BOOKED);

        log.info("Colloquio {} creato per la candidatura {}, slot {} passato a BOOKED",
                saved.getId(), application.getId(), interviewSlot.getId());

        return saved;
    }

    public Interview findById(UUID interviewId) {
        return this.interviewRepository.findById(interviewId).orElseThrow(() -> new NotFoundException(interviewId));
    }

    public Interview findByApplicationForCaller(UUID applicationId, User currentUser) {
        Application application = this.applicationService.findById(applicationId);

        boolean isOwner = application.getUser().getId().equals(currentUser.getId());
        boolean isHr = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("HR"));

        if (!isOwner && !isHr) {
            throw new ForbiddenException("Non puoi accedere al colloquio della candidatura di un altro utente");
        }

        return this.interviewRepository.findByApplication(application).orElse(null);
    }

    public Interview findByInterviewSlotForCaller(UUID interviewSlotId, User currentUser) {
        InterviewSlot slot = this.interviewSlotService.findById(interviewSlotId);

        boolean isOwnerHr = slot.getHr().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN"));

        if (!isOwnerHr && !isAdmin) {
            throw new ForbiddenException("Non puoi accedere allo slot di un altro HR");
        }

        return this.interviewRepository.findByInterviewSlot(slot).orElse(null);
    }

    public Interview findByIdForCaller(UUID interviewId, User currentUser) {
        Interview found = this.findById(interviewId);

        boolean isOwner = found.getApplication().getUser().getId().equals(currentUser.getId());
        boolean isHr = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("HR"));

        if (!isOwner && !isHr) {
            throw new ForbiddenException("Non puoi accedere al colloquio di un altro utente");
        }
        return found;
    }

    public Interview findByIdAndUpdateStatus(UUID interviewId, InterviewStatus status) {
        Interview found = this.findById(interviewId);
        found.setStatus(status);
        return this.interviewRepository.save(found);
    }


    @Transactional
    public void findByIdAndDeleteForCaller(UUID interviewId, User currentUser) {
        Interview found = this.findByIdForCaller(interviewId, currentUser);
        UUID slotId = found.getInterviewSlot().getId();

        this.interviewRepository.delete(found);
        this.interviewSlotService.findByIdAndUpdateStatus(slotId, InterviewSlotStatus.AVAILABLE);
    }
}