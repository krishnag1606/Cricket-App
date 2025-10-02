"use client";

import { useMatch } from "@/hooks/use-match";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MARKETS } from "@/lib/constants";
import { GameStateCard } from "./dashboard/game-state-card";
import { MarketCard } from "./dashboard/market-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export function DashboardClient() {
  const { matchStatus, startGame, resetMatch } = useMatch();

  if (matchStatus === 'not_started') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Welcome to Cricket Exchange</CardTitle>
            <CardDescription>
              A simulated cricket trading application. Start a demo match to see how it works.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={startGame}>Play Demo Match</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Onboarding Demo</AlertTitle>
          <AlertDescription>
            This is a demo match. Explore the markets, place some orders, and see how your P&L changes. You can reset the match at any time.
          </AlertDescription>
        </Alert>
      
      <div className="flex flex-col md:flex-row gap-6">
        <GameStateCard />
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Match Controls</CardTitle>
            <CardDescription>Manage the simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={resetMatch} variant="destructive">Reset Match</Button>
            </div>
             {matchStatus === 'finished' && (
                <p className="text-lg font-bold text-primary mt-4">Match Finished!</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(MARKETS).map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>
    </div>
  );
}
