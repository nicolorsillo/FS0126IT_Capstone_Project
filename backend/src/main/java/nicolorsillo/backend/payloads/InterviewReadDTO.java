package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Interview;
import nicolorsillo.backend.enums.InterviewStatus;

import java.util.UUID;

public record InterviewReadDTO(UUID id, InterviewStatus status, ApplicationRefDTO application,
                               InterviewSlotRefDTO interviewSlot) {
    public static InterviewReadDTO from(Interview interview) {
        return new InterviewReadDTO(
                interview.getId(),
                interview.getStatus(),
                ApplicationRefDTO.from(interview.getApplication()),
                InterviewSlotRefDTO.from(interview.getInterviewSlot())
        );
    }
}
