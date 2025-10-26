import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StakeVaultModule", (m) => {
  const vault = m.contract("StakeVault");

  return { vault };
});
