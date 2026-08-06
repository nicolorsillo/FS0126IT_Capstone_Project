package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.JobOffer;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.enums.JobOfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JobOfferRepository extends JpaRepository<JobOffer, UUID> {

    List<JobOffer> findByCreator(User creator);

    @Query("SELECT j FROM JobOffer j WHERE (:status IS NULL OR j.status = :status) " +
            "AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(j.position) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<JobOffer> search(@Param("status") JobOfferStatus status, @Param("search") String search, Pageable pageable);
}
