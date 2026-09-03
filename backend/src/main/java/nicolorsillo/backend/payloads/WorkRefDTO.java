package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.WorkStatus;
import nicolorsillo.backend.enums.WorkType;

import java.util.UUID;

public record WorkRefDTO(UUID id, WorkType type, String description, WorkStatus status) {
    public static WorkRefDTO from(Work work) {
        return new WorkRefDTO(work.getId(), work.getType(), work.getDescription(), work.getStatus());
    }
}
