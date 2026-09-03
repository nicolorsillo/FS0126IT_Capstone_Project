package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.Quote;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.QuoteStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface QuoteRepository extends JpaRepository<Quote, UUID> {

    List<Quote> findByWork(Work work);

    @Query("SELECT q FROM Quote q WHERE (:status IS NULL OR q.status = :status) " +
            "AND (:search IS NULL OR LOWER(q.work.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(q.work.client.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(q.work.client.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Quote> search(@Param("status") QuoteStatus status, @Param("search") String search, Pageable pageable);
}
