"use client";

import { useEffect, useState } from "react";
import { Election } from "@/app/lib/models/Election";
import ElectionList from "@/app/components/elections/ElectionList";

export default function ElectionPage() {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => {
    async function fetchElections() {
      const res = await fetch("/api/elections");
      const data = await res.json();
      setElections(data);
    }
    fetchElections();
  }, []);

  return (
    <div className="items-center flex flex-col pt-10">
      <h1 className="text-5xl font-black">Elections list</h1>
      <ElectionList elections={elections} />;
    </div>
  );
}
