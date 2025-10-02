"use client";

import { useMatch } from "@/hooks/use-match";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function GameStateCard() {
  const { gameState } = useMatch();

  if (!gameState) return null;

  const overs = Math.floor(gameState.ball / 6);
  const ballInOver = gameState.ball % 6;

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Live Match State</CardTitle>
        <CardDescription>
          Over {overs}.{ballInOver} (5 over match)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-3xl font-bold">{gameState.team_score}-{gameState.num_wickets}</p>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{gameState.num_boundaries}</p>
            <p className="text-sm text-muted-foreground">Boundaries</p>
          </div>
        </div>
        <Separator />
        <div className="text-sm">
          <div className="flex justify-between">
            <span className={gameState.batsmanOnStrike === 1 ? 'font-bold' : ''}>Player 1 {gameState.batsmanOnStrike === 1 && ' (Strike)'}</span>
            <span className="font-mono">{gameState.player1_score}</span>
          </div>
          <div className="flex justify-between">
            <span className={gameState.batsmanOnStrike === 2 ? 'font-bold' : ''}>Player 2 {gameState.batsmanOnStrike === 2 && ' (Strike)'}</span>
            <span className="font-mono">{gameState.player2_score}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
