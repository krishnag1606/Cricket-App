import type { MarketId, GameState, SimulationSettings, Market } from './types';

export const OVERS_PER_MATCH = 5;

export const MARKETS: Record<MarketId, Market> = {
  player1_score: { id: 'player1_score', name: 'Player 1 Score', tickSize: 1, minPrice: 0, maxPrice: 150 },
  player2_score: { id: 'player2_score', name: 'Player 2 Score', tickSize: 1, minPrice: 0, maxPrice: 150 },
  team_score: { id: 'team_score', name: 'Team Score', tickSize: 1, minPrice: 0, maxPrice: 300 },
  num_wickets: { id: 'num_wickets', name: 'Total Wickets', tickSize: 1, minPrice: 0, maxPrice: 2 },
  num_boundaries: { id: 'num_boundaries', name: 'Total Boundaries', tickSize: 1, minPrice: 0, maxPrice: 20 },
};

export const INITIAL_GAME_STATE: GameState = {
  over: 0,
  ball: 0,
  batsmanOnStrike: 1,
  player1_score: 0,
  player2_score: 0,
  team_score: 0,
  num_wickets: 0,
  num_boundaries: 0,
  isFreeHit: false,
};

export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  ballInterval: 2.5, // seconds
  probabilities: {
    dots: 30,
    singles: 35,
    doubles: 10,
    triples: 1,
    fours: 10,
    sixes: 5,
    wickets: 5,
    wides: 2,
    noBalls: 2,
  },
};
