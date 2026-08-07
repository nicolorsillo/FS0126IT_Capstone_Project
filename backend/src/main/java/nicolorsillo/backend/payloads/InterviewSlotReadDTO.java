package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.enums.InterviewSlotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record InterviewSlotReadDTO(UUID id, LocalDateTime slotDate, InterviewSlotStatus status, UserRefDTO hr) {
    public static InterviewSlotReadDTO from(InterviewSlot interviewSlot) {
        return new InterviewSlotReadDTO(
                interviewSlot.getId(),
                interviewSlot.getSlotDate(),
                interviewSlot.getStatus(),
                UserRefDTO.from(interviewSlot.getHr())
        );
    }
}
