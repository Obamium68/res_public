import { NextResponse } from "next/server";
import { Election } from "@/app/lib/models/Election";
const elections: Election[] = [
  {
    id: 1,
    name: "Presidential Election 2025",
    start_date: new Date("2025-06-01T08:00:00Z"),
    end_date: new Date("2025-06-05T20:00:00Z"),
    active: false,
    candidates: [
      { id: 1, name: "Alice Johnson", party: "Democratic", total_votes: 1234 },
      { id: 2, name: "Bob Smith", party: "Republican", total_votes: 1100 },
    ],
    winner: {
      id: 1,
      name: "Alice Johnson",
      party: "Democratic",
      total_votes: 1234,
    },
    voters: [
      { id: 1, name: "John Doe", has_voted: true },
      { id: 2, name: "Jane Roe", has_voted: false },
    ],
    type: 1, // ElectionType.GOVERNMENT
  },
  {
    id: 2,
    name: "Student Council 2025",
    start_date: new Date("2025-03-10T09:00:00Z"),
    end_date: new Date("2025-03-12T18:00:00Z"),
    active: false,
    candidates: [
      { id: 3, name: "Charlie Green", party: "Independent", total_votes: 250 },
      { id: 4, name: "Dana White", party: "Progressive", total_votes: 180 },
    ],
    winner: {
      id: 3,
      name: "Charlie Green",
      party: "Independent",
      total_votes: 250,
    },
    voters: [
      { id: 3, name: "Alice Blue", has_voted: true },
      { id: 4, name: "Bob Yellow", has_voted: true },
    ],
    type: 0, // ElectionType.PARTY
  },
  {
    id: 3,
    name: "City Mayor Election 2025",
    start_date: new Date("2025-06-01T08:00:00Z"),
    end_date: new Date("2025-06-10T20:00:00Z"),
    active: true,
    candidates: [
      { id: 5, name: "Eva Black", party: "Green Party", total_votes: 980 },
      {
        id: 6,
        name: "Frank Silver",
        party: "Liberal Party",
        total_votes: 1020,
      },
    ],
    winner: {
      id: 6,
      name: "Frank Silver",
      party: "Liberal Party",
      total_votes: 1020,
    },
    voters: [
      { id: 5, name: "Clara Orange", has_voted: true },
      { id: 6, name: "Daniel Purple", has_voted: true },
      { id: 7, name: "Edward Brown", has_voted: true },
    ],
    type: 1, // ElectionType.GOVERNMENT
  },
];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt((await params).id);


  return NextResponse.json(elections[id - 1]);
}
