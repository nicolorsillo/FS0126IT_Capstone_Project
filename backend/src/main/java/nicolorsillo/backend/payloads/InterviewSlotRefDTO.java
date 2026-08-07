package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.enums.InterviewSlotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record InterviewSlotRefDTO(UUID id, LocalDateTime slotDate, InterviewSlotStatus status) {
    public static InterviewSlotRefDTO from(InterviewSlot interviewSlot) {
        return new InterviewSlotRefDTO(interviewSlot.getId(), interviewSlot.getSlotDate(), interviewSlot.getStatus());
    }
}
