package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.InterviewStatus;

import java.util.UUID;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Interview {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne
    @JoinColumn(name = "interview_slot_id", nullable = false)
    private InterviewSlot interviewSlot;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InterviewStatus status;

    public Interview(Application application, InterviewSlot interviewSlot, InterviewStatus status) {
        this.application = application;
        this.interviewSlot = interviewSlot;
        this.status = status;
    }
}