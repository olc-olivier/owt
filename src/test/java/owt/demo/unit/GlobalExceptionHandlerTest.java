package owt.demo.unit;

import com.fasterxml.jackson.databind.ObjectMapper;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.domain.exception.InvalidOperationException;
import owt.demo.presentation.controller.GlobalExceptionHandler;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Unit tests for {@link GlobalExceptionHandler}.
 *
 * <p>Uses {@code @WebMvcTest} with a minimal stub controller that deliberately throws
 * each mapped exception type, keeping the Spring context small and startup time fast.
 */
@WebMvcTest(
        controllers = GlobalExceptionHandlerTest.StubController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                ServletWebSecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class,
                OAuth2ClientWebSecurityAutoConfiguration.class,
                OAuth2ResourceServerAutoConfiguration.class
        }
)
@Import({GlobalExceptionHandler.class, GlobalExceptionHandlerTest.StubController.class})
class GlobalExceptionHandlerTest {

    // ── Minimal stub controller — deliberately throws each mapped exception ────

    @RestController
    static class StubController {

        @GetMapping("/stub/entity-not-found")
        public void throwEntityNotFound() {
            throw new EntityNotFoundException("Boat not found with id: 99");
        }

        @GetMapping("/stub/invalid-operation")
        public void throwInvalidOperation() {
            throw new InvalidOperationException("Cannot delete a boat that is currently at sea");
        }

        @PostMapping("/stub/validation")
        public void throwValidation(@Valid @RequestBody ValidatedBody body) {
            // Spring raises MethodArgumentNotValidException before this method body runs
        }

        @GetMapping("/stub/generic-error")
        public void throwGenericError() throws Exception {
            throw new Exception("Something went very wrong");
        }
    }

    /** Minimal request body used to trigger {@code MethodArgumentNotValidException}. */
    static class ValidatedBody {
        @NotBlank(message = "name is required")
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

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

    // ── 1. EntityNotFoundException → 404 ─────────────────────────────────────

    @Test
    @DisplayName("EntityNotFoundException returns 404 with error message in body")
    void entityNotFoundException_returns404WithErrorBody() throws Exception {
        mockMvc.perform(get("/stub/entity-not-found").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Boat not found with id: 99"));
    }

    // ── 2. InvalidOperationException → 400 ───────────────────────────────────

    @Test
    @DisplayName("InvalidOperationException returns 400 with error message in body")
    void invalidOperationException_returns400WithErrorBody() throws Exception {
        mockMvc.perform(get("/stub/invalid-operation").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot delete a boat that is currently at sea"));
    }

    // ── 3. MethodArgumentNotValidException → 400 with details array ──────────

    @Test
    @DisplayName("MethodArgumentNotValidException returns 400 with Validation failed and details array")
    void methodArgumentNotValidException_returns400WithDetails() throws Exception {
        // send a body whose 'name' field is null — triggers @NotBlank
        String blankNameBody = objectMapper.writeValueAsString(new ValidatedBody());

        mockMvc.perform(post("/stub/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(blankNameBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details[0]").value("name: name is required"));
    }

    // ── 4. Generic Exception → 500 ────────────────────────────────────────────

    @Test
    @DisplayName("Unhandled generic Exception returns 500 with generic error message")
    void genericException_returns500WithGenericErrorBody() throws Exception {
        mockMvc.perform(get("/stub/generic-error").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal server error"));
    }
}
