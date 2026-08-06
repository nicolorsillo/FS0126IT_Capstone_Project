package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.entities.Interview;
import nicolorsillo.backend.entities.InterviewSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {

    boolean existsByApplication(Application application);

    boolean existsByInterviewSlot(InterviewSlot interviewSlot);

    Optional<Interview> findByApplication(Application application);

    Optional<Interview> findByInterviewSlot(InterviewSlot interviewSlot);
}
