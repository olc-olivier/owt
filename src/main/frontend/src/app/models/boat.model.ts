export interface Boat {
  id: number;
  name: string;
  description: string;
  length: number;
  capacity: number;
  yearBuilt: number;
  ownerName: string;
}

export interface BoatPageResponse {
  _embedded?: { boatResponseList: Boat[] };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface CreateBoatRequest {
  name: string;
  description: string;
  length: number;
  capacity: number;
  yearBuilt: number;
  ownerName: string;
}

export type UpdateBoatRequest = Partial<CreateBoatRequest>;
