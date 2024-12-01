export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinData extends Coin {
  market_cap: number;
  price: number;
}

export interface CoinDataRow extends CoinData {
  future_value?: number;
  future_market_cap?: number;
  qtyOwned?: number;
  multiplier?: number;
}
