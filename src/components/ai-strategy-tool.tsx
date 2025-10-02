"use client";

import * as React from "react";
import { useMatch } from "@/hooks/use-match";
import { suggestProfitableTrades, explainAiSuggestions } from "@/ai/flows";
import type { SuggestProfitableTradesOutput, ExplainAiSuggestionsOutput } from "@/ai/flows";
import type { MarketId } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Lightbulb, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";

export function AiStrategyTool({ marketId }: { marketId: MarketId }) {
  const { gameState, pnl, positions, orderBooks, setOrderForm } = useMatch();
  const [suggestions, setSuggestions] = React.useState<SuggestProfitableTradesOutput['suggestions']>([]);
  const [explanations, setExplanations] = React.useState<Record<string, ExplainAiSuggestionsOutput['suggestions'][0]>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isExplanationLoading, setIsExplanationLoading] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const marketConditions = JSON.stringify({
        [marketId]: {
          bids: orderBooks[marketId]?.buyOrders.slice(0, 5),
          asks: orderBooks[marketId]?.sellOrders.slice(0, 5),
        },
      });

      const input = {
        gameState: JSON.stringify(gameState),
        marketConditions,
        pnl: Object.values(pnl).reduce((acc, cur) => acc + cur.realized + cur.unrealized, 0),
        position: JSON.stringify(positions),
      };

      const result = await suggestProfitableTrades(input);
      setSuggestions(result.suggestions.filter(s => s.market === marketId));
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch trade suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetExplanation = async (suggestion: SuggestProfitableTradesOutput['suggestions'][0], index: number) => {
    const key = `${suggestion.market}-${index}`;
    if (explanations[key]) return;

    setIsExplanationLoading(key);
    try {
        const marketConditions = JSON.stringify({
            [marketId]: {
                bids: orderBooks[marketId]?.buyOrders.slice(0, 5),
                asks: orderBooks[marketId]?.sellOrders.slice(0, 5),
            },
        });
        const result = await explainAiSuggestions({
            gameState: JSON.stringify(gameState),
            marketConditions,
            pnl: Object.values(pnl).reduce((acc, cur) => acc + cur.realized + cur.unrealized, 0),
            positionLimits: JSON.stringify(positions),
        });

      if (result.suggestions && result.suggestions[0]) {
        setExplanations(prev => ({...prev, [key]: result.suggestions[0]}));
      }

    } catch (error) {
       console.error("Error getting AI explanation:", error);
       toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch explanation.",
      });
    } finally {
        setIsExplanationLoading(null);
    }
  }

  const prefillOrder = (suggestion: SuggestProfitableTradesOutput['suggestions'][0]) => {
     setOrderForm({
        marketId: suggestion.market as MarketId,
        price: suggestion.price,
        volume: suggestion.volume,
        side: suggestion.action
     });
     toast({
        title: "Order Pre-filled",
        description: "Order details have been copied to the form.",
     });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          AI Strategy Tool
        </CardTitle>
        <CardDescription>Get AI-powered trade suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : "Get Suggestions"}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Suggestions for {marketId}</h4>
            {suggestions.map((s, i) => {
              const key = `${s.market}-${i}`;
              return (
              <Accordion type="single" collapsible onValueChange={() => handleGetExplanation(s, i)} key={key}>
                <AccordionItem value="item-1">
                  <div className="bg-card-foreground/5 dark:bg-card-foreground/10 p-3 rounded-md space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant={s.action === 'BUY' ? 'default' : 'destructive'} className={s.action === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>{s.action}</Badge>
                            <p className="font-bold text-lg">{s.volume} @ {s.price}</p>
                        </div>
                        <Button size="sm" onClick={() => prefillOrder(s)}>Pre-fill</Button>
                    </div>
                     <p className="text-xs text-muted-foreground">{s.rationale}</p>
                     <AccordionTrigger>Why this trade?</AccordionTrigger>
                  </div>
                  <AccordionContent className="p-4">
                    {isExplanationLoading === key && <Loader2 className="animate-spin" />}
                    {explanations[key] && (
                        <div className="space-y-3 text-sm">
                            <div>
                                <h5 className="font-semibold flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/>Rationale</h5>
                                <p className="text-muted-foreground">{explanations[key].rationale}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-400"/>Risks</h5>
                                <p className="text-muted-foreground">{explanations[key].risks}</p>
                            </div>
                             <div>
                                <h5 className="font-semibold">Confidence</h5>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{width: `${explanations[key].confidence * 100}%`}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
