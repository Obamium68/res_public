import { Candidate } from "./Candidate";
import { Voter } from "./Voter";

enum ElectionType {
  PARTY,
  GOVERNMENT,
}

export interface Election {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  active: boolean;
  candidates: Candidate[];
  winner: Candidate;
  voters: Voter[];
  type: ElectionType;
}
