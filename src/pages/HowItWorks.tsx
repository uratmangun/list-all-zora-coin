import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function HowItWorksPage() {
  return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-start pt-20 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">How It Works</h1>
      <p className="mb-8 text-center text-lg">
     we use nodit mcp and zora sdk extensively to get data about zora coins. click one of this button to know how i call each mcp tool call.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl px-4">
        <Link to="/usenoditmcp" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-normal text-center px-6 py-6">Use nodit mcp on web</Button>
        </Link>
        <Link to="/getfirsttransaction" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-normal text-center px-6 py-6">Go to Get First Transaction</Button>
        </Link>
        <Link to="/searchtokenbysymbol" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-normal text-center px-6 py-6">Search Token by Symbol</Button>
        </Link>
        <Link to="/tokenfactorysearch" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-normal text-center px-6 py-6">Token Factory Search Documentation</Button>
        </Link>
        <Link to="/contractanalysisdocumentation" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-normal text-center px-6 py-6">Contract Analysis Documentation</Button>
        </Link>
      </div>
    </div>
  );
}

