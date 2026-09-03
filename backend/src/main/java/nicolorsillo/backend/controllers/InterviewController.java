package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.Interview;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InterviewStatus;
import nicolorsillo.backend.payloads.ApplicationReadDTO;
import nicolorsillo.backend.payloads.InterviewDTO;
import nicolorsillo.backend.payloads.InterviewReadDTO;
import nicolorsillo.backend.payloads.InterviewResponseDTO;
import nicolorsillo.backend.services.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_INTERVIEW')")
    public InterviewResponseDTO create(@RequestBody @Valid InterviewDTO payload, @AuthenticationPrincipal User currentUser) {
        Interview saved = this.interviewService.save(payload, currentUser);
        return new InterviewResponseDTO(saved.getId());
    }

    @GetMapping("/{interviewId}")
    @PreAuthorize("hasAuthority('SEARCH_INTERVIEW_BY_ID')")
    public InterviewReadDTO getById(@PathVariable UUID interviewId, @AuthenticationPrincipal User currentUser) {
        return InterviewReadDTO.from(this.interviewService.findByIdForCaller(interviewId, currentUser));
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAuthority('SEARCH_INTERVIEW_BY_ID')")
    public InterviewReadDTO getByApplication(@PathVariable UUID applicationId, @AuthenticationPrincipal User currentUser) {
        Interview found = this.interviewService.findByApplicationForCaller(applicationId, currentUser);
        return found == null ? null : InterviewReadDTO.from(found);
    }

    @GetMapping("/slot/{interviewSlotId}")
    @PreAuthorize("hasAuthority('SEARCH_INTERVIEW_BY_ID')")
    public ApplicationReadDTO getApplicationBySlot(@PathVariable UUID interviewSlotId, @AuthenticationPrincipal User currentUser) {
        Interview found = this.interviewService.findByInterviewSlotForCaller(interviewSlotId, currentUser);
        return found == null ? null : ApplicationReadDTO.from(found.getApplication());
    }

    @PatchMapping("/{interviewId}/status")
    @PreAuthorize("hasAuthority('MODIFY_INTERVIEW_STATUS')")
    public InterviewReadDTO updateStatus(@PathVariable UUID interviewId, @RequestParam InterviewStatus status) {
        return InterviewReadDTO.from(this.interviewService.findByIdAndUpdateStatus(interviewId, status));
    }

    @DeleteMapping("/{interviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_INTERVIEW_BY_ID')")
    public void delete(@PathVariable UUID interviewId, @AuthenticationPrincipal User currentUser) {
        this.interviewService.findByIdAndDeleteForCaller(interviewId, currentUser);
    }
}