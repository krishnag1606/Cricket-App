"use client";

import { useMatch } from "@/hooks/use-match";
import type { Market } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const { orderBooks, trades, positions } = useMatch();
  
  const marketTrades = trades[market.id] || [];
  const lastTrade = marketTrades[marketTrades.length - 1];
  
  const book = orderBooks[market.id];
  const bestBid = book?.buyOrders[0]?.price;
  const bestAsk = book?.sellOrders[0]?.price;
  
  const position = positions[market.id] || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{market.name}</CardTitle>
        <CardDescription>
          Last Trade: {lastTrade ? `${lastTrade.volume} @ ${lastTrade.price}` : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="text-center">
            <p className="font-mono text-green-500">{bestBid ?? '--'}</p>
            <p className="text-muted-foreground">Best Bid</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-red-500">{bestAsk ?? '--'}</p>
            <p className="text-muted-foreground">Best Ask</p>
          </div>
          <div className="text-center">
             <p className={`font-mono ${position > 0 ? 'text-green-500' : position < 0 ? 'text-red-500' : ''}`}>{position}</p>
             <p className="text-muted-foreground">Position</p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/market/${market.id}`}>Open Market</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
