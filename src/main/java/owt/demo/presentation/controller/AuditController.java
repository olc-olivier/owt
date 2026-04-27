package owt.demo.presentation.controller;

import owt.demo.domain.model.Boat;
import owt.demo.dto.response.BoatRevisionDTO;
import owt.demo.mapper.BoatMapper;
import jakarta.persistence.EntityManager;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuditController {

    private final EntityManager entityManager;
    private final BoatMapper boatMapper;

    public AuditController(EntityManager entityManager, BoatMapper boatMapper) {
        this.entityManager = entityManager;
        this.boatMapper = boatMapper;
    }

    @GetMapping("/boats/{id}/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BoatRevisionDTO>> getBoatHistory(@PathVariable Long id) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        @SuppressWarnings("unchecked")
        List<Object[]> results = reader.createQuery()
                .forRevisionsOfEntity(Boat.class, false, true)
                .add(AuditEntity.id().eq(id))
                .getResultList();

        List<BoatRevisionDTO> history = results.stream()
                .map(row -> {
                    Boat boat = (Boat) row[0];
                    org.hibernate.envers.DefaultRevisionEntity revEntity =
                            (org.hibernate.envers.DefaultRevisionEntity) row[1];
                    org.hibernate.envers.RevisionType revType =
                            (org.hibernate.envers.RevisionType) row[2];

                    Instant revDate = Instant.ofEpochMilli(revEntity.getRevisionDate().getTime());
                    String typeName = switch (revType) {
                        case ADD -> "ADD";
                        case MOD -> "MOD";
                        case DEL -> "DEL";
                    };

                    return new BoatRevisionDTO(
                            revEntity.getId(),
                            revDate,
                            typeName,
                            boatMapper.toResponse(boat)
                    );
                })
                .toList();

        return ResponseEntity.ok(history);
    }
}
