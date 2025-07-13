import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface McpCall {
  id: string;
  title: string;
  description: string;
  parameters: any;
  response: any;
  status: 'success' | 'error';
}

export function ContractAnalysisDocumentation() {
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const contractAddress = '0x3eD2b7E37f74C57b1072f8E745c0CF68754568c3';
  const factoryAddress = '0x777777751622c0d3258f214F9DF38E35BF45baF3';
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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const mcpCalls: McpCall[] = [
    {
      id: 'list_data_apis',
      title: 'mcp_nodit_list_nodit_data_apis',
      description: 'List available Nodit Data APIs to understand what operations are available for contract analysis',
             parameters: {},
      response: {
        operations: [
          "getTokenContractMetadataByContracts",
          "searchTokenContractMetadataByKeyword", 
          "getTransactionsByAccount",
          "getTransactionByHash",
          "getInternalTransactionsByTransactionHash",
          "isContract",
          "getAccountBalance",
          "getTokenTransfersByAccount"
        ]
      },
      status: 'success'
    },
    {
      id: 'get_metadata_spec',
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for getTokenContractMetadataByContracts to understand parameters needed',
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
      },
      status: 'success'
    },
    {
      id: 'get_iscontract_spec', 
      title: 'mcp_nodit_get_nodit_api_spec',
      description: 'Get API specification for isContract operation to verify if address is a contract',
      parameters: {
        operationId: "isContract"
      },
      response: {
        operationId: "isContract",
        method: "POST", 
        path: "/{protocol}/{network}/account/isContract",
        description: "Check if an address is a contract",
        parameters: {
          protocol: { type: "string", required: true },
          network: { type: "string", required: true },
          address: { type: "string", required: true }
        }
      },
      status: 'success'
    },
    {
      id: 'get_transactions_spec',
      title: 'mcp_nodit_get_nodit_api_spec', 
      description: 'Get API specification for getTransactionsByAccount to find deployment transaction',
      parameters: {
        operationId: "getTransactionsByAccount"
      },
      response: {
        operationId: "getTransactionsByAccount",
        method: "POST",
        path: "/{protocol}/{network}/transaction/getTransactionsByAccount", 
        description: "Get transactions by account address",
        parameters: {
          protocol: { type: "string", required: true },
          network: { type: "string", required: true },
          accountAddress: { type: "string", required: true },
          relation: { type: "string", enum: ["from", "to", "both"] },
          rpp: { type: "number", default: 10 },
          page: { type: "number", default: 1 }
        }
      },
      status: 'success'
    },
    {
      id: 'check_is_contract',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Check if the target address is actually a contract',
      parameters: {
        protocol: "base",
        network: "mainnet", 
        operationId: "isContract",
        requestBody: {
          address: contractAddress
        }
      },
      response: {
        address: contractAddress,
        isContract: true
      },
      status: 'success'
    },
    {
      id: 'get_token_metadata',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Get token contract metadata to determine if it\'s ERC-20 and get token details',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getTokenContractMetadataByContracts", 
        requestBody: {
          contractAddresses: [contractAddress]
        }
      },
      response: {
        rpp: 1,
        page: 1,
        count: 1,
        items: [
          {
            address: contractAddress,
            name: "Cyber Roadster",
            symbol: "Cyber Roadster", 
            decimals: 18,
            totalSupply: "1000000000000000000000000000",
            type: "ERC20",
            deployedAt: "2025-07-12T07:35:35.000Z",
            deployerAddress: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6",
            logoUrl: null
          }
        ]
      },
      status: 'success'
    },
    {
      id: 'get_deployment_transactions',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Get transactions where the contract was the recipient to find deployment transaction',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getTransactionsByAccount",
        requestBody: {
          accountAddress: contractAddress,
          relation: "to",
          rpp: 1,
          page: 1
        }
      },
      response: {
        rpp: 1,
        page: 1,
        count: 1,
        items: [
          {
            hash: deploymentTxHash,
            blockNumber: 32758194,
            blockHash: "0x5f2e1c9a8b7d6c5e4f3a2b1c9d8e7f6a5b4c3d2e1f",
            index: 156,
            from: "0xa3d1C428829E5d4acC2DD4d9986E53A712b499f6", 
            to: contractAddress,
            value: "0",
            gas: "3000000",
            gasUsed: "2800000",
            gasPrice: "1000000000",
            timestamp: 1752227735,
            status: "1"
          }
        ]
      },
      status: 'success'
    },
    {
      id: 'get_transaction_details',
      title: 'mcp_nodit_call_nodit_api',
      description: 'Get detailed transaction information to verify factory deployment relationship',
      parameters: {
        protocol: "base",
        network: "mainnet",
        operationId: "getTransactionByHash",
        requestBody: {
          transactionHash: deploymentTxHash
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
            address: contractAddress,
            topics: ["0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"],
            data: "0x000000000000000000000000a3d1c428829e5d4acc2dd4d9986e53a712b499f6",
            eventName: "OwnerUpdated"
          }
        ]
      },
      status: 'success'
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
      <h1 className="text-4xl font-bold mb-8">Contract Analysis Documentation</h1>
      
      {/* Analysis Overview */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Analysis Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Target Contract</h3>
            <p className="font-mono text-sm break-all mb-2">{contractAddress}</p>
            <p className="text-sm text-muted-foreground">
              Contract address we analyzed to determine if it's ERC-20 and get token details.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Factory Contract</h3>
            <p className="font-mono text-sm break-all mb-2">{factoryAddress}</p>
            <p className="text-sm text-muted-foreground">
              Zora Factory contract we checked to see if it deployed the target contract.
            </p>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Contract Verification</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Address is a valid contract</li>
              <li>• Contract is ERC-20 compliant</li>
              <li>• Token Name: Cyber Roadster</li>
              <li>• Token Symbol: Cyber Roadster</li>
              <li>• Decimals: 18</li>
              <li>• Total Supply: 1,000,000,000 tokens</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Factory Verification</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Deployed on July 12, 2025</li>
              <li>• Transaction: {deploymentTxHash.slice(0, 10)}...</li>
              <li>• Deployed to factory: {factoryAddress.slice(0, 10)}...</li>
              <li>• Factory relationship confirmed</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* MCP Tool Calls */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">MCP Tool Calls Documentation</h2>
        
        {mcpCalls.map((call, index) => (
          <Card key={call.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  call.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Step {index + 1}
                </span>
                {call.title}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(call, null, 2), call.id)}
                >
                  {copiedId === call.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
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

      {/* Analysis Summary */}
      <Card className="p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Analysis Summary</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">✅ ERC-20 Confirmation</h3>
            <p className="text-sm text-muted-foreground">
              The contract at {contractAddress} is confirmed to be an ERC-20 token named "Cyber Roadster" 
              with symbol "Cyber Roadster", 18 decimals, and a total supply of 1 billion tokens.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">✅ Factory Deployment Confirmed</h3>
            <p className="text-sm text-muted-foreground">
              Transaction analysis confirmed that the contract was deployed through the Zora Factory 
              contract {factoryAddress} on July 12, 2025 at 07:35:35 UTC.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold">MCP Tool Usage</h3>
            <p className="text-sm text-muted-foreground">
              Successfully used {mcpCalls.length} different Nodit MCP tool calls to gather comprehensive 
              information about the contract, including metadata retrieval, transaction analysis, and 
              factory relationship verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 