'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { getCoinList, getCoinsPricesByIds } from '@/lib/gecko';
import { useCoinStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const CoinDataRow: React.FC<{ coinId: string }> = ({ coinId }) => {
  const coinsIds = useCoinStore((state) => state.coinsIds);
  const deleteCoinById = useCoinStore((state) => state.deleteCoinById);

  const coinInputs = useCoinStore((state) => state.coinsInputs);
  const coinInput = coinInputs[coinId] || {};
  const { qtyOwned = 0, multiplier = 1 } = coinInput;

  const editCoinInputById = useCoinStore((state) => state.editCoinInputById);

  const { data: coinsPrices } = useQuery({
    queryKey: ['coinsPrices', coinsIds.join(',')],
    queryFn: async () => {
      const coinsPrices = await getCoinsPricesByIds(coinsIds);
      return coinsPrices;
    },
    enabled: Boolean(coinsIds.length),
  });

  const coinMarketData = coinsPrices
    ? coinsPrices[coinId]
    : {
        usd: 0,
        usd_market_cap: 0,
      };

  const { data: coinList } = useQuery({
    queryKey: ['coinsList'],
    queryFn: async () => {
      const coinList = await getCoinList();
      return coinList.map((coin) => {
        return {
          label: `${coin.name} | ${coin.symbol.toUpperCase()}`,
          value: coin.id,
          name: coin.name,
          symbol: coin.symbol,
        };
      });
    },
  });

  const coinName = coinList?.find((coin) => coin.value === coinId)?.name;
  const coinSymbol = coinList?.find((coin) => coin.value === coinId)?.symbol;

  const handleQtyOwnedChange = (qty: number) => {
    if (!coinInput) return;
    editCoinInputById({ id: coinId, qtyOwned: qty });
  };

  const handleMultiplierChange = (multi: number) => {
    if (!coinInput) return;
    editCoinInputById({ id: coinId, multiplier: multi });
  };

  const DeleteButton = () => {
    return (
      <Button className="h-8" variant={'destructive'} onClick={() => deleteCoinById(coinId)}>
        X
      </Button>
    );
  };

  if (!coinInput)
    return (
      <TableRow>
        <TableCell className="text-destructive">There was an error</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <DeleteButton />
        </TableCell>
      </TableRow>
    );

  return (
    <TableRow>
      <TableCell>{coinName}</TableCell>
      <TableCell>{coinSymbol}</TableCell>
      <TableCell>{formatCurrency(coinMarketData.usd_market_cap)}</TableCell>
      <TableCell>{formatCurrency(coinMarketData.usd)}</TableCell>
      <TableCell>
        <Input
          value={qtyOwned}
          type="number"
          onChange={(e) => {
            handleQtyOwnedChange(parseFloat(e.target.value));
          }}
          min={0}
        />
      </TableCell>
      <TableCell>{formatCurrency(qtyOwned * coinMarketData.usd)}</TableCell>
      <TableCell>
        <Input
          value={multiplier}
          type="number"
          onChange={(e) => {
            handleMultiplierChange(parseFloat(e.target.value));
          }}
          min={1}
          step={0.2}
        />
      </TableCell>
      <TableCell>{formatCurrency(multiplier * qtyOwned * coinMarketData.usd)}</TableCell>
      <TableCell>{formatCurrency(multiplier * coinMarketData.usd)}</TableCell>
      <TableCell>{formatCurrency(multiplier * coinMarketData.usd_market_cap)}</TableCell>
      <TableCell>
        <DeleteButton />
      </TableCell>
    </TableRow>
  );
};

export default CoinDataRow;
