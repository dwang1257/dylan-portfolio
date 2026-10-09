"use client";

import { Fragment, startTransition, useEffect, useOptimistic, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDay } from "./actions";
import { currentDay } from "./day";

const RECENT_DAYS = 7;
const COLUMNS = "grid grid-cols-3 sm:grid-cols-[repeat(3,8rem)] gap-x-6 sm:gap-x-16";

function dayWinner(day, players) {
  const [first, second] = [...players].sort((a, b) => (day[b.id] ?? 0) - (day[a.id] ?? 0));
  if (day[first.id] === null || day[second.id] === null || day[first.id] === day[second.id]) return null;
  return first.id;
}

function formatDay(date, today) {
  const sameYear = date.slice(0, 4) === today.slice(0, 4);
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

function formatScore(score) {
  return score === null ? "-" : score.toLocaleString("en-US");
}

export default function Scoreboard({ players, days, today, owner }) {
  const [optimisticDays, applySave] = useOptimistic(days, (state, { date, scores }) =>
    [{ date, ...scores }, ...state.filter((day) => day.date !== date)]
      .filter((day) => players.some((player) => day[player.id] !== null))
      .sort((a, b) => b.date.localeCompare(a.date))
  );
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(null);
  const router = useRouter();
  const date = editing ?? today;

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentDay() !== today) router.refresh();
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [today, router]);

  function save(scores) {
    setEditing(null);
    startTransition(async () => {
      applySave({ date, scores });
      await saveDay(date, scores);
    });
  }

  const tallies = players.map((player) => ({
    ...player,
    total: player.start + optimisticDays.filter((day) => dayWinner(day, players) === player.id).length,
  }));
  const top = Math.max(...tallies.map((player) => player.total));
  const net = top - Math.min(...tallies.map((player) => player.total));
  const leader = tallies.find((player) => player.total === top);
  const shownDays = expanded ? optimisticDays : optimisticDays.slice(0, RECENT_DAYS);

  const labelClass = "text-base sm:text-lg text-gray-400";
  const numberClass = "text-5xl sm:text-7xl font-semibold tabular-nums transition-colors duration-200";

  return (
    <section aria-label="Score" className="group space-y-10">
      <div className={`${COLUMNS} gap-y-2 items-start`}>
        {tallies.map((player) => (
          <div key={player.id} className={labelClass}>
            {player.name}
          </div>
        ))}
        <div className={labelClass}>Net</div>

        {tallies.map((player) => (
          <div
            key={player.id}
            className={`${numberClass} ${player.total === top ? "text-white" : "text-gray-500"}`}
          >
            {player.total}
          </div>
        ))}
        <div className={`${numberClass} text-gray-400`}>{net > 0 ? `+${net}` : "0"}</div>

        <div className="col-start-3 text-sm sm:text-base text-gray-500">
          {net > 0 ? `${leader.name} ahead` : "even"}
        </div>
      </div>

      {owner && (
        <DayEntry
          key={date}
          players={players}
          day={optimisticDays.find((day) => day.date === date)}
          label={formatDay(date, today)}
          onBack={editing ? () => setEditing(null) : null}
          onSave={save}
        />
      )}

      {optimisticDays.length > 0 && (
        <div className="space-y-4">
          <div className={`${COLUMNS} gap-y-1 text-sm sm:text-base tabular-nums`}>
            {shownDays.map((day) => {
              const winner = dayWinner(day, players);
              const label = formatDay(day.date, today);
              return (
                <Fragment key={day.date}>
                  {players.map((player) => (
                    <div key={player.id} className={winner === player.id ? "text-gray-200" : "text-gray-500"}>
                      {formatScore(day[player.id])}
                    </div>
                  ))}
                  {owner ? (
                    <button
                      type="button"
                      onClick={() => setEditing(day.date === today ? null : day.date)}
                      aria-label={`Edit ${label}`}
                      className={`text-left hover:text-white transition-colors duration-200 ${
                        day.date === editing ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {label}
                    </button>
                  ) : (
                    <div className="text-gray-600">{label}</div>
                  )}
                </Fragment>
              );
            })}
          </div>
          {optimisticDays.length > RECENT_DAYS && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-sm sm:text-base text-gray-600 hover:text-white transition-colors duration-200"
            >
              {expanded ? "fewer days" : "all days"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function DayEntry({ players, day, label, onBack, onSave }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(players.map((player) => [player.id, String(day?.[player.id] ?? "")]))
  );

  function submit(event) {
    event.preventDefault();
    onSave(
      Object.fromEntries(
        players.map((player) => [player.id, values[player.id].trim() === "" ? null : Number(values[player.id])])
      )
    );
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(event) => event.key === "Escape" && onBack?.()}
      aria-label="Enter krillion scores"
      className={`${COLUMNS} items-end text-sm sm:text-base transition-opacity duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-within:opacity-100`}
    >
      {players.map((player, index) => (
        <input
          key={player.id}
          autoFocus={Boolean(onBack) && index === 0}
          type="number"
          inputMode="numeric"
          step="1"
          value={values[player.id]}
          onChange={(event) => setValues({ ...values, [player.id]: event.target.value })}
          placeholder={player.name}
          aria-label={`${player.name}'s krillion score`}
          className="w-full min-w-0 bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-gray-400 outline-none py-1 tabular-nums text-white placeholder:text-gray-700 transition-colors duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      ))}
      <div className="flex items-end gap-3 py-1 whitespace-nowrap">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={`Editing ${label}, back to today`}
            className="text-white hover:text-gray-500 transition-colors duration-200"
          >
            {label}
          </button>
        ) : (
          <span className="text-gray-500">{label}</span>
        )}
        <button type="submit" className="text-gray-500 hover:text-white transition-colors duration-200">
          save
        </button>
      </div>
    </form>
  );
}
