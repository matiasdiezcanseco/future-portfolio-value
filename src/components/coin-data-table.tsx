'use client';

import CoinDataRow from '@/components/coin-data-row';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCoinStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Fragment } from 'react';

const CoinDataTable: React.FC = () => {
  const coins = useCoinStore((state) => state.coins);
  const coinsIds = coins.map(({ id }) => id);

  const totalFutureValue = coins.reduce((acc, { future_value }) => acc + (future_value || 0), 0);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Market_cap</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty. Owned</TableHead>
            <TableHead>Value (USD)</TableHead>
            <TableHead>Multiplier</TableHead>
            <TableHead>Future Value (USD)</TableHead>
            <TableHead>Future Price (USD)</TableHead>
            <TableHead>Future Market_cap (USD)</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coinsIds.map((coinId) => {
            return (
              <Fragment key={coinId}>
                <CoinDataRow coinId={coinId} />
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
      <p className="mt-4 text-muted-foreground">
        Total Future Value: <span className="text-primary">{formatCurrency(totalFutureValue)}</span>
      </p>
    </div>
  );
};

export default CoinDataTable;
