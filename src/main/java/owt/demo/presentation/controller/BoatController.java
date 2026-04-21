package owt.demo.presentation.controller;

import owt.demo.application.service.BoatService;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/boats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BoatController {
    private final BoatService boatService;

    public BoatController(BoatService boatService) {
        this.boatService = boatService;
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
    public ResponseEntity<List<BoatResponse>> getAllBoats() {
        List<BoatResponse> boats = boatService.getAllBoats();
        return ResponseEntity.ok(boats);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<BoatResponse>> getBoatsByType(@PathVariable String type) {
        List<BoatResponse> boats = boatService.getBoatsByType(type);
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
