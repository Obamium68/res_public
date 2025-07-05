import { Election } from "@/app/lib/models/Election";
import ElectionVisualizer from "./ElectionVisualizer";

export default function ElectionList({ elections }: { elections: Election[] }) {
  return (
    <div className="container mx-auto h-screen w-6/12 antialiased">
      <div>
        {elections.map((election) => (
          <ElectionVisualizer key={election.id} election={election} />
        ))}
      </div>
    </div>
  );
}
