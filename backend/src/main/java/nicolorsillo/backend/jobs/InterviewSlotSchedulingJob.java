package nicolorsillo.backend.jobs;

import lombok.extern.slf4j.Slf4j;
import nicolorsillo.backend.entities.InterviewSlot;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.InterviewSlotStatus;
import nicolorsillo.backend.events.HrRoleAssignedEvent;
import nicolorsillo.backend.repositories.InterviewSlotRepository;
import nicolorsillo.backend.repositories.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class InterviewSlotSchedulingJob {

    private static final String HR_ROLE_NAME = "HR";
    private static final int GENERATION_WINDOW_DAYS = 14;

    private static final List<LocalTime> SLOT_TIMES = List.of(
            LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0), LocalTime.of(12, 0), LocalTime.of(13, 0),
            LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0), LocalTime.of(17, 0), LocalTime.of(18, 0)
    );

    private final InterviewSlotRepository interviewSlotRepository;
    private final UserRepository userRepository;

    public InterviewSlotSchedulingJob(InterviewSlotRepository interviewSlotRepository, UserRepository userRepository) {
        this.interviewSlotRepository = interviewSlotRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void manageInterviewSlots() {
        log.info("Avvio job di gestione interview_slots");

        long deleted = deleteExpiredAvailableSlots();
        int created = generateUpcomingSlots();

        log.info("Job interview_slots completato: {} slot scaduti cancellati, {} nuovi slot generati", deleted, created);
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void onApplicationReady() {
        log.info("App avviata: eseguo subito il job interview_slots");
        manageInterviewSlots();
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onHrRoleAssigned(HrRoleAssignedEvent event) {
        User hr = this.userRepository.findById(event.userId()).orElse(null);
        if (hr == null) {
            log.warn("Utente HR {} non trovato: slot non generati", event.userId());
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate windowEnd = today.plusDays(GENERATION_WINDOW_DAYS);
        int created = generateSlotsForHr(hr, today, windowEnd);

        log.info("Nuovo HR {} assegnato: generati {} slot", event.userId(), created);
    }

    private long deleteExpiredAvailableSlots() {
        return this.interviewSlotRepository.deleteByStatusAndSlotDateBefore(InterviewSlotStatus.AVAILABLE, LocalDateTime.now());
    }

    private int generateUpcomingSlots() {
        List<User> hrUsers = this.userRepository.findByRoles_Name(HR_ROLE_NAME);
        log.info("Trovati {} utenti con ruolo HR", hrUsers.size());

        if (hrUsers.isEmpty()) {
            log.warn("Nessun utente con ruolo HR trovato: nessuno slot generato");
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate windowEnd = today.plusDays(GENERATION_WINDOW_DAYS);

        int totalCreated = 0;
        for (User hr : hrUsers) {
            totalCreated += generateSlotsForHr(hr, today, windowEnd);
        }
        return totalCreated;
    }

    private int generateSlotsForHr(User hr, LocalDate start, LocalDate end) {
        Set<LocalDateTime> existingSlotDates = this.interviewSlotRepository
                .findByHrAndSlotDateBetween(hr, start.atStartOfDay(), end.plusDays(1).atStartOfDay())
                .stream()
                .map(InterviewSlot::getSlotDate)
                .collect(Collectors.toSet());

        LocalDateTime now = LocalDateTime.now();
        List<InterviewSlot> slotsToCreate = new ArrayList<>();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                continue;
            }

            for (LocalTime time : SLOT_TIMES) {
                LocalDateTime slotDateTime = LocalDateTime.of(date, time);

                if (slotDateTime.isBefore(now)) {
                    continue;
                }
                if (existingSlotDates.contains(slotDateTime)) {
                    continue;
                }

                slotsToCreate.add(new InterviewSlot(hr, slotDateTime, InterviewSlotStatus.AVAILABLE));
            }
        }

        if (!slotsToCreate.isEmpty()) {
            this.interviewSlotRepository.saveAll(slotsToCreate);
        }

        return slotsToCreate.size();
    }
}