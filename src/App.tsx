import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from "framer-motion";
import { ArrowRight, Search, TrendingUp, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { CoinsPage } from "./pages/Coins";
import { HowItWorksPage } from "./pages/HowItWorks";
import UseNoditMcp from "./pages/UseNoditMcp";
import { GetFirstTransaction } from "./pages/GetFirstTransaction";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import ReactPlugin from "@stagewise-plugins/react";

function Layout() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navbar */}
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">ZoraScan</span>
          </Link>
          <ConnectButton />
        </div>
      </header>
      <Outlet />
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
    </div>
  );
}

function HomePage() {
  const isLoaded = true;
  const features = [
    "Real-time price tracking",
    "Comprehensive token analytics",
    "Historical data visualization",
    "Community insights and trends"
  ];

  return (
    <section className="w-full min-h-[90vh] bg-gradient-to-b from-background to-muted/30 relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-70" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -100 }}
          animate={isLoaded ? { opacity: 0.3, scale: 1, x: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={isLoaded ? { opacity: 0.2, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
        />
      </div>
      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground/80">
              List, Search, Analyze Zora Coins
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Your all-in-one platform to effortlessly discover and analyze every coin on the Zora network. Dive deep into the data and find the next big thing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/coins">
                <Button size="lg" className="group">
                  Start Exploring
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/howitworks">
                <Button size="lg" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  How it Works
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="w-full max-w-4xl bg-card/20 border border-border/20 rounded-2xl p-8 backdrop-blur-lg relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Platform Highlights</h3>
            </div>
            <div>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <motion.li 
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="p-2 bg-green-500/10 text-green-400 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-base text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
                <Route path="coins" element={<CoinsPage />} />
        <Route path="howitworks" element={<HowItWorksPage />} />
        <Route path="usenoditmcp" element={<UseNoditMcp />} />
        <Route path="getfirsttransaction" element={<GetFirstTransaction />} />
      </Route>
    </Routes>
  );
}

export default App;
