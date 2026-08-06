package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.WorkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface WorkRepository extends JpaRepository<Work, UUID> {

    List<Work> findByClient(User client);

    @Query("SELECT w FROM Work w WHERE (:status IS NULL OR w.status = :status) " +
            "AND (:search IS NULL OR LOWER(w.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(w.client.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(w.client.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Work> search(@Param("status") WorkStatus status, @Param("search") String search, Pageable pageable);
}
