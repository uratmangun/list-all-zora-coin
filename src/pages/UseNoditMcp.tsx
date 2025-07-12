import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useMcp } from 'use-mcp/react';

const exampleParameters: Record<string, any> = {
  call_nodit_api: {
    "protocol": "base",
    "network": "mainnet",
    "operationId": "getTransactionsByAccount",
    "requestBody": {
      "accountAddress": "0x777777751622c0d3258f214F9DF38E35BF45baF3",
      "rpp": 1,
      "withLogs": true,
      "withDecode": true
    }
  },
  get_nodit_api_spec: {
    operationId: "getTransactionsByAccount",
  },
};

function ToolCard({ tool, callTool }: { tool: any; callTool: (name: string, args: any) => Promise<any> }) {
  const [jsonArgs, setJsonArgs] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  

  const handleCall = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const parsedArgs = jsonArgs ? JSON.parse(jsonArgs) : {};
      let res = await callTool(tool.name, parsedArgs);

      if (res && Array.isArray(res.content) && res.content.length > 0 && res.content[0].type === 'text' && typeof res.content[0].text === 'string') {
        try {
          res = JSON.parse(res.content[0].text);
        } catch (e) {
          // Not a JSON string, so we'll just show the text
          res = res.content[0].text;
        }
      }

      setResult(res);
    } catch (error) {
      console.error("Error parsing JSON or calling tool:", error);
      setResult({ error: "Invalid JSON format or tool call failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card border rounded-lg">
      <h3 className="font-semibold text-lg">{tool.name}</h3>
      {tool.description && <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>}

      {tool.inputSchema && (
        <>
          {exampleParameters[tool.name as keyof typeof exampleParameters] && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">Example Parameters:</h4>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(exampleParameters[tool.name as keyof typeof exampleParameters], null, 2)}
              </pre>
            </div>
          )}
          <form className="space-y-2 mt-4" onSubmit={e => { e.preventDefault(); handleCall(); }}>
            <label className="text-sm font-medium" htmlFor={`${tool.name}-args`}>Parameters (JSON)</label>
            <textarea
              id={`${tool.name}-args`}
              value={jsonArgs}
              onChange={e => setJsonArgs(e.target.value)}
              className="w-full border rounded-md p-2 font-mono text-sm"
              rows={10}
              placeholder="Enter JSON parameters here..."
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calling...
                </>
              ) : (
                'Call Tool'
              )}
            </Button>
          </form>
        </>
      )}
      {!tool.inputSchema && (
        <Button onClick={handleCall} className="mt-4 w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calling...
          </>
        ) : (
          'Call Tool'
        )}
      </Button>
      )}

      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">Result:</h4>
          <div className="bg-muted/50 p-2 rounded-md overflow-x-auto text-sm font-mono">
            <JsonViewer data={result} />
          </div>
        </div>
      )}
    </div>
  );
}

const JsonViewer = ({ data }: { data: any }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (typeof data !== 'object' || data === null) {
    return <span className="text-blue-500">{JSON.stringify(data)}</span>;
  }

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const entries = Object.entries(data);
  const isArray = Array.isArray(data);

  return (
    <div>
      <button onClick={toggleExpand} className="focus:outline-none">
        {isExpanded ? '[-]' : '[+]'} {isArray ? `Array(${entries.length})` : `Object`}
      </button>
      {isExpanded && (
        <div className="pl-4 border-l border-gray-600 ml-2">
          {entries.map(([key, value]) => (
            <div key={key}>
              <span className="text-purple-400">{isArray ? '' : `"${key}": `}</span>
              <JsonViewer data={value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function McpConnection({ url }: { url: string }) {
  const { state, tools, callTool, error, retry } = useMcp({
    url,
    clientName: 'Nodit Playground',
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

export default function UseNoditMcp() {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('nodit-api-key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('nodit-api-key', apiKey);
    setIsKeySet(true);
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('nodit-api-key');
    setApiKey('');
    setIsKeySet(false);
  };

  const toggleShowApiKey = () => setShowApiKey(!showApiKey);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Nodit MCP Playground</h1>
        <p className="text-muted-foreground mb-6">
          Enter your Nodit API key to get started. You can get one from the{' '}
          <a href="https://www.nodit.io/" target="_blank" rel="noopener noreferrer" className="underline">
            Nodit website
          </a>
          .
        </p>
        {!isKeySet ? (
          <>
            <div className="relative mb-4">
              <Input
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your Nodit API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full px-3"
                onClick={toggleShowApiKey}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveKey} className="w-full mb-4">
              Save and Connect
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md mb-4">
            <p className="text-sm text-green-500">API Key is set.</p>
            <Button onClick={handleRemoveKey} variant="destructive" size="sm">Remove Key</Button>
          </div>
        )}

        {isKeySet && <McpConnection url={`https://mcp.nodit.io/sse?apiKey=${apiKey}`} />}
      </div>
    </div>
  );
}
