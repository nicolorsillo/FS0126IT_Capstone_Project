package nicolorsillo.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import nicolorsillo.backend.enums.InvoiceStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Invoice {

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
    private InvoiceStatus status;

    @ManyToOne
    @JoinColumn(name = "work_id", nullable = false)
    private Work work;

    public Invoice(LocalDateTime date, Long amount, InvoiceStatus status, Work work) {
        this.date = date;
        this.amount = amount;
        this.status = status;
        this.work = work;
    }
}