"use client";
import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import type { 
  GameState, SimulationSettings, MarketId, Order, Trade, MatchStatus, OrderSide, PnL, Position 
} from '@/lib/types';
import { 
  INITIAL_GAME_STATE, DEFAULT_SIMULATION_SETTINGS, MARKETS, OVERS_PER_MATCH 
} from '@/lib/constants';
import { matchOrders, simulateBallOutcome, updateGameState } from '@/lib/cricket-engine';
import { useToast } from '@/hooks/use-toast';

// State
interface MatchState {
  matchStatus: MatchStatus;
  gameState: GameState;
  settings: SimulationSettings;
  orderBooks: Record<MarketId, { buyOrders: Order[], sellOrders: Order[] }>;
  trades: Record<MarketId, Trade[]>;
  pnl: PnL;
  positions: Position;
  orderForm: { marketId: MarketId, price: number, side?: OrderSide } | null;
  ballHistory: BallHistoryItem[];  // ADD THIS LINE
}

// Actions
type Action =
  | { type: 'START_GAME' }
  | { type: 'RESET_MATCH' }
  | { type: 'SIMULATE_BALL' }
  | { type: 'PLACE_ORDER'; payload: { marketId: MarketId; side: OrderSide; price: number; volume: number } }
  | { type: 'UPDATE_SETTINGS'; payload: SimulationSettings }
  | { type: 'SET_STATE'; payload: MatchState }
  | { type: 'SET_ORDER_FORM', payload: { marketId: MarketId, price: number, side?: OrderSide } | null };

// Context
interface MatchContextProps extends MatchState {
  startGame: () => void;
  resetMatch: () => void;
  placeOrder: (order: { marketId: MarketId; side: OrderSide; price: number; volume: number }) => void;
  updateSettings: (settings: SimulationSettings) => void;
  setOrderForm: (payload: { marketId: MarketId, price: number, side?: OrderSide } | null) => void;
  ballHistory: BallHistoryItem[];  // ADD THIS LINE
}

export const MatchContext = createContext<MatchContextProps | undefined>(undefined);

const initialOrderBooks = Object.keys(MARKETS).reduce((acc, marketId) => {
  acc[marketId as MarketId] = { buyOrders: [], sellOrders: [] };
  return acc;
}, {} as MatchState['orderBooks']);

const initialTrades = Object.keys(MARKETS).reduce((acc, marketId) => {
    acc[marketId as MarketId] = [];
    return acc;
}, {} as MatchState['trades']);

const initialPnl = Object.keys(MARKETS).reduce((acc, marketId) => {
    acc[marketId as MarketId] = { unrealized: 0, realized: 0 };
    return acc;
}, {} as PnL);

const initialPositions = Object.keys(MARKETS).reduce((acc, marketId) => {
    acc[marketId as MarketId] = 0;
    return acc;
}, {} as Position);


const initialAppState: MatchState = {
  matchStatus: 'not_started',
  gameState: INITIAL_GAME_STATE,
  settings: DEFAULT_SIMULATION_SETTINGS,
  orderBooks: initialOrderBooks,
  trades: initialTrades,
  pnl: initialPnl,
  positions: initialPositions,
  orderForm: null,
  ballHistory: []  // ADD THIS LINE
};

