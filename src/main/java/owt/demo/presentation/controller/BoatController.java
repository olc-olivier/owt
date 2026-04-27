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
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/boats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BoatController {
    private final BoatService boatService;
    private final PagedResourcesAssembler<BoatResponse> pagedResourcesAssembler;

    public BoatController(BoatService boatService, PagedResourcesAssembler<BoatResponse> pagedResourcesAssembler) {
        this.boatService = boatService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @PostMapping
    public ResponseEntity<BoatResponse> createBoat(@Valid @RequestBody CreateBoatRequest request) {
        BoatResponse response = boatService.createBoat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoatResponse> getBoat(@PathVariable Long id) {
        BoatResponse response = boatService.getBoatById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<BoatResponse>>> getAllBoats(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<BoatResponse> page = boatService.getAllBoats(pageable);
        PagedModel<EntityModel<BoatResponse>> model = pagedResourcesAssembler.toModel(page);
        return ResponseEntity.ok(model);
    }

    @GetMapping("/stats")
    public ResponseEntity<BoatStatsResponse> getStats() {
        return ResponseEntity.ok(boatService.getStats());
    }

    @GetMapping("/description/{description}")
    public ResponseEntity<List<BoatResponse>> getBoatsByDescription(@PathVariable String description) {
        List<BoatResponse> boats = boatService.getBoatsByDescription(description);
        return ResponseEntity.ok(boats);
    }

    @GetMapping("/owner/{ownerName}")
    public ResponseEntity<List<BoatResponse>> getBoatsByOwner(@PathVariable String ownerName) {
        List<BoatResponse> boats = boatService.getBoatsByOwner(ownerName);
        return ResponseEntity.ok(boats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoatResponse> updateBoat(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBoatRequest request) {
        BoatResponse response = boatService.updateBoat(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoat(@PathVariable Long id) {
        boatService.deleteBoat(id);
        return ResponseEntity.noContent().build();
    }
}
