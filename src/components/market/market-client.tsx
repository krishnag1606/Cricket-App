"use client";
import type { MarketId } from "@/lib/types";
import { OrderBook } from "./order-book";
import { LiveTradeFeed } from "./live-trade-feed";
import { OrderEntry } from "./order-entry";
import { AiStrategyTool } from "../ai-strategy-tool";
import { useMatch } from "@/hooks/use-match";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function MarketClient({ marketId }: { marketId: MarketId }) {
  const { pnl, positions } = useMatch();

  const position = positions[marketId] || 0;
  const unrealizedPnl = pnl[marketId]?.unrealized || 0;
  const realizedPnl = pnl[marketId]?.realized || 0;

  return (
    <main className="flex-1 grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12 gap-4 lg:gap-6 p-4 md:p-6">
      <div className="lg:col-span-3 xl:col-span-3">
        <OrderBook marketId={marketId} />
      </div>
      <div className="lg:col-span-4 xl:col-span-6 flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around text-center">
                <div>
                    <p className={`text-2xl font-bold font-mono ${position > 0 ? 'text-green-500' : position < 0 ? 'text-red-500' : ''}`}>{position}</p>
                    <p className="text-sm text-muted-foreground">Net Position</p>
                </div>
                 <div>
                    <p className={`text-2xl font-bold font-mono ${unrealizedPnl > 0 ? 'text-green-500' : unrealizedPnl < 0 ? 'text-red-500' : ''}`}>{unrealizedPnl.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                </div>
                 <div>
                    <p className={`text-2xl font-bold font-mono ${realizedPnl > 0 ? 'text-green-500' : realizedPnl < 0 ? 'text-red-500' : ''}`}>{realizedPnl.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Realized P&L</p>
                </div>
            </CardContent>
        </Card>
        <LiveTradeFeed marketId={marketId} />
      </div>
      <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-6">
        <OrderEntry marketId={marketId} />
        <AiStrategyTool marketId={marketId} />
      </div>
    </main>
  );
}
