import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TokenDetails() {
  const { address } = useParams<{ address: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Token Details</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contract Address</h3>
                <p className="font-mono text-sm bg-muted p-2 rounded">{address}</p>
              </div>
              
              <div className="text-muted-foreground">
                <p>More token details will be displayed here...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 