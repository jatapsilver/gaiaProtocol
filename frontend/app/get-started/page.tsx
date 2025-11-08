"use client";

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
import { Leaf, Mail, Lock, Eye, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { useState } from "react";
import { authService, APIError } from "@/lib/server";

export default function GetStartedPage() {
  const { address, isConnected, connectWallet, isConnecting } = useWallet();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.name.length > 20) {
      newErrors.name = "El nombre debe tener máximo 20 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo puede contener letras y espacios";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = "El apellido debe tener al menos 3 caracteres";
    } else if (formData.lastName.length > 20) {
      newErrors.lastName = "El apellido debe tener máximo 20 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(formData.lastName)) {
      newErrors.lastName = "El apellido solo puede contener letras y espacios";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (formData.email.length < 8) {
      newErrors.email = "El email debe tener al menos 8 caracteres";
    } else if (formData.email.length > 50) {
      newErrors.email = "El email debe tener máximo 50 caracteres";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (formData.password.length > 15) {
      newErrors.password = "La contraseña debe tener máximo 15 caracteres";
    } else if (
      !/^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,15}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (@$!%*?&)";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña es requerida";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar wallet conectada
    if (!isConnected || !address) {
      newErrors.wallet = "Debes conectar tu wallet para continuar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar el servicio de autenticación
      await authService.createUser({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        wallet: address!,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Redirigir a login o mostrar mensaje de éxito
      alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Error creating user:", error);

      // Manejar errores de la API
      let errorMessage = "Error al crear la cuenta";

      if (error instanceof APIError) {
        errorMessage = error.message;

        // Si hay errores específicos de campos
        if (error.data?.errors) {
          const fieldErrors: Record<string, string> = {};
          error.data.errors.forEach((err: any) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
          return;
        }
      }

      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Gaia Protocol
            </span>
          </Link>
        </div>

        <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription>
              Únete a Gaia Protocol para participar en campañas ambientales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Wallet Connection Section */}
            {!isConnected ? (
              <div className="mb-6 p-6 border border-emerald-500/20 rounded-lg bg-emerald-500/5 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-full">
                    <Wallet className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Conecta tu Core Wallet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Necesitas conectar tu Core Wallet para crear una cuenta en
                  Gaia Protocol
                </p>
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? "Conectando..." : "Conectar Core Wallet"}
                </Button>
                {errors.wallet && (
                  <p className="text-sm text-red-500 mt-2">{errors.wallet}</p>
                )}
              </div>
            ) : (
              <div className="mb-6 p-4 border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-600">
                      Wallet Conectada
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Ingresa tu apellido"
                    className={`pl-10 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, una mayúscula, una minúscula, un número y
                  un carácter especial (@$!%*?&)
                </p>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    className={`pl-10 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Error general */}
              {errors.submit && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500">{errors.submit}</p>
                </div>
              )}

              {/* Botón Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                disabled={!isConnected || isSubmitting}
              >
                {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
              </span>
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Iniciar Sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
