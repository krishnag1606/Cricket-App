export type MarketId = 'player1_score' | 'player2_score' | 'team_score' | 'num_wickets' | 'num_boundaries';

export type OrderSide = 'BUY' | 'SELL';

export type Market = {
  id: MarketId;
  name: string;
  tickSize: number;
  minPrice: number;
  maxPrice: number;
};

export interface BallHistoryItem {
  ballNumber: number;
  outcome: 'dot' | 'single' | 'double' | 'triple' | 'four' | 'six' | 'wicket' | 'wide' | 'noBall';
  timestamp: number;
}

export type Order = {
  id: string;
  userId: string;
  marketId: MarketId;
  side: OrderSide;
  price: number;
  volume: number;
  timestamp: number;
};

export type Trade = {
  id: string;
  marketId: MarketId;
  price: number;
  volume: number;
  aggressorOrderId: string;
  restingOrderId: string;
  timestamp: number;
};

export type GameState = {
  over: number;
  ball: number;
  batsmanOnStrike: 1 | 2;
  player1_score: number;
  player2_score: number;
  team_score: number;
  num_wickets: number;
  num_boundaries: number;
  isFreeHit: boolean;
};

export type MatchStatus = 'not_started' | 'in_progress' | 'finished';

export type Position = {
  [key in MarketId]: number;
};

export type PnL = {
  [key in MarketId]: {
    unrealized: number;
    realized: number;
  };
};

export type SimulationSettings = {
  ballInterval: number;
  probabilities: {
    dots: number;
    singles: number;
    doubles: number;
    triples: number;
    fours: number;
    sixes: number;
    wickets: number;
    wides: number;
    noBalls: number;
  };
};

export type BallOutcome = '0' | '1' | '2' | '3' | '4' | '6' | 'W' | 'Wd' | 'Nb';
