// ============================================================
//  CHANGE THESE VALUES FOR YOUR CONTRACT
//  This is the ONLY file you need to edit to connect your
//  FHEVM smart contract to this frontend.
// ============================================================

// Your deployed contract address (paste from Hardhat deploy output)
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

// Your contract ABI — paste the ABI array from your
// artifacts/contracts/YourContract.sol/YourContract.json
// Only include the functions you want to interact with.
export const CONTRACT_ABI = [
  // Example: a function that takes an encrypted uint8
  // "function storeEncrypted(einput encryptedValue, bytes calldata inputProof)",
  //
  // Example: a view function that returns a ciphertext handle
  // "function getStoredValue() view returns (euint8)",
  //
  // Paste your ABI entries below:
];

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Ethereum Sepolia
  chainName: "Sepolia Testnet",
  rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  blockExplorer: "https://sepolia.etherscan.io",
};
