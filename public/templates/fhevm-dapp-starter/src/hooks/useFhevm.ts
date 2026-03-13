import { useState, useCallback } from "react";
import { initFhevm, createInstance, type FhevmInstance } from "fhevmjs";
import { CONTRACT_ADDRESS } from "../config";

let globalInstance: FhevmInstance | null = null;

export interface FhevmState {
  instance: FhevmInstance | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
}

export function useFhevm() {
  const [state, setState] = useState<FhevmState>({
    instance: globalInstance,
    isInitialized: globalInstance !== null,
    isInitializing: false,
    error: null,
  });

  const initialize = useCallback(async () => {
    if (globalInstance) {
      setState({
        instance: globalInstance,
        isInitialized: true,
        isInitializing: false,
        error: null,
      });
      return;
    }

    setState((s) => ({ ...s, isInitializing: true, error: null }));

    try {
      await initFhevm();
      const instance = await createInstance({
        networkUrl: "https://ethereum-sepolia-rpc.publicnode.com",
        gatewayUrl: "https://gateway.sepolia.zama.ai",
        kmsContractAddress: "0x208De73316E44722e16f6dDFF40881A3e4F86104",
        aclContractAddress: "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5",
      });
      globalInstance = instance;
      setState({
        instance,
        isInitialized: true,
        isInitializing: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isInitializing: false,
        error: err.message || "Failed to initialize FHEVM",
      }));
    }
  }, []);

  /**
   * Encrypt a value for use as a contract parameter.
   * Returns { handle, inputProof } to pass to your contract function.
   */
  const encrypt = useCallback(
    async (
      value: number | bigint | boolean | string,
      type: "uint8" | "uint16" | "uint32" | "uint64" | "uint128" | "uint256" | "bool" | "address",
      userAddress: string
    ) => {
      if (!globalInstance) throw new Error("FHEVM not initialized");

      const input = globalInstance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);

      switch (type) {
        case "bool":
          input.addBool(Boolean(value));
          break;
        case "uint8":
          input.add8(Number(value));
          break;
        case "uint16":
          input.add16(Number(value));
          break;
        case "uint32":
          input.add32(Number(value));
          break;
        case "uint64":
          input.add64(BigInt(value));
          break;
        case "uint128":
          input.add128(BigInt(value));
          break;
        case "uint256":
          input.add256(BigInt(value));
          break;
        case "address":
          input.addAddress(String(value));
          break;
      }

      const encrypted = input.encrypt();
      return encrypted;
    },
    []
  );

  /**
   * Request decryption of a ciphertext handle via the Gateway.
   * This calls the Gateway's public decrypt endpoint.
   */
  const decrypt = useCallback(
    async (handle: bigint): Promise<string> => {
      if (!globalInstance) throw new Error("FHEVM not initialized");
      // For public decryption, the contract must have called
      // TFHE.allow() or Gateway.requestDecryption() on-chain.
      // The actual decryption result comes from an on-chain callback.
      // This is a placeholder — in practice you read the decrypted
      // value from your contract's storage after the callback.
      return `Decryption must be read from contract storage after Gateway callback. Handle: ${handle.toString()}`;
    },
    []
  );

  return { ...state, initialize, encrypt, decrypt };
}
