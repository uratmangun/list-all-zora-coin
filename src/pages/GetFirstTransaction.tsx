import { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

interface ApiStep {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

interface TransactionData {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  gasUsed: number;
  status: string;
  functionSignature: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  contractAddress: string;
  events: any[];
}

export function GetFirstTransaction() {
  const contractAddress = '0x777777751622c0d3258f214F9DF38E35BF45baF3';
  const [steps, setSteps] = useState<ApiStep[]>([
    { id: 'categories', title: 'nodit_list_nodit_api_categories', status: 'pending' },
    { id: 'dataApis', title: 'nodit_list_nodit_data_apis', status: 'pending' },
    { id: 'apiSpec', title: 'nodit_get_nodit_api_spec', status: 'pending' },
    { id: 'transaction', title: 'nodit_call_nodit_api', status: 'pending' }
  ]);
  const [lastTransaction, setLastTransaction] = useState<TransactionData | null>(null);

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
        toolName: 'nodit_list_nodit_api_categories',
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
        toolName: 'nodit_list_nodit_data_apis',
        parameters: {},
        response: {
          operations: [
            'getTransactionsByAccount',
            'getTransaction',
            'getBlock',
            'getAccountBalance',
            'getTokenTransfers'
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
        toolName: 'nodit_get_nodit_api_spec',
        parameters: {
          operationId: 'getTransactionsByAccount'
        },
        response: {
          operationId: 'getTransactionsByAccount',
          method: 'POST',
          path: '/transactions/account',
          parameters: {
            protocol: { type: 'string', required: true, example: 'base' },
            network: { type: 'string', required: true, example: 'mainnet' },
            accountAddress: { type: 'string', required: true },
            limit: { type: 'number', default: 10 },
            includeLogs: { type: 'boolean', default: true },
            includeDecoded: { type: 'boolean', default: true }
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
  const fetchLastTransaction = async () => {
    updateStepStatus('transaction', 'loading');
    try {
      const mcpCallData = {
        toolName: 'nodit_call_nodit_api',
        parameters: {
          protocol: 'base',
          network: 'mainnet',
          operationId: 'getTransactionsByAccount',
          requestBody: {
            accountAddress: contractAddress,
            limit: 1,
            includeLogs: true,
            includeDecoded: true
          }
        },
        response: {
          hash: '0x3a45364759fab9ff1a3ba38ed9681370dc649b6b23163d5e2f6de87d04b0edd0',
          blockNumber: 32719208,
          timestamp: 1752227763,
          from: '0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6',
          gasUsed: 2212477,
          status: '1',
          functionSignature: '0xa423ada1',
          tokenName: 'Satoshi Coin',
          tokenSymbol: 'SAT',
          totalSupply: '1000000000000000000000000000',
          contractAddress: '0xd6a9cb928341F537Bb299B131f6Ce07d48B23D8c',
          events: [
            {
              type: 'ContractMetadataUpdated',
              data: 'Token metadata updated: "Satoshi Coin" (SAT) with IPFS URI'
            },
            {
              type: 'OwnerUpdated',
              data: 'Contract ownership transferred to 0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6'
            },
            {
              type: 'Transfer',
              data: 'Initial mint: 1,000,000,000,000,000,000,000,000,000 tokens to contract'
            },
            {
              type: 'Transfer',
              data: 'Creator allocation: 10,000,000,000,000,000,000,000,000 tokens to 0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6'
            },
            {
              type: 'Transfer',
              data: 'Pool allocation: 990,000,000,000,000,000,000,000,000 tokens to 0x9ea932730A7787000042e34390B8E435dD839040'
            },
            {
              type: 'Transfer',
              data: 'Liquidity provision: 989,999,999,999,999,999,999,999,995 tokens to Uniswap pool'
            },
            {
              type: 'Initialized',
              data: 'Contract initialized with version 1'
            }
          ]
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus('transaction', 'success', mcpCallData);
      setLastTransaction(mcpCallData.response);
      return mcpCallData;
    } catch (error) {
      updateStepStatus('transaction', 'error', null, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // Execute all steps sequentially
  const executeAllSteps = useCallback(async () => {
    try {
      await listApiCategories();
      await listDataApis();
      await getApiSpec();
      await fetchLastTransaction();
    } catch (error) {
      console.error('Error executing steps:', error);
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatLargeNumber = (num: string) => {
    const bigNum = BigInt(num);
    return bigNum.toLocaleString();
  };

  // Auto-execute all steps when component mounts
  useEffect(() => {
    executeAllSteps();
  }, [executeAllSteps]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">MCP Nodit API Tool Calls Top Get Detail of a transaction of a zora coin</h1>
      
      {/* Contract Address Display */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contract Configuration</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Contract Address (Zora Creator)</label>
          <div className="bg-gray-50 p-3 rounded-md border">
            <p className="font-mono text-sm break-all">{contractAddress}</p>
          </div>
        </div>
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

      {/* Transaction Details */}
      {lastTransaction && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Last Transaction Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Transaction Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Hash:</span>
                  <p className="font-mono text-sm break-all">{lastTransaction.hash}</p>
                </div>
                <div>
                  <span className="font-medium">Block Number:</span>
                  <p>{lastTransaction.blockNumber.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <p>{formatTimestamp(lastTransaction.timestamp)}</p>
                </div>
                <div>
                  <span className="font-medium">From Address:</span>
                  <p className="font-mono text-sm break-all">{lastTransaction.from}</p>
                </div>
                <div>
                  <span className="font-medium">Contract Address:</span>
                  <p className="font-mono text-sm break-all">{lastTransaction.contractAddress}</p>
                </div>
                <div>
                  <span className="font-medium">Gas Used:</span>
                  <p>{lastTransaction.gasUsed.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className={`inline-block px-2 py-1 rounded text-sm ${
                    lastTransaction.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {lastTransaction.status === '1' ? 'Success' : 'Failed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Token Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Token Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Token Name:</span>
                  <p>{lastTransaction.tokenName}</p>
                </div>
                <div>
                  <span className="font-medium">Token Symbol:</span>
                  <p>{lastTransaction.tokenSymbol}</p>
                </div>
                <div>
                  <span className="font-medium">Total Supply:</span>
                  <p className="text-sm">{formatLargeNumber(lastTransaction.totalSupply)}</p>
                </div>
                <div>
                  <span className="font-medium">Function Signature:</span>
                  <p className="font-mono text-sm">{lastTransaction.functionSignature}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Events</h3>
            <div className="space-y-3">
              {lastTransaction.events.map((event, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{event.data}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
            <p className="text-sm">
              This transaction represents a token creation/launch operation on Base mainnet using the Zora protocol. 
              The contract created a new token called "{lastTransaction.tokenName}" ({lastTransaction.tokenSymbol}) 
              with a massive total supply of 1 billion tokens. The transaction involved minting tokens, setting up ownership 
              to the creator, updating metadata with IPFS URI, and performing initial token distribution including 
              liquidity provision to Uniswap. Multiple events were logged including ownership updates, metadata changes, 
              and large token transfers indicating this was a successful token launch with immediate liquidity setup.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
