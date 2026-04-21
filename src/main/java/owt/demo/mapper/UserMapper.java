package owt.demo.mapper;

import owt.demo.domain.model.User;
import owt.demo.domain.model.Role;
import owt.demo.dto.request.CreateUserRequest;
import owt.demo.dto.request.UpdateUserRequest;
import owt.demo.dto.response.UserResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User toEntity(CreateUserRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.getEnabled())
                .build();
    }

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
