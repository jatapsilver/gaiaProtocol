# 🌐 Gestión de Conexiones API - Gaia Protocol

## 📁 Estructura de Carpetas

```
frontend/
├── .env.local                    # Variables de entorno
└── lib/
    └── server/                   # Gestión de conexiones API
        ├── index.ts              # Barrel export
        ├── config.ts             # Configuración centralizada
        ├── api-client.ts         # Cliente HTTP reutilizable
        └── services.ts           # Servicios por módulo
```

## 🔧 Configuración

### Variables de Entorno (`.env.local`)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Blockchain
NEXT_PUBLIC_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_FUJI_CHAIN_ID=43113
NEXT_PUBLIC_SNOWTRACE_URL=https://testnet.snowtrace.io

# Smart Contracts (Fuji Testnet)
NEXT_PUBLIC_GAIA_TOKEN_ADDRESS=0x52ecC13f091f2B15e742e7B5CfCfe48037a8247F
NEXT_PUBLIC_GAIA_NFT_ADDRESS=0x988006ffAEfC823acD9781259F60f42054134588
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0xF83c2c5011AA6F4e862087a2282e13A74d8d6f6E
```

## 📚 Uso de los Servicios

### 1. Autenticación

#### Crear Usuario

```typescript
import { authService } from "@/lib/server";

try {
  const user = await authService.createUser({
    name: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    password: "Password123*",
    confirmPassword: "Password123*",
  });

  console.log("Usuario creado:", user);
} catch (error) {
  if (error instanceof APIError) {
    console.error("Error:", error.message, error.status);
  }
}
```

#### Iniciar Sesión

```typescript
import { authService } from "@/lib/server";

try {
  const { token, user } = await authService.login({
    email: "juan@example.com",
    password: "Password123*",
  });

  // Guardar token
  localStorage.setItem("token", token);

  console.log("Usuario:", user);
} catch (error) {
  console.error("Error de login:", error);
}
```

### 2. Usuarios

#### Obtener Información de Usuario

```typescript
import { userService } from "@/lib/server";

const token = localStorage.getItem("token");

try {
  const user = await userService.getUserInformation("user-id", token!);
  console.log("Usuario:", user);
} catch (error) {
  console.error("Error:", error);
}
```

### 3. Campañas

#### Obtener Todas las Campañas

```typescript
import { campaignService } from "@/lib/server";

try {
  const campaigns = await campaignService.getAllCampaigns();
  console.log("Campañas:", campaigns);
} catch (error) {
  console.error("Error:", error);
}
```

#### Obtener una Campaña

```typescript
import { campaignService } from "@/lib/server";

try {
  const campaign = await campaignService.getCampaign("campaign-id");
  console.log("Campaña:", campaign);
} catch (error) {
  console.error("Error:", error);
}
```

#### Crear Campaña (requiere autenticación)

```typescript
import { campaignService } from "@/lib/server";

const token = localStorage.getItem("token");

try {
  const campaign = await campaignService.createCampaign(
    {
      name: "Limpieza de Playa",
      description: "Campaña de limpieza de playas",
      category: "Limpieza",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      capacity: 50,
      rewardAmount: 100,
    },
    token!
  );

  console.log("Campaña creada:", campaign);
} catch (error) {
  console.error("Error:", error);
}
```

#### Actualizar Campaña

```typescript
import { campaignService } from "@/lib/server";

const token = localStorage.getItem("token");

try {
  const updated = await campaignService.updateCampaign(
    "campaign-id",
    { capacity: 75 },
    token!
  );

  console.log("Campaña actualizada:", updated);
} catch (error) {
  console.error("Error:", error);
}
```

#### Eliminar Campaña

```typescript
import { campaignService } from "@/lib/server";

const token = localStorage.getItem("token");

try {
  await campaignService.deleteCampaign("campaign-id", token!);
  console.log("Campaña eliminada");
} catch (error) {
  console.error("Error:", error);
}
```

## 🎯 Uso en Componentes React

### Ejemplo: Formulario de Registro

```typescript
"use client";

