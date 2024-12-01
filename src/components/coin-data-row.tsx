'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { getCoinDataById } from '@/lib/gecko';
import { useCoinStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';

const CoinDataRow: React.FC<{ coinId: string }> = ({ coinId }) => {
  const coin = useCoinStore((state) => state.selectCoinById(coinId));
  const { qtyOwned = 0, multiplier = 1 } = coin || {};

  const editCoinById = useCoinStore((state) => state.editCoinById);
  const deleteCoinById = useCoinStore((state) => state.deleteCoinById);

  const { data, isLoading, error } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: async () => {
      const coinData = await getCoinDataById(coinId);
      if (!coinData) return;

      editCoinById(coinId, {
        ...coinData,
      });
      return coinData;
    },
  });

  useEffect(() => {
    if (data)
      editCoinById(coinId, {
        ...data,
        future_market_cap: data.market_cap * multiplier,
        future_value: data.price * multiplier * qtyOwned,
      });
  }, [data, qtyOwned, multiplier]);

  const handleQtyOwnedChange = (qty: number) => {
    if (!coin) return;
    editCoinById(coinId, {
      ...coin,
      qtyOwned: qty || 0,
    });
  };

  const handleMultiplierChange = (multiplier: number) => {
    if (!coin) return;
    editCoinById(coinId, {
      ...coin,
      multiplier: multiplier || 1,
    });
  };

  const DeleteButton = () => {
    return (
      <Button className="h-8" variant={'destructive'} onClick={() => deleteCoinById(coinId)}>
        X
      </Button>
    );
  };

  if (error)
    return (
      <TableRow>
        <TableCell className="text-destructive">{error.message}</TableCell>
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
  if (isLoading)
    return (
      <TableRow>
        <TableCell>Loading...</TableCell>
      </TableRow>
    );
  if (data)
    return (
      <TableRow>
        <TableCell>{data.name}</TableCell>
        <TableCell>{data.symbol}</TableCell>
        <TableCell>{formatCurrency(data.market_cap)}</TableCell>
        <TableCell>{formatCurrency(data.price)}</TableCell>
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
        <TableCell>{formatCurrency(qtyOwned * data.price)}</TableCell>
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
        <TableCell>{formatCurrency(multiplier * qtyOwned * data.price)}</TableCell>
        <TableCell>{formatCurrency(multiplier * data.price)}</TableCell>
        <TableCell>{formatCurrency(multiplier * data.market_cap)}</TableCell>
        <TableCell>
          <DeleteButton />
        </TableCell>
      </TableRow>
    );
};

export default CoinDataRow;
