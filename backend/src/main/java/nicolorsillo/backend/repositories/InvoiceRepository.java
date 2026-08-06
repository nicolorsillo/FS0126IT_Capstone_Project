package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.Invoice;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByWork(Work work);

    @Query("SELECT i FROM Invoice i WHERE (:status IS NULL OR i.status = :status) " +
            "AND (:search IS NULL OR LOWER(i.work.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(i.work.client.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(i.work.client.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Invoice> search(@Param("status") InvoiceStatus status, @Param("search") String search, Pageable pageable);
}
