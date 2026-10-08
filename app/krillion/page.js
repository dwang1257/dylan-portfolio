import Link from "next/link";
import { connection } from "next/server";
import { getScores, getShots, isOwner } from "./store";
import Scoreboard from "./scoreboard";
import Gallery from "./gallery";
import OwnerControls from "./owner-controls";

export const metadata = {
  title: "krillion",
  robots: { index: false, follow: false },
};

export default async function KrillionPage({ searchParams }) {
  await connection();
  const [scores, shots, owner, params] = await Promise.all([
    getScores(),
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
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-200">krillion</h1>
        <Scoreboard scores={scores} owner={owner} />
        <Gallery shots={shots} owner={owner} />
      </main>
    </div>
  );
}
