package nicolorsillo.backend.services;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.Invoice;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.InvoiceStatus;
import nicolorsillo.backend.exceptions.BadRequestException;
import nicolorsillo.backend.exceptions.ForbiddenException;
import nicolorsillo.backend.exceptions.NotFoundException;
import nicolorsillo.backend.payloads.InvoiceDTO;
import nicolorsillo.backend.repositories.InvoiceRepository;
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
public class InvoiceService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "date", "amount", "status");

    private final InvoiceRepository invoiceRepository;
    private final WorkService workService;

    public InvoiceService(InvoiceRepository invoiceRepository, WorkService workService) {
        this.invoiceRepository = invoiceRepository;
        this.workService = workService;
    }

    public Invoice save(InvoiceDTO payload) {
        Work work = this.workService.findById(payload.workId());

        Invoice newInvoice = new Invoice(payload.date(), payload.amount(), InvoiceStatus.PENDING, work);
        return this.invoiceRepository.save(newInvoice);
    }

    public Page<Invoice> getAll(InvoiceStatus status, String search, int page, int size, String orderBy) {
        if (size > 50) size = 50;
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        if (!ALLOWED_SORT_FIELDS.contains(orderBy)) {
            throw new BadRequestException("Campo di ordinamento non valido: '" + orderBy + "'. Ammessi: " + ALLOWED_SORT_FIELDS);
        }
        if (search != null && search.isBlank()) search = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(orderBy));
        return this.invoiceRepository.search(status, search, pageable);
    }

    public List<Invoice> findByWork(UUID workId) {
        Work work = this.workService.findById(workId);
        return this.invoiceRepository.findByWork(work);
    }

    public Invoice findById(UUID invoiceId) {
        return this.invoiceRepository.findById(invoiceId).orElseThrow(() -> new NotFoundException(invoiceId));
    }

    public List<Invoice> findByWorkForCaller(UUID workId, User currentUser) {
        Work work = this.workService.findByIdForCaller(workId, currentUser);
        return this.invoiceRepository.findByWork(work);
    }

    public Invoice findByIdForCaller(UUID invoiceId, User currentUser) {
        Invoice found = this.findById(invoiceId);

        boolean isOwner = found.getWork().getClient().getId().equals(currentUser.getId());
        boolean canManageAnyInvoice = hasStaffRole(currentUser);

        if (!isOwner && !canManageAnyInvoice) {
            throw new ForbiddenException("Non puoi accedere alla fattura di un altro cliente");
        }
        return found;
    }

    public Invoice findByIdAndUpdateStatus(UUID invoiceId, InvoiceStatus status) {
        Invoice found = this.findById(invoiceId);
        found.setStatus(status);
        return this.invoiceRepository.save(found);
    }

    public void findByIdAndDelete(UUID invoiceId) {
        Invoice found = this.findById(invoiceId);
        this.invoiceRepository.delete(found);
    }

    private boolean hasStaffRole(User user) {
        return user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("GEOMETRA"));
    }
}
