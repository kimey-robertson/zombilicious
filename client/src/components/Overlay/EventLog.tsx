import React, { useEffect, useRef } from "react";
import type { LogEvent } from "../../../../shared/types";
import { useGameStore } from "../../store/useGameStore";

const EventLog: React.FC = () => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const gameLogs = useGameStore((state) => state.gameLogs);

  const getEventTypeClasses = (type: LogEvent["type"]) => {
    switch (type) {
      case "combat":
        return "border-l-red-500 text-red-400";
      case "movement":
        return "border-l-teal-500 text-teal-400";
      case "item":
        return "border-l-blue-500 text-blue-400";
      case "zombie":
        return "border-l-red-600 text-red-500";
      case "survivor":
        return "border-l-green-500 text-green-400";
      case "noise":
        return "border-l-yellow-500 text-yellow-400";
      case "system":
        return "border-l-purple-500 text-purple-400";
      default:
        return "border-l-gray-500 text-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameLogs]);

  return (
    <div className="overlay-item w-70 bg-stone-900/90 text-stone-200 p-4 rounded-xl shadow-xl border border-red-900/50">
      <h3 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 mb-3 font-mono">
        Event Log
      </h3>
      <div className="max-h-70 overflow-y-auto pr-2 -mr-2 space-y-2 scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-stone-800">
        {gameLogs.map((event) => (
          <div
            key={event.id}
            className={`flex items-start gap-2 p-2 bg-white/5 rounded border-l-4 ${getEventTypeClasses(
              event.type
            )}`}
          >
            <span className="text-base flex-shrink-0 mt-0.5">{event.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className={`font-bold text-sm mb-1 ${
                  getEventTypeClasses(event.type).split(" ")[1]
                }`}
              >
                {event.message}
              </div>
              <div className="text-stone-400 text-xs font-mono">
                {formatTime(event.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default EventLog;
