import type { GameState, SimulationSettings, Order, Trade, BallOutcome, OrderSide } from './types';
import { OVERS_PER_MATCH } from './constants';

export function simulateBallOutcome(probabilities: SimulationSettings['probabilities']): BallOutcome {
  const rand = Math.random() * 100;
  let cumulative = 0;

  if ((cumulative += probabilities.dots) > rand) return '0';
  if ((cumulative += probabilities.singles) > rand) return '1';
  if ((cumulative += probabilities.doubles) > rand) return '2';
  if ((cumulative += probabilities.triples) > rand) return '3';
  if ((cumulative += probabilities.fours) > rand) return '4';
  if ((cumulative += probabilities.sixes) > rand) return '6';
  if ((cumulative += probabilities.wickets) > rand) return 'W';
  if ((cumulative += probabilities.wides) > rand) return 'Wd';
  return 'Nb';
}

export function updateGameState(currentState: GameState, outcome: BallOutcome): GameState {
  const newState: GameState = JSON.parse(JSON.stringify(currentState));
  let runs = 0;
  let isBallLegit = true;

  switch (outcome) {
    case '0': runs = 0; break;
    case '1': runs = 1; break;
    case '2': runs = 2; break;
    case '3': runs = 3; break;
    case '4': runs = 4; newState.num_boundaries++; break;
    case '6': runs = 6; newState.num_boundaries++; break;
    case 'W':
      if (!newState.isFreeHit) {
        newState.num_wickets++;
      }
      break;
    case 'Wd':
      runs = 1;
      isBallLegit = false;
      break;
    case 'Nb':
      runs = 1;
      isBallLegit = false;
      newState.isFreeHit = true;
      break;
  }

  newState.team_score += runs;
  if (newState.batsmanOnStrike === 1) {
    newState.player1_score += runs;
  } else {
    newState.player2_score += runs;
  }

  if (isBallLegit) {
    newState.ball++;
    newState.over = Math.floor(newState.ball / 6);
    newState.isFreeHit = false; // Free hit only lasts one legit ball
  }

  if (runs === 1 || runs === 3) {
    newState.batsmanOnStrike = newState.batsmanOnStrike === 1 ? 2 : 1;
  }

  if (isBallLegit && newState.ball % 6 === 0 && newState.over < OVERS_PER_MATCH) {
    newState.batsmanOnStrike = newState.batsmanOnStrike === 1 ? 2 : 1;
  }

  return newState;
}

export function matchOrders(
  newOrder: Order,
  currentBook: { buyOrders: Order[]; sellOrders: Order[] }
): { trades: Trade[]; updatedBuyOrders: Order[]; updatedSellOrders: Order[] } {
  let trades: Trade[] = [];
  let aggressorOrder = { ...newOrder };
  let buyOrders = [...currentBook.buyOrders];
  let sellOrders = [...currentBook.sellOrders];

  if (aggressorOrder.side === 'BUY') {
    sellOrders.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
    let restingOrders = sellOrders;

    for (let i = 0; i < restingOrders.length && aggressorOrder.volume > 0; i++) {
      let restingOrder = restingOrders[i];
      if (aggressorOrder.price >= restingOrder.price) {
        const tradeVolume = Math.min(aggressorOrder.volume, restingOrder.volume);
        
        trades.push({
          id: `trade_${Date.now()}_${Math.random()}`,
          marketId: aggressorOrder.marketId,
          price: restingOrder.price,
          volume: tradeVolume,
          aggressorOrderId: aggressorOrder.id,
          restingOrderId: restingOrder.id,
          timestamp: Date.now(),
        });
        
        aggressorOrder.volume -= tradeVolume;
        restingOrder.volume -= tradeVolume;
      }
    }
    
    let updatedSellOrders = restingOrders.filter(o => o.volume > 0);
    if (aggressorOrder.volume > 0) {
      buyOrders.push(aggressorOrder);
    }
    return { trades, updatedBuyOrders: buyOrders, updatedSellOrders };

  } else { // aggressor is SELL
    buyOrders.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
    let restingOrders = buyOrders;

    for (let i = 0; i < restingOrders.length && aggressorOrder.volume > 0; i++) {
        let restingOrder = restingOrders[i];
        if (aggressorOrder.price <= restingOrder.price) {
            const tradeVolume = Math.min(aggressorOrder.volume, restingOrder.volume);
            
            trades.push({
                id: `trade_${Date.now()}_${Math.random()}`,
                marketId: aggressorOrder.marketId,
                price: restingOrder.price,
                volume: tradeVolume,
                aggressorOrderId: aggressorOrder.id,
                restingOrderId: restingOrder.id,
                timestamp: Date.now(),
            });

            aggressorOrder.volume -= tradeVolume;
            restingOrder.volume -= tradeVolume;
        }
    }

    let updatedBuyOrders = restingOrders.filter(o => o.volume > 0);
    if (aggressorOrder.volume > 0) {
        sellOrders.push(aggressorOrder);
    }
    return { trades, updatedBuyOrders, updatedSellOrders: sellOrders };
  }
}