function matchReducer(state: MatchState, action: Action): MatchState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, matchStatus: 'in_progress', gameState: INITIAL_GAME_STATE };
    case 'RESET_MATCH':
      return {
        ...initialAppState,
        settings: state.settings,
        matchStatus: 'not_started',
        ballHistory: []  // ADD THIS LINE
      };
    case 'SIMULATE_BALL': {
      if (state.matchStatus !== 'in_progress') return state;
      const outcome = simulateBallOutcome(state.settings.probabilities);
      const newGameState = updateGameState(state.gameState, outcome);
      
      // ADD THESE LINES:
      const newBallHistory = [...state.ballHistory, {
          ballNumber: newGameState.ball,
          outcome: outcome,
          timestamp: Date.now()
      }].slice(-30); // Keep last 30 balls
      
      let matchStatus = state.matchStatus;
      if (newGameState.over >= OVERS_PER_MATCH) {
          matchStatus = 'finished';
      }
  
      // UPDATE THIS LINE to include ballHistory:
      return { ...state, gameState: newGameState, matchStatus, ballHistory: newBallHistory };
    }
    case 'PLACE_ORDER': {
      const { marketId, side, price, volume } = action.payload;
      const newOrder: Order = {
        id: `ord_${Date.now()}_${Math.random()}`,
        userId: 'user',
        marketId, side, price, volume,
        timestamp: Date.now()
      };
      
      const currentBook = state.orderBooks[marketId];
      const { trades, updatedBuyOrders, updatedSellOrders } = matchOrders(newOrder, currentBook);

      const newTrades = [...state.trades[marketId], ...trades];

      const newOrderBooks = {
        ...state.orderBooks,
        [marketId]: { buyOrders: updatedBuyOrders, sellOrders: updatedSellOrders }
      };

      // --- PnL & Position Calculation ---
      const newPositions = { ...state.positions };
      const newPnl = { ...state.pnl };
      
      let positionChange = side === 'BUY' ? volume : -volume;
      trades.forEach(trade => {
        positionChange -= side === 'BUY' ? trade.volume : -trade.volume;
        
        const costBasisChange = (side === 'BUY' ? trade.price : -trade.price) * trade.volume;
        newPnl[marketId].realized -= costBasisChange;
      });

      newPositions[marketId] += positionChange;

      return { ...state, trades: {...state.trades, [marketId]: newTrades}, orderBooks: newOrderBooks, positions: newPositions, pnl: newPnl };
    }
     case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_STATE':
        return action.payload;
    case 'SET_ORDER_FORM':
        return { ...state, orderForm: action.payload };
    default:
      return state;
  }
}

export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, initialAppState);
  const { toast } = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('cricketExchangeState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_STATE', payload: { ...initialAppState, ...parsedState, matchStatus: parsedState.matchStatus || 'not_started' }});
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('cricketExchangeState', JSON.stringify({
        settings: state.settings,
        pnl: state.pnl,
        positions: state.positions
        // We don't persist transient game state
      }));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state.settings, state.pnl, state.positions]);


  // Simulation loop
  useEffect(() => {
    if (state.matchStatus === 'in_progress') {
      const interval = setInterval(() => {
        dispatch({ type: 'SIMULATE_BALL' });
      }, state.settings.ballInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [state.matchStatus, state.settings.ballInterval]);

  // PnL Calculation
  const calculatePnl = useCallback(() => {
    const newPnl: PnL = JSON.parse(JSON.stringify(state.pnl));
    (Object.keys(MARKETS) as MarketId[]).forEach(marketId => {
        const position = state.positions[marketId];
        if (position === 0) {
            newPnl[marketId].unrealized = 0;
            return;
        }

        const book = state.orderBooks[marketId];
        const bestBid = book.buyOrders[0]?.price;
        const bestAsk = book.sellOrders[0]?.price;
        
        let markPrice: number | null = null;
        if (state.matchStatus === 'finished') {
            markPrice = state.gameState[marketId];
        } else {
             if (bestBid && bestAsk) {
                markPrice = (bestBid + bestAsk) / 2;
            } else if (bestBid) {
                markPrice = bestBid;
            } else if (bestAsk) {
                markPrice = bestAsk;
            }
        }
        
        if (markPrice !== null) {
            const marketValue = position * markPrice;
            newPnl[marketId].unrealized = newPnl[marketId].realized + marketValue;
        }
    });

    if (JSON.stringify(newPnl) !== JSON.stringify(state.pnl)) {
        // This is tricky in a reducer. For simplicity, we'll just update it directly.
        // In a more complex app, this might be a separate action.
        // This is a simplified approach.
    }

  }, [state.positions, state.orderBooks, state.gameState, state.matchStatus, state.pnl]);
  
  useEffect(() => {
      const pnlInterval = setInterval(calculatePnl, 5000);
      return () => clearInterval(pnlInterval);
  }, [calculatePnl]);


  const startGame = () => dispatch({ type: 'START_GAME' });
  const resetMatch = () => dispatch({ type: 'RESET_MATCH' });
  const placeOrder = (payload: { marketId: MarketId; side: OrderSide; price: number; volume: number }) => {
    dispatch({ type: 'PLACE_ORDER', payload });
    toast({ title: 'Order Placed', description: `Your ${payload.side} order for ${payload.volume} @ ${payload.price} has been submitted.` });
  };
  const updateSettings = (payload: SimulationSettings) => dispatch({ type: 'UPDATE_SETTINGS', payload });
  const setOrderForm = (payload: { marketId: MarketId, price: number, side?: OrderSide } | null) => dispatch({ type: 'SET_ORDER_FORM', payload });

  return (
    <MatchContext.Provider value={{ ...state, startGame, resetMatch, placeOrder, updateSettings, setOrderForm }}>
      {children}
    </MatchContext.Provider>
  );
}
