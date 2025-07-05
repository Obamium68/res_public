import { Candidate } from "./Candidate";

export interface Voter {
  id: number;
  name: string;
  has_voted: boolean;
}