import { useState } from "react";
import { authService, APIError } from "@/lib/server";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await authService.createUser({
        name: "...",
        lastName: "...",
        email: "...",
        wallet: "...",
        password: "...",
        confirmPassword: "...",
      });

      // Redirigir o mostrar éxito
      alert("¡Cuenta creada exitosamente!");
    } catch (error) {
      if (error instanceof APIError) {
        setError(error.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear Cuenta"}
      </button>
    </form>
  );
}
```

### Ejemplo: Lista de Campañas

```typescript
"use client";

import { useEffect, useState } from "react";
import { campaignService, Campaign } from "@/lib/server";

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {campaigns.map((campaign) => (
        <div key={campaign.id}>
          <h3>{campaign.name}</h3>
          <p>{campaign.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔐 Manejo de Autenticación

### Guardar Token

```typescript
// Después de login exitoso
const { token } = await authService.login({ email, password });
localStorage.setItem("token", token);
```

### Obtener Token

```typescript
const token = localStorage.getItem("token");
if (!token) {
  // Redirigir a login
  window.location.href = "/login";
}
```

### Eliminar Token (Logout)

```typescript
localStorage.removeItem("token");
window.location.href = "/login";
```

## 🛡️ Manejo de Errores

### Clase APIError

```typescript
import { APIError } from "@/lib/server";

try {
  await authService.login({ email, password });
} catch (error) {
  if (error instanceof APIError) {
    console.log("Status:", error.status);
    console.log("Message:", error.message);
    console.log("Data:", error.data);

    // Manejar errores específicos
    if (error.status === 401) {
      alert("Credenciales incorrectas");
    } else if (error.status === 404) {
      alert("Usuario no encontrado");
    } else {
      alert(error.message);
    }
  }
}
```

## 🔧 Configuración Avanzada

### Agregar Nuevos Endpoints

**1. Agregar en `config.ts`:**

```typescript
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  endpoints: {
    // ... endpoints existentes

    // Nuevos endpoints
    rewards: {
      getMyRewards: "/rewards/my-rewards",
      claimReward: (id: string) => `/rewards/claim/${id}`,
    },
  },
};
```

**2. Crear servicio en `services.ts`:**

```typescript
export const rewardService = {
  async getMyRewards(token: string) {
    return apiClient.get(API_CONFIG.endpoints.rewards.getMyRewards, { token });
  },

  async claimReward(id: string, token: string) {
    return apiClient.post(
      API_CONFIG.endpoints.rewards.claimReward(id),
      {},
      { token }
    );
  },
};
```

## 📝 Tipos de Datos

Todos los tipos están definidos en `services.ts`:

- `CreateUserDTO`
- `LoginDTO`
- `UserResponse`
- `LoginResponse`
- `Campaign`
- `CreateCampaignDTO`

Puedes importarlos y usarlos en tus componentes:

```typescript
import type { Campaign, CreateCampaignDTO } from "@/lib/server";
```

## 🚀 Ventajas de Esta Estructura

1. ✅ **Centralización**: Toda la configuración en un solo lugar
2. ✅ **Reutilización**: Un solo cliente HTTP para todo
3. ✅ **Tipado**: TypeScript completo con tipos definidos
4. ✅ **Mantenibilidad**: Fácil agregar nuevos endpoints
5. ✅ **Testing**: Fácil mockear servicios
6. ✅ **Error Handling**: Manejo consistente de errores
7. ✅ **DRY**: No repetir código de fetch

## 🔄 Migración de Código Existente

**Antes:**

```typescript
const response = await fetch("http://localhost:3001/auth/createUser", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await response.json();
```

**Después:**

```typescript
import { authService } from "@/lib/server";

const result = await authService.createUser(data);
```

¡Mucho más simple y limpio! 🎉
