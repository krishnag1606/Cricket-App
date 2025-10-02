'use server';

import { suggestProfitableTrades as suggest } from './suggest-profitable-trades';
import { explainAiSuggestions as explain } from './explain-ai-suggestions';

export const suggestProfitableTrades = suggest;
export const explainAiSuggestions = explain;
