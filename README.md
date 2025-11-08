# 🌍 Gaia Protocol

<div align="center">

![Gaia Protocol](https://img.shields.io/badge/Gaia-Protocol-green?style=for-the-badge)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Plataforma descentralizada para el seguimiento, verificación y recompensa de acciones ambientales a través de blockchain**

[Demo en Vivo](#) • [Documentación](#tabla-de-contenidos) • [Contribuir](#contribución)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [1. Backend (NestJS)](#1-backend-nestjs)
  - [2. Frontend (Next.js)](#2-frontend-nextjs)
  - [3. Smart Contracts (Hardhat)](#3-smart-contracts-hardhat)
- [Deployment](#-deployment)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Smart Contracts](#-smart-contracts)
- [API Endpoints](#-api-endpoints)
- [Variables de Entorno](#-variables-de-entorno)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🌟 Descripción General

**Gaia Protocol** es una plataforma blockchain descentralizada diseñada para revolucionar la forma en que rastreamos, verificamos y recompensamos las acciones ambientales. Utilizando la tecnología blockchain de Avalanche, garantizamos transparencia total, inmutabilidad de registros y un sistema de recompensas justo mediante tokens GAIA y NFTs.

### 🎯 Problema que Resolvemos

- **Falta de Transparencia**: Las iniciativas ambientales tradicionales carecen de trazabilidad verificable
- **Verificación Manual**: Los procesos de validación son lentos, costosos y propensos a errores
- **Ausencia de Incentivos**: Falta un sistema de recompensas tangible para los voluntarios
- **Fragmentación de Datos**: Información dispersa sin un sistema unificado de seguimiento

### 💡 Nuestra Solución

Una plataforma integral que:

- ✅ Registra todas las acciones ambientales en blockchain (inmutable y verificable)
- ✅ Automatiza la verificación mediante smart contracts
- ✅ Recompensa a los participantes con tokens GAIA
- ✅ Emite NFTs como certificados de participación
- ✅ Proporciona métricas de impacto en tiempo real
- ✅ Crea una comunidad global de defensores ambientales

---

## ✨ Características Principales

### 🔐 Blockchain & Smart Contracts

- **Token ERC20 GAIA**: Moneda nativa para recompensas y gobernanza
- **NFTs de Certificación**: Certificados únicos de participación en campañas
- **Verificación Descentralizada**: Validación automática de acciones mediante contratos inteligentes
- **Transparencia Total**: Todas las transacciones registradas en Avalanche blockchain

### 📊 Gestión de Campañas

- **Creación Flexible**: Configura campañas con objetivos, ubicaciones y fechas personalizadas
- **Registro de Voluntarios**: Sistema de inscripción on-chain
- **Seguimiento en Tiempo Real**: Monitorea el progreso de cada campaña
- **Distribución Automática**: Los tokens se distribuyen automáticamente al completar acciones

### 👥 Sistema de Usuarios

- **Autenticación JWT**: Sistema seguro de login/registro
- **Perfiles de Usuario**: Gestiona tu participación e historial
- **Roles y Permisos**: Organizadores, voluntarios y verificadores
- **Reputación**: Sistema de niveles basado en participación

### 📈 Analytics & Tracking

- **Métricas de Impacto**: CO2 ahorrado, residuos recolectados, árboles plantados
- **Dashboard Interactivo**: Visualización de datos en tiempo real
- **Blockchain Explorer**: Seguimiento de transacciones y verificaciones
- **Reportes Exportables**: Genera informes de impacto ambiental

### 💬 Comunidad

- **Foro de Discusión**: Comparte conocimiento y mejores prácticas
- **Sistema de Categorías**: Organización, Impacto, Tecnología, Recursos
- **Temas Trending**: Descubre las conversaciones más populares
- **Rankings de Contribuidores**: Reconocimiento a los miembros más activos

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                        GAIA PROTOCOL                             │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   FRONTEND    │    │    BACKEND    │    │   BLOCKCHAIN  │
│   (Next.js)   │◄──►│   (NestJS)    │◄──►│   (Avalanche) │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        │                     ▼                     │
        │            ┌───────────────┐              │
        │            │   PostgreSQL  │              │
        │            │   (TypeORM)   │              │
        │            └───────────────┘              │
        │                                           │
        └───────────────────────────────────────────┘
                    (Web3 Integration)
```

### Flujo de Datos

1. **Usuario → Frontend**: Interacción con la UI (Next.js + React)
2. **Frontend → Backend**: Peticiones REST API (autenticadas con JWT)
3. **Backend → Base de Datos**: Almacenamiento de datos off-chain (PostgreSQL)
4. **Backend ↔ Blockchain**: Interacción con smart contracts vía Web3
5. **Blockchain**: Registro inmutable de acciones y transacciones

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Framework**: Next.js 15.1.2 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Blockchain**: Ethers.js, Wagmi, RainbowKit
- **Date Handling**: date-fns

### Backend

- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator
- **API Docs**: Swagger/OpenAPI
- **Security**: bcrypt, helmet, cors

### Blockchain & Smart Contracts

- **Network**: Avalanche C-Chain (Fuji Testnet & Mainnet)
- **Smart Contracts**: Solidity 0.8.28
- **Development**: Hardhat 2.26.3
- **Libraries**: OpenZeppelin Contracts 5.4.0
- **Testing**: Hardhat Toolbox
- **Verification**: Hardhat Verify, Etherscan

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm/pnpm
- **TypeScript**: Full TypeScript support
- **Linting**: ESLint + Prettier
- **Environment**: dotenv

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v18.x o superior ([Descargar](https://nodejs.org/))
- **npm** o **pnpm**: Gestor de paquetes
- **PostgreSQL**: v14 o superior ([Descargar](https://www.postgresql.org/download/))
- **Git**: Control de versiones ([Descargar](https://git-scm.com/))
- **Metamask**: Wallet para interactuar con blockchain ([Instalar](https://metamask.io/))

### Opcional (Recomendado)

- **Docker**: Para contenedores de base de datos
- **Visual Studio Code**: IDE recomendado
- **Postman**: Para probar endpoints de API

---

## 🚀 Instalación y Configuración

### Clonar el Repositorio

```bash
git clone https://github.com/jatapsilver/gaiaProtocol.git
cd gaiaProtocol
```

---

## 1. Backend (NestJS)

### 📦 Instalación de Dependencias

```bash
cd backend
npm install
```

### 🔧 Configuración de Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=gaia_protocol

# JWT Authentication
JWT_SECRET=tu_secret_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3002

# Blockchain (Opcional para backend)
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0xTuDireccionDeContratoAqui
```

### 🗄️ Configuración de Base de Datos

#### Opción 1: PostgreSQL Local

1. Instala PostgreSQL
2. Crea la base de datos:

```sql
CREATE DATABASE gaia_protocol;
CREATE USER tu_usuario WITH ENCRYPTED PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE gaia_protocol TO tu_usuario;
```

#### Opción 2: Docker (Recomendado)

```bash
docker run --name gaia-postgres \
  -e POSTGRES_USER=tu_usuario \
  -e POSTGRES_PASSWORD=tu_contraseña \
  -e POSTGRES_DB=gaia_protocol \
  -p 5432:5432 \
  -d postgres:14
```

### ▶️ Ejecutar Backend

#### Modo Desarrollo (con hot-reload)

```bash
npm run start:dev
```

#### Modo Producción

```bash
npm run build
npm run start:prod
```

#### Ejecutar Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

El backend estará disponible en: `http://localhost:3002`

Documentación Swagger: `http://localhost:3002/api`

---

## 2. Frontend (Next.js)

### 📦 Instalación de Dependencias

```bash
cd frontend
npm install
# o con pnpm (recomendado)
pnpm install
```

### 🔧 Configuración de Variables de Entorno

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3002

# Blockchain
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# Smart Contracts
NEXT_PUBLIC_TOKEN_ADDRESS=0xDireccionDelTokenGAIA
NEXT_PUBLIC_PLATFORM_ADDRESS=0xDireccionDelContratoManager
NEXT_PUBLIC_NFT_ADDRESS=0xDireccionDelContratoNFT

# WalletConnect (Opcional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id
```

### ▶️ Ejecutar Frontend

#### Modo Desarrollo

```bash
npm run dev
# o con pnpm
pnpm dev
```

#### Construir para Producción

```bash
npm run build
npm run start
```

#### Linting y Formato

```bash
npm run lint
```

El frontend estará disponible en: `http://localhost:3001`

---

## 3. Smart Contracts (Hardhat)

### 📦 Instalación de Dependencias

```bash
cd contracts
npm install
```

### 🔧 Configuración de Variables de Entorno

Crea un archivo `.env` en la carpeta `contracts/`:

```env
# Clave Privada de tu Wallet (¡NUNCA COMPARTAS ESTO!)
PRIVATE_KEY=tu_clave_privada_sin_0x

# Snowtrace API Key (para verificación)
SNOWTRACE_API_KEY=tu_api_key_de_snowtrace

# RPC URLs (opcional, ya están en hardhat.config.ts)
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
```

### 🔑 Obtener Clave Privada

1. Abre Metamask
2. Click en los 3 puntos → Detalles de la cuenta
3. Exportar clave privada
4. Copia y pega en el `.env` (SIN el prefijo 0x)

⚠️ **IMPORTANTE**: Nunca compartas tu clave privada ni la subas a Git

### 💰 Obtener AVAX Testnet

Para desplegar en Fuji Testnet, necesitas AVAX de prueba:

1. Ve al [Avalanche Faucet](https://faucet.avax.network/)
2. Conecta tu wallet
3. Solicita AVAX testnet (43113)

### 📝 Compilar Contratos

```bash
npx hardhat compile
```

### 🧪 Ejecutar Tests

```bash
npx hardhat test
npx hardhat coverage
```

### 🚀 Desplegar Contratos

#### Desplegar en Fuji Testnet

```bash
npx hardhat run scripts/deploy.ts --network avalancheFuji
```

#### Desplegar en Avalanche Mainnet

```bash
npx hardhat run scripts/deploy.ts --network avalanche
```

#### Desplegar Localmente (Hardhat Network)

```bash
# Terminal 1: Inicia un nodo local
npx hardhat node

# Terminal 2: Despliega en el nodo local
npx hardhat run scripts/deploy.ts --network localhost
```

### ✅ Verificar Contratos en Snowtrace

Después de desplegar, verifica tus contratos:

```bash
npx hardhat verify --network avalancheFuji DIRECCION_DEL_CONTRATO "arg1" "arg2"
```

Ejemplo:

```bash
npx hardhat verify --network avalancheFuji 0x123...abc 1000000000000000000000000
```

### 📋 Interactuar con Contratos

```bash
# Consola de Hardhat
npx hardhat console --network avalancheFuji

# Dentro de la consola:
const Token = await ethers.getContractFactory("GaiaToken")
const token = await Token.attach("0xDireccionDelToken")
const balance = await token.balanceOf("0xDireccionDeUsuario")
console.log(balance.toString())
```

---

## 🌐 Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

#### Railway (Recomendado)

1. **Instala Railway CLI**

```bash
npm install -g @railway/cli
```

2. **Login y Deploy**

```bash
cd backend
railway login
railway init
railway up
```

3. **Configura Variables de Entorno**

   - Ve a tu proyecto en Railway Dashboard
   - Settings → Variables
   - Añade todas las variables del `.env`

4. **Añade PostgreSQL**
   - En Railway Dashboard → New → Database → PostgreSQL
   - Copia las credenciales a tus variables de entorno

#### Heroku

```bash
cd backend
heroku create gaia-protocol-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=tu_secret_aqui
git push heroku main
```

### Frontend Deployment (Vercel)

#### Método 1: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

#### Método 2: GitHub Integration

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en Vercel Dashboard
3. Deploy automático en cada push

#### Configuración de Vercel

En `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_TOKEN_ADDRESS": "@token-address"
  }
}
```

### Smart Contracts Deployment (Avalanche)

Los contratos ya se despliegan con Hardhat (ver sección anterior).

**Redes Disponibles:**

- **Fuji Testnet** (ChainID: 43113): Para desarrollo y pruebas
- **Avalanche Mainnet** (ChainID: 43114): Para producción

**URLs de Verificación:**

- Testnet: https://testnet.snowtrace.io/
- Mainnet: https://snowtrace.io/

---

## 📁 Estructura del Proyecto

```
avalancheJungleHackaton/
│
├── backend/                      # Backend NestJS
│   ├── src/
│   │   ├── app.module.ts        # Módulo principal
│   │   ├── main.ts              # Entry point
│   │   ├── auth/                # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── guards/
│   │   ├── users/               # Módulo de usuarios
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── Dtos/
│   │   ├── campaing/            # Módulo de campañas
│   │   │   ├── campaing.controller.ts
│   │   │   ├── campaing.service.ts
│   │   │   ├── campaing.repository.ts
│   │   │   └── Dtos/
│   │   ├── entities/            # Entidades TypeORM
│   │   │   ├── users.entity.ts
│   │   │   ├── campaing.entity.ts
│   │   │   └── credential.entity.ts
│   │   ├── config/              # Configuración
│   │   │   └── typeorm.ts
│   │   ├── decorators/          # Decoradores custom
│   │   ├── enums/               # Enumeraciones
│   │   ├── middlewares/         # Middlewares
│   │   └── utils/               # Utilidades
│   ├── test/                    # Tests E2E
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                    # Frontend Next.js
│   ├── app/                     # App Router (Next.js 13+)
│   │   ├── layout.tsx          # Layout global
│   │   ├── page.tsx            # Página principal
│   │   ├── globals.css         # Estilos globales
│   │   ├── campaigns/          # Páginas de campañas
│   │   │   ├── page.tsx
│   │   │   └── create/
│   │   ├── profile/            # Perfil de usuario
│   │   ├── tracking/           # Seguimiento blockchain
│   │   ├── community/          # Foro de comunidad
│   │   ├── login/              # Autenticación
│   │   └── get-started/        # Onboarding
│   ├── components/             # Componentes React
│   │   ├── Header.tsx
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/
│   │   └── common/
│   ├── lib/                   # Librerías y utilidades
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   ├── validators.ts
│   │   └── server/           # Servicios de API
│   ├── hooks/                # Custom hooks
│   ├── public/               # Assets estáticos
│   ├── styles/               # Estilos adicionales
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.ts
│
├── contracts/                # Smart Contracts
│   ├── contracts/
│   │   ├── TrackyPlatform.sol  # Contrato principal
│   │   ├── Lock.sol           # Ejemplo
│   │   └── Test.sol           # Testing
│   ├── scripts/
│   │   ├── deploy.ts          # Script de deployment
│   │   └── checkConnection.ts
│   ├── test/                  # Tests de contratos
│   │   └── Lock.ts
│   ├── typechain-types/       # Tipos TypeScript generados
│   ├── artifacts/             # Contratos compilados
│   ├── cache/                 # Cache de Hardhat
│   ├── hardhat.config.ts      # Configuración de Hardhat
│   ├── package.json
│   └── tsconfig.json
│
├── .git/                      # Git repository
├── .vscode/                   # Configuración de VS Code
└── README.md                  # Este archivo
```

---

## 🔗 Smart Contracts

### Contratos Principales

#### 1. **GaiaToken (ERC20)**

Token nativo de la plataforma para recompensas y gobernanza.

**Funciones Principales:**

- `mint(address to, uint256 amount)`: Acuñar nuevos tokens (solo owner)
- `burn(uint256 amount)`: Quemar tokens
- `transfer(address to, uint256 amount)`: Transferir tokens
- `balanceOf(address account)`: Consultar balance

**Suministro Inicial**: 1,000,000 GAIA

#### 2. **ImpactNFT (ERC721)**

NFTs de certificación para participantes en campañas.

**Funciones Principales:**

- `safeMint(address to, string uri)`: Acuñar NFT con metadata
- `setTokenURI(uint256 tokenId, string uri)`: Actualizar metadata
- `tokenURI(uint256 tokenId)`: Obtener URI del token
- `ownerOf(uint256 tokenId)`: Consultar propietario

#### 3. **TrackyPlatform (Contrato Principal)**

Gestión completa de campañas, voluntarios y recompensas.

**Structs:**

```solidity
struct Campaign {
    string name;
    string description;
    string location;
    uint256 startDate;
    uint256 endDate;
    uint256 goalTokens;
    uint256 tokensDistributed;
    bool isActive;
    address organizer;
}

struct Volunteer {
    address volunteerAddress;
    uint256 timestamp;
    bool verified;
    bool rewardsClaimed;
}
```

**Funciones de Campaña:**

- `createCampaign(...)`: Crear nueva campaña
- `registerVolunteer(uint256 campaignId)`: Inscribirse en campaña
- `verifyCampaignCompletion(uint256 campaignId)`: Verificar finalización
- `claimRewards(uint256 campaignId)`: Reclamar recompensas
- `getCampaignDetails(uint256 campaignId)`: Obtener info de campaña

**Funciones de Token:**

- `distributeCampaignTokens(uint256 campaignId)`: Distribuir tokens
- `calculateReward(uint256 campaignId)`: Calcular recompensa individual
- `checkRewardsClaimed(uint256 campaignId, address volunteer)`: Verificar reclamo

**Eventos:**

```solidity
event CampaignCreated(uint256 indexed campaignId, string name, address organizer);
event VolunteerRegistered(uint256 indexed campaignId, address volunteer);
event CampaignCompleted(uint256 indexed campaignId);
event RewardsClaimed(uint256 indexed campaignId, address volunteer, uint256 amount);
event NFTMinted(uint256 indexed campaignId, address volunteer, uint256 tokenId);
```

### Direcciones de Contratos

#### Avalanche Fuji Testnet

```
GaiaToken: 0x... (Actualizar después del deploy)
ImpactNFT: 0x... (Actualizar después del deploy)
TrackyPlatform: 0x... (Actualizar después del deploy)
```

#### Avalanche Mainnet

```
GaiaToken desplegado en: 0x52ecC13f091f2B15e742e7B5CfCfe48037a8247F
GaiaNFT desplegado en: 0x988006ffAEfC823acD9781259F60f42054134588
CampaignManager desplegado en: 0xF83c2c5011AA6F4e862087a2282e13A74d8d6f6E
```

### Interacción con Contratos

```javascript
// Ejemplo usando ethers.js
const { ethers } = require("ethers");

// Conectar a la red
const provider = new ethers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Cargar contrato
const platform = new ethers.Contract(PLATFORM_ADDRESS, PLATFORM_ABI, signer);

// Crear campaña
const tx = await platform.createCampaign(
  "Beach Cleanup",
  "Clean local beach",
  "Miami Beach",
  Math.floor(Date.now() / 1000),
  Math.floor(Date.now() / 1000) + 86400 * 7,
  ethers.parseEther("1000")
);
await tx.wait();

// Registrar voluntario
await platform.registerVolunteer(campaignId);

// Reclamar recompensas
await platform.claimRewards(campaignId);
```

---

## 🔌 API Endpoints

### Base URL

```
Development: http://localhost:3000
Production: https://tu-dominio-api.com
```

### Autenticación

#### POST `/auth/register`

Registrar nuevo usuario.

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "password": "Password123!",
  "name": "Juan Pérez",
  "country": "Colombia",
  "city": "Bogotá"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Juan Pérez"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/auth/login`

Iniciar sesión.

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Juan Pérez"
  }
}
```

### Usuarios

#### GET `/users`

Obtener todos los usuarios (requiere autenticación).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Juan Pérez",
    "country": "Colombia",
    "city": "Bogotá"
  }
]
```

#### GET `/users/:id`

Obtener usuario por ID.

#### PUT `/users/:id`

Actualizar usuario.

#### DELETE `/users/:id`

Eliminar usuario.

### Campañas

#### GET `/campaing`

Obtener todas las campañas.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Limpieza de Playa",
    "description": "Iniciativa de limpieza...",
    "country": "Colombia",
    "city": "Cartagena",
    "address": "Playa Blanca",
    "totalParticipants": 50,
    "goal": "Recolectar 500kg de residuos",
    "startDate": "2025-01-15",
    "endDate": "2025-01-16",
    "imageUrl": "https://...",
    "status": "Activa",
    "tokensGenerated": 0,
    "createdUserId": "uuid"
  }
]
```

#### GET `/campaing/:id`

Obtener campaña por ID.

#### POST `/campaing`

Crear nueva campaña (requiere autenticación).

**Request Body:**

```json
{
  "name": "Limpieza de Playa",
  "description": "Iniciativa de limpieza costera",
  "country": "Colombia",
  "city": "Cartagena",
  "address": "Playa Blanca",
  "totalParticipants": 50,
  "goal": "Recolectar 500kg de residuos",
  "startDate": "2025-01-15",
  "endDate": "2025-01-16",
  "imageUrl": "https://ejemplo.com/imagen.jpg",
  "createdUserId": "uuid"
}
```

#### PUT `/campaing/:id`

Actualizar campaña.

#### DELETE `/campaing/:id`

Eliminar campaña.

### Swagger Documentation

Toda la documentación de la API está disponible en:

```
http://localhost:3000/api
```

---

## 🔐 Variables de Entorno

### Backend (.env)

```env
# === SERVER ===
PORT=3000
NODE_ENV=development

# === DATABASE ===
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=gaia_user
DB_PASSWORD=strong_password_here
DB_NAME=gaia_protocol

# === JWT ===
JWT_SECRET=super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRES_IN=24h

# === CORS ===
CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# === BLOCKCHAIN (Optional) ===
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CHAIN_ID=43113
CONTRACT_ADDRESS=0xYourContractAddress
```

### Frontend (.env.local)

```env
# === API ===
NEXT_PUBLIC_API_URL=http://localhost:3000

# === BLOCKCHAIN ===
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_NAME=Avalanche Fuji Testnet

# === SMART CONTRACTS ===
NEXT_PUBLIC_TOKEN_ADDRESS=0xGaiaTokenAddress
NEXT_PUBLIC_PLATFORM_ADDRESS=0xTrackyPlatformAddress
NEXT_PUBLIC_NFT_ADDRESS=0xImpactNFTAddress

# === WALLETCONNECT ===
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# === ANALYTICS (Optional) ===
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Contracts (.env)

```env
# === WALLET ===
PRIVATE_KEY=your_private_key_without_0x_prefix

# === APIs ===
SNOWTRACE_API_KEY=your_snowtrace_api_key_for_verification

# === NETWORKS (Optional - already in hardhat.config) ===
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
```

### 🔒 Seguridad

⚠️ **NUNCA** compartas tus archivos `.env` ni los subas a GitHub

**Añadir a `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Private keys
*.key
*.pem
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Smart Contract Tests

```bash
cd contracts

# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/TrackyPlatform.test.ts

# Gas report
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage
```

### Frontend Tests (Si se implementan)

```bash
cd frontend

# Jest
npm run test

# Cypress E2E
npm run cypress:open
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**

1. Verifica que PostgreSQL esté corriendo
2. Comprueba las credenciales en `.env`
3. Asegúrate de que el puerto 5432 no esté ocupado

```bash
# Ver si PostgreSQL está corriendo
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Error: "insufficient funds for gas"

**Solución:**

1. Obtén AVAX testnet del faucet: https://faucet.avax.network/
2. Verifica que estés conectado a la red correcta (Fuji Testnet: 43113)

### Error: "Network error" al conectar wallet

**Solución:**

1. Añade Avalanche Fuji Testnet a Metamask manualmente:
   - Network Name: Avalanche Fuji C-Chain
   - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   - Chain ID: 43113
   - Symbol: AVAX
   - Explorer: https://testnet.snowtrace.io/

### Error: "Module not found"

**Solución:**

```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### Error de compilación en Solidity

**Solución:**

```bash
cd contracts
npx hardhat clean
npx hardhat compile
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Avalanche Documentation](https://docs.avax.network/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Tutoriales

- [Avalanche Developer Docs](https://docs.avax.network/build)
- [Solidity by Example](https://solidity-by-example.org/)
- [TypeORM Guide](https://typeorm.io/)

### Comunidad

- [Avalanche Discord](https://discord.gg/avalanche)
- [Stack Overflow - Solidity](https://stackoverflow.com/questions/tagged/solidity)
- [NestJS Discord](https://discord.gg/nestjs)

---

### Guías de Estilo

- **Código**: Seguir las guías de ESLint y Prettier
- **Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/)
- **Branches**: `feature/`, `bugfix/`, `hotfix/`

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **Avalanche Team** por el soporte y la infraestructura
- **OpenZeppelin** por los contratos seguros
- **NestJS Community** por el framework backend
- **Vercel** por el hosting del frontend
- **shadcn/ui** por los componentes de UI

---

## 📞 Contacto

- **GitHub**: [@jatapsilver](https://github.com/jatapsilver)

---

<div align="center">

**Construido con ❤️ para un futuro más sostenible**

[⬆ Volver arriba](#-gaia-protocol---tracky-platform)

</div>
