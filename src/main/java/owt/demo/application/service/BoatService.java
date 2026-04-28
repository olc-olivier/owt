package owt.demo.application.service;

import owt.demo.domain.model.Boat;
import owt.demo.domain.repository.BoatRepository;
import owt.demo.domain.repository.BoatStatsRow;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.dto.response.BoatStatsResponse;
import owt.demo.mapper.BoatMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Application service that encapsulates all business operations for the boat fleet.
 *
 * <p>All write operations run inside a read-write transaction; read-only operations
 * are annotated with {@code @Transactional(readOnly = true)} to allow the underlying
 * JPA provider to apply read-optimised connection and cache strategies.
 */
@Service
@Transactional
public class BoatService {

    private final BoatRepository boatRepository;
    private final BoatMapper boatMapper;

    public BoatService(BoatRepository boatRepository, BoatMapper boatMapper) {
        this.boatRepository = boatRepository;
        this.boatMapper = boatMapper;
    }

    /**
     * Persists a new boat built from the supplied creation request.
     *
     * @param request the validated creation request containing boat attributes
     * @return the persisted boat represented as a {@link BoatResponse}
     */
    public BoatResponse createBoat(CreateBoatRequest request) {
        Boat boat = boatMapper.toEntity(request);
        Boat saved = boatRepository.save(boat);
        return boatMapper.toResponse(saved);
    }

    /**
     * Retrieves a single boat by its primary key.
     *
     * @param id the boat identifier
     * @return the boat response
     * @throws EntityNotFoundException when no boat exists with the given id
     */
    @Transactional(readOnly = true)
    public BoatResponse getBoatById(Long id) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + id));
        return boatMapper.toResponse(boat);
    }

    /**
     * Returns a paginated view of all boats ordered according to the supplied {@link Pageable}.
     *
     * @param pageable pagination and sort parameters
     * @return a page of boat responses
     */
    @Transactional(readOnly = true)
    public Page<BoatResponse> getAllBoats(Pageable pageable) {
        return boatRepository.findAll(pageable).map(boatMapper::toResponse);
    }

    /**
     * Returns all boats whose description exactly matches the given value.
     *
     * @param description the exact description string to filter by
     * @return a list of matching boat responses, or an empty list
     */
    @Transactional(readOnly = true)
    public List<BoatResponse> getBoatsByDescription(String description) {
        return boatRepository.findByDescription(description).stream()
                .map(boatMapper::toResponse)
                .toList();
    }

    /**
     * Returns all boats owned by the specified owner.
     *
     * @param ownerName the exact owner name to filter by
     * @return a list of matching boat responses, or an empty list
     */
    @Transactional(readOnly = true)
    public List<BoatResponse> getBoatsByOwner(String ownerName) {
        return boatRepository.findByOwnerName(ownerName).stream()
                .map(boatMapper::toResponse)
                .toList();
    }

    /**
     * Applies a partial update to an existing boat.
     *
     * <p>Only non-null fields in the request are applied; null fields are left unchanged.
     *
     * @param id      the identifier of the boat to update
     * @param request the partial update request
     * @return the updated boat response
     * @throws EntityNotFoundException when no boat exists with the given id
     */
    public BoatResponse updateBoat(Long id, UpdateBoatRequest request) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + id));
        boatMapper.updateEntityFromRequest(request, boat);
        Boat updated = boatRepository.save(boat);
        return boatMapper.toResponse(updated);
    }

    /**
     * Computes aggregate statistics over the entire boat fleet.
     *
     * <p>Returns total count, combined capacity, average length, and the number of
     * distinct owners in a single database query.
     *
     * @return fleet-wide statistics
     */
    @Transactional(readOnly = true)
    public BoatStatsResponse getStats() {
        List<BoatStatsRow> rows = boatRepository.computeStats();
        if (rows.isEmpty()) {
            return new BoatStatsResponse(0L, 0L, 0.0, 0L);
        }
        BoatStatsRow row = rows.get(0);
        return new BoatStatsResponse(
                row.totalBoats(),
                row.totalCapacity() != null ? row.totalCapacity() : 0L,
                row.avgLength() != null ? row.avgLength() : 0.0,
                row.uniqueOwners()
        );
    }

    /**
     * Deletes the boat with the given identifier.
     *
     * @param id the identifier of the boat to delete
     * @throws EntityNotFoundException when no boat exists with the given id
     */
    public void deleteBoat(Long id) {
        if (!boatRepository.existsById(id)) {
            throw new EntityNotFoundException("Boat not found with id: " + id);
        }
        boatRepository.deleteById(id);
    }
}
