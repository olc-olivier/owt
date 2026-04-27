package owt.demo.presentation.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.domain.exception.InvalidOperationException;

import java.util.List;
import java.util.Map;

/**
 * Centralized exception handler for all REST controllers.
 *
 * <p>Maps domain and validation exceptions to structured JSON error responses,
 * keeping error bodies consistent with the rest of the API ({@code {"error": "..."}}).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles {@link EntityNotFoundException} — returns HTTP 404.
     *
     * @param ex the exception
     * @return 404 response with {@code {"error": "<message>"}}
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
    }

    /**
     * Handles {@link InvalidOperationException} — returns HTTP 400.
     *
     * @param ex the exception
     * @return 400 response with {@code {"error": "<message>"}}
     */
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidOperation(InvalidOperationException ex) {
        return ResponseEntity.status(400).body(Map.of("error", ex.getMessage()));
    }

    /**
     * Handles bean-validation failures on request bodies ({@code @Valid}).
     *
     * <p>Returns HTTP 400 with a summary message and a list of per-field error descriptions.
     *
     * @param ex the exception thrown by Spring MVC
     * @return 400 response with {@code {"error": "Validation failed", "details": [...]}}
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .toList();
        return ResponseEntity.status(400).body(Map.of(
                "error", "Validation failed",
                "details", details));
    }

    /**
     * Catch-all handler for any unhandled exception — returns HTTP 500.
     *
     * <p>The original message is intentionally not exposed to the caller to
     * prevent information leakage. The full stack trace is logged at ERROR level.
     *
     * @param ex the unexpected exception
     * @return 500 response with a generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
    }
}
