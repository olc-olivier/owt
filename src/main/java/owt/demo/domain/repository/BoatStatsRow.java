package owt.demo.domain.repository;

/**
 * JPQL constructor-expression record for the aggregate boat statistics query.
 *
 * <p>Replaces the fragile {@code Object[]} result of {@link BoatRepository#computeStats()}
 * with a strongly-typed, immutable value. The record components must match the
 * {@code SELECT new owt.demo.domain.repository.BoatStatsRow(...)} JPQL signature exactly.
 *
 * @param totalBoats    total number of boats in the fleet
 * @param totalCapacity sum of all boat capacities; {@code null} when the table is empty
 * @param avgLength     average boat length in metres; {@code null} when the table is empty
 * @param uniqueOwners  number of distinct owner names
 */
public record BoatStatsRow(
        long totalBoats,
        Long totalCapacity,
        Double avgLength,
        long uniqueOwners
) {}
