package owt.demo.mapper;

import owt.demo.domain.model.Boat;
import owt.demo.dto.request.CreateBoatRequest;
import owt.demo.dto.request.UpdateBoatRequest;
import owt.demo.dto.response.BoatResponse;
import org.springframework.stereotype.Component;

@Component
public class BoatMapper {
    public Boat toEntity(CreateBoatRequest request) {
        return Boat.builder()
                .name(request.getName())
                .type(request.getType())
                .length(request.getLength())
                .capacity(request.getCapacity())
                .yearBuilt(request.getYearBuilt())
                .ownerName(request.getOwnerName())
                .build();
    }

    public BoatResponse toResponse(Boat boat) {
        return BoatResponse.builder()
                .id(boat.getId())
                .name(boat.getName())
                .type(boat.getType())
                .length(boat.getLength())
                .capacity(boat.getCapacity())
                .yearBuilt(boat.getYearBuilt())
                .ownerName(boat.getOwnerName())
                .build();
    }

    public void updateEntityFromRequest(UpdateBoatRequest request, Boat boat) {
        if (request.getName() != null) {
            boat.setName(request.getName());
        }
        if (request.getType() != null) {
            boat.setType(request.getType());
        }
        if (request.getLength() != null) {
            boat.setLength(request.getLength());
        }
        if (request.getCapacity() != null) {
            boat.setCapacity(request.getCapacity());
        }
        if (request.getYearBuilt() != null) {
            boat.setYearBuilt(request.getYearBuilt());
        }
        if (request.getOwnerName() != null) {
            boat.setOwnerName(request.getOwnerName());
        }
    }
}
