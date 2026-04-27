package owt.demo.dto.response;

public record BoatStatsResponse(
        long totalBoats,
        long totalCapacity,
        double avgLength,
        long uniqueOwners
) {}
