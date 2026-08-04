package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.JobOfferStatus;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "job_offers")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class JobOffer {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "min_salary")
    private Long minSalary;

    @Column(name = "max_salary")
    private Long maxSalary;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    @Setter(AccessLevel.NONE)
    private User creator;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobOfferStatus status;

    private String position;

    @Column(name = "created_at", nullable = false)
    @Setter(AccessLevel.NONE)
    private LocalDate createdAt;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    public JobOffer(
            String title, String description, Long minSalary, Long maxSalary, User creator, JobOfferStatus status, String position, LocalDate createdAt, LocalDate expiresAt
    ) {
        this.title = title;
        this.description = description;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.creator = creator;
        this.status = status;
        this.position = position;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
}