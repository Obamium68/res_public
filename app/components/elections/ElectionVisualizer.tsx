"use client";
import { useEffect, useState } from "react";
import { Election } from "@/app/lib/models/Election";
import { formatDateTime } from "@/app/lib/utils/Dates";

export default function ElectionBox({ election }: { election: Election }) {
  return (
    <a
      href={`/elections/${election.id}`}
      className={`flex my-8 rounded-2xl border-1 border-gray-700 p-5 border-l-8 ${
        election.active ? "border-l-green-400" : "border-l-red-400"
      }`}
    >
      <div className="space-y-1 items-start justify-center flex flex-col border-r-2 pr-3">
        <div className="text-sm leading-5 font-semibold">
          <span className="text-xs leading-4 font-normal">Election ID#</span>{" "}
          {election.id}
        </div>
        <div className="text-sm leading-5 font-semibold">
          <ElectionTimer endDate={election.end_date} />
        </div>
      </div>
      <div className="flex-1">
        <div className="ml-3 space-y-1 border-r-2 pr-3">
          <div className="text-xl leading-6 font-black">{election.name}</div>
          <div className="text-sm leading-4 font-normal">
            <span className="text-xs leading-4 font-normal"> Tipo:</span>{" "}
            {election.type ? "Government" : "Party"}
          </div>
          <div className="text-sm leading-4 font-normal">
            <span className="text-xs leading-4 font-normal">
              {" "}
              Starting date:
            </span>{" "}
            {formatDateTime(election.start_date)}
          </div>
          <div className="text-sm leading-4 font-normal">
            <span className="text-xs leading-4 font-normal"> Ending date:</span>{" "}
            {formatDateTime(election.end_date)}
          </div>
        </div>
      </div>

      <div className={`m-5 mx-3 w-20 items-center justify-between flex flex-col`}>
        <div
          className={`uppercase font-black text-md ${
            election.active ? "text-green-500" : "text-red-500"
          } font-semibold text-center`}
        >
          {election.active ? "Open" : "Closed"}
        </div>
      </div>
    </a>
  );
}

export function ElectionTimer({ endDate }: { endDate: Date | string }) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const end = new Date(endDate);

    const updateRemainingTime = () => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime("00:00:00");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const hours = Math.floor(totalSeconds / 3600);

      // Pad con zeri (es: 02:09:07)
      const format = (n: number) => n.toString().padStart(2, "0");

      setRemainingTime(
        `${format(hours)}:${format(minutes)}:${format(seconds)}`
      );
    };

    updateRemainingTime(); // iniziale

    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval); // pulizia
  }, [endDate]);

  return (
    <div>
      Tempo rimanente:
      <br />
      {remainingTime}
    </div>
  );
}
