package owt.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoatResponse {
    private Long id;
    private String name;
    private String type;
    private Double length;
    private Integer capacity;
    private Integer yearBuilt;
    private String ownerName;
}
