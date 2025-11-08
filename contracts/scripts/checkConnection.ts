import { ethers } from "hardhat";

async function main() {
  console.log("🔎 Verificando conexión y saldo...");

  // Info del provider / red
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  console.log(
    "🔗 Conectado al RPC. Network name (si disponible):",
    (network as any).name || "unknown"
  );
  console.log("🆔 chainId:", network.chainId);

  // Obtener signer (usará la cuenta configurada en hardhat.config.ts --network)
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    console.error(
      "❌ No se encontró ningún signer. Revisa tu hardhat.config.ts / PRIVATE_KEY."
    );
    process.exit(1);
  }

  const deployer = signers[0];
  const address = await deployer.getAddress();
  console.log("📜 Deploy account (EVM addr):", address);

  // Nonce actual
  const nonce = await provider.getTransactionCount(address);
  console.log("🔢 Nonce actual:", nonce);

  // Obtener balance en wei y formatearlo (compatibilidad v5/v6)
  const balanceWei = await provider.getBalance(address);

  // Select correct formatEther depending on ethers version
  const formatEther =
    (ethers as any).utils?.formatEther ?? (ethers as any).formatEther;
  let balanceFormatted: string;
  try {
    balanceFormatted = formatEther(balanceWei);
  } catch {
    // fallback: divide manually (only if necessary)
    balanceFormatted = balanceWei.toString();
  }

  console.log("💰 Balance:", balanceFormatted, "(native units)");
  console.log("\n✅ Comprobación completada.");
}

main().catch((err) => {
  console.error("❌ Error ejecutando checkConnection:", err);
  process.exitCode = 1;
});
