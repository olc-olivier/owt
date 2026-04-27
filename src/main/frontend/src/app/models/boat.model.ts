/**
 * Core domain models and request/response DTOs for the boat fleet API.
 *
 * @category Models
 */

/**
 * Represents a registered boat in the fleet.
 *
 * @category Models
 */
export interface Boat {
  /** Unique identifier assigned by the server. */
  id: number;
  /** Display name of the boat (e.g. "Sea Breeze"). */
  name: string;
  /** Free-text description shown in the detail view. */
  description: string;
  /** Overall length in metres. */
  length: number;
  /** Maximum number of passengers. */
  capacity: number;
  /** Four-digit year the boat was built. */
  yearBuilt: number;
  /** Full name of the registered owner. */
  ownerName: string;
  /** Username that created this record (populated by Spring Data auditing). */
  createdBy?: string;
  /** ISO-8601 timestamp when this record was first created. */
  createdDate?: string;
  /** Username that last modified this record. */
  lastModifiedBy?: string;
  /** ISO-8601 timestamp of the most recent modification. */
  lastModifiedDate?: string;
}

/**
 * Spring Data REST HAL-style paginated response returned by `GET /api/boats`.
 *
 * The `_embedded` property is absent when the result set is empty.
 *
 * @category Models
 */
export interface BoatPageResponse {
  /** Contains the boat list when the page is non-empty. */
  _embedded?: { boatResponseList: Boat[] };
  /** Pagination metadata. */
  page: {
    /** Number of items per page. */
    size: number;
    /** Total number of boats across all pages. */
    totalElements: number;
    /** Total number of pages. */
    totalPages: number;
    /** Zero-based current page number. */
    number: number;
  };
}

/**
 * Payload for creating a new boat (`POST /api/boats`).
 *
 * @category Models
 */
export interface CreateBoatRequest {
  /** Display name of the boat. */
  name: string;
  /** Free-text description. */
  description: string;
  /** Overall length in metres. */
  length: number;
  /** Maximum passenger capacity. */
  capacity: number;
  /** Four-digit year the boat was built. */
  yearBuilt: number;
  /** Full name of the registered owner. */
  ownerName: string;
}

/**
 * Payload for a partial update (`PUT /api/boats/:id`).
 * All fields are optional — only provided fields are sent to the server.
 *
 * @category Models
 */
export type UpdateBoatRequest = Partial<CreateBoatRequest>;

export interface BoatStats {
  totalBoats: number;
  totalCapacity: number;
  avgLength: number;
  uniqueOwners: number;
}
