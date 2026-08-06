package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.Application;
import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByUser(User user);

    List<Application> findByJobOffer(JobOffer jobOffer);

    boolean existsByUserAndJobOffer(User user, JobOffer jobOffer);

    @Query("SELECT a FROM Application a WHERE (:status IS NULL OR a.status = :status) " +
            "AND (:search IS NULL OR LOWER(a.user.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(a.user.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(a.user.email) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(a.jobOffer.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Application> search(@Param("status") ApplicationStatus status, @Param("search") String search, Pageable pageable);
}
