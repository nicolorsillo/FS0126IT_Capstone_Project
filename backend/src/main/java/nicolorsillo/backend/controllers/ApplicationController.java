package nicolorsillo.backend.controllers;

import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.ApplicationStatus;
import nicolorsillo.backend.payloads.ApplicationReadDTO;
import nicolorsillo.backend.payloads.ApplicationResponseDTO;
import nicolorsillo.backend.services.ApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_APPLICATION')")
    public ApplicationResponseDTO create(@RequestParam UUID jobOfferId,
                                         @RequestParam("cv") MultipartFile cv,
                                         @AuthenticationPrincipal User currentUser) {
        Application saved = this.applicationService.save(jobOfferId, cv, currentUser.getId());
        return new ApplicationResponseDTO(saved.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_APPLICATIONS')")
    public Page<ApplicationReadDTO> getAll(@RequestParam(required = false) ApplicationStatus status,
                                           @RequestParam(required = false) String search,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(defaultValue = "appliedAt") String orderBy) {
        return this.applicationService.getAll(status, search, page, size, orderBy).map(ApplicationReadDTO::from);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('MY_APPLICATIONS')")
    public List<ApplicationReadDTO> getMine(@AuthenticationPrincipal User currentUser) {
        return this.applicationService.findByUser(currentUser.getId()).stream().map(ApplicationReadDTO::from).toList();
    }

    @GetMapping("/job-offer/{jobOfferId}")
    @PreAuthorize("hasAuthority('JOBOFFER_APPLICATIONS')")
    public List<ApplicationReadDTO> getByJobOffer(@PathVariable UUID jobOfferId) {
        return this.applicationService.findByJobOffer(jobOfferId).stream().map(ApplicationReadDTO::from).toList();
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasAuthority('SEARCH_APPLICATION_BY_ID')")
    public ApplicationReadDTO getById(@PathVariable UUID applicationId, @AuthenticationPrincipal User currentUser) {
        return ApplicationReadDTO.from(this.applicationService.findByIdForCaller(applicationId, currentUser));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAuthority('MODIFY_APPLICATION_STATUS')")
    public ApplicationReadDTO updateStatus(@PathVariable UUID applicationId, @RequestParam ApplicationStatus status) {
        return ApplicationReadDTO.from(this.applicationService.findByIdAndUpdateStatus(applicationId, status));
    }

    @DeleteMapping("/{applicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_APPLICATION_BY_ID')")
    public void delete(@PathVariable UUID applicationId, @AuthenticationPrincipal User currentUser) {
        this.applicationService.findByIdAndDeleteForCaller(applicationId, currentUser);
    }
}