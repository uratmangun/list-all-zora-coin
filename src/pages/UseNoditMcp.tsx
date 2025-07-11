import { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useMcp } from 'use-mcp/react';

function ToolCard({ tool, callTool }: { tool: any; callTool: (name: string, args: any) => Promise<any> }) {
  const [args, setArgs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const properties = tool.inputSchema?.properties ?? {};
  const propKeys = Object.keys(properties);

  const handleChange = (key: string, value: string) => {
    setArgs(prev => ({ ...prev, [key]: value }));
  };

  const handleCall = async () => {
    try {
      const parsedArgs = propKeys.length ? args : {};
      const res = await callTool(tool.name, parsedArgs);
      setResult(res);
    } catch (err) {
      console.error('Tool call failed:', err);
      setResult({ error: String(err) });
    }
  };

  return (
    <div className="p-4 bg-card border rounded-lg">
      <h3 className="font-semibold text-lg">{tool.name}</h3>
      {tool.description && <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>}

      {propKeys.length > 0 && (
        <form className="space-y-2 mt-4" onSubmit={e => { e.preventDefault(); handleCall(); }}>
          {propKeys.map(key => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor={`${tool.name}-${key}`}>{key}</label>
              <Input
                id={`${tool.name}-${key}`}
                value={args[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
              />
            </div>
          ))}
          <Button type="submit" className="w-full">Call Tool</Button>
        </form>
      )}
      {propKeys.length === 0 && (
        <Button onClick={handleCall} className="mt-4 w-full">Call Tool</Button>
      )}

      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">Result:</h4>
          <pre className="bg-muted/50 p-2 rounded-md overflow-x-auto text-sm">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function McpConnection({ url }: { url: string }) {
  const { state, tools, error, retry, callTool } = useMcp({
    url,
    clientName: 'list-all-zora-coin',
    autoReconnect: true,
  });

  if (state === 'failed') {
    return (
      <div className="mt-4 text-center">
        <p className="text-red-500">Connection failed: {error}</p>
        <Button onClick={retry} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (state !== 'ready') {
    return <div className="mt-4 text-center">Connecting to MCP... State: {state}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Available Tools</h2>
      <div className="space-y-4">
        {tools.map(tool => (
          <ToolCard key={tool.name} tool={tool} callTool={callTool} />
        ))}
      </div>
    </div>
  );
}

export function UseNoditMcpPage() {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [mcpUrl, setMcpUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('nodit-api-key');
    if (storedKey) {
      setIsKeySet(true);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('nodit-api-key', apiKey);
    setIsKeySet(true);
    alert('API Key saved!');
  };

  const handleConnectMcp = () => {
    const storedKey = localStorage.getItem('nodit-api-key');
    if (storedKey) {
      setMcpUrl(`https://mcp.nodit.io/sse?apiKey=${storedKey}`);
    } else {
      alert('Please save an API key first.');
    }
  };

  const toggleShowApiKey = () => setShowApiKey(!showApiKey);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Using Nodit MCP</h1>

      <div className="w-full max-w-md mx-auto mb-8">
        <p className="text-lg mb-4 text-center">
          Please enter your Nodit API key to continue.
        </p>
        <div className="relative mb-4">
          <Input
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter your Nodit API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-0 h-full px-3"
            onClick={toggleShowApiKey}
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={handleSaveKey} className="w-full mb-4">
          Save API Key
        </Button>
        <Button onClick={handleConnectMcp} className="w-full mb-4">
          Connect to MCP
        </Button>
        {isKeySet && !mcpUrl && (
          <p className="text-green-500 text-center mb-4">Nodit API Key is set. Ready to connect.</p>
        )}
      </div>

      {mcpUrl ? (
        <McpConnection url={mcpUrl} />
      ) : (
        <p className="text-lg text-center">
          Enter and save your API key, then click "Connect to MCP" to see the available tools.
        </p>
      )}
    </div>
  );
}
