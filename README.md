docker run -d --env NODIT_API_KEY=wakdnakn --restart always --network my-net supercorp/supergateway --stdio "npx @noditlabs/nodit-mcp-server@latest" --port 8000 --cors
