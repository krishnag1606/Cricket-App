'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting profitable trades in a cricket exchange application.
 *
 * It includes:
 * - `suggestProfitableTrades`: An exported function that takes game state and market conditions as input and returns trade suggestions.
 * - `SuggestProfitableTradesInput`: The input type for the `suggestProfitableTrades` function.
 * - `SuggestProfitableTradesOutput`: The output type for the `suggestProfitableTrades` function, which includes trade suggestions with rationale, confidence, and risk notes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfitableTradesInputSchema = z.object({
  gameState: z.string().describe('The current state of the cricket match, including score, wickets, and overs.'),
  marketConditions: z.string().describe('The current market conditions, including bid/ask prices and volumes for different markets.'),
  pnl: z.number().describe('The current profit and loss of the player.'),
  position: z.string().describe('The current positions held by the player in different markets.'),
});

export type SuggestProfitableTradesInput = z.infer<typeof SuggestProfitableTradesInputSchema>;

const SuggestionSchema = z.object({
  market: z.string().describe('The market for the trade suggestion (e.g., player1_score, team_score).'),
  action: z.enum(['BUY', 'SELL']).describe('The suggested action (BUY or SELL).'),
  price: z.number().describe('The price at which to execute the trade.'),
  volume: z.number().describe('The volume of the trade.'),
  rationale: z.string().describe('The rationale behind the trade suggestion.'),
  confidence: z.number().describe('The confidence level (0-1) in the trade suggestion.'),
  risks: z.string().describe('The potential risks associated with the trade.'),
});

const SuggestProfitableTradesOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('An array of trade suggestions.'),
});

export type SuggestProfitableTradesOutput = z.infer<typeof SuggestProfitableTradesOutputSchema>;

export async function suggestProfitableTrades(input: SuggestProfitableTradesInput): Promise<SuggestProfitableTradesOutput> {
  return suggestProfitableTradesFlow(input);
}

const suggestProfitableTradesPrompt = ai.definePrompt({
  name: 'suggestProfitableTradesPrompt',
  input: {schema: SuggestProfitableTradesInputSchema},
  output: {schema: SuggestProfitableTradesOutputSchema},
  prompt: `You are a trading assistant for a cricket betting exchange. Given the current game state, market conditions, current pnl, and current position, suggest up to 3 potential trades. Focus on trades with high rationale, confidence, and manageable risks.

Game State: {{{gameState}}}
Market Conditions: {{{marketConditions}}}
Current P&L: {{{pnl}}}
Current Position: {{{position}}}

Format your response as a JSON object with a 'suggestions' array. Each suggestion should include the market, action (BUY or SELL), price, volume, rationale, confidence (0-1), and risks.

Example:
{
  "suggestions": [
    {
      "market": "player1_score",
      "action": "BUY",
      "price": 55,
      "volume": 10,
      "rationale": "Player 1 is likely to score high based on current form.",
      "confidence": 0.75,
      "risks": "Sudden wicket fall could negatively impact the score."
    }
  ]
}`,
});

const suggestProfitableTradesFlow = ai.defineFlow(
  {
    name: 'suggestProfitableTradesFlow',
    inputSchema: SuggestProfitableTradesInputSchema,
    outputSchema: SuggestProfitableTradesOutputSchema,
  },
  async input => {
    const {output} = await suggestProfitableTradesPrompt(input);
    return output!;
  }
);
