import type { ContentBlock } from "./curriculum";

/**
 * Rich educational content for all 16 lessons across 4 weeks.
 * Keyed by lesson ID (e.g., "w1-l1").
 */
export const LESSON_CONTENT: Record<string, ContentBlock[]> = {
  // ═══════════════════════════════════════════════════════════════
  // WEEK 1, LESSON 1 — The Privacy Problem in Public Blockchains
  // ═══════════════════════════════════════════════════════════════
  "w1-l1": [
    {
      type: "text",
      body: "Every transaction on Ethereum is permanently visible to the entire world. When you transfer tokens, vote in a DAO, or interact with a DeFi protocol, that action is recorded on a public ledger that anyone can inspect. This radical transparency was a deliberate design choice — it enables trustless verification. But it also creates serious problems.",
    },
    {
      type: "text",
      body: "Consider what happens when you submit a large swap on a DEX. Your pending transaction sits in the mempool, visible to everyone. Sophisticated actors — known as MEV (Maximal Extractable Value) searchers — detect your trade and sandwich it: they buy before you (driving the price up), let your trade execute at the worse price, then sell immediately after for a profit. In 2023 alone, MEV extraction cost Ethereum users over $600 million.",
    },
    {
      type: "insight",
      title: "Why This Matters for Smart Contract Developers",
      body: "As a Solidity developer, you've been writing contracts where ALL state is public. Every mapping, every balance, every vote — readable by anyone who queries the chain. FHE changes this fundamental assumption: you can now have private state that is computed on but never revealed.",
    },
    {
      type: "text",
      body: "Let's compare the four main approaches to blockchain privacy and understand why FHE is uniquely powerful:",
    },
    {
      type: "list",
      title: "Privacy Approaches Compared",
      items: [
        "Zero-Knowledge Proofs (ZK): Prove something is true without revealing the underlying data. Great for verification, but you can't compute on hidden data — only prove properties about it.",
        "Trusted Execution Environments (TEE): Run code inside a hardware 'secure enclave' (like Intel SGX). Fast, but requires trusting the hardware manufacturer. Hardware vulnerabilities have been found repeatedly.",
        "Multi-Party Computation (MPC): Split secrets across multiple parties who compute together. Powerful but expensive — communication overhead grows with the number of parties.",
        "Fully Homomorphic Encryption (FHE): Perform arbitrary computations directly on encrypted data without ever decrypting it. The encrypted result, when decrypted, matches what you'd get from computing on the plaintext. No trusted hardware, no communication rounds during computation.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "TraditionalToken.sol",
      body: `// Traditional ERC-20 — ALL balances are public
contract PublicToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount); // Anyone can see this check
        balances[msg.sender] -= amount;           // Public state change
        balances[to] += amount;                   // Everyone knows both balances
    }
}`,
    },
    {
      type: "code",
      language: "solidity",
      filename: "ConfidentialToken.sol",
      body: `// FHEVM Confidential Token — balances are ENCRYPTED
import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances; // Encrypted!

    function transfer(address to, externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        ebool sufficient = FHE.le(encAmount, balances[msg.sender]); // Encrypted comparison
        euint64 actual = FHE.select(sufficient, encAmount, FHE.asEuint64(0));
        balances[msg.sender] = FHE.sub(balances[msg.sender], actual);
        balances[to] = FHE.add(balances[to], actual);
    }
}`,
    },
    {
      type: "insight",
      title: "The FHE Mental Model",
      body: "Think of FHE like a locked glovebox. You put your data inside, lock it, and hand it to someone. They can rearrange, combine, and transform the contents through the gloves — but they never see or touch the actual data. When you unlock the box, the result of their work is there, correct and verified. That's what FHEVM does for smart contracts.",
    },
    {
      type: "text",
      body: "The Zama Protocol makes FHE practical for blockchain by splitting the work: the host chain (Ethereum) handles the encrypted state and emits operation descriptions, while a network of coprocessors performs the actual FHE computations off-chain. This architecture means you write Solidity that looks almost normal — but the values are encrypted and the computations happen homomorphically.",
    },
    {
      type: "warning",
      title: "Common Misconception",
      body: "FHE does NOT make transactions anonymous. The sender, receiver, and function being called are still visible on-chain. What FHE encrypts is the DATA — balances, vote counts, bid amounts, etc. For full transaction privacy (hiding who is transacting), you'd combine FHE with other techniques.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 1, LESSON 2 — Zama Protocol Architecture Deep Dive
  // ═══════════════════════════════════════════════════════════════
  "w1-l2": [
    {
      type: "text",
      body: "Understanding how the Zama Protocol works under the hood is essential before writing any FHEVM code. The architecture explains why your contracts behave differently from standard Solidity — and why certain patterns (like using if/else on encrypted values) are impossible.",
    },
    {
      type: "text",
      body: "The Zama Protocol consists of four main components that work together to enable encrypted computation on Ethereum:",
    },
    {
      type: "list",
      title: "Architecture Components",
      items: [
        "Host Chain (Ethereum): Where your Solidity contracts live. Stores encrypted ciphertext handles and emits FHE operation events. Does NOT perform actual FHE math.",
        "Coprocessor Network: 5 operators running TFHE computations off-chain. They receive operation events from the host chain, perform the encrypted math, and return results. Consensus-based — requires agreement between operators.",
        "Key Management Service (KMS): A 13-node MPC network that manages the global FHE encryption key. Threshold decryption requires 2/3 majority (9 of 13 nodes). This is how data gets decrypted when authorized.",
        "Gateway (Arbitrum Rollup): Orchestrates cross-chain communication between the host chain, coprocessors, and KMS. Handles proof verification and result bridging.",
      ],
    },
    {
      type: "insight",
      title: "Symbolic Execution — The Key Concept",
      body: "When your FHEVM contract calls FHE.add(a, b), the host chain does NOT perform encrypted addition. Instead, it records: 'add handle_a and handle_b, store result as handle_c.' This operation description is emitted as an event. Coprocessors pick up the event, perform the actual FHE computation off-chain, and write back the result. This is called symbolic execution — the host chain manipulates symbols (handles) while the real work happens elsewhere.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "SymbolicExecution.sol",
      body: `// What you WRITE in Solidity:
euint64 result = FHE.add(balanceA, balanceB);

// What ACTUALLY happens on the host chain:
// 1. Host chain sees: "add(handle_0x1a2b, handle_0x3c4d)"
// 2. Emits event: OperationRequested(ADD, handle_0x1a2b, handle_0x3c4d)
// 3. Assigns new handle: handle_0x5e6f for the result
// 4. Coprocessors compute: decrypt(0x1a2b) + decrypt(0x3c4d) = encrypt(sum)
// 5. Result ciphertext is stored against handle_0x5e6f

// The host chain NEVER sees the actual numbers — only handles.`,
    },
    {
      type: "text",
      body: "The journey of an encrypted operation follows this flow: Your contract calls an FHE operation → the host chain emits an event with the operation details → coprocessors detect the event → they retrieve the ciphertext from the host chain → perform the FHE computation → write the result back → the host chain associates the result with the new handle.",
    },
    {
      type: "warning",
      title: "Why You Cannot Branch on Encrypted Values",
      body: "Because the host chain only has handles (not actual values), it cannot evaluate if/else conditions on encrypted data. The expression `if (FHE.lt(a, b))` is meaningless — FHE.lt returns an encrypted boolean (ebool), not a Solidity bool. The host chain doesn't know if it's true or false. This is why FHE.select() exists: it's an encrypted ternary that the coprocessors evaluate.",
    },
    {
      type: "text",
      body: "The decryption flow is equally important to understand. When someone is authorized to see a value, the process involves the KMS:",
    },
    {
      type: "list",
      title: "Decryption Flow (3 Steps)",
      items: [
        "Step 1 — On-chain declaration: Contract calls FHE.makePubliclyDecryptable(handle) to mark a ciphertext for public decryption.",
        "Step 2 — Off-chain decryption: The dApp client calls the Relayer SDK's publicDecrypt(handles[]) function. The Relayer coordinates with the KMS, which performs threshold decryption (9 of 13 nodes must agree).",
        "Step 3 — On-chain verification: The contract calls FHE.checkSignatures(handles, abiEncodedCleartexts, proof) to verify the decrypted values are authentic. The KMS provides a cryptographic proof alongside the decrypted values.",
      ],
    },
    {
      type: "insight",
      title: "Trust Model",
      body: "The Zama Protocol's security doesn't rely on any single party. Coprocessors use consensus (Byzantine fault tolerant), the KMS uses threshold cryptography (2/3 majority), and the Gateway is a rollup with fraud proofs. Even if some coprocessors or KMS nodes are compromised, the system remains secure as long as the threshold isn't breached.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 1, LESSON 3 — Development Environment Setup & First Contract
  // ═══════════════════════════════════════════════════════════════
  "w1-l3": [
    {
      type: "text",
      body: "Time to get your hands dirty. In this lesson, you'll set up a complete FHEVM development environment and write your first encrypted smart contract. By the end, you'll have a working confidential counter that stores its value as an encrypted integer — invisible to everyone except authorized parties.",
    },
    {
      type: "list",
      title: "Prerequisites",
      items: [
        "Node.js LTS (v18, v20, or v22) — check with: node -v",
        "npm or yarn package manager",
        "Git for version control",
        "A code editor (VS Code recommended — install the Solidity extension)",
        "Basic Solidity knowledge (you should know what mappings, events, and modifiers are)",
      ],
    },
    {
      type: "code",
      language: "bash",
      filename: "Terminal",
      body: `# Step 1: Clone the official FHEVM Hardhat template
git clone https://github.com/zama-ai/fhevm-hardhat-template
cd fhevm-hardhat-template

# Step 2: Install dependencies
npm install

# Step 3: Set up environment variables
npx hardhat vars set MNEMONIC        # Your wallet mnemonic for deployments
npx hardhat vars set INFURA_API_KEY  # For Sepolia testnet access

# Step 4: Compile the example contracts
npx hardhat compile

# Step 5: Run the test suite in mock mode
npx hardhat test`,
    },
    {
      type: "text",
      body: "The template comes with a well-organized project structure. Let's understand what each directory does:",
    },
    {
      type: "list",
      title: "Project Structure",
      items: [
        "contracts/ — Your Solidity contracts. The template includes example encrypted contracts.",
        "test/ — Test files using Hardhat + Mocha. Special FHEVM test helpers for encrypted I/O.",
        "deploy/ — Deployment scripts for local and testnet.",
        "tasks/ — Hardhat tasks for common operations.",
        "hardhat.config.ts — Network configuration, compiler settings, FHEVM plugin setup.",
      ],
    },
    {
      type: "text",
      body: "Now let's write your first FHEVM contract — an encrypted counter. This contract stores a count as an encrypted euint32. Anyone can increment or decrement it, but no one can see the actual value unless they're authorized.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "contracts/FHECounter.sol",
      body: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHECounter is ZamaEthereumConfig {
    // The count is encrypted — no one can read it from the blockchain
    euint32 private counter;

    constructor() {
        // Initialize to encrypted zero
        counter = FHE.asEuint32(0);
        // CRITICAL: Allow this contract to reuse the handle in future operations
        FHE.allowThis(counter);
    }

    function increment() public {
        // FHE.add with a scalar (plaintext 1) is gas-efficient
        counter = FHE.add(counter, 1);
        FHE.allowThis(counter);
    }

    function decrement() public {
        counter = FHE.sub(counter, 1);
        FHE.allowThis(counter);
    }

    function getCount() public returns (euint32) {
        // Grant the caller permission to decrypt this value
        FHE.allow(counter, msg.sender);
        return counter;
    }
}`,
    },
    {
      type: "insight",
      title: "FHE.allowThis() — The Most Common Mistake",
      body: "Every time you assign a new value to an encrypted state variable, you MUST call FHE.allowThis() on it. Without this, the contract loses permission to use that handle in future operations. Forgetting FHE.allowThis() is the #1 cause of bugs in FHEVM contracts. Think of it like re-granting yourself access to your own locker every time you put something new inside.",
    },
    {
      type: "text",
      body: "Notice two key differences from standard Solidity: (1) We use FHE.add(counter, 1) instead of counter++. The encrypted counter can't use normal operators directly. (2) We call FHE.allow(counter, msg.sender) in the getter — this grants the caller permission to decrypt the value client-side. Without this permission, the encrypted handle is useless to them.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "Key Patterns to Remember",
      body: `// Pattern 1: Encrypting a plaintext value
euint32 encrypted = FHE.asEuint32(42);

// Pattern 2: Scalar operations (cheaper gas)
euint32 result = FHE.add(encrypted, 1);  // 1 is plaintext — cheaper!

// Pattern 3: Self-permission after every assignment
counter = FHE.add(counter, 1);
FHE.allowThis(counter);  // NEVER forget this!

// Pattern 4: Granting read access to a user
FHE.allow(counter, msg.sender);  // Now msg.sender can decrypt`,
    },
    {
      type: "warning",
      title: "Version Alert",
      body: "This bootcamp uses fhEVM v0.9+ with the FHE library. If you find older tutorials online using 'TFHE' instead of 'FHE', or referencing 'GatewayCaller' or 'FHE.requestDecryption' — those patterns are deprecated. Always use the patterns shown in this bootcamp.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 1, LESSON 4 — Testing FHEVM Contracts & Encrypted I/O
  // ═══════════════════════════════════════════════════════════════
  "w1-l4": [
    {
      type: "text",
      body: "Testing FHEVM contracts is fundamentally different from testing standard Solidity. You can't just assert that a variable equals some value — the variable is encrypted. Instead, you follow a three-step pattern: encrypt inputs client-side, submit them to the contract, then decrypt outputs with authorized signers.",
    },
    {
      type: "code",
      language: "typescript",
      filename: "test/FHECounter.test.ts",
      body: `import { expect } from "chai";
import { ethers } from "hardhat";
import { createInstances } from "../instance";
import { getSigners } from "../signers";

describe("FHECounter", function () {
  let contract: any;
  let fhevm: any;
  let alice: any;

  before(async function () {
    const signers = await getSigners();
    alice = signers.alice;

    const Factory = await ethers.getContractFactory("FHECounter");
    contract = await Factory.connect(alice).deploy();
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    fhevm = await createInstances(contractAddress, ethers, signers);
  });

  it("should start at 0", async function () {
    // Step 1: Call getCount() to get the encrypted handle
    const encryptedCount = await contract.connect(alice).getCount();

    // Step 2: Decrypt using the authorized signer
    const result = await fhevm.alice.decrypt64(contractAddress, encryptedCount);
    expect(result).to.equal(0n);
  });

  it("should increment to 1", async function () {
    await contract.connect(alice).increment();
    const encryptedCount = await contract.connect(alice).getCount();
    const result = await fhevm.alice.decrypt64(contractAddress, encryptedCount);
    expect(result).to.equal(1n);
  });
});`,
    },
    {
      type: "insight",
      title: "Encrypted Inputs Are Bound to (Contract, User) Pairs",
      body: "When you create an encrypted input, it's cryptographically bound to a specific contract address AND user address. You cannot reuse encrypted inputs across different contracts or different user accounts. This is a security feature — it prevents replay attacks where someone could submit your encrypted value to a different contract.",
    },
    {
      type: "text",
      body: "To send encrypted values TO a contract (not just read them), you need to create encrypted inputs with ZKPoK (Zero-Knowledge Proof of Knowledge) proofs. This proves you know the plaintext value without revealing it:",
    },
    {
      type: "code",
      language: "typescript",
      filename: "test/EncryptedInput.test.ts",
      body: `it("should accept encrypted deposits", async function () {
  const contractAddress = await contract.getAddress();

  // Step 1: Create an encrypted input bound to (contract, alice)
  const input = await fhevm.alice
    .createEncryptedInput(contractAddress, alice.address)
    .add64(1000)      // Encrypt the value 1000 as euint64
    .encrypt();       // Generate the ZKPoK proof

  // Step 2: Submit to the contract
  // input.handles[0] = the encrypted value handle
  // input.inputProof = the ZKPoK proof
  await contract.connect(alice).deposit(
    input.handles[0],
    input.inputProof
  );

  // Step 3: Read and decrypt the result
  const encBalance = await contract.connect(alice).getBalance();
  const balance = await fhevm.alice.decrypt64(contractAddress, encBalance);
  expect(balance).to.equal(1000n);
});`,
    },
    {
      type: "warning",
      title: "Uninitialized Encrypted Values",
      body: "An encrypted variable that has never been assigned returns ethers.ZeroHash (0x000...000) when read. This is NOT the same as 'encrypted zero.' Always use FHE.isInitialized() to check if a value has been set before performing operations on it.",
    },
    {
      type: "text",
      body: "The FHEVM Hardhat template provides test helpers that abstract most of the complexity. The key functions you'll use are:",
    },
    {
      type: "list",
      title: "Essential Test Helpers",
      items: [
        "createInstances(contractAddr, ethers, signers) — Creates FHEVM instances for each signer, bound to the contract.",
        "fhevm.alice.createEncryptedInput(contract, user) — Starts building an encrypted input. Chain .add8(), .add32(), .add64() etc. for each value.",
        ".encrypt() — Finalizes the encrypted input and generates the ZKPoK proof. Returns { handles[], inputProof }.",
        "fhevm.alice.decrypt64(contract, handle) — Decrypts a euint64 handle. Only works if alice has ACL permission.",
        "Mock mode vs Sepolia — In mock mode (local), encryption/decryption is simulated. On Sepolia, it uses the real KMS.",
      ],
    },
    {
      type: "code",
      language: "typescript",
      filename: "test/MultipleInputs.test.ts",
      body: `// You can encrypt multiple values in a single input
const input = await fhevm.alice
  .createEncryptedInput(contractAddress, alice.address)
  .add64(500)     // First encrypted value
  .add64(200)     // Second encrypted value
  .addBool(true)  // Encrypted boolean
  .encrypt();

// Access each handle by index
await contract.connect(alice).multiFunction(
  input.handles[0],  // 500 (euint64)
  input.handles[1],  // 200 (euint64)
  input.handles[2],  // true (ebool)
  input.inputProof   // Single proof covers all values
);`,
    },
    {
      type: "insight",
      title: "Testing Best Practices",
      body: "Always test permission boundaries: verify that unauthorized users CANNOT decrypt values they shouldn't see. Test with multiple signers (alice, bob, carol) to ensure ACL permissions work correctly. And always test the 'no-op' path — what happens when a transfer has insufficient balance? The result should be silent (no revert), just zero transfer.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 2, LESSON 1 — Complete Guide to Encrypted Types
  // ═══════════════════════════════════════════════════════════════
  "w2-l1": [
    {
      type: "text",
      body: "FHEVM v0.9+ provides a comprehensive set of encrypted types that mirror Solidity's standard types. Choosing the right type is critical — not just for correctness, but for gas efficiency. A euint8 operation costs dramatically less than a euint256 operation.",
    },
    {
      type: "list",
      title: "All Encrypted Types in FHEVM v0.9+",
      items: [
        "ebool — Encrypted boolean. For flags, toggles, comparison results. The result of FHE.lt(), FHE.eq(), etc.",
        "euint8, euint16, euint32, euint64, euint128, euint256 — Encrypted unsigned integers. Use the smallest that fits your data.",
        "eint8, eint16, eint32, eint64, eint128, eint256 — Encrypted signed integers. New in v0.7+. For negative values and signed arithmetic.",
        "eaddress — Encrypted Ethereum address. For private recipients, hidden winners, anonymous participants.",
        "External types: externalEbool, externalEuint*, externalEint*, externalEaddress — Used for function parameters when accepting encrypted input from users.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "TypeExamples.sol",
      body: `import { FHE, ebool, euint8, euint64, eint32, eaddress,
         externalEuint64, externalEaddress } from "@fhevm/solidity/lib/FHE.sol";

contract TypeShowcase is ZamaEthereumConfig {
    ebool private isActive;          // Encrypted flag
    euint8 private level;            // 0-255 range, cheapest operations
    euint64 private balance;         // Token amounts
    eint32 private temperature;      // Signed: can be negative
    eaddress private secretRecipient; // Hidden address

    // Type casting — converting between encrypted types
    function upcast() public {
        euint8 small = FHE.asEuint8(42);
        euint64 big = FHE.asEuint64(small);   // Safe upcast: 8 → 64

        // Plaintext to encrypted
        euint64 fromPlain = FHE.asEuint64(1000);
        ebool fromBool = FHE.asEbool(true);
    }

    // Check if a value has been initialized
    function checkInit() public view returns (bool) {
        return FHE.isInitialized(balance); // true if ever assigned
    }
}`,
    },
    {
      type: "insight",
      title: "Gas Optimization Rule #1: Use the Smallest Type",
      body: "FHE operations on euint8 cost roughly 10x less gas than euint256. If your value fits in 8 bits (0-255), use euint8. Token balances? euint64 is usually enough (up to ~18.4 quintillion). Only use euint256 if you truly need the full range. This single optimization can reduce your contract's gas costs by 80%+.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "ExternalInputs.sol",
      body: `// Accepting encrypted input from users
// The 'external' prefix types are for function PARAMETERS only

function deposit(
    externalEuint64 encAmount,  // Encrypted input from user
    bytes calldata inputProof   // ZKPoK proof
) external {
    // ALWAYS validate external inputs with FHE.fromExternal()
    // This verifies the ZKPoK proof and converts to internal type
    euint64 amount = FHE.fromExternal(encAmount, inputProof);

    // Now 'amount' is a regular euint64 you can use in operations
    balances[msg.sender] = FHE.add(balances[msg.sender], amount);
}`,
    },
    {
      type: "warning",
      title: "Removed Types — Do Not Use",
      body: "The types ebytes64, ebytes128, and ebytes256 were removed in fhEVM v0.7. If you find older code or tutorials using these types, they are outdated. For encrypting byte data, consider using euint256 or multiple smaller encrypted types.",
    },
    {
      type: "text",
      body: "The externalEuint/externalEbool types exist for a specific reason: they represent encrypted values that come from OUTSIDE the contract (user submissions). These must be validated with FHE.fromExternal() before use. Internal operations (like FHE.add results) are already validated — they produce regular euint/ebool types directly.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 2, LESSON 2 — Mastering FHE Operations
  // ═══════════════════════════════════════════════════════════════
  "w2-l2": [
    {
      type: "text",
      body: "Now that you know the types, let's master every operation available in FHEVM. These operations are your building blocks — every confidential smart contract is composed of these primitives.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "ArithmeticOps.sol",
      body: `// ── Arithmetic Operations ──
euint64 a = FHE.asEuint64(100);
euint64 b = FHE.asEuint64(30);

euint64 sum  = FHE.add(a, b);   // 130
euint64 diff = FHE.sub(a, b);   // 70
euint64 prod = FHE.mul(a, b);   // 3000
euint64 low  = FHE.min(a, b);   // 30
euint64 high = FHE.max(a, b);   // 100
eint64  neg  = FHE.neg(signedVal); // Negation (signed types only)

// Division and Remainder — PLAINTEXT divisor only!
euint64 divided = FHE.div(a, 3);  // ✓ Plaintext divisor
euint64 remain  = FHE.rem(a, 3);  // ✓ Plaintext divisor
// FHE.div(a, b) — ✗ WILL NOT COMPILE (encrypted divisor not supported)`,
    },
    {
      type: "insight",
      title: "FHE.select — The Most Important Operation",
      body: "Since you cannot use if/else with encrypted conditions, FHE.select is how you do ALL conditional logic. Think of it as an encrypted ternary: FHE.select(condition, valueIfTrue, valueIfFalse). The condition is an ebool, and BOTH branches are always evaluated (there's no short-circuit). This is the fundamental pattern that replaces require() checks in confidential contracts.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "SelectPattern.sol",
      body: `// The NO-OP transfer pattern — THE most important FHEVM pattern

function transfer(address to, euint64 amount) internal {
    // Step 1: Encrypted comparison (returns ebool, NOT bool)
    ebool hasEnough = FHE.le(amount, balances[msg.sender]);

    // Step 2: Conditional amount — 0 if insufficient
    euint64 actualAmount = FHE.select(
        hasEnough,              // encrypted condition
        amount,                 // if true: transfer the amount
        FHE.asEuint64(0)       // if false: transfer nothing (no-op)
    );

    // Step 3: Always execute both operations
    balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
    balances[to] = FHE.add(balances[to], actualAmount);

    // Why no require()? Because hasEnough is ENCRYPTED.
    // The contract doesn't know if it's true or false.
    // Both paths execute, but one transfers 0.
}`,
    },
    {
      type: "code",
      language: "solidity",
      filename: "ComparisonOps.sol",
      body: `// ── Comparison Operations (all return ebool) ──
ebool isEqual    = FHE.eq(a, b);   // a == b
ebool notEqual   = FHE.ne(a, b);   // a != b
ebool lessThan   = FHE.lt(a, b);   // a < b
ebool lessOrEq   = FHE.le(a, b);   // a <= b
ebool greaterThan = FHE.gt(a, b);  // a > b
ebool greaterOrEq = FHE.ge(a, b);  // a >= b

// ── Bitwise Operations ──
euint32 andResult = FHE.and(x, y);
euint32 orResult  = FHE.or(x, y);
euint32 xorResult = FHE.xor(x, y);
euint32 notResult = FHE.not(x);
euint32 shifted   = FHE.shl(x, 2);  // Shift left by 2
euint32 rotated   = FHE.rotl(x, 1); // Rotate left by 1

// ── Random Number Generation ──
euint8  rand8  = FHE.randEuint8();   // Random encrypted uint8
euint64 rand64 = FHE.randEuint64();  // Random encrypted uint64`,
    },
    {
      type: "text",
      body: "A critical gas optimization: when one operand is a known plaintext value, pass it directly as a scalar instead of encrypting it first.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "ScalarOptimization.sol",
      body: `// ❌ EXPENSIVE — encrypts 1 first, then adds two ciphertexts
euint64 one = FHE.asEuint64(1);
euint64 result = FHE.add(counter, one);

// ✓ CHEAP — scalar operation, no extra encryption needed
euint64 result = FHE.add(counter, 1);

// This applies to ALL operations:
FHE.mul(value, 2);      // ✓ Scalar multiplication
FHE.sub(value, 100);    // ✓ Scalar subtraction
FHE.eq(value, 0);       // ✓ Scalar comparison`,
    },
    {
      type: "warning",
      title: "Overflow Behavior",
      body: "Encrypted arithmetic wraps on overflow (like unchecked Solidity). FHE.sub(5, 10) on euint8 wraps to 251, not zero. There's no built-in overflow protection. You MUST use FHE.select with comparisons to handle overflow safely — the same pattern as the no-op transfer.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 2, LESSON 3 — ACL — The Permission Layer
  // ═══════════════════════════════════════════════════════════════
  "w2-l3": [
    {
      type: "text",
      body: "Encrypted data is useless without a way to control who can decrypt it. The Access Control List (ACL) system is FHEVM's permission layer — it determines which addresses can read which encrypted values. Every encrypted value has its own ACL, and permissions must be explicitly granted.",
    },
    {
      type: "list",
      title: "Three Tiers of Access",
      items: [
        "Persistent ACL (FHE.allow): Permanent cross-transaction access. Once granted, the address can always decrypt this value. Used for: letting users read their own balances.",
        "Transient ACL (FHE.allowTransient): One-transaction-only access via EIP-1153 transient storage. Automatically revoked at end of transaction. Used for: temporary access during cross-contract calls.",
        "Public Decryption (FHE.makePubliclyDecryptable): Makes a value decryptable by anyone, forever. Used for: revealing auction results, vote tallies, final settlements.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "ACLPatterns.sol",
      body: `contract ACLExample is ZamaEthereumConfig {
    euint64 private userBalance;
    euint64 private tempResult;
    euint64 private auctionWinningBid;

    // PERSISTENT: User can always read their balance
    function updateBalance(euint64 newBalance) internal {
        userBalance = newBalance;
        FHE.allowThis(userBalance);           // Contract can reuse it
        FHE.allow(userBalance, msg.sender);   // User can decrypt it
    }

    // TRANSIENT: Another contract can read during this TX only
    function processWithHelper(address helperContract) external {
        tempResult = FHE.add(userBalance, FHE.asEuint64(100));
        FHE.allowThis(tempResult);
        FHE.allowTransient(tempResult, helperContract); // One TX only
        // helperContract can read tempResult within this transaction
        // After TX ends, permission is automatically revoked
    }

    // PUBLIC: Everyone can decrypt the auction result
    function revealWinner() external {
        FHE.makePubliclyDecryptable(auctionWinningBid);
        // Now anyone can call publicDecrypt via the Relayer SDK
    }
}`,
    },
    {
      type: "insight",
      title: "FHE.allowThis() — The Contract's Self-Permission",
      body: "A contract CANNOT use its own encrypted values in operations unless it has called FHE.allowThis() on them. This seems redundant (\"why can't the contract access its own data?\"), but it's a security feature: it prevents a contract from being tricked into using stale handles. Every time you assign to an encrypted state variable, call FHE.allowThis() immediately after.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "PermissionChecks.sol",
      body: `// You can check permissions programmatically
function checkAccess(euint64 value, address user) public view returns (bool) {
    return FHE.isAllowed(value, user);          // Persistent ACL check
}

function checkSenderAccess(euint64 value) public view returns (bool) {
    return FHE.isSenderAllowed(value);          // Checks msg.sender
}

function checkPublic(euint64 value) public view returns (bool) {
    return FHE.isPubliclyDecryptable(value);    // Public ACL check
}`,
    },
    {
      type: "warning",
      title: "ACL Security Checklist",
      body: "Before deploying any FHEVM contract, verify: (1) Every encrypted state assignment is followed by FHE.allowThis(). (2) Users who should read their data get FHE.allow(). (3) No value is made publicly decryptable unless intentionally revealed. (4) Transient permissions are used for cross-contract calls to minimize persistent exposure.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 2, LESSON 4 — Decryption Patterns
  // ═══════════════════════════════════════════════════════════════
  "w2-l4": [
    {
      type: "text",
      body: "Decryption is the bridge between the encrypted world and actionable results. In fhEVM v0.9+, the decryption model is fundamentally different from older versions: the dApp client is responsible for relaying decryption results using the Relayer SDK. The old Oracle-based pattern (GatewayCaller, FHE.requestDecryption) is completely removed.",
    },
    {
      type: "text",
      body: "There are two decryption paths: user decryption (private, for individual users via ACL) and public decryption (for values that everyone should see, like auction results or vote tallies).",
    },
    {
      type: "code",
      language: "solidity",
      filename: "PublicDecryption.sol",
      body: `// ── Step 1: On-chain — Mark value for public decryption ──
contract Auction is ZamaEthereumConfig {
    euint64 private winningBid;
    uint64 public revealedBid;   // Will hold the decrypted result
    bool public isRevealed;

    // Phase 1: Accept encrypted bids (not shown)

    // Phase 2: Mark the winning bid for decryption
    function requestReveal() external onlyOwner {
        require(!isRevealed, "Already revealed");
        FHE.makePubliclyDecryptable(winningBid);
    }

    // Phase 3: Verify and store the decrypted result
    function finalizeReveal(
        uint256[] calldata handles,
        bytes calldata abiEncodedCleartexts,
        bytes calldata proof
    ) external {
        // Verify the KMS decryption proof
        FHE.checkSignatures(handles, abiEncodedCleartexts, proof);

        // Decode the cleartext value
        revealedBid = abi.decode(abiEncodedCleartexts, (uint64));
        isRevealed = true;
    }
}`,
    },
    {
      type: "code",
      language: "typescript",
      filename: "frontend/RevealBid.ts",
      body: `// ── Step 2: Off-chain — Client relays decryption via Relayer SDK ──
import { createRelayerClient } from "@zama-fhe/relayer-sdk";

const relayer = createRelayerClient({ network: "ethereum" });

// Get the encrypted handle from the contract
const handle = await auction.winningBid();

// Request decryption from the KMS via the Relayer
const { cleartexts, proof } = await relayer.publicDecrypt([handle]);

// ── Step 3: Submit proof back to the contract ──
await auction.finalizeReveal([handle], cleartexts, proof);

// Now auction.revealedBid() returns the plaintext value`,
    },
    {
      type: "insight",
      title: "Phase-Based Contract Architecture",
      body: "Public decryption is asynchronous — it requires an off-chain round-trip through the KMS. This means your contracts need state machines: Bidding → DecryptionRequested → Revealed. You can't decrypt and use the result in the same transaction. This is the biggest architectural shift from standard Solidity.",
    },
    {
      type: "text",
      body: "User decryption is simpler — it happens entirely client-side. If a user has ACL permission (via FHE.allow), they can decrypt values directly using the Relayer SDK without any on-chain transaction:",
    },
    {
      type: "code",
      language: "typescript",
      filename: "frontend/UserDecrypt.ts",
      body: `// User decryption — no on-chain transaction needed
const encryptedBalance = await token.connect(alice).getBalance();

// Alice decrypts her own balance (she has ACL permission)
const balance = await relayer.userDecrypt(
  FhevmType.euint64,
  encryptedBalance,
  contractAddress,
  alice  // Must be the authorized signer
);

console.log("My balance:", balance); // e.g., 1000n`,
    },
    {
      type: "warning",
      title: "Deprecated Patterns — Do Not Use",
      body: "If you find tutorials referencing FHE.requestDecryption(), GatewayCaller, or callback-based decryption — these are from fhEVM v0.8 and earlier. They have been completely removed in v0.9+. The current pattern uses makePubliclyDecryptable + Relayer SDK + checkSignatures.",
    },
    {
      type: "text",
      body: "One critical detail: when calling FHE.checkSignatures(), the handles array must be in the EXACT same order as used in the decryption request. Mismatched ordering will cause proof verification to fail. This is a common source of bugs when decrypting multiple values.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 3, LESSON 1 — Confidential Voting System
  // ═══════════════════════════════════════════════════════════════
  "w3-l1": [
    {
      type: "text",
      body: "Voting is one of the most compelling use cases for FHEVM. In traditional on-chain voting, every vote is public — creating problems like voter coercion, strategic voting (people vote based on current tallies rather than preference), and last-minute vote manipulation. With encrypted voting, ballots remain secret until the result is revealed.",
    },
    {
      type: "text",
      body: "Let's transform a standard Solidity voting contract into a confidential one. This 'before and after' approach shows exactly what changes when you add encryption:",
    },
    {
      type: "code",
      language: "solidity",
      filename: "StandardVoting.sol (Before)",
      body: `// ❌ Standard voting — everything is visible
contract PublicVoting {
    mapping(uint256 => uint256) public voteCounts;  // Public!
    mapping(address => bool) public hasVoted;        // Public!

    function vote(uint256 proposalId, bool support) external {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        if (support) {
            voteCounts[proposalId]++;  // Everyone sees the running tally
        }
    }
}`,
    },
    {
      type: "code",
      language: "solidity",
      filename: "ConfidentialVoting.sol (After)",
      body: `// ✓ Confidential voting — votes are encrypted
import { FHE, euint64, ebool, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialVoting is ZamaEthereumConfig {
    euint64 private yesVotes;     // Encrypted tally
    euint64 private noVotes;      // Encrypted tally
    mapping(address => bool) public hasVoted; // This stays public (OK)

    enum Phase { Voting, DecryptionRequested, Revealed }
    Phase public currentPhase;

    constructor() {
        yesVotes = FHE.asEuint64(0);
        noVotes = FHE.asEuint64(0);
        FHE.allowThis(yesVotes);
        FHE.allowThis(noVotes);
        currentPhase = Phase.Voting;
    }

    function vote(externalEbool encSupport, bytes calldata proof) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(currentPhase == Phase.Voting, "Voting closed");
        hasVoted[msg.sender] = true;

        ebool support = FHE.fromExternal(encSupport, proof);

        // FHE.select: if support is true, add 1 to yes; else add 1 to no
        yesVotes = FHE.add(yesVotes, FHE.select(support, FHE.asEuint64(1), FHE.asEuint64(0)));
        noVotes  = FHE.add(noVotes,  FHE.select(support, FHE.asEuint64(0), FHE.asEuint64(1)));
        FHE.allowThis(yesVotes);
        FHE.allowThis(noVotes);
    }

    function requestReveal() external onlyOwner {
        currentPhase = Phase.DecryptionRequested;
        FHE.makePubliclyDecryptable(yesVotes);
        FHE.makePubliclyDecryptable(noVotes);
    }
}`,
    },
    {
      type: "insight",
      title: "The Architecture Shift",
      body: "Notice how the voting contract went from a simple increment to a three-phase state machine. This is the fundamental pattern for any FHEVM app that needs to reveal results: (1) Collect encrypted data, (2) Request decryption, (3) Verify and use the decrypted results. Every production FHEVM contract follows this pattern.",
    },
    {
      type: "text",
      body: "Key design decisions in the confidential voting contract: hasVoted stays as a plain bool (it's OK to know WHO voted, just not HOW). The vote itself is an encrypted boolean — the contract never knows which way any individual voted. Both tallies are updated on every vote using FHE.select, preventing gas-based side-channel attacks (if we only updated one counter per vote, gas cost differences would reveal the vote).",
    },
    {
      type: "warning",
      title: "Side-Channel Attack Prevention",
      body: "Always update ALL encrypted state in every code path, not just the relevant branch. If 'yes' votes cost different gas than 'no' votes, an observer could determine how someone voted by watching gas consumption. FHE.select ensures both branches execute, making gas costs uniform.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 3, LESSON 2 — Sealed-Bid Auction
  // ═══════════════════════════════════════════════════════════════
  "w3-l2": [
    {
      type: "text",
      body: "Sealed-bid auctions are impossible to run fairly on a transparent blockchain — until FHEVM. In a traditional on-chain auction, everyone can see all bids, enabling front-running and last-second sniping. With encrypted bids, no one knows the amounts until the auction owner reveals only the winning bid.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "SealedBidAuction.sol",
      body: `import { FHE, euint64, ebool, eaddress, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract SealedBidAuction is ZamaEthereumConfig {
    euint64 private highestBid;
    eaddress private highestBidder;
    mapping(address => euint64) private bids;

    address public owner;
    bool public biddingOpen;

    constructor() {
        owner = msg.sender;
        biddingOpen = true;
        highestBid = FHE.asEuint64(0);
        highestBidder = FHE.asEaddress(address(0));
        FHE.allowThis(highestBid);
        FHE.allowThis(highestBidder);
    }

    function bid(externalEuint64 encBid, bytes calldata proof) external {
        require(biddingOpen, "Bidding closed");

        euint64 bidAmount = FHE.fromExternal(encBid, proof);
        bids[msg.sender] = bidAmount;
        FHE.allowThis(bidAmount);
        FHE.allow(bidAmount, msg.sender); // Bidder can see their own bid

        // Update highest bid using encrypted comparison
        ebool isHigher = FHE.gt(bidAmount, highestBid);
        highestBid = FHE.select(isHigher, bidAmount, highestBid);
        highestBidder = FHE.select(
            isHigher,
            FHE.asEaddress(msg.sender),
            highestBidder
        );
        FHE.allowThis(highestBid);
        FHE.allowThis(highestBidder);
    }

    function closeBidding() external {
        require(msg.sender == owner);
        biddingOpen = false;
        // Only reveal the winning bid, not losers' bids
        FHE.makePubliclyDecryptable(highestBid);
    }
}`,
    },
    {
      type: "insight",
      title: "Encrypted Address Tracking",
      body: "Notice the use of eaddress to track the highest bidder. Since we can't use if/else, we use FHE.select with eaddress to conditionally update the winner. This pattern — encrypted comparison + FHE.select to update multiple state variables — is the core of any encrypted ranking or selection algorithm.",
    },
    {
      type: "text",
      body: "The auction demonstrates a key property: losing bidders' amounts are NEVER revealed. Only the winning bid is made publicly decryptable. This is impossible in traditional auctions — sealed bids on a public blockchain would normally be visible to everyone.",
    },
    {
      type: "warning",
      title: "Gas Considerations for N Bidders",
      body: "Each new bid triggers an encrypted comparison against the current highest. With N bidders, that's N encrypted comparisons total. For auctions with hundreds of bidders, consider batching strategies or off-chain aggregation with on-chain verification.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 3, LESSON 3 — Confidential Token Wrapper (ERC-7984)
  // ═══════════════════════════════════════════════════════════════
  "w3-l3": [
    {
      type: "text",
      body: "The ERC-7984 standard defines how to create confidential versions of existing ERC-20 tokens. Instead of building new tokens from scratch, you can wrap any existing ERC-20 — lock the original tokens and mint encrypted equivalents. This brings privacy to the entire existing token ecosystem.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "ConfidentialWrapper.sol",
      body: `import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ConfidentialWrapper is ZamaEthereumConfig {
    IERC20 public immutable underlying;
    mapping(address => euint64) private balances;

    constructor(address _underlying) {
        underlying = IERC20(_underlying);
    }

    // Wrap: Lock ERC-20, mint encrypted balance
    function wrap(uint64 amount) external {
        underlying.transferFrom(msg.sender, address(this), amount);

        if (FHE.isInitialized(balances[msg.sender])) {
            balances[msg.sender] = FHE.add(balances[msg.sender], FHE.asEuint64(amount));
        } else {
            balances[msg.sender] = FHE.asEuint64(amount);
        }
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    // Confidential transfer (amounts hidden)
    function transfer(address to, externalEuint64 encAmount, bytes calldata proof) external {
        euint64 amount = FHE.fromExternal(encAmount, proof);
        ebool sufficient = FHE.le(amount, balances[msg.sender]);
        euint64 actual = FHE.select(sufficient, amount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actual);
        balances[to] = FHE.add(balances[to], actual);

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }

    // Unwrap: Decrypt balance, burn confidential, release ERC-20
    // (Requires public decryption flow — shown in detail below)
}`,
    },
    {
      type: "insight",
      title: "Wrapping Is a Production Pattern",
      body: "Zama's own Confidential Wrapper app uses this exact pattern. Any ERC-20 on Ethereum can be wrapped into a confidential version. Users deposit USDC, receive encrypted USDC that can be transferred privately, then unwrap back to standard USDC when needed. This is how existing DeFi integrates with FHE privacy.",
    },
    {
      type: "text",
      body: "The wrap function is straightforward — lock tokens, mint encrypted balance. But unwrapping is more complex because it requires decryption (you need to know the plaintext amount to release the ERC-20). This means unwrapping goes through the 3-step public decryption flow: makePubliclyDecryptable → Relayer publicDecrypt → checkSignatures.",
    },
    {
      type: "warning",
      title: "Wrap Amount is Public",
      body: "Note that the wrap() function takes a plaintext uint64 amount — the initial deposit amount is visible on-chain. Privacy begins AFTER wrapping. For maximum privacy, wrap a large amount once, then do multiple confidential transfers. The unwrap amount will also be visible.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 3, LESSON 4 — Frontend Integration with Relayer SDK
  // ═══════════════════════════════════════════════════════════════
  "w3-l4": [
    {
      type: "text",
      body: "You've built confidential smart contracts — now let's connect them to a frontend. Zama provides a pre-built React template that handles wallet connection, UI scaffolding, and transaction management. Your job is to configure it to talk to your contracts using the Relayer SDK.",
    },
    {
      type: "text",
      body: "The Relayer SDK (@zama-fhe/relayer-sdk) abstracts all Gateway Chain complexity. Your frontend only needs a wallet connection to the host chain (Ethereum) — the SDK handles all encrypted I/O operations through HTTP calls to Zama's Relayer infrastructure.",
    },
    {
      type: "code",
      language: "typescript",
      filename: "src/config.ts",
      body: `// Configure the template to point to your deployed contract
export const CONTRACT_ADDRESS = "0x1234...your-deployed-address";
export const CONTRACT_ABI = [/* Your contract ABI */];
export const NETWORK = "sepolia"; // or "ethereum" for mainnet`,
    },
    {
      type: "code",
      language: "typescript",
      filename: "src/hooks/useEncryptedInput.ts",
      body: `import { createRelayerClient } from "@zama-fhe/relayer-sdk";
import { useWalletClient } from "wagmi";

export function useEncryptedInput(contractAddress: string) {
  const { data: wallet } = useWalletClient();

  const relayer = createRelayerClient({ network: "sepolia" });

  async function encryptAndSend(value: bigint) {
    if (!wallet) throw new Error("Wallet not connected");

    // Create encrypted input bound to (contract, user)
    const input = await relayer
      .createEncryptedInput(contractAddress, wallet.account.address)
      .add64(value)
      .encrypt();

    return {
      handle: input.handles[0],
      proof: input.inputProof,
    };
  }

  async function decryptValue(handle: string) {
    return relayer.userDecrypt(
      "euint64", handle, contractAddress, wallet
    );
  }

  return { encryptAndSend, decryptValue };
}`,
    },
    {
      type: "insight",
      title: "No React Experience Required",
      body: "The template handles all UI scaffolding — wallet connection, layout, loading states, error boundaries. You only need to modify the configuration files and the contract interaction hooks. If you can write TypeScript function calls, you can build a working FHEVM frontend.",
    },
    {
      type: "text",
      body: "The typical frontend flow for a confidential dApp: (1) Connect wallet, (2) Encrypt input values using the Relayer SDK, (3) Submit encrypted transaction, (4) Read encrypted results, (5) Decrypt values the user is authorized to see.",
    },
    {
      type: "warning",
      title: "Decryption Is Asynchronous",
      body: "Public decryption requires a round-trip to the KMS — expect 5-15 seconds of latency. Design your UI accordingly: show loading states, use optimistic updates where possible, and clearly communicate that 'revealing results' takes time.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 4, LESSON 1 — Zama Standard Library & Production Patterns
  // ═══════════════════════════════════════════════════════════════
  "w4-l1": [
    {
      type: "text",
      body: "Professional FHEVM development means building on audited, battle-tested foundations — not reinventing the wheel. Zama's fhevm-contracts library is the equivalent of OpenZeppelin for encrypted smart contracts. It provides production-ready implementations of common patterns.",
    },
    {
      type: "list",
      title: "Key Contracts in fhevm-contracts",
      items: [
        "ConfidentialERC20 — Production token with encrypted balances, error handling via EncryptedErrors, and proper ACL management.",
        "ConfidentialERC20Mintable — Extends ConfidentialERC20 with controlled minting capabilities.",
        "ConfidentialERC20Wrapped / ConfidentialWETH — Wrapping existing ERC-20 tokens into confidential versions.",
        "ConfidentialERC20Votes — Governance-ready tokens with encrypted voting power delegation.",
        "ConfidentialGovernorAlpha — Full governance protocol with encrypted proposals and voting.",
        "ConfidentialVestingWallet / VestingWalletCliff — Token vesting with encrypted cliff and schedule.",
        "EncryptedErrors — Utility for handling errors with encrypted error codes instead of revert strings.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "UsingStandardLibrary.sol",
      body: `// Instead of building from scratch, extend the standard library
import { ConfidentialERC20 } from "@fhevm/contracts/token/ERC20/ConfidentialERC20.sol";

contract MyToken is ConfidentialERC20 {
    constructor()
        ConfidentialERC20("MyToken", "MTK")  // Name and symbol
    {
        // Mint initial supply to deployer
        _unsafeMint(msg.sender, 1_000_000 * 1e6);
    }

    // All transfer logic, ACL management, and error handling
    // are already implemented in ConfidentialERC20!
}`,
    },
    {
      type: "insight",
      title: "EncryptedErrors — Better Error Handling",
      body: "In standard Solidity, you revert with an error message. But in FHEVM, you often can't revert (because the condition is encrypted). EncryptedErrors lets you record error codes as encrypted values — the user can decrypt the error code to see what went wrong, while the error details remain private to everyone else.",
    },
    {
      type: "code",
      language: "solidity",
      filename: "EncryptedErrorsExample.sol",
      body: `import { EncryptedErrors } from "@fhevm/contracts/utils/EncryptedErrors.sol";

contract SafeTransfer is ZamaEthereumConfig {
    using EncryptedErrors for *;

    // Define error codes
    uint8 constant NO_ERROR = 0;
    uint8 constant INSUFFICIENT_BALANCE = 1;
    uint8 constant AMOUNT_TOO_LARGE = 2;

    function transfer(address to, euint64 amount) external
        returns (euint8 errorCode)
    {
        ebool sufficient = FHE.le(amount, balances[msg.sender]);
        // Return encrypted error code instead of reverting
        errorCode = FHE.select(
            sufficient,
            FHE.asEuint8(NO_ERROR),
            FHE.asEuint8(INSUFFICIENT_BALANCE)
        );
        // Execute transfer (no-op if insufficient)
        euint64 actual = FHE.select(sufficient, amount, FHE.asEuint64(0));
        // ... transfer logic
    }
}`,
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 4, LESSON 2 — FHEVM Security & Common Vulnerabilities
  // ═══════════════════════════════════════════════════════════════
  "w4-l2": [
    {
      type: "text",
      body: "Security in FHEVM is uniquely critical: a bug doesn't just lose funds — it can leak private data permanently. Once encrypted data is exposed, you can't un-expose it. This lesson covers the top vulnerabilities specific to FHEVM contracts.",
    },
    {
      type: "list",
      title: "Top 10 FHEVM Vulnerabilities",
      items: [
        "#1 Using require() with encrypted comparisons — FHE.lt returns ebool, not bool. require(ebool) won't compile or will be a logic bug.",
        "#2 Forgetting FHE.allowThis() — Contract can't reuse its own encrypted handles. Operations silently fail or revert.",
        "#3 Forgetting FHE.allow() — Users can't decrypt their own data. Renders the contract unusable for end users.",
        "#4 Gas side-channel attacks — Different code paths for different encrypted values leak information through gas cost differences.",
        "#5 Reusing encrypted inputs across contracts — ZKPoK proofs are bound to (contract, user). Reuse causes proof verification failure.",
        "#6 Skipping FHE.fromExternal() — Raw external encrypted inputs bypass proof validation. ALWAYS validate.",
        "#7 Arithmetic overflow — Encrypted math wraps silently. No built-in overflow protection. Must use FHE.select guards.",
        "#8 Wrong handle ordering in checkSignatures — Handles must match the exact order used in the decryption request.",
        "#9 Timing attacks — Transaction submission patterns can reveal information. Consider delays and batching.",
        "#10 Excessive public decryption — Making values publicly decryptable when they should stay private. Review every makePubliclyDecryptable call.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "SpotTheBug.sol",
      body: `// ❌ BUG #1: Using require with encrypted comparison
function withdraw(euint64 amount) external {
    ebool hasEnough = FHE.ge(balances[msg.sender], amount);
    require(hasEnough); // ❌ ebool is NOT bool — this won't work!
}

// ❌ BUG #2: Forgot FHE.allowThis
function deposit(euint64 amount) external {
    balances[msg.sender] = FHE.add(balances[msg.sender], amount);
    // Missing: FHE.allowThis(balances[msg.sender]);
    // Next operation on this balance will FAIL
}

// ❌ BUG #3: Gas side-channel leak
function vote(ebool support) internal {
    if (...) { yesVotes = FHE.add(yesVotes, 1); }  // ❌ Different gas per branch!
    // Fix: Always update BOTH counters using FHE.select
}

// ❌ BUG #4: Skipping input validation
function store(externalEuint64 rawInput, bytes calldata proof) external {
    value = rawInput; // ❌ WRONG — must validate first!
    // Fix: value = FHE.fromExternal(rawInput, proof);
}`,
    },
    {
      type: "insight",
      title: "The Security Audit Mindset",
      body: "For every encrypted state variable, ask three questions: (1) Who should be able to read this? (FHE.allow) (2) Can the contract still use it? (FHE.allowThis) (3) Should it ever be made public? (makePubliclyDecryptable — probably not). For every FHE.select, ask: do both branches have the same gas cost? If not, you have a side-channel leak.",
    },
    {
      type: "warning",
      title: "What FHEVM Does NOT Protect",
      body: "FHEVM encrypts DATA, not METADATA. Transaction sender, receiver, function called, gas used, and timing are all still visible on-chain. A sophisticated observer may infer information from these patterns even if the actual values are encrypted.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 4, LESSON 3 — Gas Optimization & Performance
  // ═══════════════════════════════════════════════════════════════
  "w4-l3": [
    {
      type: "text",
      body: "FHE operations are computationally expensive — much more than standard EVM operations. Gas optimization isn't just nice-to-have; it's essential for making your contracts usable and affordable in production.",
    },
    {
      type: "list",
      title: "Five Rules of FHE Gas Optimization",
      items: [
        "Rule #1: Use the smallest type — euint8 operations cost ~10x less than euint256. If your value fits in 8 bits, use euint8.",
        "Rule #2: Prefer scalar operands — FHE.add(x, 42) is much cheaper than FHE.add(x, FHE.asEuint64(42)). The plaintext operand avoids an extra encryption.",
        "Rule #3: Minimize encrypted comparisons — Each FHE.lt/gt/eq is expensive. Batch comparisons when possible instead of doing them one-by-one.",
        "Rule #4: Use transient ACL for temporary access — FHE.allowTransient is cheaper than FHE.allow because it uses EIP-1153 transient storage (no permanent SSTORE).",
        "Rule #5: Cache encrypted intermediate results — If you use the same FHE computation multiple times, store it in a variable rather than recomputing.",
      ],
    },
    {
      type: "code",
      language: "solidity",
      filename: "GasOptimized.sol",
      body: `// ❌ UNOPTIMIZED
function expensiveTransfer(address to, euint256 amount) external {
    euint256 zero = FHE.asEuint256(0);  // Unnecessary encryption
    ebool sufficient = FHE.le(amount, balances[msg.sender]);
    euint256 actual = FHE.select(sufficient, amount, zero);
    balances[msg.sender] = FHE.sub(balances[msg.sender], actual);
    balances[to] = FHE.add(balances[to], actual);
}

// ✓ OPTIMIZED — 5-10x cheaper
function cheapTransfer(address to, euint64 amount) external {  // euint64 not 256
    ebool sufficient = FHE.le(amount, balances[msg.sender]);
    euint64 actual = FHE.select(sufficient, amount, FHE.asEuint64(0));  // Scalar 0
    balances[msg.sender] = FHE.sub(balances[msg.sender], actual);
    balances[to] = FHE.add(balances[to], actual);
}`,
    },
    {
      type: "insight",
      title: "The Performance Roadmap",
      body: "Current FHEVM throughput is ~20 TPS (CPU-based coprocessors). Zama's roadmap: GPU acceleration → 500-1,000 TPS (near-term), custom FHE ASICs → 100,000+ TPS (long-term). The operations you write today will run much faster tomorrow without code changes — the optimization happens at the coprocessor level.",
    },
    {
      type: "text",
      body: "Protocol fees add to the cost: ZKPoK proof verification on input submission, decryption fees when using the KMS, and bridging costs for cross-chain operations via the Gateway. Design your contracts to minimize the number of decryption requests — batch multiple values into a single decryption when possible.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // WEEK 4, LESSON 4 — Zama Ecosystem & Future of Confidential Computing
  // ═══════════════════════════════════════════════════════════════
  "w4-l4": [
    {
      type: "text",
      body: "The final lesson zooms out from code to the broader Zama ecosystem. Understanding the protocol landscape, economics, and roadmap helps you position yourself as an FHEVM developer and identify the most impactful areas for contribution.",
    },
    {
      type: "list",
      title: "Zama Protocol Ecosystem Apps",
      items: [
        "Governance App — Participate in protocol governance using ZAMA tokens. Proposals and voting for protocol upgrades.",
        "Staking App — Stake ZAMA tokens as a coprocessor or KMS operator. Two-tier system with square-root-of-stake distribution for fairness.",
        "Registry App — Discover validated contracts, verified wrappers, and audited templates. The 'app store' of confidential contracts.",
        "Confidential Wrapper App — Wrap any ERC-20 into its confidential equivalent. The bridge between traditional and private DeFi.",
      ],
    },
    {
      type: "text",
      body: "The ZAMA token powers the entire protocol: it's used for staking (operators must stake to participate), governance (token holders vote on protocol changes), and fee payments (protocol fees are denominated in ZAMA).",
    },
    {
      type: "insight",
      title: "Multi-Chain Expansion",
      body: "Zama Protocol launched on Ethereum, but the roadmap targets multi-chain expansion: other EVM chains in H1 2026, Solana in H2 2026. The FHE operations are chain-agnostic — the coprocessors and KMS work the same regardless of the host chain. Your FHEVM skills will transfer directly to new chains as they're supported.",
    },
    {
      type: "list",
      title: "Technology Roadmap",
      items: [
        "ZK-MPC Verification — Replacing hardware trust assumptions with zero-knowledge proofs. Removes the need to trust specific hardware for coprocessor execution.",
        "HSM-Based Execution — Hardware Security Module integration for node operators. Path toward permissionless node operation (anyone can run a coprocessor).",
        "GPU Acceleration — 25-50x throughput improvement over CPU. Target: 500-1,000 TPS.",
        "FHE ASICs — Custom silicon designed specifically for FHE operations. Target: 100,000+ TPS. This is what makes FHE competitive with plaintext computation.",
      ],
    },
    {
      type: "text",
      body: "As a bootcamp graduate, you're among the first developers skilled in confidential smart contract development. The FHEVM ecosystem is early — there are significant opportunities in building production dApps, contributing to the standard library, participating in bounty programs, and joining the Zama developer community.",
    },
    {
      type: "list",
      title: "Next Steps After the Bootcamp",
      items: [
        "Join the Zama Community Forum (community.zama.ai) — Ask questions, share projects, get feedback.",
        "Explore the Developer Hub (zama.org/developer-hub) — Apply for grants and bounties.",
        "Contribute to fhevm-contracts — The standard library needs more production patterns.",
        "Build and deploy a production dApp — The best way to learn is to ship.",
        "Join the Discord (discord.gg/zama) — Real-time help from the community and Zama team.",
      ],
    },
  ],
};

export function getLessonContent(lessonId: string): ContentBlock[] | undefined {
  return LESSON_CONTENT[lessonId];
}
