package owt.demo.unit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import owt.demo.application.service.BoatService;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.presentation.controller.BoatController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = BoatController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                ServletWebSecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class
        }
)
class BoatControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private BoatService boatService;

    // ── UC2 – Paginated list ──────────────────────────────────────────────────

    @Test
    @DisplayName("UC2 – GET /api/boats with no params returns page 0, size 20 by default")
    void getAllBoats_noParams_returnsDefaultPage() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(
                List.of(buildBoatResponse(1L), buildBoatResponse(2L)),
                PageRequest.of(0, 20),
                2
        );
        when(boatService.getAllBoats(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/boats").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.size").value(20))
                .andExpect(jsonPath("$.page.totalElements").value(2));
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?size=5 respects requested page size")
    void getAllBoats_withSizeParam_returnsRequestedPageSize() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(
                List.of(buildBoatResponse(1L)),
                PageRequest.of(0, 5),
                1
        );
        when(boatService.getAllBoats(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("size", "5").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.size").value(5));
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?page=1&size=5 returns page 1 with prev link")
    void getAllBoats_secondPage_containsPrevLink() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(
                List.of(buildBoatResponse(6L)),
                PageRequest.of(1, 5),
                10
        );
        when(boatService.getAllBoats(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("page", "1").param("size", "5")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$._links.prev").exists());
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?sort=name,asc forwards ascending sort to service")
    void getAllBoats_sortByNameAsc_pageableHasAscendingNameSort() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(List.of(), PageRequest.of(0, 20, Sort.by("name").ascending()), 0);
        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        when(boatService.getAllBoats(captor.capture())).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("sort", "name,asc").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Sort.Order order = captor.getValue().getSort().getOrderFor("name");
        assertThat(order).isNotNull();
        assertThat(order.getDirection()).isEqualTo(Sort.Direction.ASC);
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?sort=name,desc forwards descending sort to service")
    void getAllBoats_sortByNameDesc_pageableHasDescendingNameSort() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(List.of(), PageRequest.of(0, 20, Sort.by("name").descending()), 0);
        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        when(boatService.getAllBoats(captor.capture())).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("sort", "name,desc").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Sort.Order order = captor.getValue().getSort().getOrderFor("name");
        assertThat(order).isNotNull();
        assertThat(order.getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?sort=type,asc&sort=name,desc forwards multi-field sort to service")
    void getAllBoats_multiFieldSort_pageableHasTwoSortOrders() throws Exception {
        Sort multiSort = Sort.by(Sort.Order.asc("type"), Sort.Order.desc("name"));
        Page<BoatResponse> page = new PageImpl<>(List.of(), PageRequest.of(0, 20, multiSort), 0);
        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        when(boatService.getAllBoats(captor.capture())).thenReturn(page);

        mockMvc.perform(get("/api/boats")
                        .param("sort", "type,asc")
                        .param("sort", "name,desc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        List<Sort.Order> orders = captor.getValue().getSort().toList();
        assertThat(orders).hasSize(2);
        assertThat(orders.get(0).getProperty()).isEqualTo("type");
        assertThat(orders.get(0).getDirection()).isEqualTo(Sort.Direction.ASC);
        assertThat(orders.get(1).getProperty()).isEqualTo("name");
        assertThat(orders.get(1).getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    @DisplayName("UC2 – Last page response has no _links.next")
    void getAllBoats_lastPage_hasNoNextLink() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(
                List.of(buildBoatResponse(1L)),
                PageRequest.of(1, 5),
                6
        );
        when(boatService.getAllBoats(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("page", "1").param("size", "5")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._links.next").doesNotExist());
    }

    @Test
    @DisplayName("UC2 – GET /api/boats?page=9999 returns 200 with empty content")
    void getAllBoats_pageOutOfRange_returns200WithEmptyContent() throws Exception {
        Page<BoatResponse> page = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(9999, 20),
                0
        );
        when(boatService.getAllBoats(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/boats").param("page", "9999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded").doesNotExist());
    }

    // ── UC3 – Create / Update / Delete ────────────────────────────────────────

    @Test
    @DisplayName("UC3 – POST /api/boats creates a boat and returns 201")
    void createBoat_validRequest_returns201WithBody() throws Exception {
        CreateBoatRequest request = new CreateBoatRequest("Titanic", "Ocean liner", 269.0, 2224, 1912, "White Star");
        BoatResponse response = buildBoatResponse(1L);
        when(boatService.createBoat(any(CreateBoatRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/boats")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("UC3 – PUT /api/boats/{id} updates a boat and returns 200")
    void updateBoat_validRequest_returns200WithUpdatedBody() throws Exception {
        UpdateBoatRequest request = new UpdateBoatRequest("Titanic II", "Rebuilt liner", 270.0, 2300, 2022, "Blue Star");
        BoatResponse response = buildBoatResponse(1L);
        when(boatService.updateBoat(eq(1L), any(UpdateBoatRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/boats/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("UC3 – DELETE /api/boats/{id} deletes a boat and returns 204")
    void deleteBoat_existingId_returns204() throws Exception {
        doNothing().when(boatService).deleteBoat(1L);

        mockMvc.perform(delete("/api/boats/1"))
                .andExpect(status().isNoContent());

        verify(boatService).deleteBoat(1L);
    }

    // ── UC4 – Detail view ─────────────────────────────────────────────────────

    @Test
    @DisplayName("UC4 – GET /api/boats/{id} returns boat detail")
    void getBoat_existingId_returnsBoatDetail() throws Exception {
        BoatResponse response = buildBoatResponse(1L);
        when(boatService.getBoatById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/boats/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Titanic"))
                .andExpect(jsonPath("$.ownerName").value("White Star"));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private BoatResponse buildBoatResponse(Long id) {
        return BoatResponse.builder()
                .id(id)
                .name("Titanic")
                .description("A large ocean liner")
                .length(269.0)
                .capacity(2224)
                .yearBuilt(1912)
                .ownerName("White Star")
                .build();
    }
}
