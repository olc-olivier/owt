package owt.demo.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import owt.demo.domain.model.Role;
import owt.demo.domain.model.User;
import owt.demo.dto.request.CreateUserRequest;
import owt.demo.dto.request.UpdateUserRequest;
import owt.demo.dto.response.UserResponse;

/**
 * Converts between {@link User} JPA entities and their request/response DTOs.
 *
 * <p>Password hashing is delegated to the injected {@link PasswordEncoder}
 * (BCrypt-12) so that raw passwords are never stored in the database.
 */
@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Builds a new {@link User} entity from the creation request.
     * The password is hashed before being stored.
     *
     * @param request the validated creation request
     * @return a new, un-persisted {@link User} entity
     */
    public User toEntity(CreateUserRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    /**
     * Maps a {@link User} entity to a safe response DTO.
     * The password field is intentionally omitted.
     *
     * @param user the entity to map
     * @return the corresponding {@link UserResponse}
     */
    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.getEnabled())
                .build();
    }

    /**
     * Applies a partial update to the given user entity.
     *
     * <p>Only non-null fields are applied. Passwords are re-hashed when provided.
     *
     * @param request the partial update request
     * @param user    the entity to mutate in-place
     */
    public void updateEntityFromRequest(UpdateUserRequest request, User user) {
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
    }
}
