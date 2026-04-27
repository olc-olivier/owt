package owt.demo.domain.repository;

import owt.demo.domain.model.Boat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    List<Boat> findByDescription(String description);
    List<Boat> findByOwnerName(String ownerName);
    Page<Boat> findAll(Pageable pageable);

    @Query("SELECT COUNT(b), SUM(b.capacity), AVG(b.length), COUNT(DISTINCT b.ownerName) FROM Boat b")
    List<Object[]> computeStats();
}
