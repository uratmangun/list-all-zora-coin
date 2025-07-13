# ZoraScan - Zora Network Token Explorer

A comprehensive React application for exploring, analyzing, and discovering tokens on the Zora network. Built with modern web technologies and integrated with the Zora SDK and Nodit MCP (Model Context Protocol) for real-time blockchain data.

## 🚀 Features

- **📊 Real-time Token Discovery**: Browse and search all tokens on the Zora network
- **🔍 Advanced Search**: Find tokens by symbol, contract address, or name
- **📈 Token Analytics**: Detailed token information including price, market data, and metadata
- **🏭 Token Factory Search**: Explore token factory contracts and their deployments
- **📋 Contract Analysis**: In-depth smart contract analysis and documentation
- **🔄 Transaction History**: View first transactions and historical data
- **💰 Portfolio Integration**: Connect your wallet with RainbowKit integration
- **📱 Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Blockchain Integration**: 
  - Zora SDK (`@zoralabs/coins-sdk`)
  - Wagmi & Viem for Ethereum interactions
  - RainbowKit for wallet connections
- **Data Provider**: Nodit MCP for blockchain data
- **Animation**: Framer Motion
- **Routing**: React Router DOM

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- A Nodit API key (for blockchain data access)

### Using Bun (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd list-all-zora-coin

# Install dependencies
bun install

# Start development server
bun run dev
```

### Using pnpm
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:
```bash
VITE_NODIT_API_KEY=your_nodit_api_key_here
```

### Nodit MCP Gateway (Optional)
For enhanced blockchain data access, you can run the Nodit MCP gateway:

```bash
docker run -d --env NODIT_API_KEY=your_api_key --restart always --network my-net supercorp/supergateway --stdio "npx @noditlabs/nodit-mcp-server@latest" --port 8000 --cors
```

## 🎯 Usage

### Main Features

1. **Token Discovery**: Visit the main page to browse all available Zora tokens
2. **Search Functionality**: Use the search bar to find specific tokens by symbol or address
3. **Token Details**: Click on any token to view detailed information, analytics, and contract data
4. **Wallet Integration**: Connect your wallet to interact with tokens directly

### Available Pages

- **`/`** - Homepage with featured tokens and platform overview
- **`/coins`** - Complete token listing and search interface
- **`/token/:address`** - Detailed token information page
- **`/howitworks`** - Platform documentation and feature explanations
- **`/usenoditmcp`** - Nodit MCP integration examples
- **`/getfirsttransaction`** - Transaction history tools
- **`/searchtokenbysymbol`** - Symbol-based token search
- **`/tokenfactorysearch`** - Token factory exploration
- **`/contractanalysisdocumentation`** - Smart contract analysis tools

## 🔗 API Integration

### Zora SDK
The application uses the official Zora SDK to interact with:
- Token metadata and pricing
- Contract information
- Network-specific data

### Nodit MCP
Leverages Nodit's Model Context Protocol for:
- Real-time blockchain data
- Transaction history
- Contract analysis
- Token factory information

## 🏗️ Development

### Project Structure
```
src/
├── components/ui/          # Reusable UI components
├── pages/                  # Route components
├── lib/                    # Utility functions
└── App.tsx                 # Main application component
```

### Available Scripts
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m '✨ Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation in the `/howitworks` section
- Review the contract analysis documentation

---

**Built with ❤️ for the Zora ecosystem**
