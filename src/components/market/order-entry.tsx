"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMatch } from "@/hooks/use-match";
import type { MarketId, OrderSide } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { MARKETS } from "@/lib/constants";

export function OrderEntry({ marketId }: { marketId: MarketId }) {
  const { placeOrder, orderForm, matchStatus } = useMatch();
  const market = MARKETS[marketId];

  const formSchema = z.object({
    side: z.enum(["BUY", "SELL"]),
    price: z.coerce.number().min(market.minPrice).max(market.maxPrice),
    volume: z.coerce.number().positive().int(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      side: "BUY",
      price: market.minPrice,
      volume: 1,
    },
  });

  React.useEffect(() => {
    if (orderForm && orderForm.marketId === marketId) {
      form.setValue("price", orderForm.price);
      if (orderForm.side) {
        form.setValue("side", orderForm.side === 'BUY' ? 'SELL' : 'BUY'); // Pre-fill opposite side
      }
    }
  }, [orderForm, marketId, form]);

  const side = useWatch({ control: form.control, name: 'side' });

  function onSubmit(values: z.infer<typeof formSchema>) {
    placeOrder({
      marketId,
      side: values.side,
      price: values.price,
      volume: values.volume,
    });
    form.reset({ ...values, volume: 1 });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      className="grid grid-cols-2"
                      value={field.value}
                      onValueChange={(value) => value && field.onChange(value as OrderSide)}
                    >
                      <ToggleGroupItem value="BUY" className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-700 dark:data-[state=on]:text-green-400">
                        Buy
                      </ToggleGroupItem>
                      <ToggleGroupItem value="SELL" className="data-[state=on]:bg-red-500/20 data-[state=on]:text-red-700 dark:data-[state=on]:text-red-400">
                        Sell
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step={market.tickSize} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn(
                "w-full",
                side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
                'text-white'
              )}
              disabled={matchStatus !== 'in_progress'}
            >
              Place {side} Order
            </Button>
            {matchStatus !== 'in_progress' && <p className="text-xs text-center text-muted-foreground">Trading is closed.</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
