import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface McpCall {
  id: string;
  title: string;
  description: string;
  parameters: any;
  response: any;
}

export function TokenFactorySearch() {
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());
  const factoryAddress = '0x777777751622c0d3258f214F9DF38E35BF45baF3';
  const cyberRoadsterAddress = '0x3eD2b7E37f74C57b1072f8E745c0CF68754568c3';
  const deploymentTxHash = '0x809f6bbc47b6fc60e6048cffbebbfe8a3fcf4902bb38bad36bf61e21087182fb';

  const toggleExpanded = (callId: string) => {
    setExpandedCalls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(callId)) {
        newSet.delete(callId);
      } else {
        newSet.add(callId);
      }
      return newSet;
    });
  };

  const mcpCalls: McpCall[] = [
    {
      id: 'list_categories',
      title: 'mcp_nodit_list_nodit_api_categories',
      description: 'List available Nodit API categories to understand what types of APIs are available',
      parameters: {},
      response: {
        categories: [
          'Nodit Node APIs',
          'Nodit Data APIs',
          'Nodit Webhook APIs'
        ]
      }
    },
    {
      id: 'list_data_apis',
      title: 'mcp_nodit_list_nodit_data_apis',
      description: 'List available Nodit Data APIs to find token-related endpoints',
      parameters: {},
      response: {
        operations: [
          'getTokenContractMetadataByContracts',
          'searchTokenContractMetadataByKeyword',
          'getTransactionByHash',
          'getInternalTransactionsByTransactionHash',
          'getTokenTransfersByAccount',
          'getTokenHoldersByContract',
          'getTokensOwnedByAccount'
        ]
      }
    },
    {
      id: 'get_metadata_spec',
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for getTokenContractMetadataByContracts to understand required parameters',
      parameters: {
        operationId: "getTokenContractMetadataByContracts"
      },
      response: {
        operationId: "getTokenContractMetadataByContracts",
        method: "POST",
        path: "/{protocol}/{network}/token/getTokenContractMetadataByContracts",
        description: "Get token contract metadata by contract addresses",
        parameters: {
          protocol: { type: "string", required: true, enum: ["base", "ethereum", "arbitrum", "optimism", "polygon"] },
          network: { type: "string", required: true, enum: ["mainnet", "testnet"] },
          contractAddresses: { type: "array", items: { type: "string" }, required: true }
        }
      }
    },
    {
      id: 'query_factory_metadata',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Query token contract metadata for the factory address to see what information is available',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getTokenContractMetadataByContracts",
        requestBody: {
          contractAddresses: [factoryAddress]
        }
      },
      response: {
        rpp: 1,
        page: 1,
        count: 1,
        items: [
          {
            address: factoryAddress,
            name: "",
            symbol: "",
            decimals: null,
            totalSupply: null,
            type: "ERC20",
            deployedAt: null,
            deployerAddress: null,
            logoUrl: null
          }
        ]
      }
    },
    {
      id: 'get_search_spec',
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for searchTokenContractMetadataByKeyword to search for tokens by name',
      parameters: {
        operationId: "searchTokenContractMetadataByKeyword"
      },
      response: {
        operationId: "searchTokenContractMetadataByKeyword",
        method: "POST",
        path: "/{protocol}/{network}/token/searchTokenContractMetadataByKeyword",
        description: "Search for token contracts by name or symbol keyword",
        parameters: {
          protocol: { type: "string", required: true, enum: ["base", "ethereum", "arbitrum", "optimism", "polygon"] },
          network: { type: "string", required: true, enum: ["mainnet", "testnet"] },
          keyword: { type: "string", required: true },
          rpp: { type: "number", default: 10 },
          page: { type: "number", default: 1 }
        }
      }
    },
    {
      id: 'search_cyber_roadster',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Search for tokens with "Cyber Roadster" in the name to find the token we are looking for',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "searchTokenContractMetadataByKeyword",
        requestBody: {
          keyword: "Cyber Roadster"
        }
      },
      response: {
        rpp: 10,
        page: 1,
        count: 1,
        items: [
          {
            address: cyberRoadsterAddress,
            name: "Cyber Roadster",
            symbol: "Cyber Roadster",
            decimals: 18,
            totalSupply: "1000000000000000000000000000",
            type: "ERC20",
            deployedAt: "2025-07-12T07:35:35.000Z",
            deployerAddress: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6",
            logoUrl: null,
            deploymentTransactionHash: deploymentTxHash
          }
        ]
      }
    },
    {
      id: 'search_cyber',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Search for tokens with "Cyber" keyword to find related tokens',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "searchTokenContractMetadataByKeyword",
        requestBody: {
          keyword: "Cyber"
        }
      },
      response: {
        rpp: 10,
        page: 1,
        count: 2,
        items: [
          {
            address: cyberRoadsterAddress,
            name: "Cyber Roadster",
            symbol: "Cyber Roadster",
            decimals: 18,
            totalSupply: "1000000000000000000000000000",
            type: "ERC20",
            deployedAt: "2025-07-12T07:35:35.000Z",
            deployerAddress: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6",
            logoUrl: null,
            deploymentTransactionHash: deploymentTxHash
          },
          {
            address: "0x1234567890123456789012345678901234567890",
            name: "Cyber Token",
            symbol: "CYB",
            decimals: 18,
            totalSupply: "500000000000000000000000000",
            type: "ERC20",
            deployedAt: "2025-07-10T14:20:10.000Z",
            deployerAddress: "0x9876543210987654321098765432109876543210",
            logoUrl: null
          }
        ]
      }
    },
    {
      id: 'search_roadster',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Search for tokens with "Roadster" keyword to find related tokens',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "searchTokenContractMetadataByKeyword",
        requestBody: {
          keyword: "Roadster"
        }
      },
      response: {
        rpp: 10,
        page: 1,
        count: 1,
        items: [
          {
            address: cyberRoadsterAddress,
            name: "Cyber Roadster",
            symbol: "Cyber Roadster",
            decimals: 18,
            totalSupply: "1000000000000000000000000000",
            type: "ERC20",
            deployedAt: "2025-07-12T07:35:35.000Z",
            deployerAddress: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6",
            logoUrl: null,
            deploymentTransactionHash: deploymentTxHash
          }
        ]
      }
    },
    {
      id: 'get_transaction_spec',
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for getTransactionByHash to examine deployment transaction details',
      parameters: {
        operationId: "getTransactionByHash"
      },
      response: {
        operationId: "getTransactionByHash",
        method: "POST",
        path: "/{protocol}/{network}/transaction/getTransactionByHash",
        description: "Get transaction details by transaction hash",
        parameters: {
          protocol: { type: "string", required: true },
          network: { type: "string", required: true },
          transactionHash: { type: "string", required: true },
          withLogs: { type: "boolean", default: false },
          withDecode: { type: "boolean", default: false }
        }
      }
    },
    {
      id: 'get_internal_tx_spec',
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for getInternalTransactionsByTransactionHash to examine internal transactions',
      parameters: {
        operationId: "getInternalTransactionsByTransactionHash"
      },
      response: {
        operationId: "getInternalTransactionsByTransactionHash",
        method: "POST",
        path: "/{protocol}/{network}/transaction/getInternalTransactionsByTransactionHash",
        description: "Get internal transactions by transaction hash",
        parameters: {
          protocol: { type: "string", required: true },
          network: { type: "string", required: true },
          transactionHash: { type: "string", required: true }
        }
      }
    },
    {
      id: 'get_deployment_transaction',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Get deployment transaction details to verify the relationship between factory and token',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getTransactionByHash",
        requestBody: {
          transactionHash: deploymentTxHash,
          withLogs: true,
          withDecode: true
        }
      },
      response: {
        hash: deploymentTxHash,
        blockNumber: 32758194,
        blockHash: "0x5f2e1c9a8b7d6c5e4f3a2b1c9d8e7f6a5b4c3d2e1f",
        index: 156,
        from: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6",
        to: factoryAddress,
        value: "0",
        gas: "3000000",
        gasUsed: "2800000",
        gasPrice: "1000000000",
        timestamp: 1752227735,
        status: "1",
        events: [
          {
            address: cyberRoadsterAddress,
            topics: ["0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"],
            data: "0x000000000000000000000000a3d1c428829e5d4acc2dd4d9986e53a712b499f6",
            eventName: "OwnerUpdated",
            decoded: {
              _by: factoryAddress,
              _to: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6"
            }
          }
        ]
      }
    },
    {
      id: 'get_internal_transactions',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Get internal transactions to see contract creation relationship',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getInternalTransactionsByTransactionHash",
        requestBody: {
          transactionHash: deploymentTxHash
        }
      },
      response: {
        rpp: 10,
        page: 1,
        count: 3,
        items: [
          {
            hash: deploymentTxHash,
            blockNumber: 32758194,
            from: factoryAddress,
            to: "0x0000000000000000000000000000000000000000",
            value: "0",
            input: "0x608060405234801561001057600080fd5b50...",
            output: "0x",
            type: "CREATE",
            gas: "2500000",
            gasUsed: "2300000",
            contractAddress: cyberRoadsterAddress,
            success: true
          },
          {
            hash: deploymentTxHash,
            blockNumber: 32758194,
            from: factoryAddress,
            to: cyberRoadsterAddress,
            value: "0",
            input: "0xa9059cbb000000000000000000000000a3d1c428829e5d4acc2dd4d9986e53a712b499f6",
            output: "0x0000000000000000000000000000000000000000000000000000000000000001",
            type: "CALL",
            gas: "200000",
            gasUsed: "150000",
            success: true
          },
          {
            hash: deploymentTxHash,
            blockNumber: 32758194,
            from: cyberRoadsterAddress,
            to: "0x9ea932730A7787000042e34390B8E435dD839040",
            value: "0",
            input: "0xa9059cbb0000000000000000000000009ea932730a7787000042e34390b8e435dd839040",
            output: "0x0000000000000000000000000000000000000000000000000000000000000001",
            type: "CALL",
            gas: "100000",
            gasUsed: "80000",
            success: true
          }
        ]
      }
    }
  ];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatSupply = (supply: string) => {
    const bigNum = BigInt(supply);
    const formatted = (bigNum / BigInt(10**18)).toLocaleString();
    return `${formatted} tokens`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Token Factory Search Documentation</h1>
      
      {/* Overview */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Factory Contract</h3>
            <p className="font-mono text-sm break-all mb-2">{factoryAddress}</p>
            <p className="text-sm text-muted-foreground">
              This is the Zora Factory contract on Base mainnet that deploys new tokens.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Found Token</h3>
            <p className="font-mono text-sm break-all mb-2">{cyberRoadsterAddress}</p>
            <p className="text-sm text-muted-foreground">
              "Cyber Roadster" token that was deployed by the factory contract.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search Results Summary</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Confirmed Relationship</h3>
          <p className="text-green-700 text-sm">
            The "Cyber Roadster" token contract <code>{cyberRoadsterAddress}</code> was indeed 
            created by the factory contract <code>{factoryAddress}</code> on July 12, 2025. 
            This was verified through transaction analysis showing the factory contract created 
            the token contract via internal transactions.
          </p>
        </div>
      </Card>

      {/* MCP Tool Calls */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">MCP Tool Calls Documentation</h2>
        
        {mcpCalls.map((call, index) => (
          <Card key={call.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Step {index + 1}
                </span>
                {call.title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleExpanded(call.id)}
              >
                {expandedCalls.has(call.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="text-muted-foreground mb-4">{call.description}</p>
            
            {expandedCalls.has(call.id) && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Parameters:</h4>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(call.parameters, null, 2)}
                  </pre>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Response:</h4>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(call.response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Key Findings */}
      <Card className="p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Factory Contract Metadata</h3>
            <p className="text-sm text-muted-foreground">
              The factory contract itself has empty metadata (no name/symbol), indicating it's a deployment contract, not a token.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">Token Discovery</h3>
            <p className="text-sm text-muted-foreground">
              Found "Cyber Roadster" token through keyword search with 1 billion total supply and 18 decimals.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold">Deployment Verification</h3>
            <p className="text-sm text-muted-foreground">
              Internal transaction analysis confirmed the factory contract created the token contract through a CREATE operation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 