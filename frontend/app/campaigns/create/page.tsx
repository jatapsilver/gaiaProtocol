"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  MapPin,
  Target,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { campaignService } from "@/lib/server/services";

interface CreateCampaignForm {
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  totalParticipants: number;
  goal: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  imageUrl: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<CreateCampaignForm>({
    name: "",
    description: "",
    country: "",
    city: "",
    address: "",
    totalParticipants: 10,
    goal: "",
    startDate: undefined,
    endDate: undefined,
    imageUrl: "",
  });

  // Obtener userId del sessionStorage
  useEffect(() => {
    const userInfoStr = sessionStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        console.log("User info from sessionStorage:", userInfo);

        // Intentar obtener el ID del usuario (puede ser 'id', 'uuid', o 'userId')
        const userId = userInfo.id || userInfo.uuid || userInfo.userId;
        if (userId) {
          setUserId(userId);
          console.log("User ID set:", userId);
        } else {
          console.error("No se encontró ID de usuario en:", userInfo);
        }
      } catch (error) {
        console.error("Error parsing user_info:", error);
      }
    } else {
      console.log("No user_info found in sessionStorage");
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (
    field: keyof CreateCampaignForm,
    value: string | number | Date
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!userId) {
      setError("Debes iniciar sesión para crear una campaña");
      return false;
    }

    if (!formData.name.trim()) {
      setError("El nombre de la campaña es obligatorio");
      return false;
    }

    if (!formData.description.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }

    if (!formData.country.trim()) {
      setError("El país es obligatorio");
      return false;
    }

    if (!formData.city.trim()) {
      setError("La ciudad es obligatoria");
      return false;
    }

    if (!formData.address.trim()) {
      setError("La dirección es obligatoria");
      return false;
    }

    if (formData.totalParticipants < 1) {
      setError("Debe haber al menos 1 participante");
      return false;
    }

    if (!formData.goal.trim()) {
      setError("El objetivo es obligatorio");
      return false;
    }

    if (!formData.startDate) {
      setError("La fecha de inicio es obligatoria");
      return false;
    }

    if (!formData.endDate) {
      setError("La fecha de fin es obligatoria");
      return false;
    }

    if (formData.endDate <= formData.startDate) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return false;
    }

    if (!formData.imageUrl.trim()) {
      setError("La URL de la imagen es obligatoria");
      return false;
    }

    // Validar que sea una URL válida
    try {
      new URL(formData.imageUrl);
    } catch {
      setError("La URL de la imagen no es válida");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Preparar datos según el DTO del backend
      const campaignData = {
        createdUserId: userId!,
        name: formData.name,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        totalParticipants: formData.totalParticipants,
        goal: formData.goal,
        startDate: format(formData.startDate!, "yyyy-MM-dd"),
        endDate: format(formData.endDate!, "yyyy-MM-dd"),
        imageUrl: formData.imageUrl,
      };

      await campaignService.createCampaign(campaignData, token);

      alert("¡Campaña creada exitosamente!");
      router.push("/campaigns");
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error al crear la campaña"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Autenticación Requerida</CardTitle>
            <CardDescription>
              Debes iniciar sesión para crear una campaña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Crear Nueva Campaña
            </h1>
            <p className="text-muted-foreground mt-2">
              Configura una campaña ambiental transparente con seguimiento
              verificable
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Detalles principales de la campaña
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre de la Campaña{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ej: Salva el amazonas"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descripción <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe los objetivos y actividades de la campaña"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">
                      Objetivo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="goal"
                      placeholder="Ej: Reforestación de 1000 árboles"
                      value={formData.goal}
                      onChange={(e) =>
                        handleInputChange("goal", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">
                      URL de la Imagen <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </CardTitle>
                  <CardDescription>
                    Dónde se llevará a cabo la campaña
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        País <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        placeholder="Ej: Brasil"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">
                        Ciudad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="Ej: São Paulo"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Ej: Av. Paulista, 1578"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fechas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Fechas
                  </CardTitle>
                  <CardDescription>Duración de la campaña</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Fecha de Inicio <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={
                          formData.startDate
                            ? format(formData.startDate, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            handleInputChange(
                              "startDate",
                              new Date(e.target.value)
                            );
                          }
                        }}
                        min={format(new Date(), "yyyy-MM-dd")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        Fecha de Fin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={
                          formData.endDate
                            ? format(formData.endDate, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            handleInputChange(
                              "endDate",
                              new Date(e.target.value)
                            );
                          }
                        }}
                        min={
                          formData.startDate
                            ? format(formData.startDate, "yyyy-MM-dd")
                            : format(new Date(), "yyyy-MM-dd")
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participantes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participantes
                  </CardTitle>
                  <CardDescription>Capacidad de la campaña</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalParticipants">
                      Número Total <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="totalParticipants"
                      type="number"
                      min="1"
                      value={formData.totalParticipants}
                      onChange={(e) =>
                        handleInputChange(
                          "totalParticipants",
                          Number.parseInt(e.target.value)
                        )
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Número máximo de personas que pueden participar
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Estado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Estado Inicial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estado:</span>
                      <span className="text-sm font-medium text-yellow-600">
                        Creada
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tokens:</span>
                      <span className="text-sm font-medium">0 GAIA</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      La campaña será creada en estado "Creada" y requerirá
                      aprobación del administrador para activarse.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                  <CardContent className="pt-6">
                    <p className="text-sm text-red-500">{error}</p>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Campaña"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
