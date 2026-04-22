package owt.demo.dto.request;

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
public class UpdateBoatRequest {
    private String name;
    private String description;

    @Positive(message = "Boat length must be positive")
    private Double length;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @Min(value = 1800, message = "Year built must be 1800 or later")
    private Integer yearBuilt;

    private String ownerName;
}
