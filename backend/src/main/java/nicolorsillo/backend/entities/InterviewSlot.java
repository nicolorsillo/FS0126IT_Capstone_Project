package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.InterviewSlotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "interview_slots")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class InterviewSlot {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "hr_id", nullable = false)
    private User hr;

    @Column(name = "slot_date", nullable = false)
    private LocalDateTime slotDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InterviewSlotStatus status;

    public InterviewSlot(User hr, LocalDateTime slotDate, InterviewSlotStatus status) {
        this.hr = hr;
        this.slotDate = slotDate;
        this.status = status;
    }
}