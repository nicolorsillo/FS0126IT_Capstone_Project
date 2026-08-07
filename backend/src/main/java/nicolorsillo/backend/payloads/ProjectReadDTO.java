package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Project;
import nicolorsillo.backend.enums.ProjectStatus;

import java.util.UUID;

public record ProjectReadDTO(UUID id, String projectUrl, ProjectStatus status, String rejectionReason,
                             UserRefDTO surveyor, WorkRefDTO work) {
    public static ProjectReadDTO from(Project project) {
        return new ProjectReadDTO(
                project.getId(),
                project.getProjectUrl(),
                project.getStatus(),
                project.getRejectionReason(),
                UserRefDTO.from(project.getSurveyor()),
                WorkRefDTO.from(project.getWork())
        );
    }
}
