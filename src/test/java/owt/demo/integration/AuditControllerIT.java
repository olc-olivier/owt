package owt.demo.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for {@link owt.demo.presentation.controller.AuditController}.
 *
 * <p>A mock {@link ClientRegistrationRepository} is provided so the context loads
 * without a running Dex instance. Tests exercise the revision-history endpoint
 * against the H2 in-memory database pre-loaded with sample data.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://example.com/.well-known/jwks.json"
})
class AuditControllerIT {

    @TestConfiguration
    static class MockOAuth2Config {

        @Bean
        ClientRegistrationRepository clientRegistrationRepository() {
            ClientRegistration dex = ClientRegistration
                    .withRegistrationId("dex")
                    .clientId("boats-app")
                    .clientSecret("boats-app-secret")
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                    .scope("openid", "profile", "email")
                    .authorizationUri("https://example.com/oauth2/authorize")
                    .tokenUri("https://example.com/oauth2/token")
                    .userInfoUri("https://example.com/userinfo")
                    .userNameAttributeName(IdTokenClaimNames.SUB)
                    .jwkSetUri("https://example.com/.well-known/jwks.json")
                    .clientName("Dex")
                    .issuerUri("https://example.com")
                    .build();
            return new InMemoryClientRegistrationRepository(dex);
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/audit/boats/{id}/history without auth returns 401 or 302")
    void getBoatHistory_withoutAuth_returnsUnauthorizedOrRedirect() throws Exception {
        mockMvc.perform(get("/api/audit/boats/1/history"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    if (status != 401 && status != 302 && status != 403) {
                        throw new AssertionError(
                                "Expected 401, 403, or 302 but got: " + status);
                    }
                });
    }

    @Test
    @DisplayName("GET /api/audit/boats/{id}/history with ADMIN role returns 200 with array")
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getBoatHistory_withAdminRole_returnsHistoryArray() throws Exception {
        // Boat with id=1 is pre-loaded by data.sql; Envers may or may not have
        // a revision for it depending on schema initialisation order, so we only
        // assert the response shape (HTTP 200 + JSON array).
        mockMvc.perform(get("/api/audit/boats/1/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/audit/boats/{id}/history with USER role returns 403")
    @WithMockUser(username = "user", roles = "USER")
    void getBoatHistory_withUserRole_returnsForbidden() throws Exception {
        mockMvc.perform(get("/api/audit/boats/1/history"))
                .andExpect(status().isForbidden());
    }
}
