'use client';

import { Input } from '@/components/ui/input';
import { useCredentialsStore } from '@/lib/store';

const ApiKeyInput = () => {
  const apiKey = useCredentialsStore((state) => state.apiKey);
  const setApiKey = useCredentialsStore((state) => state.setApiKey);

  return (
    <label className="text-sm text-muted-foreground">
      Coingeko API Key:
      <Input
        className="text-primary"
        name="apiKey"
        id="apikey"
        placeholder="Type your key here..."
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
        }}
      />
    </label>
  );
};

export default ApiKeyInput;
