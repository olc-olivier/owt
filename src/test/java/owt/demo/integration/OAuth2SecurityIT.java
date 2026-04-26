package owt.demo.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for OAuth2 security configuration.
 *
 * <p>A mock {@link ClientRegistrationRepository} is provided via {@link MockOAuth2Config}
 * so that the application context loads without a running Dex instance.
 * The JWT resource server JWK URI is overridden to a static HTTPS URL; no actual
 * token validation is exercised in these tests.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://example.com/.well-known/jwks.json"
})
class OAuth2SecurityIT {

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
    @DisplayName("Test 1 - GET /api/boats without auth returns 401 or redirects to login")
    void getBoats_withoutAuth_returnsUnauthorizedOrRedirect() throws Exception {
        mockMvc.perform(get("/api/boats"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    if (status != 401 && status != 302) {
                        throw new AssertionError(
                                "Expected status 401 or 302 but got: " + status);
                    }
                });
    }

    @Test
    @DisplayName("Test 2 - GET /api/boats with mock authenticated user returns 200")
    @WithMockUser(username = "admin@example.com", roles = "USER")
    void getBoats_withMockUser_returns200() throws Exception {
        mockMvc.perform(get("/api/boats"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Test 3 - /oauth2/authorization/dex redirects to Dex authorization endpoint")
    void oauth2AuthorizationDex_redirectsToDex() throws Exception {
        mockMvc.perform(get("/oauth2/authorization/dex"))
                .andExpect(status().is3xxRedirection())
                .andExpect(result -> {
                    String location = result.getResponse().getHeader("Location");
                    if (location == null || !location.startsWith("https://example.com/oauth2/authorize")) {
                        throw new AssertionError(
                                "Expected redirect to Dex authorization endpoint but got: " + location);
                    }
                });
    }
}
