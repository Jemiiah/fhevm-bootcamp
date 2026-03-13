import { useState } from "react";

interface DecryptionPanelProps {
  decrypt: (handle: bigint) => Promise<string>;
  fhevmReady: boolean;
}

export function DecryptionPanel({ decrypt, fhevmReady }: DecryptionPanelProps) {
  const [handle, setHandle] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    if (!fhevmReady) {
      setError("FHEVM not initialized — click 'Init FHEVM' first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const handleBigInt = BigInt(handle);
      const decrypted = await decrypt(handleBigInt);
      setResult(decrypted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Decrypt a Value</h3>
      <p style={styles.hint}>
        Enter a ciphertext handle to request decryption. Your contract must have
        called <code>TFHE.allow()</code> or <code>Gateway.requestDecryption()</code> first.
      </p>

      <label style={styles.label}>
        Ciphertext Handle
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter handle (decimal or 0x...)"
          style={styles.input}
        />
      </label>

      <button onClick={handleDecrypt} disabled={loading || !handle} style={styles.button}>
        {loading ? "Decrypting..." : "Decrypt"}
      </button>

      {error && <div style={styles.error}>{error}</div>}
      {result && (
        <div style={styles.resultBox}>
          <strong>Result:</strong>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "1rem 0" },
  heading: { margin: "0 0 0.25rem", color: "#e0e0e0" },
  hint: { color: "#888", fontSize: "0.85rem", margin: "0 0 1rem" },
  label: { display: "flex", flexDirection: "column" as const, gap: "0.3rem", color: "#aaa", fontSize: "0.85rem", marginBottom: "1rem" },
  input: { padding: "0.5rem", background: "#1a1a2e", color: "#fff", border: "1px solid #333", borderRadius: "6px", fontSize: "0.9rem", minWidth: "300px" },
  button: { padding: "0.6rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" },
  error: { marginTop: "0.75rem", color: "#f87171", fontSize: "0.85rem" },
  resultBox: { marginTop: "1rem", padding: "0.75rem", background: "#1a1a2e", borderRadius: "6px", fontSize: "0.85rem", color: "#ccc" },
  pre: { margin: "0.5rem 0 0", whiteSpace: "pre-wrap" as const, wordBreak: "break-all" as const, color: "#a5b4fc" },
};
