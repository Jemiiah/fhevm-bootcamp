import { useState, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { NETWORK_CONFIG } from "../config";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    signer: null,
    provider: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    const hexChainId = "0x" + NETWORK_CONFIG.chainId.toString(16);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError: any) {
      // Chain not added — add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId,
              chainName: NETWORK_CONFIG.chainName,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
            },
          ],
        });
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((s) => ({ ...s, error: "MetaMask not found. Please install it." }));
      return;
    }

    setState((s) => ({ ...s, isConnecting: true, error: null }));

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (chainId !== NETWORK_CONFIG.chainId) {
        await switchNetwork();
        // Re-create provider after network switch
        const newProvider = new BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();
        setState({
          address,
          signer,
          provider: newProvider,
          chainId: NETWORK_CONFIG.chainId,
          isConnecting: false,
          error: null,
        });
      } else {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setState({
          address,
          signer,
          provider,
          chainId,
          isConnecting: false,
          error: null,
        });
      }
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err.message || "Failed to connect wallet",
      }));
    }
  }, [switchNetwork]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      signer: null,
      provider: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  return { ...state, connect, disconnect };
}
