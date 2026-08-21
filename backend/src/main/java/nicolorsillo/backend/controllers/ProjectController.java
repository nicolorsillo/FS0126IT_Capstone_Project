package nicolorsillo.backend.controllers;

import jakarta.validation.Valid;
import nicolorsillo.backend.entities.Project;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.ProjectStatus;
import nicolorsillo.backend.payloads.ProjectDTO;
import nicolorsillo.backend.payloads.ProjectReadDTO;
import nicolorsillo.backend.payloads.ProjectResponseDTO;
import nicolorsillo.backend.services.ProjectService;
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
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_PROJECT')")
    public ProjectResponseDTO create(@ModelAttribute @Valid ProjectDTO payload,
                                     @RequestParam("projectFile") MultipartFile projectFile) {
        Project saved = this.projectService.save(payload, projectFile);
        return new ProjectResponseDTO(saved.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GET_ALL_PROJECTS')")
    public Page<ProjectReadDTO> getAll(@RequestParam(required = false) ProjectStatus status,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "status") String orderBy) {
        return this.projectService.getAll(status, search, page, size, orderBy).map(ProjectReadDTO::from);
    }

    @GetMapping("/work/{workId}")
    @PreAuthorize("hasAuthority('WORK_PROJECTS')")
    public List<ProjectReadDTO> getByWork(@PathVariable UUID workId, @AuthenticationPrincipal User currentUser) {
        return this.projectService.findByWorkForCaller(workId, currentUser).stream().map(ProjectReadDTO::from).toList();
    }

    @GetMapping("/surveyor/{surveyorId}")
    @PreAuthorize("hasAuthority('SURVEYOR_PROJECTS')")
    public List<ProjectReadDTO> getBySurveyor(@PathVariable UUID surveyorId) {
        return this.projectService.findBySurveyor(surveyorId).stream().map(ProjectReadDTO::from).toList();
    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasAuthority('SEARCH_PROJECT_BY_ID')")
    public ProjectReadDTO getById(@PathVariable UUID projectId, @AuthenticationPrincipal User currentUser) {
        return ProjectReadDTO.from(this.projectService.findByIdForCaller(projectId, currentUser));
    }

    @PatchMapping("/{projectId}/status")
    @PreAuthorize("hasAuthority('MODIFY_PROJECT_STATUS')")
    public ProjectReadDTO updateStatus(@PathVariable UUID projectId,
                                       @RequestParam ProjectStatus status,
                                       @RequestParam(required = false) String reason,
                                       @AuthenticationPrincipal User currentUser) {
        return ProjectReadDTO.from(this.projectService.findByIdAndUpdateStatusForCaller(projectId, status, reason, currentUser));
    }

    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('DELETE_PROJECT_BY_ID')")
    public void delete(@PathVariable UUID projectId) {
        this.projectService.findByIdAndDelete(projectId);
    }
}