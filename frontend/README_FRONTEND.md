# 🌍 Gaia Protocol - Frontend

Frontend application for Gaia Protocol, a blockchain-powered platform for transparent environmental campaigns built on Avalanche C-Chain.

## 🎨 Design System - Emerald Green Theme

### Color Palette

The entire application uses an **Emerald Green** color scheme that represents nature, growth, and environmental sustainability:

#### Primary Colors

- **Emerald 500** `#10b981` - Main brand color
- **Emerald 600** `#059669` - Darker accent
- **Emerald 400** `#34d399` - Lighter accent (dark mode)

#### Full Emerald Scale

```
50:  #ecfdf5  (Very light)
100: #d1fae5
200: #a7f3d0
300: #6ee7b7
400: #34d399  (Light emerald - dark mode primary)
500: #10b981  (Main emerald - light mode primary)
600: #059669  (Dark emerald - light mode secondary)
700: #047857
800: #065f46
900: #064e3b  (Very dark)
```

---

## 🚀 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library
- **Ethers.js** - Blockchain integration

---

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with Gaia branding
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles with emerald theme
│   ├── campaigns/          # Campaign pages
│   ├── tracking/           # Tracking dashboard
│   ├── community/          # Community hub
│   ├── profile/            # User profile
│   ├── rewards/            # Rewards system
│   ├── auditing/           # Auditing tools
│   └── reports/            # Impact reports
├── components/
│   ├── Header.tsx          # Navigation with Gaia branding
│   ├── ui/                 # Shadcn UI components
│   └── layout/             # Layout components
├── lib/
│   ├── constants.ts        # Contract addresses & configs
│   ├── utils.ts            # Utility functions
│   └── validators.ts       # Form validation
└── public/                 # Static assets
```

---

## 🎯 Key Features

### 1️⃣ Emerald Branding

- ✅ Logo with emerald gradient
- ✅ Buttons with emerald gradients and shadows
- ✅ Cards with emerald borders and hover effects
- ✅ Icons with emerald colors
- ✅ Text highlights in emerald

### 2️⃣ Blockchain Integration

- Connect wallet (MetaMask)
- Interact with smart contracts on Avalanche
- Display GAIA token balances
- Show NFT achievements

### 3️⃣ Campaign Management

- Browse active campaigns
- Create new campaigns
- Join campaigns
- Track progress
- View impact metrics

### 4️⃣ Rewards System

- Earn GAIA tokens
- Collect NFT badges
- View achievement history
- Redeem rewards

---

## 🔧 Setup & Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```bash
# Avalanche RPC (Fuji Testnet)
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113

# Smart Contract Addresses (Fuji Testnet)
NEXT_PUBLIC_GAIA_TOKEN_ADDRESS=0x52ecC13f091f2B15e742e7B5CfCfe48037a8247F
NEXT_PUBLIC_GAIA_NFT_ADDRESS=0x988006ffAEfC823acD9781259F60f42054134588
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0xF83c2c5011AA6F4e862087a2282e13A74d8d6f6E

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3002

# For Mainnet:
# NEXT_PUBLIC_RPC_URL=https://api.avax.network/ext/bc/C/rpc
# NEXT_PUBLIC_CHAIN_ID=43114
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎨 Customization Guide

### Adding Emerald Colors to Components

#### Buttons

```tsx
<Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30">
  Click Me
</Button>
```

#### Cards

```tsx
<Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
  {/* Content */}
</Card>
```

#### Icons with Backgrounds

```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-2 ring-emerald-500/20">
  <Icon className="h-6 w-6 text-emerald-500" />
</div>
```

#### Text Highlights

```tsx
<h1>
  Make an <span className="text-emerald-500">environmental</span> impact
</h1>
```

#### Gradient Text

```tsx
<span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
  Gaia Protocol
</span>
```

---

## 🌐 Pages Overview

### Homepage (`/`)

- Hero section with emerald accents
- Statistics showcase
- Feature grid with icons
- CTA section
- Footer with links

### Campaigns (`/campaigns`)

- Browse all active campaigns
- Filter and search
- Campaign cards with progress
- Create new campaign button

### Tracking (`/tracking`)

- Real-time campaign tracking
- Blockchain transaction history
- Resource allocation charts
- Impact metrics

### Community (`/community`)

- Discussion forums
- User profiles
- Activity feed
- Leaderboards

### Profile (`/profile`)

- User information
- Wallet connection
- Campaign history
- Earned rewards
- NFT collection

### Rewards (`/rewards`)

- GAIA token balance
- NFT achievements
- Reward history
- Redemption options

### Auditing (`/auditing`)

- Transparent resource tracking
- Financial reports
- Sponsor dashboard
- Verification tools

### Reports (`/reports`)

- Impact reports
- Campaign analytics
- Export options
- Share functionality

---

## 🔗 Smart Contract Integration

### Contract Addresses (Fuji Testnet)

| Contract            | Address                                      |
| ------------------- | -------------------------------------------- |
| **GaiaToken**       | `0x52ecC13f091f2B15e742e7B5CfCfe48037a8247F` |
| **GaiaNFT**         | `0x988006ffAEfC823acD9781259F60f42054134588` |
| **CampaignManager** | `0xF83c2c5011AA6F4e862087a2282e13A74d8d6f6E` |

### Example: Connect Wallet

```typescript
import { ethers } from "ethers";

const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return signer;
  }
};
```

### Example: Read GAIA Balance

```typescript
import { ethers } from "ethers";
import GaiaTokenABI from "./abis/GaiaToken.json";

const getBalance = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_GAIA_TOKEN_ADDRESS!,
    GaiaTokenABI,
    provider
  );
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
};
```

---

## 📱 Responsive Design

The application is fully responsive:

- **Mobile** (< 768px) - Stacked layout, hamburger menu
- **Tablet** (768px - 1024px) - 2-column grid
- **Desktop** (> 1024px) - 3-column grid, full navigation

---

## 🎨 Component Library

All UI components use **shadcn/ui** with emerald customization:

- Button
- Card
- Badge
- Dialog
- Dropdown Menu
- Toast
- Form inputs
- And more...

---

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

---

## 🌟 Brand Guidelines

### Logo Usage

- Always use the emerald gradient for the Gaia Protocol logo
- Maintain minimum size: 32x32px
- Use white text on dark backgrounds
- Use dark green text on light backgrounds

### Typography

- **Headings**: Inter font (bold)
- **Body**: Inter font (regular)
- **Monospace**: Roboto Mono (for addresses/numbers)

### Spacing

- Use Tailwind spacing scale (4px increments)
- Maintain consistent padding in cards (p-6)
- Gap between elements: gap-4 or gap-6

---

## 📚 Resources

- [Avalanche Documentation](https://docs.avax.network/)
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**Built with 💚 by the Gaia Protocol team**
