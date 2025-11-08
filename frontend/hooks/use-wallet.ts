/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
/* eslint-disable n/prefer-global/window */
"use client";

import { useState, useEffect } from "react";

// Avalanche Fuji Testnet configuration
const FUJI_CHAIN_ID = "0xa869"; // 43113 en hexadecimal
const FUJI_CHAIN_NAME = "Avalanche Fuji C-Chain";
const FUJI_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const FUJI_EXPLORER = "https://testnet.snowtrace.io";

// Extend globalThis to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        handler: (...args: any[]) => void
      ) => void;
    };
  }
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Verificar si ya está conectado al cargar
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum === undefined) {
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        // Verificar que esté en la red correcta
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId === FUJI_CHAIN_ID) {
          setWallet({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    // Verificar si Core Wallet está instalado
    if (window.ethereum === undefined) {
      setWallet((prev) => ({
        ...prev,
        error: "Por favor instala Core Wallet para continuar",
      }));
      window.open("https://core.app/", "_blank");
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Solicitar conexión
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Verificar la red actual
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // Si no está en Fuji, cambiar a Fuji
      if (chainId === FUJI_CHAIN_ID) {
        // Ya está en Fuji, continuar
      } else {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: FUJI_CHAIN_ID }],
          });
        } catch (switchError: any) {
          // Si la red no existe, agregarla
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: FUJI_CHAIN_ID,
                  chainName: FUJI_CHAIN_NAME,
                  nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18,
                  },
                  rpcUrls: [FUJI_RPC_URL],
                  blockExplorerUrls: [FUJI_EXPLORER],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setWallet({
        address: null,
        isConnected: false,
        isConnecting: false,
        error: error.message || "Error al conectar la wallet",
      });
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Escuchar cambios de cuenta y red
  useEffect(() => {
    if (window.ethereum === undefined) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWallet((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (chainId === FUJI_CHAIN_ID) {
        setWallet((prev) => ({ ...prev, error: null }));
        checkConnection();
      } else {
        setWallet((prev) => ({
          ...prev,
          error: "Por favor cambia a la red Avalanche Fuji Testnet",
        }));
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
}
