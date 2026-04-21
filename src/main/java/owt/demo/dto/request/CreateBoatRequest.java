package owt.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBoatRequest {
    @NotBlank(message = "Boat name is required")
    private String name;

    @NotBlank(message = "Boat type is required")
    private String type;

    @NotNull(message = "Boat length is required")
    @Positive(message = "Boat length must be positive")
    private Double length;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @NotNull(message = "Year built is required")
    @Min(value = 1800, message = "Year built must be 1800 or later")
    private Integer yearBuilt;

    @NotBlank(message = "Owner name is required")
    private String ownerName;
}
