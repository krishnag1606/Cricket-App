"use client";

import { useMatch } from "@/hooks/use-match";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BallHistoryCard() {
  const { ballHistory } = useMatch();

  const getOutcomeDisplay = (outcome: string) => {
    if (outcome === "dot") return "•";
    if (outcome === "single") return "1";
    if (outcome === "double") return "2";
    if (outcome === "triple") return "3";
    if (outcome === "four") return "4";
    if (outcome === "six") return "6";
    if (outcome === "wicket") return "W";
    if (outcome === "wide") return "WD";
    if (outcome === "noBall") return "NB";
    return outcome;
  };

  const getOutcomeBadgeVariant = (outcome: string) => {
    if (outcome === "four" || outcome === "six") return "default";
    if (outcome === "wicket") return "destructive";
    if (outcome === "dot") return "secondary";
    return "outline";
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Ball-by-Ball</CardTitle>
        <CardDescription>
          Recent deliveries (most recent on right)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ballHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No balls bowled yet</p>
          ) : (
            ballHistory.map((ball, index) => {
              const over = Math.floor((ball.ballNumber - 1) / 6);
              const ballInOver = ((ball.ballNumber - 1) % 6) + 1;
              
              return (
                <div key={ball.ballNumber} className="flex flex-col items-center gap-1">
                  <Badge 
                    variant={getOutcomeBadgeVariant(ball.outcome)}
                    className="w-10 h-10 flex items-center justify-center text-base font-bold"
                  >
                    {getOutcomeDisplay(ball.outcome)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {over}.{ballInOver}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}