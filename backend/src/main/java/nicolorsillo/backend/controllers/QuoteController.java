package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.Quote;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.QuoteStatus;
import nicolorsillo.backend.payloads.QuoteDTO;
import nicolorsillo.backend.payloads.QuoteReadDTO;
import nicolorsillo.backend.payloads.QuoteResponseDTO;
import nicolorsillo.backend.services.QuoteService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_QUOTE')")
    public QuoteResponseDTO create(@RequestBody @Valid QuoteDTO payload) {
        Quote saved = this.quoteService.save(payload);
        return new QuoteResponseDTO(saved.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_QUOTES')")
    public Page<QuoteReadDTO> getAll(@RequestParam(required = false) QuoteStatus status,
                                     @RequestParam(required = false) String search,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(defaultValue = "date") String orderBy) {
        return this.quoteService.getAll(status, search, page, size, orderBy).map(QuoteReadDTO::from);
    }

    @GetMapping("/work/{workId}")
    @PreAuthorize("hasAuthority('WORK_QUOTES')")
    public List<QuoteReadDTO> getByWork(@PathVariable UUID workId, @AuthenticationPrincipal User currentUser) {
        return this.quoteService.findByWorkForCaller(workId, currentUser).stream().map(QuoteReadDTO::from).toList();
    }

    @GetMapping("/{quoteId}")
    @PreAuthorize("hasAuthority('SEARCH_QUOTE_BY_ID')")
    public QuoteReadDTO getById(@PathVariable UUID quoteId, @AuthenticationPrincipal User currentUser) {
        return QuoteReadDTO.from(this.quoteService.findByIdForCaller(quoteId, currentUser));
    }

    @PatchMapping("/{quoteId}/status")
    @PreAuthorize("hasAuthority('MODIFY_QUOTE_STATUS')")
    public QuoteReadDTO updateStatus(@PathVariable UUID quoteId, @RequestParam QuoteStatus status, @AuthenticationPrincipal User currentUser) {
        return QuoteReadDTO.from(this.quoteService.findByIdAndUpdateStatusForCaller(quoteId, status, currentUser));
    }

    @DeleteMapping("/{quoteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_QUOTE_BY_ID')")
    public void delete(@PathVariable UUID quoteId) {
        this.quoteService.findByIdAndDelete(quoteId);
    }
}