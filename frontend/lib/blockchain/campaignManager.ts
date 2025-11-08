/**
 * CampaignManager Smart Contract Service
 * Interactúa con el contrato CampaignManager en Avalanche Fuji
 */

import { ethers } from "ethers";
import { BLOCKCHAIN_CONFIG } from "../server/config";

// ABI simplificado del CampaignManager (solo las funciones que necesitamos)
const CAMPAIGN_MANAGER_ABI = [
  // getCampaignBasic
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getCampaignBasic",
    outputs: [
      { internalType: "uint256", name: "cid", type: "uint256" },
      { internalType: "string", name: "uuid_", type: "string" },
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "description_", type: "string" },
      { internalType: "uint256", name: "startAt", type: "uint256" },
      { internalType: "uint256", name: "endAt", type: "uint256" },
      { internalType: "address", name: "creator_", type: "address" },
      { internalType: "uint256", name: "rewardAmount", type: "uint256" },
      { internalType: "uint256", name: "funds", type: "uint256" },
      { internalType: "uint8", name: "status_", type: "uint8" },
      { internalType: "string", name: "imageUrl", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // getCampaignCreatorAndWallets
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getCampaignCreatorAndWallets",
    outputs: [
      { internalType: "uint256", name: "cid", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "address[]", name: "wallets", type: "address[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // getParticipants
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getParticipants",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "bool", name: "attended", type: "bool" },
          { internalType: "bool", name: "nftMinted", type: "bool" },
        ],
        internalType: "struct CampaignManager.Participant[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // markAttendance
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address[]", name: "attendees", type: "address[]" },
    ],
    name: "markAttendance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export enum CampaignStatus {
  Created = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface OnchainCampaign {
  id: number;
  uuid: string;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  creator: string;
  rewardAmount: string;
  funds: string;
  status: CampaignStatus;
  imageUrl: string;
}

export interface OnchainParticipant {
  name: string;
  wallet: string;
  attended: boolean;
  nftMinted: boolean;
}

/**
 * Obtiene el provider de Avalanche Fuji
 */
function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.fuji.rpcUrl);
}

/**
 * Obtiene el contrato CampaignManager
 */
function getCampaignManagerContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(
    BLOCKCHAIN_CONFIG.contracts.campaignManager,
    CAMPAIGN_MANAGER_ABI,
    provider
  );
}

/**
 * Obtiene la información básica de una campaña por su ID
 */
export async function getCampaignBasic(
  campaignId: number
): Promise<OnchainCampaign> {
  try {
    const contract = getCampaignManagerContract();
    const result = await contract.getCampaignBasic(campaignId);

    return {
      id: Number(result.cid),
      uuid: result.uuid_,
      name: result.name_,
      description: result.description_,
      startAt: new Date(Number(result.startAt) * 1000),
      endAt: new Date(Number(result.endAt) * 1000),
      creator: result.creator_,
      rewardAmount: ethers.formatEther(result.rewardAmount),
      funds: ethers.formatEther(result.funds),
      status: Number(result.status_) as CampaignStatus,
      imageUrl: result.imageUrl,
    };
  } catch (error: any) {
    console.error(`Error fetching campaign ${campaignId}:`, error);
    throw new Error(
      `No se pudo obtener la campaña ${campaignId}: ${error.message}`
    );
  }
}

/**
 * Obtiene las wallets participantes de una campaña
 */
export async function getCampaignWallets(
  campaignId: number
): Promise<string[]> {
  try {
    const contract = getCampaignManagerContract();
    const result = await contract.getCampaignCreatorAndWallets(campaignId);
    return result.wallets;
  } catch (error: any) {
    console.error(`Error fetching campaign wallets ${campaignId}:`, error);
    throw new Error(
      `No se pudieron obtener las wallets de la campaña ${campaignId}: ${error.message}`
    );
  }
}

/**
 * Obtiene los participantes de una campaña
 */
export async function getCampaignParticipants(
  campaignId: number
): Promise<OnchainParticipant[]> {
  try {
    const contract = getCampaignManagerContract();
    const participants = await contract.getParticipants(campaignId);

    return participants.map((p: any) => ({
      name: p.name,
      wallet: p.wallet,
      attended: p.attended,
      nftMinted: p.nftMinted,
    }));
  } catch (error: any) {
    console.error(`Error fetching campaign participants ${campaignId}:`, error);
    throw new Error(
      `No se pudieron obtener los participantes de la campaña ${campaignId}: ${error.message}`
    );
  }
}

