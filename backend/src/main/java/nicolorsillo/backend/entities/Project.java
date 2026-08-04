package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.ProjectStatus;

import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Project {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "surveyor_id", nullable = false)
    private User surveyor;

    @Column(name = "project_url", nullable = false)
    private String projectUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "work_id", nullable = false)
    private Work work;

    public Project(User surveyor, String projectUrl, ProjectStatus status, Work work) {
        this.surveyor = surveyor;
        this.projectUrl = projectUrl;
        this.status = status;
        this.work = work;
    }
}