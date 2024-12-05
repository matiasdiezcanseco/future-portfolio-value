import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  coinsIds: string[];
  addCoinId: (coinId: string) => void;
  deleteCoinById: (id: string) => void;

  coinsInputs: { [key: string]: { multiplier: number; qtyOwned: number } };
  addCoinInput: (coinInputs: { coinId: string; multiplier: number; qtyOwned: number }) => void;
  deleteCoinInputById: (id: string) => void;
  editCoinInputById: (data: { id: string; multiplier?: number; qtyOwned?: number }) => void;
};

export const useCoinStore = create<
  CoinStore,
  [['zustand/persist', CoinStore], ['zustand/devtools', never]]
>(
  persist(
    (set, get) => ({
      coinsIds: [],
      addCoinId: (coinId) =>
        set((state) => {
          const coinExists = state.coinsIds.some((existingCoinId) => existingCoinId === coinId);
          if (coinExists) {
            return state; // If the coin exists, do nothing
          }
          return {
            coinsIds: [...state.coinsIds, coinId], // Otherwise, add the new coin
          };
        }),
      deleteCoinById: (coinId) => {
        set((state) => {
          const newCoinsIds = state.coinsIds.filter((existingCoinId) => existingCoinId !== coinId);
          return {
            coinsIds: [...newCoinsIds],
          };
        });
      },
      coinsInputs: {},
      addCoinInput: (coinInputs) => {
        const existingCoin = get().coinsInputs[coinInputs.coinId];

        if (!existingCoin || !existingCoin.qtyOwned) {
          return; // If the coin doesn't exist or it's not owned, do nothing
        }

        set((state) => ({
          ...state,
          coinsInputs: {
            ...state.coinsInputs,
            [coinInputs.coinId]: { ...existingCoin, ...coinInputs },
          },
        }));
      },
      deleteCoinInputById: (id) => {
        delete get().coinsInputs[id];

        set(() => ({
          coinsInputs: { ...get().coinsInputs },
        }));
      },
      editCoinInputById: ({ id, multiplier, qtyOwned }) => {
        set((state) => {
          const coin = get().coinsInputs[id];
          const updatedCoinsInputs = { ...state.coinsInputs };
          if (multiplier) {
            updatedCoinsInputs[id] = { ...coin, multiplier };
          }
          if (qtyOwned) {
            updatedCoinsInputs[id] = { ...coin, qtyOwned };
          }
          return {
            coinsInputs: { ...updatedCoinsInputs },
          };
        });
      },
    }),

    {
      name: 'coin-store', // Unique key for localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
