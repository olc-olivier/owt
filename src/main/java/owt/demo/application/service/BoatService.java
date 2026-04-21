package owt.demo.application.service;

import owt.demo.domain.model.Boat;
import owt.demo.domain.repository.BoatRepository;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.mapper.BoatMapper;
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

    public List<BoatResponse> getAllBoats() {
        return boatRepository.findAll().stream()
                .map(boatMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BoatResponse> getBoatsByType(String type) {
        return boatRepository.findByType(type).stream()
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

    public void deleteBoat(Long id) {
        if (!boatRepository.existsById(id)) {
            throw new EntityNotFoundException("Boat not found with id: " + id);
        }
        boatRepository.deleteById(id);
    }
}
