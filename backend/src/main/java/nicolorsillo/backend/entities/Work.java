package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.WorkStatus;
import nicolorsillo.backend.enums.WorkType;

import java.util.UUID;

@Entity
@Table(name = "works")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Work {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private WorkType type;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private WorkStatus status;

    public Work(WorkType type, User client, String description, WorkStatus status) {
        this.type = type;
        this.client = client;
        this.description = description;
        this.status = status;
    }
}