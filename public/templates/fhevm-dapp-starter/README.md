# FHEVM dApp Starter

A ready-to-use React frontend for interacting with FHEVM smart contracts on Zama's encrypted blockchain. Built for the FHEVM Bootcamp.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Connect Your Contract

Edit **one file**: `src/config.ts`

1. Set your deployed contract address:

```ts
export const CONTRACT_ADDRESS = "0xYourDeployedAddress";
```

2. Add your contract's ABI (from Hardhat artifacts):

```ts
export const CONTRACT_ABI = [
  "function storeSecret(einput encryptedValue, bytes calldata inputProof)",
  "function getSecret() view returns (euint8)",
];
```

That's it. The app reads the ABI and builds the UI automatically.

## How to Submit Encrypted Values

1. Connect your MetaMask wallet (Sepolia network)
2. Go to the **Encrypt** tab
3. Select the type (uint8, uint32, bool, etc.) and enter a plaintext value
4. Click **Encrypt** — you'll get a handle and input proof
5. Go to the **Contract** tab, select your function, and paste the encrypted values

## How to Decrypt Results

Your contract must call `TFHE.allow()` or `Gateway.requestDecryption()` on-chain to enable decryption.

1. Go to the **Decrypt** tab
2. Enter the ciphertext handle (from a contract read call)
3. The decrypted value is read from your contract after the Gateway callback

## Project Structure

```
src/
  config.ts          ← YOUR CONTRACT CONFIG (edit this)
  App.tsx            ← Main app with tab layout
  hooks/
    useWallet.ts     ← MetaMask connection + network switching
    useFhevm.ts      ← FHEVM SDK init, encrypt, decrypt helpers
  components/
    StatusBar.tsx     ← Connection status indicators
    EncryptedInput.tsx    ← Encrypt plaintext values
    DecryptionPanel.tsx   ← Decrypt ciphertext handles
    ContractInteraction.tsx ← Generic ABI-based contract calls
```

## Troubleshooting

**MetaMask not detected**
→ Install the MetaMask browser extension.

**Wrong network**
→ The app will prompt you to switch to Sepolia. Make sure you have Sepolia ETH for gas.

**FHEVM initialization fails**
→ Check your internet connection. The SDK fetches cryptographic parameters from Zama's servers.

**"No functions found in your ABI"**
→ You need to add your contract ABI to `src/config.ts`.

**Transaction reverts**
→ Make sure your encrypted input types match what the contract expects (e.g., `einput` + `bytes`).

## Tech Stack

- **Vite** — fast dev server and build tool
- **React 18** — UI framework
- **TypeScript** — type safety
- **ethers v6** — blockchain interaction (same as Hardhat)
- **fhevmjs** — Zama's client-side encryption SDK
