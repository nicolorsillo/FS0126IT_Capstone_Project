package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InterviewSlotStatus;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.InterviewSlotDTO;
import nicolorsillo.backend.repositories.InterviewSlotRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class InterviewSlotService {

    private final InterviewSlotRepository interviewSlotRepository;
    private final UsersService usersService;

    public InterviewSlotService(InterviewSlotRepository interviewSlotRepository, UsersService usersService) {
        this.interviewSlotRepository = interviewSlotRepository;
        this.usersService = usersService;
    }

    public InterviewSlot save(InterviewSlotDTO payload, UUID hrId) {
        User hr = this.usersService.findById(hrId);

        InterviewSlot newSlot = new InterviewSlot(hr, payload.slotDate(), InterviewSlotStatus.AVAILABLE);
        return this.interviewSlotRepository.save(newSlot);
    }

    public List<InterviewSlot> findByHr(UUID hrId) {
        User hr = this.usersService.findById(hrId);
        return this.interviewSlotRepository.findByHr(hr);
    }

    public List<InterviewSlot> findAvailableUpcoming() {
        return this.interviewSlotRepository.findByStatusAndSlotDateAfter(InterviewSlotStatus.AVAILABLE, LocalDateTime.now());
    }

    public InterviewSlot findById(UUID interviewSlotId) {
        return this.interviewSlotRepository.findById(interviewSlotId).orElseThrow(() -> new NotFoundException(interviewSlotId));
    }


    public InterviewSlot findByIdForCaller(UUID interviewSlotId, User currentUser) {
        InterviewSlot found = this.findById(interviewSlotId);

        boolean isHr = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("HR"));
        if (isHr && !found.getHr().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Questo slot appartiene a un altro HR");
        }
        return found;
    }

    public InterviewSlot findByIdAndUpdateStatus(UUID interviewSlotId, InterviewSlotStatus status) {
        InterviewSlot found = this.findById(interviewSlotId);
        found.setStatus(status);
        return this.interviewSlotRepository.save(found);
    }


    public void findByIdAndDeleteForCaller(UUID interviewSlotId, User currentUser) {
        InterviewSlot found = this.findById(interviewSlotId);

        if (!found.getHr().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Non puoi cancellare uno slot di un altro HR");
        }
        this.interviewSlotRepository.delete(found);
    }
}