package owt.demo.domain.repository;

import owt.demo.domain.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    List<Boat> findByType(String type);
    List<Boat> findByOwnerName(String ownerName);
}
