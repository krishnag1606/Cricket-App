"use client";

import { useMatch } from "@/hooks/use-match";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function LeaderboardClient() {
  const { pnl } = useMatch();

  // In a real app, this would come from a server with multiple users.
  // Here, we simulate a single-user leaderboard.
  const totalPnl = Object.values(pnl).reduce((acc, marketPnl) => {
    return acc + marketPnl.realized + marketPnl.unrealized;
  }, 0);

  const leaderboardData = [
    { rank: 1, user: "You", pnl: totalPnl.toFixed(2) },
    { rank: 2, user: "Bot Trader 1", pnl: "15.50" },
    { rank: 3, user: "Bot Trader 2", pnl: "-5.20" },
  ].sort((a,b) => parseFloat(b.pnl) - parseFloat(a.pnl));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Total P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow key={entry.user}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.user}</TableCell>
                <TableCell className={`text-right font-mono ${parseFloat(entry.pnl) > 0 ? "text-green-500" : parseFloat(entry.pnl) < 0 ? "text-red-500" : ""}`}>
                  {entry.pnl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
