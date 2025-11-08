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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { campaignService, Campaign } from "@/lib/server";
import {
  getAllOnchainCampaigns,
  OnchainCampaign,
  getStatusString,
} from "@/lib/blockchain/campaignManager";

// Tipo unificado para campañas
type UnifiedCampaign = {
  id: string;
  title: string;
  description: string;
  location?: string;
  category?: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  capacity?: number;
  status: string;
  tokens: number;
  source: "offchain" | "onchain";
  creator?: string;
  funds?: string;
};

export default function CampaignsPage() {
  const [offchainCampaigns, setOffchainCampaigns] = useState<Campaign[]>([]);
  const [onchainCampaigns, setOnchainCampaigns] = useState<OnchainCampaign[]>(
    []
  );
  const [allCampaigns, setAllCampaigns] = useState<UnifiedCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<UnifiedCampaign[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Estados para aprobación
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [approvingCampaignId, setApprovingCampaignId] = useState<string | null>(
    null
  );
  const [tokenAmount, setTokenAmount] = useState<number>(0);

  // Verificar si el usuario es admin
  useEffect(() => {
    // Buscar el token en diferentes lugares del sessionStorage
    let token = sessionStorage.getItem("authToken");

    if (!token) {
      // Intentar obtener access_token
      token = sessionStorage.getItem("access_token");
    }

    // También revisar si hay user_info
    const userInfoStr = sessionStorage.getItem("user_info");

    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);

        // Verificar si user_info tiene roles
        if (userInfo.role || userInfo.roles) {
          let roles: string[] = [];
          const roleData = userInfo.role || userInfo.roles;

          if (Array.isArray(roleData)) {
            roles = roleData;
          } else if (typeof roleData === "string") {
            roles = [roleData];
          }

          const adminCheck = roles.some(
            (role) => role.toLowerCase() === "admin"
          );
          setIsAdmin(adminCheck);
        }
      } catch (error) {
        console.error("Error parsing user_info:", error);
      }
    }

    if (token) {
      setUserToken(token);
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));

        // Extraer userId del token (uuid field)
        if (decoded.uuid) {
          setUserId(decoded.uuid);
        }

        // El token puede tener role como array o string
        let roles: string[] = [];
        if (Array.isArray(decoded.role)) {
          roles = decoded.role;
        } else if (typeof decoded.role === "string") {
          roles = [decoded.role];
        }

        // Verificar si incluye "admin" (case insensitive)
        const adminCheck = roles.some((role) => role.toLowerCase() === "admin");

        setIsAdmin(adminCheck);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
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

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        // Cargar campañas offchain y onchain en paralelo
        const [offchain, onchain] = await Promise.all([
          campaignService.getAllCampaigns(),
          getAllOnchainCampaigns(50),
        ]);

        setOffchainCampaigns(offchain);
        setOnchainCampaigns(onchain);

        // Unificar campañas
        const unified = [
          ...offchain.map(
            (c): UnifiedCampaign => ({
              id: c.id,
              title: c.name,
              description: c.description,
              location: `${c.city}, ${c.country}`,
              category: c.goal,
              startDate: new Date(c.startDate),
              endDate: new Date(c.endDate),
              participants: c.currentParticipants,
              capacity: c.totalParticipants,
              status: c.campaignStatus,
              tokens: c.token,
              source: "offchain",
            })
          ),
          ...onchain.map(
            (c): UnifiedCampaign => ({
              id: `onchain-${c.id}`,
              title: c.name,
              description: c.description,
              startDate: c.startAt,
              endDate: c.endAt,
              status: getStatusString(c.status),
              tokens: Number.parseFloat(c.rewardAmount),
              source: "onchain",
              creator: c.creator,
              funds: c.funds,
            })
          ),
        ];

        setAllCampaigns(unified);
        setFilteredCampaigns(unified);
      } catch (err: any) {
        console.error("Error loading campaigns:", err);
        setError(
          err.message || "Error al cargar las campañas. Intenta nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  // Filtrar campañas cuando cambian los filtros
  useEffect(() => {
    let filtered = allCampaigns;

    // Excluir campañas en proceso
    filtered = filtered.filter((c) => c.status !== "in_progress");

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }

    // Filtro de status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filtro de fuente
    if (sourceFilter !== "all") {
      filtered = filtered.filter((c) => c.source === sourceFilter);
    }

    setFilteredCampaigns(filtered);
  }, [searchTerm, categoryFilter, statusFilter, sourceFilter, allCampaigns]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleApproveCampaign = async (campaignId: string) => {
    if (!userToken || !tokenAmount || tokenAmount <= 0) {
      alert("Por favor ingrese una cantidad válida de tokens");
      return;
    }

    try {
      await campaignService.approveCampaign(campaignId, tokenAmount, userToken);
      alert("Campaña aprobada exitosamente");
      setApprovingCampaignId(null);
      setTokenAmount(0);
      // Recargar campañas
      window.location.reload();
    } catch (error: any) {
      console.error("Error al aprobar campaña:", error);
      alert(error.message || "Error al aprobar la campaña");
    }
  };

  const handleJoinCampaign = async (campaignId: string) => {
    if (!userToken || !userId) {
      alert("Debes iniciar sesión para unirte a una campaña");
      return;
    }

    try {
      await campaignService.joinCampaign(campaignId, userId, userToken);
      alert("Te has unido a la campaña exitosamente");
      // Recargar campañas
      window.location.reload();
    } catch (error: any) {
      console.error("Error al unirse a campaña:", error);
      alert(error.message || "Error al unirse a la campaña");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando campañas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Campañas Ambientales
            </h1>
            <p className="text-muted-foreground mt-2">
              Únete a acciones ambientales transparentes y verificadas en
              blockchain
            </p>
            <div className="flex gap-2 mt-4">
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-500"
              >
                {
                  filteredCampaigns.filter((c) => c.source === "offchain")
                    .length
                }{" "}
                Offchain
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500"
              >
                {filteredCampaigns.filter((c) => c.source === "onchain").length}{" "}
                Onchain
              </Badge>
              <Badge variant="secondary">
                {filteredCampaigns.length} Total
              </Badge>
            </div>
          </div>
          <Link href="/campaigns/create">
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Crear Campaña
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campañas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              <SelectItem value="offchain">Offchain</SelectItem>
              <SelectItem value="onchain">Onchain</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los objetivos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="created">Creada</SelectItem>
              <SelectItem value="active">Activa</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Grid */}
        {filteredCampaigns.length === 0 ? (
          <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron campañas
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta ajustar los filtros o crea una nueva campaña
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => {
              const isActive = campaign.status === "active";
              const isCompleted = campaign.status === "completed";
              const isInProgress = campaign.status === "in_progress";

              let badgeVariant: "default" | "secondary" | "outline" = "outline";
              if (isActive) {
                badgeVariant = "default";
              } else if (isCompleted || isInProgress) {
                badgeVariant = "secondary";
              }

              return (
                <Card
                  key={campaign.id}
                  className={`${
                    campaign.source === "onchain"
                      ? "border-blue-500/20"
                      : "border-emerald-500/20"
                  } bg-card/50 backdrop-blur hover:bg-card/80 transition-colors`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge
                          variant={badgeVariant}
                          className={
                            isActive ? "bg-emerald-600 text-white" : ""
                          }
                        >
                          {getStatusLabel(campaign.status)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            campaign.source === "onchain"
                              ? "border-blue-500/50 text-blue-500"
                              : "border-emerald-500/50 text-emerald-500"
                          }
                        >
                          {campaign.source === "onchain"
                            ? "Onchain"
                            : "Offchain"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            campaign.source === "onchain"
                              ? "text-blue-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {campaign.tokens} GAIA
                        </div>
                        <div className="text-xs text-muted-foreground">
                          recompensa
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {campaign.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        {campaign.location}
                      </div>
                    )}
                    {campaign.category && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                        {campaign.category}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      {campaign.startDate.toLocaleDateString("es-ES")} -{" "}
                      {campaign.endDate.toLocaleDateString("es-ES")}
                    </div>
                    {campaign.participants !== undefined &&
                      campaign.capacity !== undefined && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          {campaign.participants} / {campaign.capacity}{" "}
                          participantes
                        </div>
                      )}
                    {campaign.source === "onchain" && campaign.creator && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Creador
                        </div>
                        <div className="text-sm font-mono text-blue-500">
                          {formatAddress(campaign.creator)}
                        </div>
                      </div>
                    )}
                    {campaign.source === "onchain" && campaign.funds && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Fondos
                        </div>
                        <div className="text-sm text-blue-500">
                          {campaign.funds} GAIA
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/campaigns/${campaign.id.replace(
                          "onchain-",
                          ""
                        )}`}
                        className={
                          campaign.source === "onchain" ? "w-full" : "flex-1"
                        }
                      >
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Ver Detalles
                        </Button>
                      </Link>

                      {/* Solo mostrar botones de acción para campañas offchain */}
                      {campaign.source === "offchain" && (
                        <>
                          {/* Si la campaña está "created" y el usuario es admin */}
                          {campaign.status === "created" && isAdmin ? (
                            approvingCampaignId === campaign.id ? (
                              <div className="flex-1 flex gap-1">
                                <input
                                  type="number"
                                  placeholder="Tokens"
                                  value={tokenAmount || ""}
                                  onChange={(e) =>
                                    setTokenAmount(Number(e.target.value))
                                  }
                                  className="flex-1 px-2 py-1 text-sm border rounded"
                                  min="1"
                                />
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveCampaign(campaign.id)
                                  }
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setApprovingCampaignId(null);
                                    setTokenAmount(0);
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() =>
                                  setApprovingCampaignId(campaign.id)
                                }
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                              >
                                Aprobar
                              </Button>
                            )
                          ) : campaign.status === "created" ? (
                            /* Si está "created" pero no es admin */
                            <Button
                              disabled
                              className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                            >
                              En espera de aprobación
                            </Button>
                          ) : (
                            /* Para cualquier otro estado, mostrar botón de unirse */
                            <Button
                              onClick={() => handleJoinCampaign(campaign.id)}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                            >
                              Unirse
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
