package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.payloads.InterviewSlotDTO;
import nicolorsillo.backend.payloads.InterviewSlotReadDTO;
import nicolorsillo.backend.payloads.InterviewSlotResponseDTO;
import nicolorsillo.backend.services.InterviewSlotService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/interview-slots")
public class InterviewSlotController {

    private final InterviewSlotService interviewSlotService;

    public InterviewSlotController(InterviewSlotService interviewSlotService) {
        this.interviewSlotService = interviewSlotService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_INTERVIEW_SLOT')")
    public InterviewSlotResponseDTO create(@RequestBody @Valid InterviewSlotDTO payload, @AuthenticationPrincipal User currentUser) {
        InterviewSlot saved = this.interviewSlotService.save(payload, currentUser.getId());
        return new InterviewSlotResponseDTO(saved.getId());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('MY_INTERVIEW_SLOTS')")
    public List<InterviewSlotReadDTO> getMine(@AuthenticationPrincipal User currentUser) {
        return this.interviewSlotService.findByHr(currentUser.getId()).stream().map(InterviewSlotReadDTO::from).toList();
    }

    @GetMapping("/available")
    @PreAuthorize("hasAuthority('AVAILABLE_INTERVIEW_SLOTS')")
    public List<InterviewSlotReadDTO> getAvailable() {
        return this.interviewSlotService.findAvailableUpcoming().stream().map(InterviewSlotReadDTO::from).toList();
    }

    @GetMapping("/{interviewSlotId}")
    @PreAuthorize("hasAuthority('SEARCH_INTERVIEW_SLOT_BY_ID')")
    public InterviewSlotReadDTO getById(@PathVariable UUID interviewSlotId, @AuthenticationPrincipal User currentUser) {
        return InterviewSlotReadDTO.from(this.interviewSlotService.findByIdForCaller(interviewSlotId, currentUser));
    }

    @DeleteMapping("/{interviewSlotId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_INTERVIEW_SLOT_BY_ID')")
    public void delete(@PathVariable UUID interviewSlotId, @AuthenticationPrincipal User currentUser) {
        this.interviewSlotService.findByIdAndDeleteForCaller(interviewSlotId, currentUser);
    }
}