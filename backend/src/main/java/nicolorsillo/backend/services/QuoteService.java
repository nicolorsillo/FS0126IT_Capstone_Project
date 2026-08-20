package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Quote;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.QuoteStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.QuoteDTO;
import nicolorsillo.backend.repositories.QuoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class QuoteService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "date", "amount", "status");

    private final QuoteRepository quoteRepository;
    private final WorkService workService;

    public QuoteService(QuoteRepository quoteRepository, WorkService workService) {
        this.quoteRepository = quoteRepository;
        this.workService = workService;
    }

    public Quote save(QuoteDTO payload) {
        Work work = this.workService.findById(payload.workId());

        Quote newQuote = new Quote(payload.date(), payload.amount(), QuoteStatus.PENDING, work);
        return this.quoteRepository.save(newQuote);
    }

    public Page<Quote> getAll(QuoteStatus status, String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.quoteRepository.search(status, search, pageable);
    }

    public List<Quote> findByWork(UUID workId) {
        Work work = this.workService.findById(workId);
        return this.quoteRepository.findByWork(work);
    }

    public Quote findById(UUID quoteId) {
        return this.quoteRepository.findById(quoteId).orElseThrow(() -> new NotFoundException(quoteId));
    }

    public List<Quote> findByWorkForCaller(UUID workId, User currentUser) {
        Work work = this.workService.findByIdForCaller(workId, currentUser);
        return this.quoteRepository.findByWork(work);
    }

    public Quote findByIdForCaller(UUID quoteId, User currentUser) {
        Quote found = this.findById(quoteId);

        boolean isOwner = found.getWork().getClient().getId().equals(currentUser.getId());
        boolean canManageAnyQuote = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyQuote) {
            throw new ForbiddenException("Non puoi accedere al preventivo di un altro cliente");
        }
        return found;
    }

    public Quote findByIdAndUpdateStatus(UUID quoteId, QuoteStatus status) {
        Quote found = this.findById(quoteId);
        found.setStatus(status);
        return this.quoteRepository.save(found);
    }

    public Quote findByIdAndUpdateStatusForCaller(UUID quoteId, QuoteStatus status, User currentUser) {
        Quote found = this.findById(quoteId);

        boolean isOwner = found.getWork().getClient().getId().equals(currentUser.getId());
        boolean canManageAnyQuote = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyQuote) {
            throw new ForbiddenException("Non puoi accedere al preventivo di un altro cliente");
        }

        found.setStatus(status);
        return this.quoteRepository.save(found);
    }

    public void findByIdAndDelete(UUID quoteId) {
        Quote found = this.findById(quoteId);
        this.quoteRepository.delete(found);
    }

    private boolean hasStaffRole(User user) {
        return user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("GEOMETRA"));
    }
}
