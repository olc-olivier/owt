package owt.demo.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "boats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double length;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer yearBuilt;

    @Column(nullable = false)
    private String ownerName;
}
