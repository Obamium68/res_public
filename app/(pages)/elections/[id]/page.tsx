import { ElectionTimer } from "@/app/components/elections/ElectionVisualizer";
import { Election } from "@/app/lib/models/Election";
import { formatDateTime } from "@/app/lib/utils/Dates";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ElectionPage({ params }: PageProps) {
  const electionId = (await params).id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/elections/${electionId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Election not found");
  }

  const election: Election = await res.json();

  return (
    <div className="container mx-auto px-8 py-6">
      <h1 className="text-4xl font-bold mb-4">{election.name}</h1>
      <div className="mb-4">
        <p>
          <strong>Tipo:</strong> {election.type === 0 ? "PARTY" : "GOVERNMENT"}
        </p>
        <p>
          <strong>Inizio:</strong> {formatDateTime(election.start_date)}
        </p>
        <p>
          <strong>Fine:</strong> {formatDateTime(election.end_date)}
        </p>
        <p>
          <strong>Attiva:</strong> {election.active ? "✅" : "❌"}
        </p>
        {election.active && (
          <div className="mt-2">
            <ElectionTimer endDate={election.end_date} />
          </div>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Candidati</h2>
        <ul className="space-y-2">
          {election.candidates.map((candidate) => (
            <li
              key={candidate.id}
              className={`p-3 rounded-lg border ${
                candidate.id === election.winner.id
                  ? "border-green-600 bg-green-100"
                  : "border-gray-300"
              }`}
            >
              <p>
                <strong>{candidate.name}</strong> ({candidate.party}) —{" "}
                {candidate.total_votes} voti
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Elettori: {election.voters.length},
        </h2>
        <h2 className="text-2xl font-semibold mb-2">
          Votanti: {election.voters.filter((voter) => voter.has_voted).length}
        </h2>
        <ul className="space-y-1">
          {election.voters.map((voter) => (
            <li key={voter.id}>
              {voter.name} —{" "}
              {voter.has_voted ? "Ha votato ✅" : "Non ha votato ❌"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
