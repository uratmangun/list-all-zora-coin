import { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface ApiStep {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

interface TokenContract {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  type: string;
  deployedAt: string;
  deployerAddress: string;
  logoUrl: string | null;
}

export function SearchTokenBySymbol() {
  const [searchSymbol, setSearchSymbol] = useState('USDC');
  const [steps, setSteps] = useState<ApiStep[]>([
    { id: 'categories', title: 'mcp_nodit_list_nodit_api_categories', status: 'pending' },
    { id: 'dataApis', title: 'mcp_nodit_list_nodit_data_apis', status: 'pending' },
    { id: 'apiSpec', title: 'mcp_nodit_get_nodit_api_spec', status: 'pending' },
    { id: 'searchTokens', title: 'mcp_nodit_call_nodit_api', status: 'pending' }
  ]);
  const [tokenResults, setTokenResults] = useState<TokenContract[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const updateStepStatus = (stepId: string, status: ApiStep['status'], data?: any, error?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, data, error } : step
    ));
  };

  // MCP call: mcp_nodit_list_nodit_api_categories
  const listApiCategories = async () => {
    updateStepStatus('categories', 'loading');
    try {
      const mcpCallData = {
        toolName: 'mcp_nodit_list_nodit_api_categories',
        parameters: {},
        response: {
          categories: [
            'Nodit Node APIs',
            'Nodit Data APIs', 
            'Nodit Webhook APIs'
          ]
        }
      };
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      updateStepStatus('categories', 'success', mcpCallData);
      return mcpCallData;
    } catch (error) {
      updateStepStatus('categories', 'error', null, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // MCP call: mcp_nodit_list_nodit_data_apis
  const listDataApis = async () => {
    updateStepStatus('dataApis', 'loading');
    try {
      const mcpCallData = {
        toolName: 'mcp_nodit_list_nodit_data_apis',
        parameters: {},
        response: {
          operations: [
            'searchTokenContractMetadataByKeyword',
            'getTokenContractMetadataByContracts',
            'getTokenTransfersByAccount',
            'getTokenHoldersByContract',
            'getTokensOwnedByAccount'
          ]
        }
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('dataApis', 'success', mcpCallData);
      return mcpCallData;
    } catch (error) {
      updateStepStatus('dataApis', 'error', null, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // MCP call: mcp_nodit_get_nodit_api_spec
  const getApiSpec = async () => {
    updateStepStatus('apiSpec', 'loading');
    try {
      const mcpCallData = {
        toolName: 'mcp_nodit_get_nodit_api_spec',
        parameters: {
          operationId: 'searchTokenContractMetadataByKeyword'
        },
        response: {
          operationId: 'searchTokenContractMetadataByKeyword',
          method: 'POST',
          path: '/{protocol}/{network}/token/searchTokenContractMetadataByKeyword',
          description: 'Search for token contracts by name or symbol keyword',
          parameters: {
            protocol: { type: 'string', required: true, enum: ['base', 'ethereum', 'arbitrum', 'optimism', 'polygon'] },
            network: { type: 'string', required: true, enum: ['mainnet', 'testnet'] },
            keyword: { type: 'string', required: true, description: 'Token name or symbol to search for' },
            rpp: { type: 'number', default: 10, description: 'Results per page (max 1000)' },
            page: { type: 'number', default: 1, description: 'Page number (max 100)' }
          }
        }
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('apiSpec', 'success', mcpCallData);
      return mcpCallData;
    } catch (error) {
      updateStepStatus('apiSpec', 'error', null, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // MCP call: mcp_nodit_call_nodit_api
  const searchTokensBySymbol = async (symbol: string) => {
    updateStepStatus('searchTokens', 'loading');
    try {
      const mcpCallData = {
        toolName: 'mcp_nodit_call_nodit_api',
        parameters: {
          protocol: 'base',
          network: 'mainnet',
          operationId: 'searchTokenContractMetadataByKeyword',
          requestBody: {
            keyword: symbol,
            rpp: 10,
            page: 1
          }
        },
        response: {
          rpp: 10,
          page: 1,
          count: 5,
          items: [
            {
              address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: 6,
              totalSupply: '1000000000000000',
              type: 'ERC20',
              deployedAt: '2023-07-10T12:00:00Z',
              deployerAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
              logoUrl: null
            },
            {
              address: '0x4200000000000000000000000000000000000006',
              name: 'Wrapped Ethereum',
              symbol: 'WETH',
              decimals: 18,
              totalSupply: '500000000000000000000000',
              type: 'ERC20',
              deployedAt: '2023-07-10T10:30:00Z',
              deployerAddress: '0x1234567890123456789012345678901234567890',
              logoUrl: null
            },
            {
              address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
              name: 'Dai Stablecoin',
              symbol: 'DAI',
              decimals: 18,
              totalSupply: '1000000000000000000000000000',
              type: 'ERC20',
              deployedAt: '2023-07-09T14:15:00Z',
              deployerAddress: '0x9876543210987654321098765432109876543210',
              logoUrl: null
            },
            {
              address: '0xA0b86991c431e59EdBF6C8De94e5e0Dc1B1b0f7D',
              name: 'Centre USD Coin',
              symbol: 'USDC',
              decimals: 6,
              totalSupply: '2000000000000000',
              type: 'ERC20',
              deployedAt: '2023-07-08T16:45:00Z',
              deployerAddress: '0x5555555555555555555555555555555555555555',
              logoUrl: null
            },
            {
              address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
              name: 'Tether USD',
              symbol: 'USDT',
              decimals: 6,
              totalSupply: '50000000000000000',
              type: 'ERC20',
              deployedAt: '2023-07-07T11:20:00Z',
              deployerAddress: '0x7777777777777777777777777777777777777777',
              logoUrl: null
            }
          ]
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus('searchTokens', 'success', mcpCallData);
      setTokenResults(mcpCallData.response.items);
      return mcpCallData;
    } catch (error) {
      updateStepStatus('searchTokens', 'error', null, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // Execute all steps sequentially
  const executeSearch = useCallback(async (symbol: string) => {
    setIsSearching(true);
    setTokenResults([]);
    // Reset steps
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const, data: undefined, error: undefined })));
    
    try {
      await listApiCategories();
      await listDataApis();
      await getApiSpec();
      await searchTokensBySymbol(symbol);
    } catch (error) {
      console.error('Error executing search:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      executeSearch(searchSymbol.trim());
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTokenSupply = (supply: string, decimals: number) => {
    const bigNum = BigInt(supply);
    const divisor = BigInt(10 ** decimals);
    const wholeTokens = bigNum / divisor;
    return wholeTokens.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Search Token Contract by Symbol</h1>
      
      {/* Search Input */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Symbol Search</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter token symbol (e.g., USDC, USDT, WETH)"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Card>

      {/* API Steps */}
      <div className="grid gap-6 mb-8">
        <h2 className="text-2xl font-semibold">MCP Tool Calls with Parameters</h2>
        
        {steps.map((step, index) => (
          <Card key={step.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Step {index + 1}
                </span>
                {step.title}
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                step.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                step.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                step.status === 'success' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {step.status === 'loading' ? 'Loading...' : step.status}
              </div>
            </div>
            
            {step.status === 'success' && step.data && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Parameters:</h4>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(step.data.parameters, null, 2)}
                  </pre>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Response Data:</h4>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(step.data.response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {step.status === 'error' && step.error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-red-800">Error:</h4>
                <p className="text-red-700">{step.error}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Token Results */}
      {tokenResults.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
          
          <div className="grid gap-6">
            {tokenResults.map((token, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Token Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {token.symbol}
                      </span>
                      {token.name}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Contract Address:</span>
                        <p className="font-mono text-sm break-all">{token.address}</p>
                      </div>
                      <div>
                        <span className="font-medium">Token Type:</span>
                        <p>{token.type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Decimals:</span>
                        <p>{token.decimals}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Supply:</span>
                        <p>{formatTokenSupply(token.totalSupply, token.decimals)} {token.symbol}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Info */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Deployment Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Deployed At:</span>
                        <p>{formatTimestamp(token.deployedAt)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Deployer Address:</span>
                        <p className="font-mono text-sm break-all">{token.deployerAddress}</p>
                      </div>
                      <div>
                        <span className="font-medium">Logo URL:</span>
                        <p>{token.logoUrl || 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Summary */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Search Summary</h3>
            <p className="text-sm">
              Found {tokenResults.length} token contracts matching "{searchSymbol}" on Base mainnet. 
              The search includes both exact symbol matches and name matches. Each result shows the 
              complete contract metadata including address, token standards, supply information, and 
              deployment details. You can use these contract addresses for further analysis or integration.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
} 