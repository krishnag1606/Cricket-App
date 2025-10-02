'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered trade suggestions with rationale, confidence, and risk assessment.
 *
 * - explainAiSuggestions -  A function that generates trade suggestions with explanations.
 * - ExplainAiSuggestionsInput - The input type for the explainAiSuggestions function.
 * - ExplainAiSuggestionsOutput - The output type for the explainAiSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAiSuggestionsInputSchema = z.object({
  gameState: z
    .string()
    .describe('The current state of the cricket match, including scores, wickets, and overs.'),
  marketConditions: z
    .string()
    .describe('The current market conditions, including bid/ask prices and order book depth.'),
  pnl: z.number().describe('The current profit and loss for the user.'),
  positionLimits: z
    .string()
    .describe('The maximum allowed position limits for each market.'),
});
export type ExplainAiSuggestionsInput = z.infer<typeof ExplainAiSuggestionsInputSchema>;

const ExplainAiSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      market: z.string().describe('The market for the trade suggestion.'),
      action: z.enum(['buy', 'sell']).describe('The suggested action.'),
      price: z.number().describe('The suggested price for the trade.'),
      volume: z.number().describe('The suggested volume for the trade.'),
      rationale: z.string().describe('The rationale behind the trade suggestion.'),
      confidence: z.number().describe('The confidence level for the trade suggestion (0-1).'),
      risks: z.string().describe('The potential risks associated with the trade suggestion.'),
    })
  ).describe('A list of trade suggestions with rationale, confidence, and risks.'),
});
export type ExplainAiSuggestionsOutput = z.infer<typeof ExplainAiSuggestionsOutputSchema>;

export async function explainAiSuggestions(input: ExplainAiSuggestionsInput): Promise<ExplainAiSuggestionsOutput> {
  return explainAiSuggestionsFlow(input);
}

const explainAiSuggestionsPrompt = ai.definePrompt({
  name: 'explainAiSuggestionsPrompt',
  input: {schema: ExplainAiSuggestionsInputSchema},
  output: {schema: ExplainAiSuggestionsOutputSchema},
  prompt: `You are a trading assistant providing trade suggestions for a cricket match.

  Analyze the current game state, market conditions, and user P&L to provide specific trade suggestions.
  Provide a rationale, confidence level (0-1), and potential risks for each suggestion.
  Consider the user's position limits and avoid suggesting trades that would exceed those limits.

  Game State: {{{gameState}}}
  Market Conditions: {{{marketConditions}}}
  User P&L: {{{pnl}}}
  Position Limits: {{{positionLimits}}}

  Format your output as a JSON object conforming to the ExplainAiSuggestionsOutputSchema schema.
  Focus on explaining why the trade is suggested.
  Do not make assumptions beyond the data provided.
  Limit the number of suggestions to a maximum of 3.
  `,
});

const explainAiSuggestionsFlow = ai.defineFlow(
  {
    name: 'explainAiSuggestionsFlow',
    inputSchema: ExplainAiSuggestionsInputSchema,
    outputSchema: ExplainAiSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await explainAiSuggestionsPrompt(input);
    return output!;
  }
);
