"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  ArrowLeft,
  Share2,
  Heart,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";
import Link from "next/link";
import { campaignService } from "@/lib/server/services";
import {
  getCampaignBasic,
  getCampaignParticipants,
  OnchainParticipant,
  markAttendance,
} from "@/lib/blockchain/campaignManager";
import { useWallet } from "@/hooks/use-wallet";
import { BLOCKCHAIN_CONFIG } from "@/lib/server/config";
import { BrowserProvider } from "ethers";

type UnifiedCampaign = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  capacity: number;
  goal: string;
  status: string;
  tokens: number;
  source: "offchain" | "onchain";
  creator?: string;
  country?: string;
  city?: string;
  address?: string;
  imageUrl?: string;
  onchainTxHash?: string;
  onchainCampaignId?: string;
  creatorInfo?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    wallet: string;
  };
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    created: "Creada",
    active: "Activa",
    in_progress: "En Progreso",
    completed: "Completada",
    cancelled: "Cancelada",
    pending: "Pendiente",
  };
  return statusMap[status] || status;
};

export default function CampaignDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [campaign, setCampaign] = useState<UnifiedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onchainParticipants, setOnchainParticipants] = useState<
    OnchainParticipant[]
  >([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const { address, isConnected, formatAddress } = useWallet();
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(
    new Set()
  );
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  // Verificar si el usuario conectado es el creador
  const isCreator =
    campaign?.source === "onchain" &&
    isConnected &&
    address &&
    campaign.creator?.toLowerCase() === address.toLowerCase();

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Intentar cargar desde offchain primero
        try {
          const offchainCampaigns = await campaignService.getAllCampaigns();
          const offchainCampaign = offchainCampaigns.find(
            (c) => c.id === params.id
          );

          if (offchainCampaign) {
            const unified: UnifiedCampaign = {
              id: offchainCampaign.id,
              title: offchainCampaign.name,
              description: offchainCampaign.description,
              location: `${offchainCampaign.city}, ${offchainCampaign.country}`,
              startDate: new Date(offchainCampaign.startDate),
              endDate: new Date(offchainCampaign.endDate),
              participants: offchainCampaign.currentParticipants,
              capacity: offchainCampaign.totalParticipants,
              goal: offchainCampaign.goal,
              status: offchainCampaign.campaignStatus,
              tokens: offchainCampaign.token,
              source: "offchain",
              country: offchainCampaign.country,
              city: offchainCampaign.city,
              address: offchainCampaign.address,
              imageUrl: offchainCampaign.imageUrl,
              onchainTxHash: offchainCampaign.onchainTxHash,
              onchainCampaignId: offchainCampaign.onchainCampaignId,
              creatorInfo: offchainCampaign.creator,
            };
            setCampaign(unified);
            setIsLoading(false);
            return;
          }
        } catch (offchainError) {
          console.log("No se encontró en offchain, intentando onchain...");
        }

        // Si no está en offchain, intentar onchain
        try {
          const onchainId = Number.parseInt(params.id);
          if (!Number.isNaN(onchainId)) {
            const onchainCampaign = await getCampaignBasic(onchainId);
            if (onchainCampaign) {
              // Cargar participantes onchain
              setLoadingParticipants(true);
              try {
                const participants = await getCampaignParticipants(onchainId);
                setOnchainParticipants(participants);
              } catch (participantsError) {
                console.error(
                  "Error cargando participantes:",
                  participantsError
                );
              } finally {
                setLoadingParticipants(false);
              }

              const unified: UnifiedCampaign = {
                id: `onchain-${onchainId}`,
                title: onchainCampaign.name,
                description: onchainCampaign.description,
                location: "Blockchain",
                startDate: onchainCampaign.startAt,
                endDate: onchainCampaign.endAt,
                participants: 0,
                capacity: 100,
                goal: "Objetivo blockchain",
                status: onchainCampaign.status.toString(),
                tokens: Number.parseInt(onchainCampaign.rewardAmount),
                source: "onchain",
                creator: onchainCampaign.creator,
                imageUrl: onchainCampaign.imageUrl,
              };
              setCampaign(unified);
              setIsLoading(false);
              return;
            }
          }
        } catch (onchainError) {
          console.error("Error cargando desde onchain:", onchainError);
        }

        setError("Campaña no encontrada");
      } catch (err) {
        console.error("Error cargando campaña:", err);
        setError("Error al cargar la campaña");
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [params.id]);

  const handleMarkAttendance = async () => {
    if (!campaign || campaign.source !== "onchain") return;
    if (selectedParticipants.size === 0) {
      alert("Selecciona al menos un participante");
      return;
    }

    try {
      setIsMarkingAttendance(true);

      // Obtener el provider y signer de la wallet conectada
      if (!window.ethereum) {
        throw new Error("No se encontró MetaMask o Core Wallet");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const campaignId = Number.parseInt(campaign.id.replace("onchain-", ""));
      const attendees = Array.from(selectedParticipants);

      // Llamar a la función del contrato
      const tx = await markAttendance(campaignId, attendees, signer);

      alert("Transacción enviada. Esperando confirmación...");

      // Esperar confirmación
      await tx.wait();

      alert("¡Asistencia marcada exitosamente!");

      // Recargar participantes
      const updatedParticipants = await getCampaignParticipants(campaignId);
      setOnchainParticipants(updatedParticipants);
      setSelectedParticipants(new Set());
    } catch (error: any) {
      console.error("Error marcando asistencia:", error);
      alert(`Error: ${error.message || "No se pudo marcar la asistencia"}`);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const toggleParticipantSelection = (wallet: string) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(wallet)) {
      newSelected.delete(wallet);
    } else {
      newSelected.add(wallet);
    }
    setSelectedParticipants(newSelected);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Campaña no encontrada"}
          </p>
          <Link href="/campaigns">
            <Button>Volver a Campañas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Campañas
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Header */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="default"
                      className={`${
                        campaign.source === "onchain"
                          ? "bg-blue-600"
                          : "bg-emerald-600"
                      } text-white`}
                    >
                      {getStatusLabel(campaign.status)}
                    </Badge>
                    <Badge variant="outline">
                      {campaign.source === "onchain" ? "Onchain" : "Offchain"}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground">
                    {campaign.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Campaign Meta */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {campaign.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {campaign.startDate.toLocaleDateString("es-ES")} -{" "}
                  {campaign.endDate.toLocaleDateString("es-ES")}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {campaign.source === "onchain"
                    ? `${onchainParticipants.length} participantes`
                    : `${campaign.participants}/${campaign.capacity} participantes`}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-2" />
                  {campaign.goal}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Descripción</TabsTrigger>
                <TabsTrigger value="progress">Progreso</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre Esta Campaña</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {campaign.description}
                    </p>
                    {campaign.goal && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Objetivo:</h4>
                        <p className="text-muted-foreground">{campaign.goal}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {campaign.creatorInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Organizador de la Campaña</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {campaign.creatorInfo.name[0]}
                            {campaign.creatorInfo.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {campaign.creatorInfo.name}{" "}
                            {campaign.creatorInfo.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.creatorInfo.email}
                          </p>
                          {campaign.creatorInfo.wallet && (
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              {campaign.creatorInfo.wallet.slice(0, 6)}...
                              {campaign.creatorInfo.wallet.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {campaign.creator && campaign.source === "onchain" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Creador (Blockchain)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-mono text-blue-500 break-all">
                        {campaign.creator}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progreso de Participantes</CardTitle>
                    <CardDescription>
                      {campaign.source === "onchain"
                        ? "Participantes registrados en blockchain"
                        : "Participación actual en la campaña"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {campaign.source === "onchain" ? (
                      /* Mostrar participantes onchain */
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              Participantes Registrados
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {onchainParticipants.length} persona
                              {onchainParticipants.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Datos obtenidos directamente del blockchain
                          </div>
                        </div>

                        {loadingParticipants ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">
                              Cargando participantes desde blockchain...
                            </p>
                          </div>
                        ) : onchainParticipants.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              Aún no hay participantes registrados
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                Lista de Participantes:
                              </p>
                              {isCreator && selectedParticipants.size > 0 && (
                                <Button
                                  size="sm"
                                  onClick={handleMarkAttendance}
                                  disabled={isMarkingAttendance}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  {isMarkingAttendance
                                    ? "Procesando..."
                                    : `Marcar Asistencia (${selectedParticipants.size})`}
                                </Button>
                              )}
                            </div>
                            {onchainParticipants.map((participant, index) => (
                              <div
                                key={participant.wallet}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  selectedParticipants.has(participant.wallet)
                                    ? "bg-emerald-500/10 border-emerald-500/50"
                                    : "bg-muted/30 border-blue-500/20"
                                } ${
                                  isCreator && !participant.attended
                                    ? "cursor-pointer hover:border-emerald-500/50"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (isCreator && !participant.attended) {
                                    toggleParticipantSelection(
                                      participant.wallet
                                    );
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {isCreator && !participant.attended && (
                                    <input
                                      type="checkbox"
                                      checked={selectedParticipants.has(
                                        participant.wallet
                                      )}
                                      onChange={() => {}}
                                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                  )}
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {participant.name || "Usuario Anónimo"}
                                    </p>
                                    <p className="text-xs font-mono text-muted-foreground truncate">
                                      {formatAddress(participant.wallet)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-2">
                                  {participant.attended && (
                                    <Badge
                                      variant="outline"
                                      className="border-emerald-500/50 text-emerald-500 text-xs"
                                    >
                                      ✓ Asistió
                                    </Badge>
                                  )}
                                  {participant.nftMinted && (
                                    <Badge
                                      variant="outline"
                                      className="border-purple-500/50 text-purple-500 text-xs"
                                    >
                                      🎨 NFT
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Mostrar progreso offchain */
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Participantes</span>
                          <span className="text-muted-foreground">
                            {campaign.participants} / {campaign.capacity}{" "}
                            personas
                          </span>
                        </div>
                        <Progress
                          value={
                            (campaign.participants / campaign.capacity) * 100
                          }
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {Math.round(
                            (campaign.participants / campaign.capacity) * 100
                          )}
                          % completado
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estado de la Campaña</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estado:</span>
                        <Badge
                          className={`${
                            campaign.source === "onchain"
                              ? "bg-blue-600"
                              : "bg-emerald-600"
                          } text-white`}
                        >
                          {getStatusLabel(campaign.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Fuente:</span>
                        <Badge variant="outline">
                          {campaign.source === "onchain"
                            ? "Onchain"
                            : "Offchain"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Recompensa:</span>
                        <span className="text-sm font-bold text-emerald-600">
                          {campaign.tokens} GAIA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Detallada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {campaign.country && (
                      <div>
                        <span className="text-sm font-medium">País: </span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.country}
                        </span>
                      </div>
                    )}
                    {campaign.city && (
                      <div>
                        <span className="text-sm font-medium">Ciudad: </span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.city}
                        </span>
                      </div>
                    )}
                    {campaign.address && (
                      <div>
                        <span className="text-sm font-medium">Dirección: </span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.address}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div>
                      <span className="text-sm font-medium">
                        Fecha de inicio:{" "}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {campaign.startDate.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Fecha de fin:{" "}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {campaign.endDate.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {campaign.onchainTxHash && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm font-medium">
                            Hash de transacción:{" "}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground break-all">
                            {campaign.onchainTxHash}
                          </span>
                        </div>
                      </>
                    )}
                    {campaign.onchainCampaignId && (
                      <div>
                        <span className="text-sm font-medium">
                          ID Onchain:{" "}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.onchainCampaignId}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Participantes Onchain */}
                {campaign.source === "onchain" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Participantes Onchain</CardTitle>
                      <CardDescription>
                        Wallets registradas en la blockchain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingParticipants ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Cargando participantes...
                          </p>
                        </div>
                      ) : onchainParticipants.length === 0 ? (
                        <div className="text-center py-4">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            Aún no hay participantes registrados
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {onchainParticipants.map((participant, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                                      {participant.name
                                        ? participant.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)
                                        : "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {participant.name || "Usuario Anónimo"}
                                    </p>
                                    <p className="text-xs font-mono text-muted-foreground truncate">
                                      {formatAddress(participant.wallet)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-2">
                                {participant.attended && (
                                  <Badge
                                    variant="outline"
                                    className="border-emerald-500/50 text-emerald-500 text-xs"
                                  >
                                    ✓ Asistió
                                  </Badge>
                                )}
                                {participant.nftMinted && (
                                  <Badge
                                    variant="outline"
                                    className="border-purple-500/50 text-purple-500 text-xs"
                                  >
                                    🎨 NFT
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 text-center">
                            <p className="text-sm text-muted-foreground">
                              Total: {onchainParticipants.length} participante
                              {onchainParticipants.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Campaign / Onchain Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {campaign.source === "onchain"
                    ? "Información Onchain"
                    : "Unirse a la Campaña"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      campaign.source === "onchain"
                        ? "text-blue-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {campaign.tokens}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    tokens GAIA de recompensa
                  </div>
                </div>

                {campaign.source === "onchain" ? (
                  /* Botones e info para campañas onchain */
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">
                          Participantes:
                        </span>
                        <span className="font-medium">
                          {onchainParticipants.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Creador:</span>
                        <span className="font-mono text-xs font-medium text-blue-500">
                          {formatAddress(campaign.creator || "")}
                        </span>
                      </div>
                    </div>

                    {isConnected ? (
                      <div className="space-y-2">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                          Unirse Onchain
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          Requiere transacción en blockchain
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Conecta tu wallet para interactuar con esta campaña
                          onchain
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                        >
                          Conectar Wallet
                        </Button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/50">
                      <a
                        href={`https://testnet.snowtrace.io/address/${BLOCKCHAIN_CONFIG.contracts.campaignManager}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1"
                      >
                        Ver contrato en Snowtrace
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </>
                ) : (
                  /* Botón para campañas offchain */
                  <>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                      Unirse a la Campaña
                    </Button>
                    <div className="text-xs text-center text-muted-foreground">
                      {campaign.capacity - campaign.participants} lugares
                      restantes
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Progreso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.source === "onchain" ? (
                  /* Resumen para campañas onchain */
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participantes Onchain</span>
                        <span className="font-medium text-blue-600">
                          {onchainParticipants.length}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Datos verificados en blockchain
                      </div>
                    </div>
                  </>
                ) : (
                  /* Resumen para campañas offchain */
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso General</span>
                      <span className="font-medium">
                        {Math.round(
                          (campaign.participants / campaign.capacity) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(campaign.participants / campaign.capacity) * 100}
                      className="h-2"
                    />
                  </div>
                )}
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp
                      className={`h-4 w-4 ${
                        campaign.source === "onchain"
                          ? "text-blue-600"
                          : "text-emerald-600"
                      }`}
                    />
                    <span className="text-sm">
                      {campaign.source === "onchain"
                        ? `${onchainParticipants.length} participantes activos`
                        : `${campaign.participants} participantes activos`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award
                      className={`h-4 w-4 ${
                        campaign.source === "onchain"
                          ? "text-blue-600"
                          : "text-emerald-600"
                      }`}
                    />
                    <span className="text-sm">
                      {campaign.tokens} GAIA de recompensa
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield
                      className={`h-4 w-4 ${
                        campaign.source === "onchain"
                          ? "text-blue-600"
                          : "text-emerald-600"
                      }`}
                    />
                    <span className="text-sm">
                      {campaign.source === "onchain"
                        ? "Verificado en blockchain"
                        : "Verificado por la plataforma"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaign.source === "onchain" ? (
                  /* Info para campañas onchain */
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Participantes:
                      </span>
                      <span className="font-medium text-blue-600">
                        {onchainParticipants.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge
                        variant="outline"
                        className="border-blue-500/50 text-blue-500"
                      >
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>
                  </>
                ) : (
                  /* Info para campañas offchain */
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacidad:</span>
                      <span className="font-medium">{campaign.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Participantes:
                      </span>
                      <span className="font-medium">
                        {campaign.participants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-500"
                      >
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
