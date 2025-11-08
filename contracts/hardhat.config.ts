import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("❌ Falta PRIVATE_KEY en el .env");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    paseoTestnet: {
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io", // RPC público
      chainId: 420420422,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 5_000_000, // límite de gas por transacción
      gasPrice: 1_000_000_000, // 1 Gwei, ajustar según la testnet
    },
    // Avalanche C-Chain Testnet (Fuji)
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 25000000000, // 25 gwei
    },
    // Avalanche C-Chain Mainnet
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 25000000000, // 25 gwei
    },
  },
  etherscan: {
    apiKey: {
      paseoTestnet: "abc",
      avalancheFuji: process.env.SNOWTRACE_API_KEY || "abc",
      avalanche: process.env.SNOWTRACE_API_KEY || "abc",
    },
    customChains: [
      {
        network: "paseoTestnet",
        chainId: 420420422,
        urls: {
          apiURL: "https://blockscout.passet-hub.parity-testnet.parity.io/api",
          browserURL: "https://blockscout.passet-hub.parity-testnet.parity.io",
        },
      },
      {
        network: "avalancheFuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
      {
        network: "avalanche",
        chainId: 43114,
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://snowtrace.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
