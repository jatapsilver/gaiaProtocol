"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Wallet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletInfo() {
  const { address, isConnected, connectWallet, isConnecting } = useWallet();

  if (isConnected && address) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Wallet Conectada
              </p>
              <p className="text-lg font-mono font-semibold">{address}</p>
            </div>
          </div>
          <a
            href={`https://testnet.snowtrace.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Ver en Explorer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 border border-dashed rounded-lg p-8 text-center">
      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Conecta tu Wallet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Conecta tu Core Wallet para interactuar con la plataforma Gaia Protocol
      </p>
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Conectando..." : "Conectar Core Wallet"}
      </Button>
    </div>
  );
}
