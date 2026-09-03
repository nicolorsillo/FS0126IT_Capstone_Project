package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.QuoteStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quotes")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Quote {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QuoteStatus status;

    @ManyToOne
    @JoinColumn(name = "work_id", nullable = false)
    private Work work;

    public Quote(LocalDateTime date, Long amount, QuoteStatus status, Work work) {
        this.date = date;
        this.amount = amount;
        this.status = status;
        this.work = work;
    }
}