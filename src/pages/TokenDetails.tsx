import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import { Send, Trash2 } from "lucide-react";
import { useMcp } from 'use-mcp/react';
import OpenAI from "openai";
import ReactMarkdown from 'react-markdown';

export default function TokenDetails() {
  const { address } = useParams<{ address: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user" | "system"; content: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_api_key') || '');

  const { state, tools, callTool, error: mcpError, retry } = useMcp({
    url: `https://nodit-mcp.uratmangun.fun/sse`,
    clientName: 'Zora Coins App',
    autoReconnect: true,
  });

  // Convert MCP tools to OpenAI SDK tool format
  const getOpenAITools = (): OpenAI.Chat.Completions.ChatCompletionTool[] => {
    if (!tools || tools.length === 0) return [];

    return tools.map((mcpTool) => ({
      type: "function",
      function: {
        name: mcpTool.name,
        description: mcpTool.description || '',
        parameters: mcpTool.inputSchema || {
          type: "object",
          properties: {},
          required: []
        }
      }
    }));
  };

  // Available MCP functions for tool calling
  const getAvailableFunctions = () => {
    if (!tools || tools.length === 0) return {};

    const functions: Record<string, (args: any) => Promise<string>> = {};

    tools.forEach((mcpTool) => {
      functions[mcpTool.name] = async (args: any) => {
        try {
          console.log(`Calling MCP tool: ${mcpTool.name}`, args);
          const result = await callTool(mcpTool.name, args);
          return JSON.stringify(result);
        } catch (error) {
          console.error(`Error calling ${mcpTool.name}:`, error);
          return JSON.stringify({ error: error.message || "Unknown error" });
        }
      };
    });

    return functions;
  };

  // Auto-scroll to bottom when messages change or generation completes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const clearMessages = () => {
    setMessages([]);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('openrouter_api_key', value);
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!address) return;

      try {
        setLoading(true);
        const response = await getCoin({
          address: address as `0x${string}`,
          chain: base.id,
        });

        setCoin(response.data?.zora20Token);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to fetch coin data");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [address]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isGenerating) return;

    const userMessage = { role: "user" as const, content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsGenerating(true);

    try {
      // Debug: Check MCP tools
      console.log("MCP State:", state);
      console.log("MCP Tools:", tools);
      console.log("MCP Tools Length:", tools?.length);

      // Create context from coin data
      const coinContext = coin ? `
Token Information:
- Name: ${coin.name || "N/A"}
- Symbol: ${coin.symbol || "N/A"}
- Address: ${address}
- Description: ${coin.description || "No description"}
- Market Cap: $${coin.marketCap || "N/A"}
- Total Supply: ${coin.totalSupply || "N/A"}
- Unique Holders: ${coin.uniqueHolders || "N/A"}
- Creator: ${coin.creatorAddress || "N/A"}
- Created: ${coin.createdAt ? new Date(coin.createdAt).toLocaleDateString() : "N/A"}
- Total Volume: ${coin.totalVolume || "N/A"}
- 24h Volume: ${coin.volume24h || "N/A"}
- Market Cap Delta 24h: ${coin.marketCapDelta24h || "N/A"}
      ` : `Token Address: ${address}`;

      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey || import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const openaiTools = getOpenAITools();
      const toolNames = openaiTools.map(t => t.function.name);

      // Debug: Check converted tools
      console.log("Available OpenAI Tools:", toolNames);
      console.log("Tools count:", toolNames.length);

      // Build message history for OpenAI
      const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are a helpful assistant that analyzes cryptocurrency tokens, specifically Zora coins. You have access to the following token data: ${coinContext}. 
          
          ${toolNames.length > 0 ? `You also have access to these tools: ${toolNames.join(', ')}. Use them when appropriate to get additional information about blockchain data, transactions, or token details.` : ''}
          
          Please provide helpful, accurate information about this token based on the data provided. If asked about specific metrics, refer to the actual data. Be concise but informative.`
        },
        ...messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        })),
        userMessage
      ];

      // Common OpenAI API configuration
      const openaiConfig = {
        model: "moonshotai/kimi-k2:free",
        tools: openaiTools,
        temperature: 0.3,
        tool_choice: "auto" as const,
        models: [
          'google/gemini-2.0-flash-exp:free',
          'openrouter/cypher-alpha:free',
          'deepseek/deepseek-chat-v3-0324:free',
        ],
        provider: {
           sort: "throughput",
          allow_fallbacks: true
        }

      };

      // Make the initial request
      const response = await openai.chat.completions.create({
        ...openaiConfig,
        messages: openaiMessages,
      });

      const responseMessage = response.choices[0].message;
      console.log("Response message:", JSON.stringify(responseMessage, null, 2));

      const toolCalls = responseMessage.tool_calls || [];

      if (toolCalls.length > 0) {
        // Process tool calls
        openaiMessages.push(responseMessage);
        const availableFunctions = getAvailableFunctions();

        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionToCall = availableFunctions[functionName];
          const functionArgs = JSON.parse(toolCall.function.arguments);

          // Call corresponding MCP function if it exists
          const functionResponse = functionToCall ? await functionToCall(functionArgs) : "Function not available";
          console.log(functionResponse);

          openaiMessages.push({
            role: "tool",
            content: functionResponse,
            tool_call_id: toolCall.id,
          });
        }

        // Make the final request with tool call results
        const finalResponse = await openai.chat.completions.create({
          ...openaiConfig,
          messages: openaiMessages,
        });

        const finalContent = finalResponse.choices[0].message.content || "No response generated.";
        console.log("Final result:", finalContent);
        setMessages(prev => [...prev, { role: "assistant", content: finalContent }]);
      } else {
        // No tool calls, use the direct response
        const directContent = responseMessage.content || "No response generated.";
        console.log("Direct result:", directContent);
        setMessages(prev => [...prev, { role: "assistant", content: directContent }]);
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble generating a response right now. Please try again later."
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading coin data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Token Details</h1>



        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contract Address</h3>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{address}</p>
                </div>

                {coin && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Name</h3>
                        <p>{coin.name || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Symbol</h3>
                        <p>{coin.symbol || "N/A"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold">Description</h3>
                      <p>{coin.description || "No description available"}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold">Total Supply</h3>
                        <p>{coin.totalSupply || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Unique Holders</h3>
                        <p>{coin.uniqueHolders || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Chain ID</h3>
                        <p>{coin.chainId || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Token URI</h3>
                        <p className="font-mono text-xs break-all">{coin.tokenUri || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Created At</h3>
                        <p>{coin.createdAt ? new Date(coin.createdAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          {coin && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Market Cap</h3>
                      <p>${coin.marketCap || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Market Cap Delta 24h</h3>
                      <p className={`${coin.marketCapDelta24h && parseFloat(coin.marketCapDelta24h) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {coin.marketCapDelta24h ? `${parseFloat(coin.marketCapDelta24h) > 0 ? '+' : ''}${coin.marketCapDelta24h}` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Total Volume</h3>
                      <p>{coin.totalVolume || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">24h Volume</h3>
                      <p>{coin.volume24h || "N/A"}</p>
                    </div>
                  </div>

                  {coin.creatorEarnings && coin.creatorEarnings.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Creator Earnings</h3>
                      <div className="space-y-2">
                        {coin.creatorEarnings.map((earning: any, index: number) => (
                          <div key={index} className="bg-muted p-2 rounded">
                            <p className="text-sm">Amount: {earning.amount?.amountDecimal || "N/A"}</p>
                            <p className="text-sm">USD Value: ${earning.amountUsd || "N/A"}</p>
                            <p className="text-sm font-mono text-xs">Currency: {earning.amount?.currencyAddress || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Creator Information */}
          {coin && (
            <Card>
              <CardHeader>
                <CardTitle>Creator Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Creator Address</h3>
                      <p className="font-mono text-sm">{coin.creatorAddress || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Payout Recipient</h3>
                      <p className="font-mono text-sm">{coin.payoutRecipientAddress || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Platform Referrer</h3>
                    <p className="font-mono text-sm">{coin.platformReferrerAddress || "N/A"}</p>
                  </div>

                  {coin.creatorProfile && (
                    <div>
                      <h3 className="font-semibold mb-2">Creator Profile</h3>
                      <div className="bg-muted p-3 rounded">
                        <div className="flex items-center gap-3">
                          {coin.creatorProfile.avatar?.previewImage?.small && (
                            <img
                              src={coin.creatorProfile.avatar.previewImage.small}
                              alt={coin.creatorProfile.handle || "Creator"}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-semibold">@{coin.creatorProfile.handle || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">ID: {coin.creatorProfile.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pool Information */}
          {coin?.poolCurrencyToken && (
            <Card>
              <CardHeader>
                <CardTitle>Pool Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Pool Currency Token</h3>
                    <div className="bg-muted p-3 rounded">
                      <p><strong>Name:</strong> {coin.poolCurrencyToken.name || "N/A"}</p>
                      <p><strong>Address:</strong> <span className="font-mono text-sm">{coin.poolCurrencyToken.address || "N/A"}</span></p>
                      <p><strong>Decimals:</strong> {coin.poolCurrencyToken.decimals || "N/A"}</p>
                    </div>
                  </div>

                  {coin.uniswapV4PoolKey && (
                    <div>
                      <h3 className="font-semibold mb-2">Uniswap V4 Pool Key</h3>
                      <div className="bg-muted p-3 rounded space-y-2">
                        <p><strong>Token 0:</strong> <span className="font-mono text-sm">{coin.uniswapV4PoolKey.token0Address}</span></p>
                        <p><strong>Token 1:</strong> <span className="font-mono text-sm">{coin.uniswapV4PoolKey.token1Address}</span></p>
                        <p><strong>Fee:</strong> {coin.uniswapV4PoolKey.fee}</p>
                        <p><strong>Tick Spacing:</strong> {coin.uniswapV4PoolKey.tickSpacing}</p>
                        <p><strong>Hook Address:</strong> <span className="font-mono text-sm">{coin.uniswapV4PoolKey.hookAddress}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Media Content */}
          {coin?.mediaContent && (
            <Card>
              <CardHeader>
                <CardTitle>Media Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">MIME Type</h3>
                    <p>{coin.mediaContent.mimeType || "N/A"}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Original URI</h3>
                    <p className="font-mono text-sm break-all">{coin.mediaContent.originalUri || "N/A"}</p>
                  </div>

                  {coin.mediaContent.previewImage && (
                    <div>
                      <h3 className="font-semibold mb-2">Preview Images</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {coin.mediaContent.previewImage.small && (
                          <div>
                            <p className="text-sm font-medium mb-1">Small</p>
                            <img
                              src={coin.mediaContent.previewImage.small}
                              alt={`${coin.name} - Small`}
                              className="w-32 h-32 object-cover rounded"
                            />
                          </div>
                        )}
                        {coin.mediaContent.previewImage.medium && (
                          <div>
                            <p className="text-sm font-medium mb-1">Medium</p>
                            <img
                              src={coin.mediaContent.previewImage.medium}
                              alt={`${coin.name} - Medium`}
                              className="w-32 h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>

                      {coin.mediaContent.previewImage.blurhash && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Blurhash</p>
                          <p className="font-mono text-xs text-muted-foreground">{coin.mediaContent.previewImage.blurhash}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Assistant */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chat about the coin</CardTitle>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <Button
                      onClick={clearMessages}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* API Key Input */}
              <div className="flex items-center gap-2 mt-3">
                <label htmlFor="api-key" className="text-sm font-medium text-muted-foreground shrink-0">
                  OpenRouter API Key:
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  className="text-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              {state === 'failed' ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connection to MCP service failed
                    </p>
                    <Button onClick={retry} variant="outline" size="sm">
                      Retry Connection
                    </Button>
                  </div>
                </div>
              ) : state === 'ready' ? (
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div ref={chatContainerRef} className="h-64 overflow-y-auto space-y-3 p-4 border rounded-lg bg-muted/30">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border'
                          }`}>
                          {message.role === 'assistant' ? (
                            <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="max-w-[70%] p-3 rounded-lg bg-background border">
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask me anything about this token..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isGenerating}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-sm text-muted-foreground">
                    Connecting to MCP service...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 