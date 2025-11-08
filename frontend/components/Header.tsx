"use client";

import { Button } from "@/components/ui/button";
import { Leaf, Wallet, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const {
    address,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
  } = useWallet();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Gaia Protocol
              </span>
            </div>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/campaigns"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive("/campaigns")
                  ? "text-tracky-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Campañas
            </Link>
            <Link
              href="/tracking"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive("/tracking")
                  ? "text-tracky-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Rastreo
            </Link>
            <Link
              href="/community"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive("/community")
                  ? "text-tracky-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Comunidad
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive("/profile")
                  ? "text-tracky-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Perfil
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {showError && error && (
              <div className="fixed top-20 right-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Fuji Testnet
                  </span>
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <span className="text-sm font-mono">
                    {formatAddress(address!)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={disconnectWallet}
                  className="border-red-500/20 hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <a href="/login" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    Iniciar Sesión
                  </Button>
                </a>
                <Button
                  size="sm"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white cursor-pointer disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? "Conectando..." : "Conectar Core Wallet"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
