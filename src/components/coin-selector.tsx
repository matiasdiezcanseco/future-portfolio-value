'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getCoinList } from '@/lib/gecko';
import { useCoinStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

const CoinSelector = () => {
  const addCoin = useCoinStore((state) => state.addCoin);

  const {
    data: coinList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['coinList'],
    queryFn: async () => {
      const coinList = await getCoinList();
      return coinList.map((coin) => {
        return {
          label: coin.name,
          value: coin.id,
        };
      });
    },
  });

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const filteredCoinList =
    coinList?.filter((coin) => coin.label.toLowerCase().includes(value?.toLowerCase())).slice(0, 50) || [];

  if (isError) return <p className="text-destructive">Error getting coins...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (!coinList) return <p>No coins available</p>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          Select coin...
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search a coin..."
            onChangeCapture={(e) => {
              const { target } = e as React.ChangeEvent<HTMLInputElement>;
              setValue(target.value);
            }}
          />
          <CommandList>
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {filteredCoinList.map((coin) => (
                <CommandItem
                  key={coin.value}
                  value={coin.value}
                  onSelect={() => {
                    setOpen(false);
                    addCoin({
                      id: coin.value,
                      market_cap: 0,
                      name: '',
                      price: 0,
                      symbol: '',
                      future_market_cap: 0,
                      future_value: 0,
                    });
                  }}
                >
                  {coin.label}
                  <Check className={cn('ml-auto', value === coin.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CoinSelector;
