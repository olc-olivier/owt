package owt.demo.application.service;

import owt.demo.domain.model.User;
import owt.demo.domain.repository.UserRepository;
import owt.demo.domain.exception.EntityNotFoundException;
import owt.demo.dto.request.CreateUserRequest;
import owt.demo.dto.request.UpdateUserRequest;
import owt.demo.dto.response.UserResponse;
import owt.demo.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Application service that encapsulates all business operations for user management.
 *
 * <p>Write operations run inside a read-write transaction; read-only operations
 * carry {@code @Transactional(readOnly = true)} to enable provider-level optimisations.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    /**
     * Persists a new user built from the supplied creation request.
     *
     * @param request the validated creation request containing user attributes
     * @return the persisted user represented as a {@link UserResponse}
     */
    public UserResponse createUser(CreateUserRequest request) {
        User user = userMapper.toEntity(request);
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    /**
     * Retrieves a single user by their primary key.
     *
     * @param id the user identifier
     * @return the user response
     * @throws EntityNotFoundException when no user exists with the given id
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    /**
     * Retrieves a single user by their unique username.
     *
     * @param username the username to look up
     * @return the user response
     * @throws EntityNotFoundException when no user exists with the given username
     */
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
        return userMapper.toResponse(user);
    }

    /**
     * Returns all users in the system.
     *
     * @return a list of all user responses, or an empty list when no users exist
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    /**
     * Applies a partial update to an existing user.
     *
     * <p>Only non-null fields in the request are applied; null fields are left unchanged.
     *
     * @param id      the identifier of the user to update
     * @param request the partial update request
     * @return the updated user response
     * @throws EntityNotFoundException when no user exists with the given id
     */
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        userMapper.updateEntityFromRequest(request, user);
        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }

    /**
     * Deletes the user with the given identifier.
     *
     * @param id the identifier of the user to delete
     * @throws EntityNotFoundException when no user exists with the given id
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
