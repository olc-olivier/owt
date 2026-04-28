package owt.demo.domain.repository;

import owt.demo.domain.model.Boat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Boat} entities.
 *
 * <p>Extends {@link JpaRepository} for standard CRUD operations and adds
 * convenience finders and an aggregate statistics query.
 */
public interface BoatRepository extends JpaRepository<Boat, Long> {

    /**
     * Returns all boats whose description exactly matches the given value.
     *
     * @param description the description to search for
     * @return matching boats, or an empty list
     */
    List<Boat> findByDescription(String description);

    /**
     * Returns all boats owned by the given owner name.
     *
     * @param ownerName the owner name to search for
     * @return matching boats, or an empty list
     */
    List<Boat> findByOwnerName(String ownerName);

    /**
     * Returns a paginated view of all boats.
     *
     * @param pageable pagination and sort parameters
     * @return a page of boats
     */
    Page<Boat> findAll(Pageable pageable);

    /**
     * Computes aggregate statistics over the whole boat fleet in a single query.
     *
     * <p>Uses a JPQL constructor expression to return a strongly-typed
     * {@link BoatStatsRow} instead of a raw {@code Object[]}.
     *
     * @return a single-element list containing the aggregate statistics row
     */
    @Query("""
            SELECT new owt.demo.domain.repository.BoatStatsRow(
                COUNT(b),
                SUM(b.capacity),
                AVG(b.length),
                COUNT(DISTINCT b.ownerName)
            )
            FROM Boat b
            """)
    List<BoatStatsRow> computeStats();
}
