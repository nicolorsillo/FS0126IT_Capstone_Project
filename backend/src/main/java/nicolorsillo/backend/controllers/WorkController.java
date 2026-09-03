package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.WorkStatus;
import nicolorsillo.backend.payloads.WorkDTO;
import nicolorsillo.backend.payloads.WorkReadDTO;
import nicolorsillo.backend.payloads.WorkResponseDTO;
import nicolorsillo.backend.services.WorkService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/works")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_WORK')")
    public WorkResponseDTO create(@RequestBody @Valid WorkDTO payload, @AuthenticationPrincipal User currentUser) {
        Work saved = this.workService.save(payload, currentUser.getId());
        return new WorkResponseDTO(saved.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_WORKS')")
    public Page<WorkReadDTO> getAll(@RequestParam(required = false) WorkStatus status,
                                    @RequestParam(required = false) String search,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(defaultValue = "status") String orderBy) {
        return this.workService.getAll(status, search, page, size, orderBy).map(WorkReadDTO::from);
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAuthority('CLIENT_WORKS')")
    public List<WorkReadDTO> getByClient(@PathVariable UUID clientId, @AuthenticationPrincipal User currentUser) {
        return this.workService.findByClientForCaller(clientId, currentUser).stream().map(WorkReadDTO::from).toList();
    }

    @GetMapping("/{workId}")
    @PreAuthorize("hasAuthority('SEARCH_WORK_BY_ID')")
    public WorkReadDTO getById(@PathVariable UUID workId, @AuthenticationPrincipal User currentUser) {
        return WorkReadDTO.from(this.workService.findByIdForCaller(workId, currentUser));
    }

    @PatchMapping("/{workId}/status")
    @PreAuthorize("hasAuthority('MODIFY_WORK_STATUS')")
    public WorkReadDTO updateStatus(@PathVariable UUID workId, @RequestParam WorkStatus status) {
        return WorkReadDTO.from(this.workService.findByIdAndUpdateStatus(workId, status));
    }

    @DeleteMapping("/{workId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_WORK_BY_ID')")
    public void delete(@PathVariable UUID workId) {
        this.workService.findByIdAndDelete(workId);
    }
}