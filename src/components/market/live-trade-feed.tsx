"use client";

import { useMatch } from "@/hooks/use-match";
import type { MarketId } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export function LiveTradeFeed({ marketId }: { marketId: MarketId }) {
  const { trades } = useMatch();
  const marketTrades = trades[marketId] || [];

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Live Trade Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...marketTrades].reverse().map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{new Date(trade.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell
                    className={cn(
                      "font-mono font-semibold",
                      // This is a simplification; a real trade feed would need to know if the aggressor was a buyer or seller.
                      // We'll alternate for visual effect.
                      parseInt(trade.id.slice(-1), 16) % 2 === 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trade.price}
                  </TableCell>
                  <TableCell className="text-right font-mono">{trade.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
