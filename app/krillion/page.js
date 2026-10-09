import Link from "next/link";
import { connection } from "next/server";
import { PLAYERS, getDays, getShots, isOwner } from "./store";
import { currentDay } from "./day";
import Scoreboard from "./scoreboard";
import Gallery from "./gallery";
import OwnerControls from "./owner-controls";
import Title from "./title";

export const metadata = {
  title: "krillion",
  robots: { index: false, follow: false },
};

export default async function KrillionPage({ searchParams }) {
  await connection();
  const [days, shots, owner, params] = await Promise.all([
    getDays(),
    getShots(),
    isOwner(),
    searchParams,
  ]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-8 sm:p-12 flex justify-between items-start text-base sm:text-lg">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
          ← Dylan Wang
        </Link>
        <OwnerControls owner={owner} unlocking={"edit" in params} />
      </header>

      <main className="flex-1 px-8 sm:px-12 pb-16 w-full max-w-6xl space-y-16 sm:space-y-20">
        <Title />
        <Scoreboard players={PLAYERS} days={days} today={currentDay()} owner={owner} />
        <Gallery shots={shots} owner={owner} />
      </main>
    </div>
  );
}
