import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CoinDataRow } from './interfaces';

type CredentialsStore = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
};

export const useCredentialsStore = create<
  CredentialsStore,
  [['zustand/persist', CredentialsStore], ['zustand/devtools', never]]
>(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (apiKey) =>
        set(() => ({
          apiKey: apiKey,
        })),
    }),
    {
      name: 'credentials-store', // Unique key for localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

type CoinStore = {
  coins: CoinDataRow[];
  addCoin: (coin: CoinDataRow) => void;
  selectCoinById: (id: string) => CoinDataRow | null;
  editCoinById: (id: string, coinData: CoinDataRow) => void;
  deleteCoinById: (id: string) => void;
};

export const useCoinStore = create<CoinStore, [['zustand/persist', CoinStore], ['zustand/devtools', never]]>(
  persist(
    (set, get) => ({
      coins: [],
      addCoin: (coin) =>
        set((state) => {
          const coinExists = state.coins.some((existingCoin) => existingCoin.id === coin.id);
          if (coinExists) {
            return state; // If the coin exists, do nothing
          }
          return {
            coins: [...state.coins, coin], // Otherwise, add the new coin
          };
        }),
      selectCoinById: (id) => {
        const coin = get().coins.find((coin) => coin.id === id);
        return coin || null;
      },
      editCoinById: (id, coinData) =>
        set((state) => ({
          coins: state.coins.map((coin) => (coin.id === id ? { ...coin, ...coinData } : coin)),
        })),
      deleteCoinById: (deleteId) =>
        set((state) => ({
          coins: state.coins.filter(({ id }) => id !== deleteId),
        })),
    }),
    {
      name: 'coin-store', // Unique key for localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
