package owt.demo.application.service;

import owt.demo.domain.model.Boat;
import owt.demo.domain.repository.BoatRepository;
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
import java.util.stream.Collectors;

@Service
@Transactional
public class BoatService {
    private final BoatRepository boatRepository;
    private final BoatMapper boatMapper;

    public BoatService(BoatRepository boatRepository, BoatMapper boatMapper) {
        this.boatRepository = boatRepository;
        this.boatMapper = boatMapper;
    }

    public BoatResponse createBoat(CreateBoatRequest request) {
        Boat boat = boatMapper.toEntity(request);
        Boat saved = boatRepository.save(boat);
        return boatMapper.toResponse(saved);
    }

    public BoatResponse getBoatById(Long id) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + id));
        return boatMapper.toResponse(boat);
    }

    public Page<BoatResponse> getAllBoats(Pageable pageable) {
        return boatRepository.findAll(pageable).map(boatMapper::toResponse);
    }

    public List<BoatResponse> getBoatsByDescription(String description) {
        return boatRepository.findByDescription(description).stream()
                .map(boatMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BoatResponse> getBoatsByOwner(String ownerName) {
        return boatRepository.findByOwnerName(ownerName).stream()
                .map(boatMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BoatResponse updateBoat(Long id, UpdateBoatRequest request) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + id));
        boatMapper.updateEntityFromRequest(request, boat);
        Boat updated = boatRepository.save(boat);
        return boatMapper.toResponse(updated);
    }

    public BoatStatsResponse getStats() {
        Object[] row = boatRepository.computeStats().get(0);
        return new BoatStatsResponse(
                ((Number) row[0]).longValue(),
                row[1] != null ? ((Number) row[1]).longValue() : 0L,
                row[2] != null ? ((Number) row[2]).doubleValue() : 0.0,
                ((Number) row[3]).longValue()
        );
    }

    public void deleteBoat(Long id) {
        if (!boatRepository.existsById(id)) {
            throw new EntityNotFoundException("Boat not found with id: " + id);
        }
        boatRepository.deleteById(id);
    }
}
