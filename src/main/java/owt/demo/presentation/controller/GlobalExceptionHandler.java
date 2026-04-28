package owt.demo.presentation.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.domain.exception.InvalidOperationException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Centralized exception handler for all REST controllers.
 *
 * <p>Maps domain and validation exceptions to structured JSON error responses.
 * Every response body contains at minimum:
 * <ul>
 *   <li>{@code timestamp} – UTC instant the error occurred</li>
 *   <li>{@code status} – HTTP status code</li>
 *   <li>{@code error} – short error description</li>
 *   <li>{@code path} – the request URI that triggered the error</li>
 * </ul>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles {@link EntityNotFoundException} — returns HTTP 404.
     *
     * @param ex      the exception
     * @param request the current HTTP request (used to extract the path)
     * @return 404 response with a structured error body
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFound(
            EntityNotFoundException ex, HttpServletRequest request) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), null, request);
    }

    /**
     * Handles {@link InvalidOperationException} — returns HTTP 400.
     *
     * @param ex      the exception
     * @param request the current HTTP request
     * @return 400 response with a structured error body
     */
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidOperation(
            InvalidOperationException ex, HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), null, request);
    }

    /**
     * Handles bean-validation failures on request bodies ({@code @Valid}).
     *
     * <p>Returns HTTP 400 with a summary message and a list of per-field error descriptions.
     *
     * @param ex      the exception thrown by Spring MVC
     * @param request the current HTTP request
     * @return 400 response with {@code {"error": "Validation failed", "details": [...]}}
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .toList();
        return buildError(HttpStatus.BAD_REQUEST, "Validation failed", details, request);
    }

    /**
     * Catch-all handler for any unhandled exception — returns HTTP 500.
     *
     * <p>The original message is intentionally not exposed to the caller to
     * prevent information leakage. The full stack trace is logged at ERROR level.
     *
     * @param ex      the unexpected exception
     * @param request the current HTTP request
     * @return 500 response with a generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on {}", request.getRequestURI(), ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", null, request);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private ResponseEntity<Map<String, Object>> buildError(
            HttpStatus status, String message, List<String> details, HttpServletRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", message);
        body.put("path", request.getRequestURI());
        if (details != null && !details.isEmpty()) {
            body.put("details", details);
        }
        return ResponseEntity.status(status).body(body);
    }
}
