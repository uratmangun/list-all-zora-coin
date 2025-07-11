import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoinsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Canonical Deployment Address</h2>
        <div className="border rounded-lg p-4 bg-card text-card-foreground">
          <div className="grid grid-cols-4 gap-4 font-semibold mb-2 pb-2 border-b">
            <div>Chain</div>
            <div>Chain ID</div>
            <div>Contract Name</div>
            <div>Address</div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center mb-2">
            <div>Base</div>
            <div>8453</div>
            <div>ZoraFactory</div>
            <a href="https://basescan.org/address/0x777777751622c0d3258f214F9DF38E35BF45baF3" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">0x777777751622c0d3258f214F9DF38E35BF45baF3</a>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <div>Base Sepolia</div>
            <div>84532</div>
            <div>ZoraFactory</div>
            <a href="https://sepolia.basescan.org/address/0x777777751622c0d3258f214F9DF38E35BF45baF3" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">0x777777751622c0d3258f214F9DF38E35BF45baF3</a>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search for a coin..."
          className="max-w-sm"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder for coin cards */}
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Coin Name {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coin description and other details go here.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
