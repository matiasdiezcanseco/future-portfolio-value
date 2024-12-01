'use client';

import ApiKeyInput from '@/components/api-key-input';
import CoinDataTable from '@/components/coin-data-table';
import CoinSelector from '@/components/coin-selector';

export default function Page() {
  return (
    <div className="m-4 mt-12 space-y-6">
      <div className="space-y-4">
        <h1 className="text-6xl text-center">Future Portfolio Value</h1>
        <p className="text-center mx-auto max-w-[600px] text-muted-foreground">
          Input your Coingecko Demo API Key and add the coins your want. Everything is saved locally. Your information
          never leaves your computer.
        </p>
      </div>
      <div className="space-y-6 max-w-64">
        <ApiKeyInput />
        <CoinSelector />
      </div>
      <CoinDataTable />
    </div>
  );
}
