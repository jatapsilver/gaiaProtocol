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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Wallet,
  LogOut,
  Loader2,
  AlertCircle,
  Leaf,
  MapPin,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { authService, userService, UserResponse, APIError } from "@/lib/server";
import {
  getCampaignsForWallet,
  getCampaignsCreatedByWallet,
  OnchainCampaign,
  getStatusString,
} from "@/lib/blockchain/campaignManager";

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [onchainCreatedCampaigns, setOnchainCreatedCampaigns] = useState<
    OnchainCampaign[]
  >([]);
  const [onchainJoinedCampaigns, setOnchainJoinedCampaigns] = useState<
    OnchainCampaign[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOnchain, setIsLoadingOnchain] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar si hay token en sessionStorage
        const token = authService.getToken();
        const userInfo = authService.getUserInfo();

        if (!token || !userInfo) {
          // No hay sesión, redirigir a login
          alert("Debes iniciar sesión para ver tu perfil");
          window.location.href = "/login";
          return;
        }

        // Obtener información completa del usuario
        const data = await userService.getUserInformation(userInfo.uuid, token);
        setUserData(data);
      } catch (err: any) {
        console.error("Error loading user data:", err);

        if (err instanceof APIError && err.status === 401) {
          // Token inválido o expirado
          authService.logout();
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          window.location.href = "/login";
        } else {
          setError(err.message || "Error al cargar la información del usuario");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Cargar campañas onchain cuando tenemos la wallet del usuario
  useEffect(() => {
    const loadOnchainCampaigns = async () => {
      if (!userData?.wallet) return;

      setIsLoadingOnchain(true);
      try {
        // Cargar campañas creadas y participando en paralelo
        const [created, joined] = await Promise.all([
          getCampaignsCreatedByWallet(userData.wallet, 50),
          getCampaignsForWallet(userData.wallet, 50),
        ]);

        setOnchainCreatedCampaigns(created);
        setOnchainJoinedCampaigns(joined);
      } catch (error: any) {
        console.error("Error loading onchain campaigns:", error);
        // No mostrar error al usuario, solo log en consola
      } finally {
        setIsLoadingOnchain(false);
      }
    };

    loadOnchainCampaigns();
  }, [userData?.wallet]);

  const handleLogout = () => {
    authService.logout();
    alert("Sesión cerrada exitosamente");
    window.location.href = "/";
  };

  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando perfil...</p>
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

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <Card className="border-emerald-500/20 bg-card/50 backdrop-blur mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 border-4 border-emerald-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl">
                    {getInitials(userData.name, userData.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {userData.name} {userData.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wallet className="h-4 w-4" />
                      <span className="font-mono">
                        {formatAddress(userData.wallet)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campañas Creadas (Offchain)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">
                {userData.createdCampaigns?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campañas Participando (Offchain)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">
                {userData.campaigns?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Creadas Onchain
                {isLoadingOnchain && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {onchainCreatedCampaigns.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Participando Onchain
                {isLoadingOnchain && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {onchainJoinedCampaigns.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de campañas */}
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="created">Offchain Creadas</TabsTrigger>
            <TabsTrigger value="joined">Offchain Participando</TabsTrigger>
            <TabsTrigger value="onchain">Onchain</TabsTrigger>
          </TabsList>

          {/* Campañas creadas (Offchain) */}
          <TabsContent value="created" className="space-y-4">
            {userData.createdCampaigns &&
            userData.createdCampaigns.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userData.createdCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-2 ring-emerald-500/20">
                            <Leaf className="h-6 w-6 text-emerald-500" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          >
                            {campaign.campaignStatus}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mt-4">
                          {campaign.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {campaign.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Ubicación
                            </span>
                            <span className="font-medium text-xs">
                              {campaign.city}, {campaign.country}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Participantes
                            </span>
                            <span className="font-medium">
                              {campaign.currentParticipants}/
                              {campaign.totalParticipants}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Tokens
                            </span>
                            <span className="font-medium text-emerald-500">
                              {campaign.token} GAIA
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No has creado campañas aún
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Comienza a crear campañas para generar impacto ambiental
                  </p>
                  <Link href="/campaigns/create">
                    <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                      Crear Primera Campaña
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Campañas participando */}
          <TabsContent value="joined" className="space-y-4">
            {userData.campaigns && userData.campaigns.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userData.campaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10 ring-2 ring-emerald-400/20">
                            <Leaf className="h-6 w-6 text-emerald-400" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                          >
                            {campaign.campaignStatus}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mt-4">
                          {campaign.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {campaign.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Ubicación
                            </span>
                            <span className="font-medium">
                              {campaign.city}, {campaign.country}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Participantes
                            </span>
                            <span className="font-medium">
                              {campaign.currentParticipants}/
                              {campaign.totalParticipants}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Tokens
                            </span>
                            <span className="font-medium text-emerald-400">
                              {campaign.token} GAIA
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No estás participando en campañas
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Explora y únete a campañas para contribuir al cambio
                    ambiental
                  </p>
                  <Link href="/campaigns">
                    <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                      Explorar Campañas
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Campañas Onchain */}
          <TabsContent value="onchain" className="space-y-6">
            {isLoadingOnchain ? (
              <Card className="border-blue-500/20 bg-card/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Cargando campañas desde la blockchain...
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Sección de Campañas Creadas Onchain */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Campañas Creadas Onchain ({onchainCreatedCampaigns.length}
                      )
                    </h3>
                  </div>
                  {onchainCreatedCampaigns.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {onchainCreatedCampaigns.map((campaign) => (
                        <Card
                          key={campaign.id}
                          className="border-blue-500/20 bg-card/50 backdrop-blur hover:border-blue-500/40 transition-colors"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 ring-2 ring-blue-500/20">
                                <Leaf className="h-6 w-6 text-blue-500" />
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                              >
                                {getStatusString(campaign.status)}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl mt-4">
                              {campaign.name || "Campaña #" + campaign.id}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {campaign.description || "Sin descripción"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Separator />
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  ID Onchain
                                </span>
                                <span className="font-medium">
                                  #{campaign.id}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Fecha Inicio
                                </span>
                                <span className="font-medium">
                                  {campaign.startAt.toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Fecha Fin
                                </span>
                                <span className="font-medium">
                                  {campaign.endAt.toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Recompensa
                                </span>
                                <span className="font-medium text-blue-500">
                                  {campaign.rewardAmount} GAIA
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Fondos
                                </span>
                                <span className="font-medium text-blue-400">
                                  {campaign.funds} GAIA
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-blue-500/20 bg-card/50 backdrop-blur">
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                          No hay campañas creadas onchain
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Sección de Campañas Participando Onchain */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Campañas Participando Onchain (
                      {onchainJoinedCampaigns.length})
                    </h3>
                  </div>
                  {onchainJoinedCampaigns.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {onchainJoinedCampaigns.map((campaign) => (
                        <Card
                          key={campaign.id}
                          className="border-blue-400/20 bg-card/50 backdrop-blur hover:border-blue-400/40 transition-colors"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10 ring-2 ring-blue-400/20">
                                <Users className="h-6 w-6 text-blue-400" />
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-blue-400/10 text-blue-400 border-blue-400/20"
                              >
                                {getStatusString(campaign.status)}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl mt-4">
                              {campaign.name || "Campaña #" + campaign.id}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {campaign.description || "Sin descripción"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Separator />
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  ID Onchain
                                </span>
                                <span className="font-medium">
                                  #{campaign.id}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Fecha Inicio
                                </span>
                                <span className="font-medium">
                                  {campaign.startAt.toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Fecha Fin
                                </span>
                                <span className="font-medium">
                                  {campaign.endAt.toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Recompensa
                                </span>
                                <span className="font-medium text-blue-400">
                                  {campaign.rewardAmount} GAIA
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Creador
                                </span>
                                <span className="font-mono text-xs">
                                  {campaign.creator.slice(0, 6)}...
                                  {campaign.creator.slice(-4)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-blue-400/20 bg-card/50 backdrop-blur">
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                          No estás participando en campañas onchain
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
