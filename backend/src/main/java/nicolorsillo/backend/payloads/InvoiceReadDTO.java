package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Invoice;
import nicolorsillo.backend.enums.InvoiceStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record InvoiceReadDTO(UUID id, LocalDateTime date, Long amount, InvoiceStatus status, WorkRefDTO work) {
    public static InvoiceReadDTO from(Invoice invoice) {
        return new InvoiceReadDTO(
                invoice.getId(),
                invoice.getDate(),
                invoice.getAmount(),
                invoice.getStatus(),
                WorkRefDTO.from(invoice.getWork())
        );
    }
}
