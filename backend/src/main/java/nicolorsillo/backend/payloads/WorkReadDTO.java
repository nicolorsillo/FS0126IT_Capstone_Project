package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.WorkStatus;
import nicolorsillo.backend.enums.WorkType;

import java.util.UUID;

public record WorkReadDTO(UUID id, WorkType type, String description, WorkStatus status, UserRefDTO client) {
    public static WorkReadDTO from(Work work) {
        return new WorkReadDTO(
                work.getId(),
                work.getType(),
                work.getDescription(),
                work.getStatus(),
                UserRefDTO.from(work.getClient())
        );
    }
}
