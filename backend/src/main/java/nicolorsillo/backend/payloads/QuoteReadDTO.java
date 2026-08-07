package nicolorsillo.backend.payloads;

import nicolorsillo.backend.entities.Quote;
import nicolorsillo.backend.enums.QuoteStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteReadDTO(UUID id, LocalDateTime date, Long amount, QuoteStatus status, WorkRefDTO work) {
    public static QuoteReadDTO from(Quote quote) {
        return new QuoteReadDTO(
                quote.getId(),
                quote.getDate(),
                quote.getAmount(),
                quote.getStatus(),
                WorkRefDTO.from(quote.getWork())
        );
    }
}
