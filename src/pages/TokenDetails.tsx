import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import { Send } from "lucide-react";

export default function TokenDetails() {
  const { address } = useParams<{ address: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm here to help you understand this token. What would you like to know?" },
    { role: "user", content: "What is this token about?" },
    { role: "assistant", content: "This is a Zora coin token. Based on the data, I can see it has various properties including market cap, creator information, and media content. Feel free to ask me anything specific about this token!" }
  ]);

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

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { role: "user", content: currentMessage }]);
      setCurrentMessage("");
      // Mock AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: "This is a mock AI response. I would analyze the token data and provide relevant insights here." }]);
      }, 1000);
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
              <CardTitle>Chat about the coin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto space-y-3 p-4 border rounded-lg bg-muted/30">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
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
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 