import { NETWORK_CONFIG } from "../config";

interface StatusBarProps {
  address: string | null;
  chainId: number | null;
  fhevmReady: boolean;
}

export function StatusBar({ address, chainId, fhevmReady }: StatusBarProps) {
  const isCorrectNetwork = chainId === NETWORK_CONFIG.chainId;

  return (
    <div style={styles.bar}>
      <div style={styles.item}>
        <span style={styles.dot(!!address)} />
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
      </div>
      <div style={styles.item}>
        <span style={styles.dot(isCorrectNetwork)} />
        {chainId ? (isCorrectNetwork ? NETWORK_CONFIG.chainName : `Wrong network (${chainId})`) : "No network"}
      </div>
      <div style={styles.item}>
        <span style={styles.dot(fhevmReady)} />
        FHEVM {fhevmReady ? "Ready" : "Not initialized"}
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    gap: "1.5rem",
    padding: "0.5rem 1rem",
    background: "#1a1a2e",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#ccc",
    flexWrap: "wrap" as const,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  dot: (active: boolean) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: active ? "#4ade80" : "#666",
    display: "inline-block",
  }),
};
