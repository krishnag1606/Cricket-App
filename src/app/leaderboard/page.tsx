import { Header } from "@/components/header";
import { LeaderboardClient } from "@/components/leaderboard-client";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Leaderboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <LeaderboardClient />
      </main>
    </div>
  );
}
