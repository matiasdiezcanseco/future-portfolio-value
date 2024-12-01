'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCoinDataById } from '@/lib/gecko';
import { useCoinStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { useEffect } from 'react';

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

  const TooltipError: React.FC<{ text: string; error: string }> = ({ text, error }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-2 items-center">
              <CircleAlert className=" h-4 w-4 shrink-0 text-destructive" />
              <p className="text-destructive underline">{text}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  console.log(coin);
  if (error && !coin)
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
  if (coin)
    return (
      <TableRow>
        <TableCell>{error ? <TooltipError text={coin.name} error={error.message} /> : coin.name}</TableCell>
        <TableCell>{coin.symbol}</TableCell>
        <TableCell>{formatCurrency(coin.market_cap)}</TableCell>
        <TableCell>{formatCurrency(coin.price)}</TableCell>
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
        <TableCell>{formatCurrency(qtyOwned * coin.price)}</TableCell>
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
        <TableCell>{formatCurrency(multiplier * qtyOwned * coin.price)}</TableCell>
        <TableCell>{formatCurrency(multiplier * coin.price)}</TableCell>
        <TableCell>{formatCurrency(multiplier * coin.market_cap)}</TableCell>
        <TableCell>
          <DeleteButton />
        </TableCell>
      </TableRow>
    );
};

export default CoinDataRow;
