/**
 * API Configuration
 * Centraliza la configuración de conexión con el backend
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  endpoints: {
    auth: {
      createUser: "/auth/createUser",
      login: "/auth/loginUser",
    },
    users: {
      getUserInformation: (id: string) => `/users/userInformation/${id}`,
    },
    campaigns: {
      getAllCampaigns: "/campaing/allCampaings",
      getCampaign: (id: string) => `/campaing/getCampaing/${id}`,
      createCampaign: "/campaing/createCampaing",
      updateCampaign: (id: string) => `/campaing/updateCampaing/${id}`,
      deleteCampaign: (id: string) => `/campaing/deleteCampaing/${id}`,
    },
  },
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Blockchain Configuration
 */
export const BLOCKCHAIN_CONFIG = {
  fuji: {
    rpcUrl:
      process.env.NEXT_PUBLIC_FUJI_RPC_URL ||
      "https://api.avax-test.network/ext/bc/C/rpc",
    chainId: Number(process.env.NEXT_PUBLIC_FUJI_CHAIN_ID) || 43113,
    chainIdHex: "0xa869",
    chainName: "Avalanche Fuji C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    blockExplorerUrl:
      process.env.NEXT_PUBLIC_SNOWTRACE_URL || "https://testnet.snowtrace.io",
  },
  contracts: {
    gaiaToken:
      process.env.NEXT_PUBLIC_GAIA_TOKEN_ADDRESS ||
      "0x52ecC13f091f2B15e742e7B5CfCfe48037a8247F",
    gaiaNFT:
      process.env.NEXT_PUBLIC_GAIA_NFT_ADDRESS ||
      "0x988006ffAEfC823acD9781259F60f42054134588",
    campaignManager:
      process.env.NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS ||
      "0xF83c2c5011AA6F4e862087a2282e13A74d8d6f6E",
  },
};
