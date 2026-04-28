package owt.demo.presentation.controller;

import owt.demo.application.service.BoatService;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.dto.response.BoatStatsResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller exposing CRUD and search operations for the boat fleet.
 *
 * <p>All endpoints are prefixed with {@code /api/boats}.
 * Paginated responses follow the Spring HATEOAS {@link PagedModel} structure.
 */
@RestController
@RequestMapping("/api/boats")
public class BoatController {

    private final BoatService boatService;
    private final PagedResourcesAssembler<BoatResponse> pagedResourcesAssembler;

    public BoatController(BoatService boatService,
                          PagedResourcesAssembler<BoatResponse> pagedResourcesAssembler) {
        this.boatService = boatService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    /**
     * Creates a new boat from the supplied request body.
     *
     * @param request validated creation request
     * @return HTTP 201 with the persisted boat in the body
     */
    @PostMapping
    public ResponseEntity<BoatResponse> createBoat(@Valid @RequestBody CreateBoatRequest request) {
        BoatResponse response = boatService.createBoat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieves a single boat by its identifier.
     *
     * @param id the boat's primary key
     * @return HTTP 200 with the boat body, or HTTP 404 when not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BoatResponse> getBoat(@PathVariable Long id) {
        BoatResponse response = boatService.getBoatById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns a paginated list of all boats.
     *
     * <p>Supports {@code page}, {@code size}, and {@code sort} query parameters.
     * Defaults to page 0, size 20.
     *
     * @param pageable pagination and sort parameters resolved from the request
     * @return HTTP 200 with a HATEOAS paged model
     */
    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<BoatResponse>>> getAllBoats(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<BoatResponse> page = boatService.getAllBoats(pageable);
        PagedModel<EntityModel<BoatResponse>> model = pagedResourcesAssembler.toModel(page);
        return ResponseEntity.ok(model);
    }

    /**
     * Returns aggregate statistics for the entire boat fleet.
     *
     * @return HTTP 200 with total count, combined capacity, average length, and distinct owner count
     */
    @GetMapping("/stats")
    public ResponseEntity<BoatStatsResponse> getStats() {
        return ResponseEntity.ok(boatService.getStats());
    }

    /**
     * Returns all boats whose description exactly matches the query parameter value.
     *
     * @param description the description to search for
     * @return HTTP 200 with the list of matching boats (may be empty)
     */
    @GetMapping("/search/description")
    public ResponseEntity<List<BoatResponse>> getBoatsByDescription(
            @RequestParam String description) {
        List<BoatResponse> boats = boatService.getBoatsByDescription(description);
        return ResponseEntity.ok(boats);
    }

    /**
     * Returns all boats owned by the specified owner.
     *
     * @param ownerName the owner name to search for
     * @return HTTP 200 with the list of matching boats (may be empty)
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<BoatResponse>> getBoatsByOwner(
            @RequestParam String ownerName) {
        List<BoatResponse> boats = boatService.getBoatsByOwner(ownerName);
        return ResponseEntity.ok(boats);
    }

    /**
     * Applies a partial update to an existing boat.
     *
     * @param id      the identifier of the boat to update
     * @param request validated partial update request
     * @return HTTP 200 with the updated boat, or HTTP 404 when not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BoatResponse> updateBoat(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBoatRequest request) {
        BoatResponse response = boatService.updateBoat(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes the boat with the given identifier.
     *
     * @param id the identifier of the boat to delete
     * @return HTTP 204 on success, or HTTP 404 when not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoat(@PathVariable Long id) {
        boatService.deleteBoat(id);
        return ResponseEntity.noContent().build();
    }
}
