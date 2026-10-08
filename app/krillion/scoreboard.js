"use client";

import { startTransition, useOptimistic } from "react";
import { Minus, Plus } from "lucide-react";
import { adjustScore } from "./actions";

export default function Scoreboard({ scores, owner }) {
  const [optimisticScores, applyDelta] = useOptimistic(scores, (state, { id, delta }) =>
    state.map((player) =>
      player.id === id ? { ...player, score: Math.max(0, player.score + delta) } : player
    )
  );
  const top = Math.max(...optimisticScores.map((player) => player.score));

  function change(id, delta) {
    startTransition(async () => {
      applyDelta({ id, delta });
      await adjustScore(id, delta);
    });
  }

  return (
    <section aria-label="Score" className="flex gap-8 sm:gap-16">
      {optimisticScores.map((player) => (
        <div key={player.id} className="group min-w-28 sm:min-w-32 space-y-2">
          <div className="text-base sm:text-lg text-gray-400">{player.name}</div>
          <div
            className={`text-6xl sm:text-7xl font-semibold tabular-nums transition-colors duration-200 ${
              player.score === top ? "text-white" : "text-gray-500"
            }`}
          >
            {player.score}
          </div>
          {owner && (
            <div className="flex gap-1 -ml-2 transition-opacity duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-within:opacity-100">
              <button
                type="button"
                onClick={() => change(player.id, -1)}
                disabled={player.score === 0}
                aria-label={`Remove a point from ${player.name}`}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-200"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                onClick={() => change(player.id, 1)}
                aria-label={`Add a point for ${player.name}`}
                className="p-2 text-gray-500 hover:text-white transition-colors duration-200"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
