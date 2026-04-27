import { Boat } from './boat.model';

export type RevisionType = 'ADD' | 'MOD' | 'DEL';

export interface BoatRevision {
  revisionNumber: number;
  revisionDate: string;
  revisionType: RevisionType;
  boat: Boat;
}
