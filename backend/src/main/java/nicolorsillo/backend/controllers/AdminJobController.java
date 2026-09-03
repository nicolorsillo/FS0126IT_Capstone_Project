package nicolorsillo.backend.controllers;

import nicolorsillo.backend.jobs.InterviewSlotSchedulingJob;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/jobs")
public class AdminJobController {

    private final InterviewSlotSchedulingJob interviewSlotSchedulingJob;

    public AdminJobController(InterviewSlotSchedulingJob interviewSlotSchedulingJob) {
        this.interviewSlotSchedulingJob = interviewSlotSchedulingJob;
    }

    @PostMapping("/interview-slots/run")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('RUN_INTERVIEW_SLOT_JOB')")
    public void runInterviewSlotJob() {
        this.interviewSlotSchedulingJob.manageInterviewSlots();
    }
}