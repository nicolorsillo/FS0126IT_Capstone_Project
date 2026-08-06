package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InterviewSlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, UUID> {

    List<InterviewSlot> findByHr(User hr);

    List<InterviewSlot> findByStatusAndSlotDateBefore(InterviewSlotStatus status, LocalDateTime dateTime);

    List<InterviewSlot> findByStatusAndSlotDateAfter(InterviewSlotStatus status, LocalDateTime dateTime);

    long deleteByStatusAndSlotDateBefore(InterviewSlotStatus status, LocalDateTime dateTime);

    List<InterviewSlot> findByHrAndSlotDateBetween(User hr, LocalDateTime from, LocalDateTime to);
}