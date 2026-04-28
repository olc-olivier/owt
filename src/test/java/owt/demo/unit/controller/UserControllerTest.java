package owt.demo.unit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import owt.demo.application.service.UserService;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.dto.request.CreateUserRequest;
import owt.demo.dto.response.UserResponse;
import owt.demo.presentation.controller.GlobalExceptionHandler;
import owt.demo.presentation.controller.UserController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.security.oauth2.client.autoconfigure.servlet.OAuth2ClientWebSecurityAutoConfiguration;
import org.springframework.boot.security.oauth2.server.resource.autoconfigure.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Unit tests for {@link UserController}.
 *
 * <p>Security auto-configuration is excluded so the controller layer is tested in isolation
 * without an OAuth2/session context.
 */
@WebMvcTest(
        controllers = UserController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                ServletWebSecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class,
                OAuth2ClientWebSecurityAutoConfiguration.class,
                OAuth2ResourceServerAutoConfiguration.class
        }
)
@Import(GlobalExceptionHandler.class)
class UserControllerTest {

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
    private UserService userService;

    // ── POST /api/users ───────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/users with valid request returns 201 with body")
    void createUser_validRequest_returns201() throws Exception {
        CreateUserRequest req = new CreateUserRequest("alice", "secret123", "alice@example.com");
        UserResponse resp = UserResponse.builder().id(1L).username("alice").email("alice@example.com").build();
        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    @DisplayName("POST /api/users with blank username returns 400 with validation details")
    void createUser_blankUsername_returns400() throws Exception {
        CreateUserRequest req = new CreateUserRequest("", "secret123", "alice@example.com");

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    @DisplayName("POST /api/users with invalid email returns 400")
    void createUser_invalidEmail_returns400() throws Exception {
        CreateUserRequest req = new CreateUserRequest("alice", "secret123", "not-an-email");

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }

    // ── GET /api/users ────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/users returns 200 with list of users")
    void getAllUsers_returns200WithList() throws Exception {
        UserResponse u1 = UserResponse.builder().id(1L).username("alice").build();
        UserResponse u2 = UserResponse.builder().id(2L).username("bob").build();
        when(userService.getAllUsers()).thenReturn(List.of(u1, u2));

        mockMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("alice"))
                .andExpect(jsonPath("$[1].username").value("bob"));
    }

    @Test
    @DisplayName("GET /api/users returns 200 with empty list when no users exist")
    void getAllUsers_noUsers_returnsEmptyList() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of());

        mockMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // ── GET /api/users/{id} ───────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/users/{id} returns 200 when user exists")
    void getUser_existingId_returns200() throws Exception {
        UserResponse resp = UserResponse.builder().id(1L).username("alice").build();
        when(userService.getUserById(1L)).thenReturn(resp);

        mockMvc.perform(get("/api/users/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    @DisplayName("GET /api/users/{id} returns 404 when user does not exist")
    void getUser_nonExistingId_returns404() throws Exception {
        when(userService.getUserById(99L)).thenThrow(new EntityNotFoundException("User not found with id: 99"));

        mockMvc.perform(get("/api/users/99").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User not found with id: 99"))
                .andExpect(jsonPath("$.status").value(404));
    }

    // ── GET /api/users/username/{username} ────────────────────────────────────

    @Test
    @DisplayName("GET /api/users/username/{username} returns 200 when user found")
    void getUserByUsername_found_returns200() throws Exception {
        UserResponse resp = UserResponse.builder().id(1L).username("alice").build();
        when(userService.getUserByUsername("alice")).thenReturn(resp);

        mockMvc.perform(get("/api/users/username/alice").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    @DisplayName("GET /api/users/username/{username} returns 404 when not found")
    void getUserByUsername_notFound_returns404() throws Exception {
        when(userService.getUserByUsername("ghost"))
                .thenThrow(new EntityNotFoundException("User not found with username: ghost"));

        mockMvc.perform(get("/api/users/username/ghost").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ── PUT /api/users/{id} ───────────────────────────────────────────────────

    @Test
    @DisplayName("PUT /api/users/{id} returns 200 with updated user")
    void updateUser_validRequest_returns200() throws Exception {
        UserResponse resp = UserResponse.builder().id(1L).username("alice").email("new@example.com").build();
        when(userService.updateUser(eq(1L), any())).thenReturn(resp);

        String body = """
                { "email": "new@example.com" }
                """;

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("new@example.com"));
    }

    @Test
    @DisplayName("PUT /api/users/{id} with invalid email returns 400")
    void updateUser_invalidEmail_returns400() throws Exception {
        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "email": "not-valid" }
                                """))
                .andExpect(status().isBadRequest());
    }

    // ── DELETE /api/users/{id} ────────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /api/users/{id} returns 204 when user exists")
    void deleteUser_existingId_returns204() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    @DisplayName("DELETE /api/users/{id} returns 404 when user does not exist")
    void deleteUser_nonExistingId_returns404() throws Exception {
        doThrow(new EntityNotFoundException("User not found with id: 99"))
                .when(userService).deleteUser(99L);

        mockMvc.perform(delete("/api/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
