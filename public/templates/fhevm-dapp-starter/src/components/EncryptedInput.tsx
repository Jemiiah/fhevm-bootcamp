import { useState } from "react";

type EncryptedType = "uint8" | "uint16" | "uint32" | "uint64" | "uint128" | "uint256" | "bool" | "address";

interface EncryptedInputProps {
  encrypt: (value: any, type: EncryptedType, userAddress: string) => Promise<any>;
  userAddress: string | null;
  fhevmReady: boolean;
}

export function EncryptedInput({ encrypt, userAddress, fhevmReady }: EncryptedInputProps) {
  const [type, setType] = useState<EncryptedType>("uint8");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!userAddress) {
      setError("Connect your wallet first");
      return;
    }
    if (!fhevmReady) {
      setError("FHEVM not initialized — click 'Init FHEVM' first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedValue: any = value;
      if (type === "bool") {
        parsedValue = value === "true" || value === "1";
      } else if (type !== "address") {
        parsedValue = BigInt(value);
      }

      const encrypted = await encrypt(parsedValue, type, userAddress);
      setResult(JSON.stringify({
        handles: encrypted.handles.map((h: Uint8Array) => "0x" + Array.from(h).map(b => b.toString(16).padStart(2, "0")).join("")),
        inputProof: "0x" + Array.from(encrypted.inputProof as Uint8Array).map(b => b.toString(16).padStart(2, "0")).join(""),
      }, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Encrypt a Value</h3>
      <p style={styles.hint}>
        Encrypt a plaintext value to get the handle + proof for your contract call.
      </p>

      <div style={styles.row}>
        <label style={styles.label}>
          Type
          <select value={type} onChange={(e) => setType(e.target.value as EncryptedType)} style={styles.select}>
            <option value="uint8">uint8</option>
            <option value="uint16">uint16</option>
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
            <option value="uint128">uint128</option>
            <option value="uint256">uint256</option>
            <option value="bool">bool</option>
            <option value="address">address</option>
          </select>
        </label>

        <label style={styles.label}>
          Value
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "bool" ? "true / false" : type === "address" ? "0x..." : "0"}
            style={styles.input}
          />
        </label>
      </div>

      <button onClick={handleEncrypt} disabled={loading || !value} style={styles.button}>
        {loading ? "Encrypting..." : "Encrypt"}
      </button>

      {error && <div style={styles.error}>{error}</div>}
      {result && (
        <div style={styles.resultBox}>
          <strong>Encrypted output (pass to your contract):</strong>
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
  row: { display: "flex", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "1rem" },
  label: { display: "flex", flexDirection: "column" as const, gap: "0.3rem", color: "#aaa", fontSize: "0.85rem" },
  select: { padding: "0.5rem", background: "#1a1a2e", color: "#fff", border: "1px solid #333", borderRadius: "6px", fontSize: "0.9rem" },
  input: { padding: "0.5rem", background: "#1a1a2e", color: "#fff", border: "1px solid #333", borderRadius: "6px", fontSize: "0.9rem", minWidth: "200px" },
  button: { padding: "0.6rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" },
  error: { marginTop: "0.75rem", color: "#f87171", fontSize: "0.85rem" },
  resultBox: { marginTop: "1rem", padding: "0.75rem", background: "#1a1a2e", borderRadius: "6px", fontSize: "0.85rem", color: "#ccc" },
  pre: { margin: "0.5rem 0 0", whiteSpace: "pre-wrap" as const, wordBreak: "break-all" as const, color: "#a5b4fc" },
};
