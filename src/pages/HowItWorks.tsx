import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function HowItWorksPage() {
  return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-start pt-20 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">How It Works</h1>
      <p className="mb-8 text-center text-lg">
     I use nodit mcp extensively to get data about zora coins. click one of this button to know how i call each mcp tool call.
      </p>
      <div className="flex flex-row gap-4">
        <Link to="/usenoditmcp">
          <Button>Use nodit mcp on web</Button>
        </Link>
        <Link to="/getfirsttransaction">
          <Button>Go to Get First Transaction</Button>
        </Link>
      </div>
    </div>
  );
}