/**
 * Verifica si una wallet está participando en una campaña
 */
export async function isWalletInCampaign(
  campaignId: number,
  walletAddress: string
): Promise<boolean> {
  try {
    const wallets = await getCampaignWallets(campaignId);
    return wallets
      .map((w) => w.toLowerCase())
      .includes(walletAddress.toLowerCase());
  } catch (error) {
    console.error(`Error checking wallet in campaign ${campaignId}:`, error);
    return false;
  }
}

/**
 * Obtiene todas las campañas en las que participa una wallet
 * @param userWallet Dirección de la wallet del usuario
 * @param maxCampaignId ID máximo de campaña a verificar (por defecto 100)
 */
export async function getCampaignsForWallet(
  userWallet: string,
  maxCampaignId: number = 100
): Promise<OnchainCampaign[]> {
  const campaigns: OnchainCampaign[] = [];

  // Buscar en todas las campañas (de 1 a maxCampaignId)
  for (let i = 1; i <= maxCampaignId; i++) {
    try {
      // Verificar si la wallet está en la campaña
      const isParticipant = await isWalletInCampaign(i, userWallet);

      if (isParticipant) {
        const campaign = await getCampaignBasic(i);
        campaigns.push(campaign);
      }
    } catch (error: any) {
      // Si la campaña no existe, continuar con la siguiente
      console.debug(`Campaign ${i} not found or error:`, error.message);
      continue;
    }
  }

  return campaigns;
}

/**
 * Obtiene las campañas creadas por una wallet
 * @param creatorWallet Dirección de la wallet del creador
 * @param maxCampaignId ID máximo de campaña a verificar (por defecto 100)
 */
export async function getCampaignsCreatedByWallet(
  creatorWallet: string,
  maxCampaignId: number = 100
): Promise<OnchainCampaign[]> {
  const campaigns: OnchainCampaign[] = [];

  // Buscar en todas las campañas (de 1 a maxCampaignId)
  for (let i = 1; i <= maxCampaignId; i++) {
    try {
      const campaign = await getCampaignBasic(i);

      if (campaign.creator.toLowerCase() === creatorWallet.toLowerCase()) {
        campaigns.push(campaign);
      }
    } catch (error: any) {
      // Si la campaña no existe, continuar con la siguiente
      console.debug(`Campaign ${i} not found or error:`, error.message);
      continue;
    }
  }

  return campaigns;
}

/**
 * Obtiene TODAS las campañas onchain
 * @param maxCampaignId ID máximo de campaña a verificar (por defecto 100)
 */
export async function getAllOnchainCampaigns(
  maxCampaignId: number = 100
): Promise<OnchainCampaign[]> {
  const campaigns: OnchainCampaign[] = [];

  // Buscar en todas las campañas (de 1 a maxCampaignId)
  for (let i = 1; i <= maxCampaignId; i++) {
    try {
      const campaign = await getCampaignBasic(i);
      campaigns.push(campaign);
    } catch (error: any) {
      // Si la campaña no existe, continuar con la siguiente
      console.debug(`Campaign ${i} not found or error:`, error.message);
      continue;
    }
  }

  return campaigns;
}

/**
 * Convierte el status de enum a string legible
 */
export function getStatusString(status: CampaignStatus): string {
  switch (status) {
    case CampaignStatus.Created:
      return "Creada";
    case CampaignStatus.Active:
      return "Activa";
    case CampaignStatus.Completed:
      return "Completada";
    case CampaignStatus.Cancelled:
      return "Cancelada";
    default:
      return "Desconocido";
  }
}

/**
 * Marca la asistencia de participantes en una campaña
 * Solo el creador de la campaña puede ejecutar esta función
 * @param campaignId ID de la campaña
 * @param attendeeAddresses Array de direcciones de wallets a marcar como asistentes
 * @param signer Signer con la wallet conectada (debe ser el creador)
 */
export async function markAttendance(
  campaignId: number,
  attendeeAddresses: string[],
  signer: ethers.Signer
): Promise<ethers.ContractTransactionResponse> {
  try {
    const contract = new ethers.Contract(
      BLOCKCHAIN_CONFIG.contracts.campaignManager,
      CAMPAIGN_MANAGER_ABI,
      signer
    );

    const tx = await contract.markAttendance(campaignId, attendeeAddresses);
    return tx;
  } catch (error: any) {
    console.error(
      `Error marking attendance for campaign ${campaignId}:`,
      error
    );
    throw new Error(
      `No se pudo marcar la asistencia: ${error.message || "Error desconocido"}`
    );
  }
}
