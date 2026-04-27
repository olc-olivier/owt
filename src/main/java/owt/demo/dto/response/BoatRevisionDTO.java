package owt.demo.dto.response;

import java.time.Instant;

public record BoatRevisionDTO(
        int revisionNumber,
        Instant revisionDate,
        String revisionType,
        BoatResponse boat
) {}
