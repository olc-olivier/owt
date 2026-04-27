package owt.demo.presentation.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for form-based authentication.
 *
 * <p>Provides a credential login path ({@code POST /api/auth/login}),
 * a session introspection endpoint ({@code GET /api/auth/me}), and
 * a logout endpoint ({@code POST /api/auth/logout}).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Authenticates the user with username/password credentials.
     *
     * <p>On success a Spring Security session is created and the session
     * cookie is set in the response. Returns HTTP 200 with user info.
     * Returns HTTP 401 on invalid credentials.
     *
     * @param request  the login request body
     * @param httpReq  the HTTP servlet request (used to bind the session)
     * @return authenticated user info or 401
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpReq) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            HttpSession session = httpReq.getSession(true);
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context);

            List<String> roles = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return ResponseEntity.ok(new LoginResponse(auth.getName(), true, roles));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid username or password"));
        }
    }

    /**
     * Returns the currently authenticated user.
     *
     * <p>Works for both session-based (form login) and OAuth2 (Dex) principals.
     * Returns HTTP 401 when no active session exists.
     *
     * @param authentication the Spring Security authentication (injected)
     * @return user info or 401
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String username = resolveUsername(authentication);
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(new LoginResponse(username, true, roles));
    }

    /**
     * Invalidates the current session and clears the security context.
     *
     * @param httpReq  the HTTP servlet request
     * @param httpResp the HTTP servlet response
     * @return HTTP 200 on success
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpReq, HttpServletResponse httpResp) {
        SecurityContextHolder.clearContext();
        HttpSession session = httpReq.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private String resolveUsername(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OidcUser oidcUser) {
            String email = oidcUser.getEmail();
            return email != null ? email : oidcUser.getName();
        }
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return authentication.getName();
    }

    // -------------------------------------------------------------------------
    // Records
    // -------------------------------------------------------------------------

    /**
     * Login request body.
     *
     * @param username the username
     * @param password the password
     */
    public record LoginRequest(String username, String password) {}

    /**
     * Login/me response body.
     *
     * @param username      the authenticated username
     * @param authenticated always {@code true} when returned from a 200 response
     * @param roles         the granted authority names
     */
    public record LoginResponse(String username, boolean authenticated, List<String> roles) {}
}
