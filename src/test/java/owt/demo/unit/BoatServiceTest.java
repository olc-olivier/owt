package owt.demo.unit;

import owt.demo.application.service.BoatService;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.domain.model.Boat;
import owt.demo.domain.repository.BoatRepository;
import owt.demo.domain.repository.BoatStatsRow;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.dto.response.BoatStatsResponse;
import owt.demo.mapper.BoatMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link BoatService}.
 *
 * <p>The repository and mapper are mocked via Mockito so no Spring context
 * or database is required.
 */
@ExtendWith(MockitoExtension.class)
class BoatServiceTest {

    @Mock
    private BoatRepository boatRepository;

    @Mock
    private BoatMapper boatMapper;

    @InjectMocks
    private BoatService boatService;

    private Boat boat;
    private BoatResponse boatResponse;

    @BeforeEach
    void setUp() {
        boat = Boat.builder()
                .id(1L)
                .name("Titanic")
                .description("Ocean liner")
                .length(269.0)
                .capacity(2224)
                .yearBuilt(1912)
                .ownerName("White Star")
                .build();

        boatResponse = BoatResponse.builder()
                .id(1L)
                .name("Titanic")
                .description("Ocean liner")
                .length(269.0)
                .capacity(2224)
                .yearBuilt(1912)
                .ownerName("White Star")
                .build();
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createBoat: persists entity and returns mapped response")
    void createBoat_validRequest_persistsAndReturnsResponse() {
        CreateBoatRequest request = new CreateBoatRequest(
                "Titanic", "Ocean liner", 269.0, 2224, 1912, "White Star");

        when(boatMapper.toEntity(request)).thenReturn(boat);
        when(boatRepository.save(boat)).thenReturn(boat);
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        BoatResponse result = boatService.createBoat(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Titanic");
        verify(boatRepository).save(boat);
    }

    // ── getById ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getBoatById: returns response when boat exists")
    void getBoatById_existingId_returnsResponse() {
        when(boatRepository.findById(1L)).thenReturn(Optional.of(boat));
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        BoatResponse result = boatService.getBoatById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getBoatById: throws EntityNotFoundException when boat does not exist")
    void getBoatById_nonExistingId_throwsEntityNotFoundException() {
        when(boatRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> boatService.getBoatById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── getAll ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllBoats: returns paginated response mapped from repository page")
    void getAllBoats_returnsPageOfResponses() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Boat> boatPage = new PageImpl<>(List.of(boat), pageable, 1);

        when(boatRepository.findAll(pageable)).thenReturn(boatPage);
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        Page<BoatResponse> result = boatService.getAllBoats(pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo(1L);
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateBoat: updates existing boat and returns updated response")
    void updateBoat_existingId_returnsUpdatedResponse() {
        UpdateBoatRequest request = new UpdateBoatRequest(
                "Titanic II", null, null, null, null, null);

        when(boatRepository.findById(1L)).thenReturn(Optional.of(boat));
        doNothing().when(boatMapper).updateEntityFromRequest(request, boat);
        when(boatRepository.save(boat)).thenReturn(boat);
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        BoatResponse result = boatService.updateBoat(1L, request);

        assertThat(result).isNotNull();
        verify(boatMapper).updateEntityFromRequest(request, boat);
        verify(boatRepository).save(boat);
    }

    @Test
    @DisplayName("updateBoat: throws EntityNotFoundException when boat does not exist")
    void updateBoat_nonExistingId_throwsEntityNotFoundException() {
        UpdateBoatRequest request = new UpdateBoatRequest(null, null, null, null, null, null);
        when(boatRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> boatService.updateBoat(99L, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(boatRepository, never()).save(any());
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteBoat: deletes boat when it exists")
    void deleteBoat_existingId_deletesSuccessfully() {
        when(boatRepository.existsById(1L)).thenReturn(true);
        doNothing().when(boatRepository).deleteById(1L);

        boatService.deleteBoat(1L);

        verify(boatRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteBoat: throws EntityNotFoundException when boat does not exist")
    void deleteBoat_nonExistingId_throwsEntityNotFoundException() {
        when(boatRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> boatService.deleteBoat(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(boatRepository, never()).deleteById(any());
    }

    // ── getStats ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getStats: returns computed fleet statistics")
    void getStats_withData_returnsCorrectStats() {
        BoatStatsRow row = new BoatStatsRow(30L, 5000L, 15.5, 8L);
        when(boatRepository.computeStats()).thenReturn(List.of(row));

        BoatStatsResponse stats = boatService.getStats();

        assertThat(stats.totalBoats()).isEqualTo(30L);
        assertThat(stats.totalCapacity()).isEqualTo(5000L);
        assertThat(stats.avgLength()).isEqualTo(15.5);
        assertThat(stats.uniqueOwners()).isEqualTo(8L);
    }

    @Test
    @DisplayName("getStats: handles null capacity and avgLength when table is empty")
    void getStats_withNullAggregates_defaultsToZero() {
        BoatStatsRow row = new BoatStatsRow(0L, null, null, 0L);
        when(boatRepository.computeStats()).thenReturn(List.of(row));

        BoatStatsResponse stats = boatService.getStats();

        assertThat(stats.totalBoats()).isEqualTo(0L);
        assertThat(stats.totalCapacity()).isEqualTo(0L);
        assertThat(stats.avgLength()).isEqualTo(0.0);
        assertThat(stats.uniqueOwners()).isEqualTo(0L);
    }

    @Test
    @DisplayName("getStats: returns zero-value response when computeStats returns an empty list")
    void getStats_emptyResultList_returnsZeroValues() {
        when(boatRepository.computeStats()).thenReturn(List.of());

        BoatStatsResponse stats = boatService.getStats();

        assertThat(stats.totalBoats()).isEqualTo(0L);
        assertThat(stats.totalCapacity()).isEqualTo(0L);
        assertThat(stats.avgLength()).isEqualTo(0.0);
        assertThat(stats.uniqueOwners()).isEqualTo(0L);
    }

    // ── getByDescription / getByOwner ──────────────────────────────────────────

    @Test
    @DisplayName("getBoatsByDescription: returns mapped responses for matching boats")
    void getBoatsByDescription_returnsMatches() {
        when(boatRepository.findByDescription("Ocean liner")).thenReturn(List.of(boat));
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        List<BoatResponse> result = boatService.getBoatsByDescription("Ocean liner");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescription()).isEqualTo("Ocean liner");
    }

    @Test
    @DisplayName("getBoatsByDescription: returns empty list when no match")
    void getBoatsByDescription_noMatch_returnsEmptyList() {
        when(boatRepository.findByDescription("unknown")).thenReturn(List.of());

        List<BoatResponse> result = boatService.getBoatsByDescription("unknown");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("getBoatsByOwner: returns mapped responses for matching boats")
    void getBoatsByOwner_returnsMatches() {
        when(boatRepository.findByOwnerName("White Star")).thenReturn(List.of(boat));
        when(boatMapper.toResponse(boat)).thenReturn(boatResponse);

        List<BoatResponse> result = boatService.getBoatsByOwner("White Star");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOwnerName()).isEqualTo("White Star");
    }

    @Test
    @DisplayName("getBoatsByOwner: returns empty list when no match")
    void getBoatsByOwner_noMatch_returnsEmptyList() {
        when(boatRepository.findByOwnerName("nobody")).thenReturn(List.of());

        List<BoatResponse> result = boatService.getBoatsByOwner("nobody");

        assertThat(result).isEmpty();
    }
}
