import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import * as React from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { X } from "lucide-react";
import { useMcp } from 'use-mcp/react';

type TSelectData = {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  custom?: React.ReactNode;
};

type SelectProps = {
  data?: TSelectData[];
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
};

const Select = ({ data, defaultValue, onChange, placeholder }: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TSelectData | undefined>(undefined);

  React.useEffect(() => {
    if (defaultValue) {
      const item = data?.find((i) => i.value === defaultValue);
      if (item) {
        setSelected(item);
      }
    }
  }, [defaultValue, data]);

  const onSelect = (value: string) => {
    const item = data?.find((i) => i.value === value);
    setSelected(item as TSelectData);
    if (onChange) onChange(value);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <MotionConfig
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 500,
      }}
    >
      <div className="relative w-full" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{selected ? selected.label : placeholder}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md"
            >
              <div className="p-1">
                {data?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item.value)}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

const searchTypes = [
  { id: "1", label: "Token Symbol", value: "symbol" },
  { id: "2", label: "Token Contract", value: "contract" },
];

function CoinsPage() {
  const [searchType, setSearchType] = useState("symbol");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { state, tools, callTool, error, retry } = useMcp({
    url: `https://nodit-mcp.uratmangun.fun/sse`,
    clientName: 'Zora Coins App',
    autoReconnect: true,
  });

  const isConnected = state === 'ready';

  const truncateHash = (hash: string, prefixLength = 6, suffixLength = 4) => {
    if (!hash) return '';
    return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !isConnected) return;

    if (searchType === "symbol") {
      setIsLoading(true);
      try {
        const result = await callTool("call_nodit_api", {
          protocol: "base",
          network: "mainnet",
          operationId: "searchTokenContractMetadataByKeyword",
          requestBody: {
            keyword: searchQuery.trim()
          }
        });

        // Parse the response
        let parsedResult = result;
        if (result && Array.isArray(result.content) && result.content.length > 0 && result.content[0].type === 'text') {
          parsedResult = JSON.parse(result.content[0].text);
        }

        const items = parsedResult.items || [];
        
        // If we have items, validate each one by checking the deployment transaction
        if (items.length > 0) {
          const validatedTokens = [];
          
          for (const token of items) {
            if (token.deployedTransactionHash) {
              try {
                const txResult = await callTool("call_nodit_api", {
                  protocol: "base",
                  network: "mainnet",
                  operationId: "getTransactionByHash",
                  requestBody: {
                    transactionHash: token.deployedTransactionHash,
                    withLogs: true,
                    withDecode: true
                  }
                });

                // Parse the transaction response
                let parsedTxResult = txResult;
                if (txResult && Array.isArray(txResult.content) && txResult.content.length > 0 && txResult.content[0].type === 'text') {
                  parsedTxResult = JSON.parse(txResult.content[0].text);
                }

                // Check if any log in the transaction has the Zora factory contract address
                if (parsedTxResult.logs && Array.isArray(parsedTxResult.logs)) {
                  const hasZoraFactoryLog = parsedTxResult.logs.some(log => 
                    log.contractAddress === "0x777777751622c0d3258f214F9DF38E35BF45baF3"
                  );
                  
                  if (hasZoraFactoryLog) {
                    validatedTokens.push(token);
                  }
                }
              } catch (error) {
                console.error("Failed to validate token:", token.address, error);
              }
            }
          }
          
          setSearchResults(validatedTokens);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else if (searchType === "contract") {
      setIsLoading(true);
      try {
        const result = await callTool("call_nodit_api", {
          protocol: "base",
          network: "mainnet",
          operationId: "getTokenContractMetadataByContracts",
          requestBody: {
            contractAddresses: [searchQuery.trim()]
          }
        });

        // Parse the response
        let parsedResult = result;
        if (result && Array.isArray(result.content) && result.content.length > 0 && result.content[0].type === 'text') {
          parsedResult = JSON.parse(result.content[0].text);
        }

        const contracts = Array.isArray(parsedResult) ? parsedResult : [];
        
        // If we have contracts, validate each one by checking the deployment transaction
        if (contracts.length > 0) {
          const validatedTokens = [];
          
          for (const token of contracts) {
            if (token.deployedTransactionHash) {
              try {
                const txResult = await callTool("call_nodit_api", {
                  protocol: "base",
                  network: "mainnet",
                  operationId: "getTransactionByHash",
                  requestBody: {
                    transactionHash: token.deployedTransactionHash,
                    withLogs: true,
                    withDecode: true
                  }
                });

                // Parse the transaction response
                let parsedTxResult = txResult;
                if (txResult && Array.isArray(txResult.content) && txResult.content.length > 0 && txResult.content[0].type === 'text') {
                  parsedTxResult = JSON.parse(txResult.content[0].text);
                }

                // Check if any log in the transaction has the Zora factory contract address
                if (parsedTxResult.logs && Array.isArray(parsedTxResult.logs)) {
                  const hasZoraFactoryLog = parsedTxResult.logs.some(log => 
                    log.contractAddress === "0x777777751622c0d3258f214F9DF38E35BF45baF3"
                  );
                  
                  if (hasZoraFactoryLog) {
                    validatedTokens.push(token);
                  }
                }
              } catch (error) {
                console.error("Failed to validate token:", token.address, error);
              }
            }
          }
          
          setSearchResults(validatedTokens);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Contract search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Canonical Deployment Address</h2>
        <div className="rounded-lg border bg-card p-4 text-card-foreground">
          <div className="mb-2 grid grid-cols-4 gap-4 border-b pb-2 font-semibold">
            <div>Chain</div>
            <div>Chain ID</div>
            <div>Contract Name</div>
            <div>Address</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div>Base</div>
            <div>8453</div>
            <div>ZoraFactory</div>
            <a
              href="https://basescan.org/address/0x777777751622c0d3258f214F9DF38E35BF45baF3"
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-500 hover:underline"
            >
              0x777777751622c0d3258f214F9DF38E35BF45baF3
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8">
        {state === 'failed' && (
          <div className="mb-4 flex items-center justify-center">
            <Button onClick={retry} variant="outline" size="sm">
              Retry Connection
            </Button>
          </div>
        )}
        <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground shrink-0">Filter by</label>
            <div className="w-full sm:w-48">
              <Select
                data={searchTypes}
                defaultValue="symbol"
                onChange={(value) => setSearchType(value)}
                placeholder="Select search type"
              />
            </div>
          </div>
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search for a coin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
              disabled={!isConnected}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button type="button" onClick={handleSearch} disabled={!isConnected || isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
        {!isConnected && (
          <div className="mt-2 text-sm text-muted-foreground">
            Connection status: {state}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {searchResults.map((token, i) => (
                      <Card key={token.address || i} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{token.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Symbol: {token.symbol}</p>
                <p className="text-sm text-muted-foreground">
                  Address: <span className="font-mono text-xs">{truncateHash(token.address)}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Tx Hash: <span className="font-mono text-xs">{truncateHash(token.deployedTransactionHash)}</span>
                </p>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

export default CoinsPage;
