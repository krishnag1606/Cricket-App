"use client";

import { useMatch } from "@/hooks/use-match";
import type { MarketId, Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export function OrderBook({ marketId }: { marketId: MarketId }) {
  const { orderBooks, setOrderForm } = useMatch();
  const book = orderBooks[marketId];

  const handleRowClick = (price: number, side: 'BUY' | 'SELL') => {
    setOrderForm({ marketId, price, side });
  };
  
  const renderOrderRows = (orders: Order[], side: 'BUY' | 'SELL') => {
    // Aggregate volume by price
    const priceMap = new Map<number, number>();
    orders.forEach(order => {
        priceMap.set(order.price, (priceMap.get(order.price) || 0) + order.volume);
    });

    const sortedPrices = Array.from(priceMap.keys()).sort((a, b) => side === 'BUY' ? b - a : a - b);
    
    return sortedPrices.map(price => (
        <TableRow key={price} className="cursor-pointer" onClick={() => handleRowClick(price, side)}>
            <TableCell className="font-mono">{priceMap.get(price)}</TableCell>
            <TableCell className={`font-mono text-right ${side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{price}</TableCell>
        </TableRow>
    ));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
        <div className="flex flex-col">
          <h3 className="text-center font-semibold text-green-500 mb-2">Buy</h3>
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {book?.buyOrders && renderOrderRows(book.buyOrders, 'BUY')}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
          <h3 className="text-center font-semibold text-red-500 mb-2">Sell</h3>
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {book?.sellOrders && renderOrderRows(book.sellOrders, 'SELL')}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
