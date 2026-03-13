import { useState } from "react";
import { Contract, InterfaceAbi } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config";
import type { JsonRpcSigner } from "ethers";

interface ContractInteractionProps {
  signer: JsonRpcSigner | null;
}

interface FunctionParam {
  name: string;
  value: string;
}

export function ContractInteraction({ signer }: ContractInteractionProps) {
  const [selectedFn, setSelectedFn] = useState("");
  const [params, setParams] = useState<FunctionParam[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse ABI to get callable functions
  const functions = parseFunctions(CONTRACT_ABI);

  const handleSelectFn = (fnName: string) => {
    setSelectedFn(fnName);
    setResult(null);
    setError(null);
    const fn = functions.find((f) => f.name === fnName);
    if (fn) {
      setParams(fn.inputs.map((input) => ({ name: input.name || input.type, value: "" })));
    }
  };

  const handleCall = async () => {
    if (!signer) {
      setError("Connect your wallet first");
      return;
    }
    if (!selectedFn) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI as InterfaceAbi, signer);
      const args = params.map((p) => p.value);
      const fn = functions.find((f) => f.name === selectedFn);

      if (fn?.stateMutability === "view" || fn?.stateMutability === "pure") {
        const res = await contract[selectedFn](...args);
        setResult(String(res));
      } else {
        const tx = await contract[selectedFn](...args);
        setResult(`Tx sent: ${tx.hash}\nWaiting for confirmation...`);
        await tx.wait();
        setResult(`Tx confirmed: ${tx.hash}`);
      }
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (functions.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>Contract Interaction</h3>
        <div style={styles.empty}>
          <p>No functions found in your ABI.</p>
          <p style={{ color: "#888", fontSize: "0.85rem" }}>
            Edit <code>src/config.ts</code> and add your contract's ABI to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Contract Interaction</h3>
      <p style={styles.hint}>Select a function from your contract ABI and fill in the parameters.</p>

      <select value={selectedFn} onChange={(e) => handleSelectFn(e.target.value)} style={styles.select}>
        <option value="">Select a function...</option>
        {functions.map((fn) => (
          <option key={fn.name} value={fn.name}>
            {fn.name}({fn.inputs.map((i) => i.type).join(", ")}) {fn.stateMutability === "view" ? "[view]" : ""}
          </option>
        ))}
      </select>

      {params.length > 0 && (
        <div style={styles.params}>
          {params.map((param, i) => (
            <label key={i} style={styles.label}>
              {param.name}
              <input
                type="text"
                value={param.value}
                onChange={(e) => {
                  const next = [...params];
                  next[i] = { ...next[i], value: e.target.value };
                  setParams(next);
                }}
                placeholder={`Enter ${param.name}`}
                style={styles.input}
              />
            </label>
          ))}
        </div>
      )}

      {selectedFn && (
        <button onClick={handleCall} disabled={loading} style={styles.button}>
          {loading ? "Sending..." : functions.find((f) => f.name === selectedFn)?.stateMutability === "view" ? "Read" : "Write"}
        </button>
      )}

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

interface ParsedFunction {
  name: string;
  inputs: { name: string; type: string }[];
  stateMutability: string;
}

function parseFunctions(abi: any[]): ParsedFunction[] {
  const results: ParsedFunction[] = [];
  for (const item of abi) {
    if (typeof item === "string") {
      // Human-readable ABI format: "function name(type param) view returns (type)"
      const match = item.match(/function\s+(\w+)\(([^)]*)\)(?:\s+(view|pure))?/);
      if (match) {
        const inputs = match[2]
          ? match[2].split(",").map((p: string) => {
              const parts = p.trim().split(/\s+/);
              return { type: parts[0], name: parts[parts.length - 1] || parts[0] };
            })
          : [];
        results.push({ name: match[1], inputs, stateMutability: match[3] || "nonpayable" });
      }
    } else if (item.type === "function") {
      results.push({
        name: item.name,
        inputs: item.inputs || [],
        stateMutability: item.stateMutability || "nonpayable",
      });
    }
  }
  return results;
}

const styles = {
  container: { padding: "1rem 0" },
  heading: { margin: "0 0 0.25rem", color: "#e0e0e0" },
  hint: { color: "#888", fontSize: "0.85rem", margin: "0 0 1rem" },
  empty: { padding: "2rem", textAlign: "center" as const, color: "#aaa", background: "#1a1a2e", borderRadius: "8px" },
  select: { padding: "0.5rem", background: "#1a1a2e", color: "#fff", border: "1px solid #333", borderRadius: "6px", fontSize: "0.9rem", width: "100%", marginBottom: "1rem" },
  params: { display: "flex", flexDirection: "column" as const, gap: "0.75rem", marginBottom: "1rem" },
  label: { display: "flex", flexDirection: "column" as const, gap: "0.3rem", color: "#aaa", fontSize: "0.85rem" },
  input: { padding: "0.5rem", background: "#1a1a2e", color: "#fff", border: "1px solid #333", borderRadius: "6px", fontSize: "0.9rem" },
  button: { padding: "0.6rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" },
  error: { marginTop: "0.75rem", color: "#f87171", fontSize: "0.85rem" },
  resultBox: { marginTop: "1rem", padding: "0.75rem", background: "#1a1a2e", borderRadius: "6px", fontSize: "0.85rem", color: "#ccc" },
  pre: { margin: "0.5rem 0 0", whiteSpace: "pre-wrap" as const, wordBreak: "break-all" as const, color: "#a5b4fc" },
};
