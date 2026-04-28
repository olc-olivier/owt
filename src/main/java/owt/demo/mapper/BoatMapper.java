package owt.demo.mapper;

import owt.demo.domain.model.Boat;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import org.springframework.stereotype.Component;

/**
 * Maps between the {@link Boat} JPA entity and its request/response DTOs.
 *
 * <p>All conversions are pure functions — no database access is performed here.
 * Partial updates via {@link #updateEntityFromRequest(UpdateBoatRequest, Boat)}
 * only modify fields that are non-null in the request.
 */
@Component
public class BoatMapper {

    /**
     * Converts a {@link CreateBoatRequest} to a new, unsaved {@link Boat} entity.
     *
     * @param request the validated creation request
     * @return a new {@link Boat} instance (not yet persisted)
     */
    public Boat toEntity(CreateBoatRequest request) {
        return Boat.builder()
                .name(request.getName())
                .description(request.getDescription())
                .length(request.getLength())
                .capacity(request.getCapacity())
                .yearBuilt(request.getYearBuilt())
                .ownerName(request.getOwnerName())
                .build();
    }

    /**
     * Converts a persisted {@link Boat} entity to a {@link BoatResponse} DTO,
     * including auditing fields populated by Spring Data.
     *
     * @param boat the persisted entity
     * @return the response DTO
     */
    public BoatResponse toResponse(Boat boat) {
        return BoatResponse.builder()
                .id(boat.getId())
                .name(boat.getName())
                .description(boat.getDescription())
                .length(boat.getLength())
                .capacity(boat.getCapacity())
                .yearBuilt(boat.getYearBuilt())
                .ownerName(boat.getOwnerName())
                .createdBy(boat.getCreatedBy())
                .createdDate(boat.getCreatedDate())
                .lastModifiedBy(boat.getLastModifiedBy())
                .lastModifiedDate(boat.getLastModifiedDate())
                .build();
    }

    /**
     * Applies non-null fields from a {@link UpdateBoatRequest} to an existing {@link Boat} entity.
     * Null fields in the request are ignored, leaving the entity's current value unchanged.
     *
     * @param request the partial update request
     * @param boat    the entity to mutate in place
     */
    public void updateEntityFromRequest(UpdateBoatRequest request, Boat boat) {
        if (request.getName() != null) {
            boat.setName(request.getName());
        }
        if (request.getDescription() != null) {
            boat.setDescription(request.getDescription());
        }
        if (request.getLength() != null) {
            boat.setLength(request.getLength());
        }
        if (request.getCapacity() != null) {
            boat.setCapacity(request.getCapacity());
        }
        if (request.getYearBuilt() != null) {
            boat.setYearBuilt(request.getYearBuilt());
        }
        if (request.getOwnerName() != null) {
            boat.setOwnerName(request.getOwnerName());
        }
    }
}
