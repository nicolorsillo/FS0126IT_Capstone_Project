package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.Invoice;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InvoiceStatus;
import nicolorsillo.backend.payloads.InvoiceDTO;
import nicolorsillo.backend.payloads.InvoiceReadDTO;
import nicolorsillo.backend.payloads.InvoiceResponseDTO;
import nicolorsillo.backend.services.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_INVOICE')")
    public InvoiceResponseDTO create(@RequestBody @Valid InvoiceDTO payload) {
        Invoice saved = this.invoiceService.save(payload);
        return new InvoiceResponseDTO(saved.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_INVOICES')")
    public Page<InvoiceReadDTO> getAll(@RequestParam(required = false) InvoiceStatus status,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "date") String orderBy) {
        return this.invoiceService.getAll(status, search, page, size, orderBy).map(InvoiceReadDTO::from);
    }

    @GetMapping("/work/{workId}")
    @PreAuthorize("hasAuthority('WORK_INVOICES')")
    public List<InvoiceReadDTO> getByWork(@PathVariable UUID workId, @AuthenticationPrincipal User currentUser) {
        return this.invoiceService.findByWorkForCaller(workId, currentUser).stream().map(InvoiceReadDTO::from).toList();
    }

    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAuthority('SEARCH_INVOICE_BY_ID')")
    public InvoiceReadDTO getById(@PathVariable UUID invoiceId, @AuthenticationPrincipal User currentUser) {
        return InvoiceReadDTO.from(this.invoiceService.findByIdForCaller(invoiceId, currentUser));
    }

    @PatchMapping("/{invoiceId}/status")
    @PreAuthorize("hasAuthority('MODIFY_INVOICE_STATUS')")
    public InvoiceReadDTO updateStatus(@PathVariable UUID invoiceId, @RequestParam InvoiceStatus status) {
        return InvoiceReadDTO.from(this.invoiceService.findByIdAndUpdateStatus(invoiceId, status));
    }

    @DeleteMapping("/{invoiceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_INVOICE_BY_ID')")
    public void delete(@PathVariable UUID invoiceId) {
        this.invoiceService.findByIdAndDelete(invoiceId);
    }
}