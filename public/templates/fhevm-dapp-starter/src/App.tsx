import { useState, useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import { useFhevm } from "./hooks/useFhevm";
import { StatusBar } from "./components/StatusBar";
import { EncryptedInput } from "./components/EncryptedInput";
import { DecryptionPanel } from "./components/DecryptionPanel";
import { ContractInteraction } from "./components/ContractInteraction";

type Tab = "interact" | "encrypt" | "decrypt";

export default function App() {
  const wallet = useWallet();
  const fhevm = useFhevm();
  const [activeTab, setActiveTab] = useState<Tab>("interact");

  // Auto-initialize FHEVM when wallet connects
  useEffect(() => {
    if (wallet.address && !fhevm.isInitialized && !fhevm.isInitializing) {
      fhevm.initialize();
    }
  }, [wallet.address, fhevm.isInitialized, fhevm.isInitializing]);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>FHEVM dApp Starter</h1>
        <div style={styles.headerActions}>
          {!fhevm.isInitialized && wallet.address && (
            <button onClick={fhevm.initialize} disabled={fhevm.isInitializing} style={styles.initBtn}>
              {fhevm.isInitializing ? "Initializing..." : "Init FHEVM"}
            </button>
          )}
          {wallet.address ? (
            <button onClick={wallet.disconnect} style={styles.disconnectBtn}>
              Disconnect
            </button>
          ) : (
            <button onClick={wallet.connect} disabled={wallet.isConnecting} style={styles.connectBtn}>
              {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </header>

      <StatusBar address={wallet.address} chainId={wallet.chainId} fhevmReady={fhevm.isInitialized} />

      {(wallet.error || fhevm.error) && (
        <div style={styles.errorBanner}>{wallet.error || fhevm.error}</div>
      )}

      <nav style={styles.tabs}>
        {(["interact", "encrypt", "decrypt"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={activeTab === tab ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          >
            {tab === "interact" ? "Contract" : tab === "encrypt" ? "Encrypt" : "Decrypt"}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === "interact" && <ContractInteraction signer={wallet.signer} />}
        {activeTab === "encrypt" && (
          <EncryptedInput encrypt={fhevm.encrypt} userAddress={wallet.address} fhevmReady={fhevm.isInitialized} />
        )}
        {activeTab === "decrypt" && <DecryptionPanel decrypt={fhevm.decrypt} fhevmReady={fhevm.isInitialized} />}
      </main>

      <footer style={styles.footer}>FHEVM Bootcamp Starter Template</footer>
    </div>
  );
}

const styles = {
  app: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "1.5rem",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#e0e0e0",
    background: "#0f0f1a",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.4rem",
    background: "linear-gradient(135deg, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  headerActions: { display: "flex", gap: "0.5rem" },
  connectBtn: {
    padding: "0.5rem 1.2rem",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  disconnectBtn: {
    padding: "0.5rem 1.2rem",
    background: "#333",
    color: "#ccc",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  initBtn: {
    padding: "0.5rem 1.2rem",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  errorBanner: {
    marginTop: "0.75rem",
    padding: "0.5rem 1rem",
    background: "#3b1111",
    border: "1px solid #7f1d1d",
    borderRadius: "6px",
    color: "#fca5a5",
    fontSize: "0.85rem",
  },
  tabs: {
    display: "flex",
    gap: "0",
    marginTop: "1.5rem",
    borderBottom: "1px solid #333",
  },
  tab: {
    padding: "0.6rem 1.5rem",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#888",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "color 0.2s",
  },
  activeTab: {
    color: "#a5b4fc",
    borderBottomColor: "#6366f1",
  },
  main: {
    marginTop: "0.5rem",
  },
  footer: {
    marginTop: "3rem",
    textAlign: "center" as const,
    color: "#555",
    fontSize: "0.8rem",
  },
};
