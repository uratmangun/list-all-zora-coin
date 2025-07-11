export function UseNoditMcpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Using Nodit MCP</h1>
      <p className="text-lg">
        This page will demonstrate how Nodit MCP is used to fetch data from the Zora network.
      </p>
      <div className="mt-8 p-6 bg-card border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Mock MCP Call</h2>
        <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto">
          <code>
            {
`{
  "toolName": "nodit_call_nodit_api",
  "parameters": {
    "protocol": "zora",
    "network": "mainnet",
    "operationId": "getSomeData",
    "requestBody": {}
  }
}`
            }
          </code>
        </pre>
      </div>
    </div>
  );
}
