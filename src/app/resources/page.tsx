"use client";

import { useState } from "react";

type Section = "docs" | "repos" | "code" | "community";

const docs = [
  { title: "Zama Protocol Docs", desc: "Complete protocol documentation", url: "https://docs.zama.org/protocol" },
  { title: "Solidity Guides", desc: "Smart contract development guides", url: "https://docs.zama.org/protocol/solidity-guides" },
  { title: "Relayer SDK", desc: "Frontend SDK documentation", url: "https://docs.zama.org/protocol/relayer-sdk-guides" },
  { title: "Protocol Litepaper", desc: "Technical architecture overview", url: "https://docs.zama.org/protocol/zama-protocol-litepaper" },
  { title: "Examples", desc: "Official code examples", url: "https://docs.zama.org/protocol/examples" },
];

const repos = [
  { name: "zama-ai/fhevm", desc: "Core FHEVM framework", url: "https://github.com/zama-ai/fhevm" },
  { name: "zama-ai/fhevm-solidity", desc: "Solidity library", url: "https://github.com/zama-ai/fhevm-solidity" },
  { name: "zama-ai/fhevm-contracts", desc: "Standard contract library", url: "https://github.com/zama-ai/fhevm-contracts" },
  { name: "zama-ai/fhevm-hardhat-template", desc: "Starter template", url: "https://github.com/zama-ai/fhevm-hardhat-template" },
];

const snippets = [
  {
    title: "Encrypted State",
    lang: "Solidity",
    code: `pragma solidity ^0.8.24;
import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is ZamaEthereumConfig {
    euint64 private _value;

    function setValue(externalEuint64 input, bytes calldata proof) external {
        _value = FHE.fromExternal(input, proof);
        FHE.allowThis(_value);
        FHE.allow(_value, msg.sender);
    }
}`,
  },
  {
    title: "Encrypted Transfer",
    lang: "Solidity",
    code: `function transfer(address to, externalEuint64 encAmount, bytes calldata proof) external {
    euint64 amount = FHE.fromExternal(encAmount, proof);
    ebool canTransfer = FHE.le(amount, balances[msg.sender]);
    euint64 transferAmount = FHE.select(canTransfer, amount, FHE.asEuint64(0));
    balances[msg.sender] = FHE.sub(balances[msg.sender], transferAmount);
    balances[to] = FHE.add(balances[to], transferAmount);
    FHE.allowThis(balances[msg.sender]);
    FHE.allow(balances[msg.sender], msg.sender);
    FHE.allowThis(balances[to]);
    FHE.allow(balances[to], to);
}`,
  },
  {
    title: "Test Pattern",
    lang: "TypeScript",
    code: `const input = await fhevm
    .createEncryptedInput(contractAddress, alice.address)
    .add64(42)
    .encrypt();

await contract.connect(alice).setValue(input.handles[0], input.inputProof);

const encrypted = await contract.getValue();
const result = await fhevm.userDecryptEuint(
    FhevmType.euint64, encrypted, contractAddress, alice
);
expect(result).to.equal(42n);`,
  },
];

const sectionTabs: { key: Section; label: string }[] = [
  { key: "docs", label: "docs" },
  { key: "repos", label: "github" },
  { key: "code", label: "templates" },
  { key: "community", label: "community" },
];

export default function ResourcesPage() {
  const [active, setActive] = useState<Section>("docs");

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-20">
      <div className="mb-8 animate-fade-in-up">
        <span className="section-label">// RESOURCES</span>
        <h1 className="mt-3 text-2xl font-bold text-[#E8E8ED]">Resources</h1>
        <p className="mt-2 text-[13px] text-[#5A5F73]">
          Official docs, code templates, and community links.
        </p>
      </div>

      {/* Section nav */}
      <div className="mb-6 flex flex-wrap gap-1">
        {sectionTabs.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
              active === s.key
                ? "bg-[#FFC517]/8 text-[#FFC517] border border-[#FFC517]/20"
                : "text-[#3A3D47] border border-transparent hover:text-[#5A5F73]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Docs */}
      {active === "docs" && (
        <div className="space-y-0.5">
          {docs.map((d) => (
            <a
              key={d.url}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-[#1a1a1a] bg-[#0a0a0a] px-5 py-3.5 transition hover:border-[#2a2a2a] hover:bg-[#111318]"
            >
              <div>
                <span className="text-[13px] font-medium text-[#B8BCC8]">{d.title}</span>
                <span className="ml-3 text-[12px] text-[#3A3D47]">{d.desc}</span>
              </div>
              <span className="text-[#3A3D47]">&rarr;</span>
            </a>
          ))}
        </div>
      )}

      {/* Repos */}
      {active === "repos" && (
        <div className="grid gap-3 md:grid-cols-2">
          {repos.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="t-card group"
            >
              <h3 className="text-[13px] font-medium text-[#B8BCC8] group-hover:text-[#FFC517]">
                {r.name}
              </h3>
              <p className="mt-1 text-[12px] text-[#3A3D47]">{r.desc}</p>
            </a>
          ))}
        </div>
      )}

      {/* Code Templates */}
      {active === "code" && (
        <div className="space-y-5">
          {snippets.map((s) => (
            <div key={s.title}>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[13px] font-medium text-[#B8BCC8]">{s.title}</span>
                <span className="tag text-[10px]">{s.lang}</span>
              </div>
              <div className="t-card-window">
                <div className="t-titlebar">
                  <span className="t-dot red" />
                  <span className="t-dot yellow" />
                  <span className="t-dot green" />
                </div>
                <pre className="!border-0 !bg-transparent p-4 text-[12px] text-[#5A5F73]">
                  <code>{s.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community */}
      {active === "community" && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Discord", desc: "Join the Zama community chat", url: "https://discord.gg/zama" },
            { label: "Community Forum", desc: "Ask questions and share projects", url: "https://community.zama.ai" },
            { label: "Developer Program", desc: "Apply for grants and bounties", url: "https://zama.org/developer-hub" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="t-card group"
            >
              <h3 className="text-[13px] font-medium text-[#B8BCC8] group-hover:text-[#FFC517]">{c.label}</h3>
              <p className="mt-1 text-[12px] text-[#3A3D47]">{c.desc}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
