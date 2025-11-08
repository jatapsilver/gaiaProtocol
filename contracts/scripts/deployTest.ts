import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Desplegando contrato Test en Avalanche...\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("� Información de Red:");
  console.log("  - Chain ID:", network.chainId.toString());
  console.log("\n👤 Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "AVAX\n");

  if (balance === 0n) {
    console.log("❌ Balance insuficiente. Necesitas AVAX para desplegar.");
    console.log("💧 Obtén AVAX gratis en: https://faucet.avax.network/\n");
    process.exit(1);
  }

  // Valor inicial para el constructor
  const initialValue = 42;

  console.log("📝 Desplegando contrato Test con valor inicial:", initialValue);

  const Test = await ethers.getContractFactory("Test");
  const test = await Test.deploy(initialValue);

  console.log("⏳ Esperando confirmación...");
  await test.waitForDeployment();

  const address = await test.getAddress();

  console.log("\n✅ ¡Contrato Test desplegado exitosamente!");
  console.log("📍 Dirección:", address);
  console.log(
    "🔍 Ver en Explorer:",
    network.chainId === 43113n
      ? `https://testnet.snowtrace.io/address/${address}`
      : `https://snowtrace.io/address/${address}`
  );

  // Verificar que el valor se guardó correctamente
  const storedValue = await test.value();
  console.log("\n🔢 Valor almacenado:", storedValue.toString());

  console.log("\n📋 Para verificar el contrato, ejecuta:");
  console.log(
    `npx hardhat verify --network ${
      network.chainId === 43113n ? "avalancheFuji" : "avalanche"
    } ${address} ${initialValue}`
  );
}

main().catch((error) => {
  console.error("\n❌ Error durante el despliegue:", error.message);
  process.exitCode = 1;
});
