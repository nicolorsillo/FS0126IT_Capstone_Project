package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.JobOfferStatus;
import nicolorsillo.backend.payloads.JobOfferDTO;
import nicolorsillo.backend.payloads.JobOfferReadDTO;
import nicolorsillo.backend.payloads.JobOfferResponseDTO;
import nicolorsillo.backend.services.JobOfferService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/job-offers")
public class JobOfferController {

    private final JobOfferService jobOfferService;

    public JobOfferController(JobOfferService jobOfferService) {
        this.jobOfferService = jobOfferService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_JOBOFFER')")
    public JobOfferResponseDTO create(@RequestBody @Valid JobOfferDTO payload, @AuthenticationPrincipal User currentUser) {
        JobOffer saved = this.jobOfferService.save(payload, currentUser.getId());
        return new JobOfferResponseDTO(saved.getId());
    }

    @GetMapping
    public Page<JobOfferReadDTO> getAll(@RequestParam(required = false) JobOfferStatus status,
                                        @RequestParam(required = false) String search,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(defaultValue = "createdAt") String orderBy,
                                        @AuthenticationPrincipal User currentUser) {
        return this.jobOfferService.getAll(status, search, page, size, orderBy, currentUser).map(JobOfferReadDTO::from);
    }

    @GetMapping("/{jobOfferId}")
    public JobOfferReadDTO getById(@PathVariable UUID jobOfferId, @AuthenticationPrincipal User currentUser) {
        return JobOfferReadDTO.from(this.jobOfferService.findByIdForPublic(jobOfferId, currentUser));
    }

    @PutMapping("/{jobOfferId}")
    @PreAuthorize("hasAuthority('MODIFY_JOBOFFER')")
    public JobOfferReadDTO update(@PathVariable UUID jobOfferId, @RequestBody @Valid JobOfferDTO payload) {
        return JobOfferReadDTO.from(this.jobOfferService.findByIdAndUpdate(jobOfferId, payload));
    }

    @PatchMapping("/{jobOfferId}/status")
    @PreAuthorize("hasAuthority('MODIFY_JOBOFFER_STATUS')")
    public JobOfferReadDTO updateStatus(@PathVariable UUID jobOfferId, @RequestParam JobOfferStatus status) {
        return JobOfferReadDTO.from(this.jobOfferService.findByIdAndUpdateStatus(jobOfferId, status));
    }

    @DeleteMapping("/{jobOfferId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_JOBOFFER_BY_ID')")
    public void delete(@PathVariable UUID jobOfferId) {
        this.jobOfferService.findByIdAndDelete(jobOfferId);
    }
}