package owt.demo.unit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import owt.demo.application.service.BoatService;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import owt.demo.presentation.controller.BoatController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
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

    private BoatResponse buildBoatResponse(Long id) {
        return BoatResponse.builder()
                .id(id)
                .name("Titanic")
                .description("A large ocean liner")
                .length(269.0)
                .capacity(2224)
                .yearBuilt(1912)
                .ownerName("White Star Line")
                .build();
    }

    // --- UC2: paginated list of all boats (GET /api/boats) ---

    @Test
    @DisplayName("UC2 - should return 200 with list of boats when GET /api/boats")
    void shouldReturnAllBoats() throws Exception {
        BoatResponse boat1 = buildBoatResponse(1L);
        BoatResponse boat2 = BoatResponse.builder()
                .id(2L)
                .name("Nina")
                .description("A small caravel")
                .length(20.0)
                .capacity(40)
                .yearBuilt(1492)
                .ownerName("Columbus")
                .build();

        when(boatService.getAllBoats()).thenReturn(List.of(boat1, boat2));

        mockMvc.perform(get("/api/boats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Titanic"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Nina"));
    }

    @Test
    @DisplayName("UC2 - should return 200 with empty list when no boats exist")
    void shouldReturnEmptyListWhenNoBoats() throws Exception {
        when(boatService.getAllBoats()).thenReturn(List.of());

        mockMvc.perform(get("/api/boats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // --- UC3: create a boat (POST /api/boats) ---

    @Test
    @DisplayName("UC3 - should return 201 with created boat when POST /api/boats")
    void shouldCreateBoat() throws Exception {
        CreateBoatRequest request = CreateBoatRequest.builder()
                .name("Titanic")
                .description("A large ocean liner")
                .length(269.0)
                .capacity(2224)
                .yearBuilt(1912)
                .ownerName("White Star Line")
                .build();

        BoatResponse response = buildBoatResponse(1L);

        when(boatService.createBoat(any(CreateBoatRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/boats")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Titanic"))
                .andExpect(jsonPath("$.description").value("A large ocean liner"))
                .andExpect(jsonPath("$.length").value(269.0))
                .andExpect(jsonPath("$.capacity").value(2224))
                .andExpect(jsonPath("$.yearBuilt").value(1912))
                .andExpect(jsonPath("$.ownerName").value("White Star Line"));
    }

    // --- UC3: update a boat (PUT /api/boats/{id}) ---

    @Test
    @DisplayName("UC3 - should return 200 with updated boat when PUT /api/boats/{id}")
    void shouldUpdateBoat() throws Exception {
        UpdateBoatRequest request = UpdateBoatRequest.builder()
                .name("Titanic II")
                .description("A rebuilt ocean liner")
                .length(270.0)
                .capacity(2300)
                .yearBuilt(2022)
                .ownerName("Blue Star Line")
                .build();

        BoatResponse response = BoatResponse.builder()
                .id(1L)
                .name("Titanic II")
                .description("A rebuilt ocean liner")
                .length(270.0)
                .capacity(2300)
                .yearBuilt(2022)
                .ownerName("Blue Star Line")
                .build();

        when(boatService.updateBoat(eq(1L), any(UpdateBoatRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/boats/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Titanic II"))
                .andExpect(jsonPath("$.description").value("A rebuilt ocean liner"))
                .andExpect(jsonPath("$.capacity").value(2300))
                .andExpect(jsonPath("$.ownerName").value("Blue Star Line"));
    }

    // --- UC3: delete a boat (DELETE /api/boats/{id}) ---

    @Test
    @DisplayName("UC3 - should return 204 when DELETE /api/boats/{id}")
    void shouldDeleteBoat() throws Exception {
        doNothing().when(boatService).deleteBoat(1L);

        mockMvc.perform(delete("/api/boats/1"))
                .andExpect(status().isNoContent());
    }

    // --- UC4: get boat detail (GET /api/boats/{id}) ---

    @Test
    @DisplayName("UC4 - should return 200 with boat detail when GET /api/boats/{id}")
    void shouldReturnBoatById() throws Exception {
        BoatResponse response = buildBoatResponse(1L);

        when(boatService.getBoatById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/boats/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Titanic"))
                .andExpect(jsonPath("$.description").value("A large ocean liner"))
                .andExpect(jsonPath("$.length").value(269.0))
                .andExpect(jsonPath("$.capacity").value(2224))
                .andExpect(jsonPath("$.yearBuilt").value(1912))
                .andExpect(jsonPath("$.ownerName").value("White Star Line"));
    }
}
