import axios, { AxiosError } from 'axios';

import type { Coin, CoinData } from './interfaces';
import { useCredentialsStore } from './store';

export const getCoinDataById = async (id: string) => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  const apiKey = useCredentialsStore.getState().apiKey.trim();

  try {
    const { data } = await axios.get(url, {
      headers: {
        'x-cg-demo-api-key': apiKey,
      },
    });
    const coinData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      market_cap: data.market_data.market_cap.usd,
      price: data.market_data.current_price.usd,
    };

    return coinData as CoinData;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.status === 429) throw new Error('429 Too Many Requests');
    if (e instanceof AxiosError && e.response?.status) throw new Error(`${e.response.status} There was an error`);
    if (e instanceof Error) throw new Error(e.message);
  }
};

export const getCoinList = async () => {
  const url = 'https://api.coingecko.com/api/v3/coins/list ';
  const apiKey = useCredentialsStore.getState().apiKey.trim();

  const { data } = await axios.get(url, {
    headers: {
      'x-cg-demo-api-key': apiKey,
    },
  });

  return data as Coin[];
};
