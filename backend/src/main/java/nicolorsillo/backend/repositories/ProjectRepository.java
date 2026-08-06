package nicolorsillo.backend.repositories;

import nicolorsillo.backend.entities.Project;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.entities.Work;
import nicolorsillo.backend.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByWork(Work work);

    List<Project> findBySurveyor(User surveyor);

    @Query("SELECT p FROM Project p WHERE (:status IS NULL OR p.status = :status) " +
            "AND (:search IS NULL OR LOWER(p.work.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(p.work.client.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(p.work.client.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(p.surveyor.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(p.surveyor.surname) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Project> search(@Param("status") ProjectStatus status, @Param("search") String search, Pageable pageable);
}
