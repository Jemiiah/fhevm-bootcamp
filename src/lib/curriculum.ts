export type ContentBlock =
  | { type: "text"; body: string }
  | { type: "code"; language: string; filename?: string; body: string }
  | { type: "insight"; title: string; body: string }
  | { type: "warning"; title?: string; body: string }
  | { type: "info"; body: string }
  | { type: "list"; title: string; items: string[] };

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  objectives: string[];
  topics: string[];
  description: string;
  content?: ContentBlock[];
}

export interface Homework {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimatedTime: string;
  description: string;
  requirements: string[];
  gradingCriteria: { criterion: string; points: number }[];
  starterRepo: string;
  solutionRepo: string;
  totalPoints: number;
}

export interface Week {
  number: number;
  title: string;
  subtitle: string;
  theme: string;
  color: string;
  icon: string;
  overview: string;
  learningObjectives: string[];
  lessons: Lesson[];
  homework: Homework;
  instructorNotes: string[];
  estimatedTime: string;
}

/**
 * Curriculum targets fhEVM v0.9+ (Solidity library renamed from TFHE to FHE).
 * Key packages: @fhevm/solidity (contracts), @fhevm/sdk (testing),
 * @zama-fhe/relayer-sdk v0.3+ (frontend integration).
 *
 * Breaking changes vs older tutorials found online:
 * - Library renamed: TFHE → FHE (v0.7+)
 * - einput replaced with externalEuintXXX / externalEbool / externalEaddress (v0.7+)
 * - ebytesXXX types removed (v0.7+)
 * - Signed integer types added: eint8–eint256 (v0.7+)
 * - SepoliaConfig removed → use ZamaEthereumConfig (v0.9+)
 * - Oracle-based decryption (FHE.requestDecryption) removed (v0.9+)
 * - New decryption: makePubliclyDecryptable → Relayer publicDecrypt → checkSignatures
 * - GatewayCaller pattern deprecated
 */

export const WEEKS: Week[] = [
  {
    number: 1,
    title: "Foundations of FHE & FHEVM",
    subtitle: "From Zero to Encrypted Hello World",
    theme: "foundation",
    color: "#3B82F6",
    icon: "🧱",
    overview:
      "Week 1 builds the conceptual and practical foundation. Students learn what Fully Homomorphic Encryption is, why it matters for blockchain privacy, and how Zama Protocol makes it accessible to Solidity developers. By the end, every student will have deployed their first confidential smart contract. This curriculum targets fhEVM v0.9+ and the FHE Solidity library — if you encounter older tutorials referencing the TFHE library or GatewayCaller, those patterns are deprecated.",
    learningObjectives: [
      "Explain what FHE is and why it enables new classes of on-chain applications",
      "Describe the Zama Protocol architecture: host chain, coprocessors, KMS, Gateway",
      "Set up a complete FHEVM development environment using the Hardhat template",
      "Write, compile, deploy, and test a basic encrypted counter contract",
      "Understand the symbolic execution model and how FHE operations differ from standard EVM",
    ],
    estimatedTime: "10-12 hours",
    lessons: [
      {
        id: "w1-l1",
        title: "The Privacy Problem in Public Blockchains",
        duration: "90 min",
        objectives: [
          "Identify the fundamental transparency-privacy tension in public blockchains",
          "Compare privacy approaches: ZK proofs, TEEs, MPC, FHE",
          "Explain why FHE is uniquely suited for on-chain computation",
        ],
        topics: [
          "Why all blockchain data is public (and why that matters)",
          "Real-world examples: front-running, MEV, doxxed wallet analysis",
          "Privacy approach comparison matrix: ZK vs TEE vs MPC vs FHE",
          "FHE intuition: computing on locked data without the key",
          "The Zama Protocol vision: a confidentiality layer for any chain",
        ],
        description:
          "This opening lesson sets the stage by exploring why privacy matters on public blockchains. We examine real-world attacks enabled by transparency (front-running, wallet analysis, MEV extraction) and survey the landscape of privacy solutions. Students learn to distinguish FHE from other approaches and understand its unique advantage: enabling arbitrary computation on encrypted data without decryption.",
      },
      {
        id: "w1-l2",
        title: "Zama Protocol Architecture Deep Dive",
        duration: "90 min",
        objectives: [
          "Draw the Zama Protocol architecture from memory",
          "Explain the role of each component: host chain, FHEVM library, coprocessors, KMS, Gateway",
          "Describe how symbolic execution enables FHE on existing EVM chains",
        ],
        topics: [
          "Architecture overview: host chain ↔ coprocessors ↔ KMS ↔ Gateway",
          "Symbolic execution: how the host chain emits operation events instead of computing FHE directly",
          "Coprocessor network: 5 operators performing actual FHE computations",
          "KMS: 13-node MPC for threshold decryption with 2/3 majority",
          "Gateway (Arbitrum rollup): orchestrating cross-chain operations",
          "Trust model: consensus-based FHE + robust MPC + hardware isolation",
          "Fee structure: ZKPoK verification, decryption, bridging costs",
        ],
        description:
          "A thorough walk-through of how the Zama Protocol actually works under the hood. Students trace the journey of an encrypted operation from Solidity code through symbolic execution on the host chain, to off-chain FHE computation by coprocessors, and back. This lesson is critical for understanding why FHEVM contracts behave differently from standard Solidity.",
      },
      {
        id: "w1-l3",
        title: "Development Environment Setup & First Contract",
        duration: "120 min",
        objectives: [
          "Set up the FHEVM Hardhat template from scratch",
          "Configure environment variables for Sepolia testnet",
          "Write, compile, and deploy an encrypted counter contract",
          "Run tests with encrypted values in mock mode",
        ],
        topics: [
          "Prerequisites: Node.js (LTS), npm, Git, VS Code",
          "Cloning and configuring the fhevm-hardhat-template",
          "Project structure walkthrough: contracts, tasks, test, deploy",
          "Writing FHECounter.sol: importing FHE library, using ZamaEthereumConfig",
          "Encrypted types: euint32, externalEuint32",
          "FHE operations: FHE.add(), FHE.sub(), FHE.fromExternal()",
          "Permissions: FHE.allowThis(), FHE.allow()",
          "Compiling with npx hardhat compile",
          "Running tests in mock mode",
        ],
        description:
          "The hands-on lab where students build their first FHEVM contract. Starting from the official Hardhat template, they set up their environment, understand the project structure, and implement a confidential counter. The contract uses encrypted uint32 for the count, accepts encrypted inputs with ZKPoK proofs, and grants appropriate access permissions. Students compile, deploy locally, and run their first encrypted tests.",
      },
      {
        id: "w1-l4",
        title: "Testing FHEVM Contracts & Encrypted I/O",
        duration: "90 min",
        objectives: [
          "Write comprehensive tests for FHEVM contracts",
          "Create encrypted inputs using the @fhevm/sdk package",
          "Decrypt and verify results in tests",
          "Understand the ZKPoK input verification flow",
        ],
        topics: [
          "Test structure: fixtures, signers, encrypted helpers",
          "Creating encrypted inputs: fhevmInstance.createEncryptedInput()",
          "Binding inputs to contract + user (security model)",
          "Submitting encrypted values with handles[] and inputProof (attestation)",
          "Decrypting results: user decryption via ACL permissions",
          "Testing edge cases: uninitialized values = ethers.ZeroHash",
          "Running tests on Sepolia vs local mock mode",
          "Best practices: isolate tests, test permission boundaries",
          "Note: older tutorials reference the TFHE library — this bootcamp uses the current FHE library (v0.9+)",
        ],
        description:
          "Deep dive into the FHEVM testing workflow. Students learn the three-step testing pattern: (1) encrypt inputs client-side with ZKPoK proofs, (2) submit encrypted data bound to specific contract+user pairs, (3) decrypt outputs with authorized signers. This lesson emphasizes that encrypted inputs cannot be reused across contracts or users — a fundamental security property of the system.",
      },
    ],
    homework: {
      id: "hw1",
      title: "Confidential Vault — Encrypted Deposit & Withdraw",
      difficulty: "Beginner",
      estimatedTime: "6-8 hours",
      description:
        "Build a confidential vault contract where users can deposit and withdraw encrypted amounts. The vault tracks each user's balance as an encrypted euint64. No one — not even the contract deployer — can see individual balances. Users can only view their own balance through proper ACL permissions.",
      requirements: [
        "Create ConfidentialVault.sol inheriting ZamaEthereumConfig",
        "Use euint64 for user balances stored in a mapping(address => euint64)",
        "Implement deposit(externalEuint64, bytes calldata inputProof) that adds to the caller's balance",
        "Implement withdraw(externalEuint64, bytes calldata inputProof) that subtracts from the caller's balance",
        "Use FHE.select with FHE.ge to prevent withdrawing more than the balance (no revert on encrypted comparison)",
        "Grant FHE.allow(balance, msg.sender) so users can decrypt their own balance",
        "Grant FHE.allowThis(balance) so the contract can reuse the balance handle",
        "Implement getBalance() that returns the caller's encrypted balance handle",
        "Write at least 5 tests: deposit, withdraw, underflow prevention, multiple users, permission checks",
        "Include a README explaining the design choices",
      ],
      gradingCriteria: [
        { criterion: "Contract compiles and deploys without errors", points: 15 },
        { criterion: "Correct use of encrypted types (euint64) and FHE operations", points: 20 },
        { criterion: "Proper ACL permissions (allow, allowThis)", points: 15 },
        { criterion: "Underflow protection using FHE.select (not require on encrypted values)", points: 20 },
        { criterion: "Comprehensive test suite (5+ tests) with encrypted I/O", points: 20 },
        { criterion: "Code quality, comments, and README documentation", points: 10 },
      ],
      starterRepo: "https://github.com/fhevm-bootcamp/week1-starter",
      solutionRepo: "https://github.com/fhevm-bootcamp/week1-solution",
      totalPoints: 100,
    },
    instructorNotes: [
      "Common confusion: students try to use require() with encrypted comparisons. Emphasize early that you CANNOT branch on encrypted values — use FHE.select instead.",
      "The symbolic execution concept is the hardest for students. Use the analogy of a post office: the host chain writes a 'letter' (event) describing what computation to do, and the coprocessors 'open and process' it off-chain.",
      "Have students draw the architecture diagram on paper/whiteboard before coding. This dramatically improves comprehension.",
      "For the homework vault contract, watch for students who forget FHE.allowThis — without it, the contract can't reuse the balance handle in subsequent operations.",
      "When teaching testing, emphasize that encrypted inputs are bound to (contract, user) pairs. A common bug is trying to reuse encrypted inputs across different test accounts.",
    ],
  },
  {
    number: 2,
    title: "Encrypted Types, Operations & Access Control",
    subtitle: "Mastering the FHEVM Toolkit",
    theme: "toolkit",
    color: "#7C3AED",
    icon: "🔧",
    overview:
      "Week 2 goes deep into the FHEVM developer toolkit. Students master all encrypted types, learn every available operation, understand the ACL system, and build increasingly sophisticated contracts. The focus shifts from 'making things work' to 'making things work correctly and efficiently.'",
    learningObjectives: [
      "Use all FHEVM encrypted types: ebool, euint8-256, eint8-256, eaddress",
      "Apply arithmetic, bitwise, comparison, and ternary operations on encrypted values",
      "Design correct access control patterns using persistent, transient, and public ACL",
      "Implement the 3-step public decryption flow: makePubliclyDecryptable → publicDecrypt → checkSignatures",
      "Optimize gas costs through type selection and scalar operand usage",
    ],
    estimatedTime: "12-14 hours",
    lessons: [
      {
        id: "w2-l1",
        title: "Complete Guide to Encrypted Types & Type Casting",
        duration: "90 min",
        objectives: [
          "List all FHEVM encrypted types and their use cases",
          "Perform type casting between encrypted and plaintext values",
          "Choose the optimal encrypted type for gas efficiency",
        ],
        topics: [
          "Encrypted boolean: ebool — flags, toggles, access gates",
          "Encrypted unsigned integers: euint8, euint16, euint32, euint64, euint128, euint256",
          "Encrypted signed integers: eint8, eint16, eint32, eint64, eint128, eint256 — for negative values and signed arithmetic",
          "Encrypted addresses: eaddress — private recipients",
          "External input types: externalEbool, externalEuint*, externalEint*, externalEaddress",
          "Type casting: FHE.asEbool(), FHE.asEuint*(), FHE.asEint*(), FHE.asEaddress()",
          "FHE.isInitialized() — checking if encrypted values have been set",
          "Gas optimization: always use the smallest type that fits your data range",
          "Deprecated types: ebytes64/128/256 were removed in fhEVM v0.7 — do not use these in new contracts",
        ],
        description:
          "A comprehensive catalog of every encrypted type available in FHEVM v0.9+. Students learn which type to use for different scenarios, how to cast between types, and critical optimization patterns. Key additions in recent versions include signed integer types (eint8–eint256) for negative values. Note: ebytesXXX types were removed in v0.7 — older tutorials referencing them are outdated. Key insight: euint8 operations cost dramatically less gas than euint256 — always use the smallest type that fits.",
      },
      {
        id: "w2-l2",
        title: "Mastering FHE Operations",
        duration: "120 min",
        objectives: [
          "Apply all arithmetic, bitwise, and comparison operations",
          "Use FHE.select for encrypted conditional logic",
          "Generate on-chain randomness with FHE.randEuintX",
          "Handle overflow scenarios safely",
        ],
        topics: [
          "Arithmetic: add, sub, mul, div (plaintext divisor only), rem, neg, min, max",
          "Bitwise: and, or, xor, not, shl, shr, rotl, rotr",
          "Comparison: eq, ne, lt, le, gt, ge (all return ebool)",
          "Conditional: FHE.select(ebool condition, euint ifTrue, euint ifFalse)",
          "Random: FHE.randEuint8(), randEuint16(), etc. — on-chain encrypted randomness",
          "Operator overloading: +, -, *, /, &, |, ^, ~",
          "Shift behavior: second operand computed modulo bit-width",
          "Overflow handling: using FHE.select to cap values safely",
          "Scalar optimization: FHE.add(x, 42) cheaper than FHE.add(x, FHE.asEuint(42))",
        ],
        description:
          "Hands-on mastery of every FHE operation. Students build small contracts exercising each operation category, learning the nuances: division only works with plaintext divisors, comparisons return ebool (not bool), and you cannot use if/else with encrypted conditions — you must use FHE.select. The scalar optimization lesson is critical for real-world gas efficiency.",
      },
      {
        id: "w2-l3",
        title: "Access Control Lists (ACL) — The Permission Layer",
        duration: "90 min",
        objectives: [
          "Implement persistent, transient, and public ACL patterns",
          "Design multi-party access control for encrypted data",
          "Understand EIP-1153 transient storage for gas-efficient temporary permissions",
        ],
        topics: [
          "Why ACL exists: encrypted data is useless without authorized access",
          "Persistent ACL: FHE.allow(ciphertext, address) — permanent cross-transaction access",
          "Contract self-access: FHE.allowThis(ciphertext) — critical for reusing handles",
          "Transient ACL: FHE.allowTransient(ciphertext, address) — one-transaction-only via EIP-1153",
          "Public decryption: FHE.makePubliclyDecryptable(ciphertext) — permanent global access",
          "Permission checks: FHE.isAllowed(), FHE.isSenderAllowed(), FHE.isPubliclyDecryptable()",
          "Multi-party patterns: granting access to multiple contracts and users",
          "Security audit checklist: common ACL mistakes that leak data",
        ],
        description:
          "The ACL system is what makes FHEVM practical — without it, encrypted data would be permanently locked. Students learn the three tiers of access (persistent, transient, public) and when to use each. Critical emphasis on FHE.allowThis(): forgetting it is the #1 source of bugs in FHEVM contracts.",
      },
      {
        id: "w2-l4",
        title: "Decryption Patterns — From Private to Public",
        duration: "90 min",
        objectives: [
          "Implement the 3-step public decryption flow",
          "Use the Relayer SDK for client-side decryption",
          "Design contracts that safely reveal encrypted results",
        ],
        topics: [
          "When decryption is needed: auction results, vote tallies, final settlements",
          "Step 1: FHE.makePubliclyDecryptable(handle) — on-chain declaration",
          "Step 2: Relayer SDK publicDecrypt(handles[]) — off-chain KMS decryption via @zama-fhe/relayer-sdk",
          "Step 3: FHE.checkSignatures(handles, abiEncodedCleartexts, proof) — on-chain verification",
          "Proof ordering: handles must match the exact order used in decryption request",
          "User decryption via ACL: private decryption for authorized users only",
          "Relayer SDK (@zama-fhe/relayer-sdk v0.3+) setup and initialization",
          "Design patterns: phase-based contracts (Open → DecryptionInProgress → Revealed)",
          "Deprecated: FHE.requestDecryption and GatewayCaller (Oracle-based) were removed in v0.9 — do not follow older tutorials using these patterns",
        ],
        description:
          "Decryption is the bridge between the encrypted world and actionable on-chain results. In fhEVM v0.9+, the dApp client is responsible for relaying decryption results — the old Oracle-based pattern (FHE.requestDecryption / GatewayCaller) is removed. Students implement the current 3-step public decryption flow using the Relayer SDK and learn the asynchronous nature of FHEVM: unlike standard Solidity where results are immediate, decryption requires off-chain coordination through the KMS. This fundamentally changes contract architecture — students learn to design phase-based state machines.",
      },
    ],
    homework: {
      id: "hw2",
      title: "Confidential ERC-20 Token — PrivCoin",
      difficulty: "Intermediate",
      estimatedTime: "8-10 hours",
      description:
        "Build a fully functional confidential ERC-20 token called PrivCoin. All balances and transfer amounts are encrypted. Only token holders can see their own balance. The contract supports minting (owner only), confidential transfers, and encrypted allowances for delegated spending.",
      requirements: [
        "Create PrivCoin.sol inheriting ZamaEthereumConfig",
        "Store balances as mapping(address => euint64) — all encrypted",
        "Implement mint(address to, externalEuint64 amount, bytes proof) — owner only",
        "Implement transfer(address to, externalEuint64 amount, bytes proof) with encrypted balance checking",
        "Use FHE.select + FHE.le to enforce 'balance >= amount' without revealing either value",
        "Implement approve/transferFrom with encrypted allowances (euint64)",
        "Properly manage ACL: sender sees their balance, receiver sees theirs, no cross-visibility",
        "Implement totalSupply() as a public (non-encrypted) value for transparency",
        "Handle the 'insufficient balance' case by making the transfer a no-op (don't revert — you can't revert on encrypted conditions)",
        "Write 8+ tests covering: mint, transfer, insufficient balance no-op, allowance, transferFrom, multiple users",
        "Include detailed README with design decisions and known limitations",
      ],
      gradingCriteria: [
        { criterion: "Contract compiles and all core functions work", points: 15 },
        { criterion: "Correct encrypted balance tracking and transfer logic", points: 20 },
        { criterion: "Proper use of FHE.select for conditional transfers (no reverts on encrypted values)", points: 15 },
        { criterion: "Encrypted allowance system (approve/transferFrom)", points: 15 },
        { criterion: "Correct ACL permissions — no information leakage", points: 15 },
        { criterion: "Comprehensive test suite (8+ tests)", points: 15 },
        { criterion: "Documentation and code quality", points: 5 },
      ],
      starterRepo: "https://github.com/fhevm-bootcamp/week2-starter",
      solutionRepo: "https://github.com/fhevm-bootcamp/week2-solution",
      totalPoints: 100,
    },
    instructorNotes: [
      "The biggest Week 2 mistake: students write `if (FHE.lt(balance, amount))` — this doesn't compile because FHE.lt returns ebool, not bool. Hammer home the FHE.select pattern.",
      "For the token homework, the 'no-op transfer' pattern is non-obvious. When balance < amount, the transfer should silently do nothing (set transfer amount to 0 via FHE.select). Students used to require/revert will resist this.",
      "Demonstrate the gas difference between euint8 and euint256 operations with a live comparison. This makes the optimization lesson concrete.",
      "The transient ACL (EIP-1153) is confusing. Use the analogy of a 'day pass' at a gym vs a 'membership card' for persistent ACL.",
      "For the decryption lesson, draw a sequence diagram on the board showing the 3-step flow. The asynchronous nature trips up students who expect synchronous returns.",
      "Students will find older tutorials using TFHE.* (now FHE.*), GatewayCaller, and FHE.requestDecryption — these are all deprecated in v0.9+. Address this proactively: show a side-by-side of old vs new API to prevent confusion.",
      "The ebytesXXX types (ebytes64, ebytes128, ebytes256) were removed in fhEVM v0.7. If students ask about encrypting arbitrary bytes, explain that eaddress and euint256 cover most use cases.",
    ],
  },
  {
    number: 3,
    title: "Real-World FHEVM Applications",
    subtitle: "Building Production-Grade Confidential dApps",
    theme: "applications",
    color: "#10B981",
    icon: "🏗️",
    overview:
      "Week 3 shifts from individual concepts to complete applications. Students build three real-world confidential dApps: a private voting system, a sealed-bid auction, and a confidential token wrapper. Each project demonstrates different FHEVM patterns and teaches students to think architecturally about privacy-preserving systems.",
    learningObjectives: [
      "Design and implement a confidential voting contract with encrypted vote tallying",
      "Build a sealed-bid auction with encrypted bids and fair price discovery",
      "Create a confidential ERC-7984 token wrapper for existing ERC-20 tokens",
      "Configure a pre-built frontend template with the Relayer SDK for FHEVM contract interaction",
      "Apply phase-based state machine patterns for asynchronous decryption workflows",
    ],
    estimatedTime: "14-16 hours",
    lessons: [
      {
        id: "w3-l1",
        title: "Confidential Voting System",
        duration: "120 min",
        objectives: [
          "Transform a standard voting contract into a confidential one using FHEVM",
          "Handle the architectural shift from synchronous to asynchronous result revelation",
          "Implement phase-based state management",
        ],
        topics: [
          "Why voting needs privacy: coercion resistance, strategic voting prevention",
          "Converting a standard voting contract: identifying sensitive fields",
          "Replacing uint64 vote counts with euint64",
          "Replacing bool hasVoted with ebool",
          "Using FHE.select + FHE.add for conditional vote counting",
          "Phase management: Voting → DecryptionRequested → ResultsRevealed",
          "Public decryption of final tallies via 3-step flow",
          "Testing the complete voting lifecycle",
        ],
        description:
          "Students transform a plain Solidity voting contract into a confidential one step by step — the same transformation pattern they'll use in production. The key insight is that FHEVM changes contract architecture: you can't just swap types. The voting result must go through an asynchronous decryption phase, requiring a state machine pattern.",
      },
      {
        id: "w3-l2",
        title: "Sealed-Bid Auction",
        duration: "120 min",
        objectives: [
          "Build a sealed-bid auction where bid amounts are encrypted",
          "Implement encrypted comparison to find the winning bid without revealing losers' bids",
          "Design a fair settlement mechanism",
        ],
        topics: [
          "Auction design: why sealed bids prevent sniping and front-running",
          "Architecture: bidding phase → evaluation phase → settlement phase",
          "Submitting encrypted bids: externalEuint64 + proof",
          "Finding the maximum bid using FHE.select + FHE.gt across all bidders",
          "Tracking the winning address using eaddress + encrypted comparisons",
          "Revealing only the winning bid via public decryption",
          "Refunding losing bidders without revealing their bid amounts",
          "Gas optimization for N-bidder auctions",
        ],
        description:
          "The sealed-bid auction is one of the killer use cases for FHEVM — impossible to build safely without on-chain encryption. Students learn to iterate over encrypted bids to find the maximum without revealing any individual bid. The winner's bid amount is revealed; losing bids remain permanently encrypted. This lesson teaches advanced FHE patterns including encrypted address tracking.",
      },
      {
        id: "w3-l3",
        title: "Confidential Token Wrapper (ERC-7984)",
        duration: "90 min",
        objectives: [
          "Understand the ERC-7984 confidential token standard",
          "Build a wrapper that converts standard ERC-20 tokens to confidential equivalents",
          "Implement wrap/unwrap flows with encryption/decryption",
        ],
        topics: [
          "ERC-7984 standard: what it specifies and why it exists",
          "Wrapper architecture: lock ERC-20 → mint confidential equivalent",
          "The Zama Registry Contract: finding validated wrappers",
          "Implementing wrap(): receive ERC-20, encrypt balance as euint64",
          "Implementing unwrap(): decrypt balance, burn confidential token, release ERC-20",
          "Confidential transfers between wrapped token holders",
          "Integration with the Zama Confidential Wrapper app",
        ],
        description:
          "The confidential token wrapper bridges the existing ERC-20 ecosystem with FHEVM privacy. Students build a contract that locks standard tokens and issues encrypted equivalents, enabling private transfers of any existing token. This is a production pattern used in the Zama Protocol's own Confidential Wrapper app.",
      },
      {
        id: "w3-l4",
        title: "Frontend Integration with Relayer SDK",
        duration: "90 min",
        objectives: [
          "Configure the pre-built frontend template to connect to an FHEVM contract",
          "Submit encrypted inputs from the browser using the Relayer SDK",
          "Perform user decryption and public decryption from the frontend",
        ],
        topics: [
          "Relayer SDK (@zama-fhe/relayer-sdk v0.3+) overview: abstracting Gateway Chain complexity",
          "Using the provided React frontend template: project structure and configuration",
          "Connecting the template to your deployed contract: ABI, address, and network config",
          "Creating encrypted inputs from the browser: createEncryptedInput()",
          "Submitting transactions with encrypted parameters via the template's transaction helpers",
          "User decryption: reading your own private data via ACL",
          "Public decryption: fetching publicly decryptable results via HTTP",
          "Error handling and UX considerations for async decryption",
          "Note: no prior React/TypeScript experience required — the template handles all UI scaffolding",
        ],
        description:
          "The bridge from Solidity to full-stack dApp. Students use a pre-built React frontend template that handles wallet connection, UI layout, and transaction management out of the box. The focus is on configuring the template to connect to their FHEVM contracts and understanding the Relayer SDK integration points — not on building a frontend from scratch. The SDK handles all Gateway Chain interactions through HTTP calls to Zama's Relayer, meaning clients only need a wallet on the host chain. This approach lets Solidity-focused developers produce a working end-to-end confidential dApp without prior web development experience.",
      },
    ],
    homework: {
      id: "hw3",
      title: "Confidential DAO Governance — SecretDAO",
      difficulty: "Advanced",
      estimatedTime: "12-15 hours",
      description:
        "Build a complete confidential DAO governance system. Token holders can create proposals, vote with encrypted ballots (for/against/abstain), and results are only revealed after the voting period ends. The system uses ConfidentialERC20Votes for governance tokens and implements a multi-phase voting lifecycle.",
      requirements: [
        "Deploy or implement a ConfidentialERC20Votes-compatible governance token",
        "Create SecretDAO.sol with proposal creation, encrypted voting, and result revelation",
        "Proposals have: description, start block, end block, encrypted vote tallies (euint64 for, against, abstain)",
        "Voting uses encrypted ballots: voters submit encrypted vote type (0=against, 1=for, 2=abstain) and encrypted weight",
        "Implement vote delegation: token holders can delegate their voting power",
        "Phase management: Pending → Active → DecryptionRequested → Executed/Defeated",
        "Public decryption of results only after voting period ends",
        "On-chain verification of decrypted results via checkSignatures",
        "Quorum checking against a configurable threshold",
        "Configure the provided React frontend template to allow: connecting wallet, viewing proposals, casting encrypted votes, viewing results (template handles UI scaffolding — focus on contract integration)",
        "Write 10+ tests covering the complete governance lifecycle",
        "Include architecture documentation explaining design trade-offs",
      ],
      gradingCriteria: [
        { criterion: "Smart contract compiles and core governance flow works", points: 15 },
        { criterion: "Encrypted voting with proper ballot privacy", points: 20 },
        { criterion: "Correct phase management and timing", points: 10 },
        { criterion: "Public decryption and on-chain verification", points: 15 },
        { criterion: "Frontend template configured with Relayer SDK integration", points: 15 },
        { criterion: "Test suite (10+ tests) covering full lifecycle", points: 15 },
        { criterion: "Architecture documentation and code quality", points: 10 },
      ],
      starterRepo: "https://github.com/fhevm-bootcamp/week3-starter",
      solutionRepo: "https://github.com/fhevm-bootcamp/week3-solution",
      totalPoints: 100,
    },
    instructorNotes: [
      "Week 3 is where students struggle most. The jump from single-concept contracts to full applications is big. Pair programming during labs helps enormously.",
      "For the voting lesson, start by showing the plain Solidity contract, then transform it live. This 'before/after' approach from the Zama docs is very effective.",
      "The sealed-bid auction requires iterating over bidders — discuss the gas implications of processing N encrypted comparisons. For production, discuss batching strategies.",
      "The ERC-7984 lesson connects to the broader Zama ecosystem. Show the live Confidential Wrapper app to demonstrate what they're building toward.",
      "For the homework SecretDAO, encourage students to start with the governance token (week 2 knowledge) before tackling the DAO contract itself. Modular development prevents overwhelm.",
      "The frontend integration lesson uses a pre-built React template so Solidity developers don't need prior web development experience. Walk through the template structure before students modify it. Key files to highlight: contract config, encrypted input helpers, and the decryption result display.",
    ],
  },
  {
    number: 4,
    title: "Advanced Patterns & Capstone Project",
    subtitle: "From Bootcamp Graduate to FHEVM Developer",
    theme: "mastery",
    color: "#FFD700",
    icon: "🏆",
    overview:
      "The final week covers advanced topics, security considerations, and the capstone project. Students learn production patterns from Zama's standard library, understand the security model deeply, and build an original confidential application that demonstrates mastery of all FHEVM concepts.",
    learningObjectives: [
      "Apply production patterns from fhevm-contracts: ConfidentialERC20, governance, vesting",
      "Identify and prevent common FHEVM security vulnerabilities",
      "Understand gas optimization strategies for encrypted operations",
      "Design, implement, and present an original confidential dApp as a capstone project",
      "Navigate the Zama Protocol ecosystem: staking, governance, registry, future roadmap",
    ],
    estimatedTime: "16-20 hours",
    lessons: [
      {
        id: "w4-l1",
        title: "Zama Standard Library & Production Patterns",
        duration: "90 min",
        objectives: [
          "Use fhevm-contracts standard library in production projects",
          "Understand ConfidentialERC20, governance, and vesting contract patterns",
          "Apply the EncryptedErrors utility for better error handling",
        ],
        topics: [
          "fhevm-contracts overview: audited templates for common use cases",
          "ConfidentialERC20: production token implementation with error handling",
          "ConfidentialERC20Mintable: adding controlled minting",
          "ConfidentialERC20Wrapped / ConfidentialWETH: wrapping existing tokens",
          "ConfidentialERC20Votes: governance-ready voting tokens",
          "ConfidentialGovernorAlpha: full governance protocol",
          "ConfidentialVestingWallet / VestingWalletCliff: token vesting schedules",
          "EncryptedErrors: handling errors with encrypted error codes",
          "Composing standard contracts: building on audited foundations",
        ],
        description:
          "Professional FHEVM development means building on audited, battle-tested foundations. Students explore Zama's fhevm-contracts library — the equivalent of OpenZeppelin for encrypted smart contracts. Each template demonstrates production patterns: error handling with encrypted error codes, proper ACL management, and gas-efficient operations.",
      },
      {
        id: "w4-l2",
        title: "FHEVM Security & Common Vulnerabilities",
        duration: "120 min",
        objectives: [
          "Identify and prevent the top 10 FHEVM-specific vulnerabilities",
          "Conduct a security review of an FHEVM contract",
          "Understand the trust assumptions and threat model",
        ],
        topics: [
          "Vulnerability #1: Using require() with encrypted comparisons (compiler error or logic bug)",
          "Vulnerability #2: Forgetting FHE.allowThis — contract can't reuse its own handles",
          "Vulnerability #3: Forgetting FHE.allow — users can't decrypt their own data",
          "Vulnerability #4: Information leakage through gas patterns (side-channel attacks)",
          "Vulnerability #5: Reusing encrypted inputs across contracts (proof binding violation)",
          "Vulnerability #6: Not validating input proofs (FHE.fromExternal is mandatory)",
          "Vulnerability #7: Arithmetic overflow in encrypted operations",
          "Vulnerability #8: Incorrect handle ordering in checkSignatures",
          "Vulnerability #9: Timing attacks through transaction patterns",
          "Vulnerability #10: Excessive public decryption exposing data unnecessarily",
          "OpenZeppelin's FHEVM security guide: key recommendations",
          "Trust model review: what FHEVM protects and what it doesn't",
          "Security audit checklist for FHEVM contracts",
        ],
        description:
          "Security is critical in FHEVM because mistakes don't just lose funds — they leak private data permanently. This lesson catalogs the most common FHEVM vulnerabilities, many unique to encrypted computation. Students practice identifying these issues in code review exercises and build a security checklist they can use in production.",
      },
      {
        id: "w4-l3",
        title: "Gas Optimization & Performance",
        duration: "90 min",
        objectives: [
          "Minimize gas costs in FHEVM contracts",
          "Choose optimal encrypted types and operation patterns",
          "Understand the performance roadmap: CPU → GPU → ASIC",
        ],
        topics: [
          "Gas cost model: type size impacts cost exponentially",
          "Rule #1: Use the smallest encrypted type that fits (euint8 >> euint256)",
          "Rule #2: Prefer scalar operands (FHE.add(x, 42) vs FHE.add(x, encrypted42))",
          "Rule #3: Minimize encrypted comparisons — batch when possible",
          "Rule #4: Use transient ACL for temporary operations (gas savings via EIP-1153)",
          "Rule #5: Cache encrypted intermediate results",
          "Benchmarking: measuring actual gas costs of FHE operations",
          "Performance roadmap: 20 TPS (CPU) → 500-1000 TPS (GPU) → 100K+ TPS (ASIC)",
          "Protocol fee structure: ZKPoK verification, decryption, bridging costs",
        ],
        description:
          "As FHEVM contracts handle real assets, gas optimization becomes critical. Students learn concrete rules for minimizing costs and benchmark different approaches. The performance roadmap lesson sets expectations for where the technology is heading — from current CPU-based computation to future ASIC acceleration.",
      },
      {
        id: "w4-l4",
        title: "Zama Ecosystem & Future of Confidential Computing",
        duration: "60 min",
        objectives: [
          "Navigate the Zama Protocol ecosystem apps",
          "Understand the ZAMA token economics and staking model",
          "Explore the future roadmap: multi-chain, ZK-MPC, permissionless nodes",
        ],
        topics: [
          "Protocol apps: Governance, Staking, Registry, Confidential Wrapper",
          "ZAMA token: protocol fees, operator staking, governance voting",
          "Two-tier staking system and square-root-of-stake distribution",
          "Multi-chain expansion: Ethereum → other EVM chains (H1 2026) → Solana (H2 2026)",
          "ZK-MPC verification: removing hardware trust assumptions",
          "HSM-based node execution: path to permissionless operation",
          "FHE ASICs: 100,000+ TPS target",
          "Career paths: FHEVM developer, protocol contributor, dApp builder",
          "Community resources: forum, Discord, bounty programs",
        ],
        description:
          "The final lesson zooms out from code to ecosystem. Students understand the broader Zama Protocol landscape — the apps, economics, governance, and multi-year roadmap. This context helps graduates position themselves as FHEVM developers and understand where to focus their continued learning.",
      },
    ],
    homework: {
      id: "hw4",
      title: "Capstone Project — Original Confidential dApp",
      difficulty: "Expert",
      estimatedTime: "20-25 hours",
      description:
        "Design and build an original confidential dApp that solves a real-world problem using FHEVM. This is your capstone — demonstrate mastery of encrypted types, operations, ACL, decryption, frontend integration, and security best practices. Choose from the suggested projects or propose your own.",
      requirements: [
        "Choose a project: Confidential AMM (encrypted liquidity + private swaps), Confidential Payroll (encrypted salaries + batch payment), Private Identity System (encrypted credentials + selective disclosure), Encrypted Gaming (hidden game state + fair randomness), OR propose your own with instructor approval",
        "Implement at least 2 smart contracts with meaningful encrypted state",
        "Use at least 3 different encrypted types (e.g., euint64, ebool, eaddress)",
        "Implement both user decryption (private data access) and public decryption (result revelation)",
        "Configure the provided React frontend template with Relayer SDK integration for your dApp",
        "Apply at least 3 gas optimization techniques from Week 4, Lesson 3",
        "Conduct a self-security-review using the FHEVM security checklist",
        "Write comprehensive tests (15+ tests) including edge cases and security scenarios",
        "Create complete documentation: README, architecture diagram, security analysis, user guide",
        "Record a 3-minute demo video showing the dApp in action",
        "Deploy to Sepolia testnet with verified contracts",
      ],
      gradingCriteria: [
        { criterion: "Originality and real-world applicability of the concept", points: 10 },
        { criterion: "Correct and sophisticated use of FHEVM encrypted operations", points: 20 },
        { criterion: "Security: proper ACL, no information leakage, vulnerability mitigation", points: 15 },
        { criterion: "Frontend template configured with Relayer SDK integration", points: 10 },
        { criterion: "Gas optimization techniques applied", points: 10 },
        { criterion: "Test suite (15+ tests) with edge cases", points: 15 },
        { criterion: "Documentation: README, architecture, security analysis", points: 10 },
        { criterion: "Demo video quality and completeness", points: 5 },
        { criterion: "Sepolia deployment with verified contracts", points: 5 },
      ],
      starterRepo: "https://github.com/fhevm-bootcamp/capstone-starter",
      solutionRepo: "https://github.com/fhevm-bootcamp/capstone-examples",
      totalPoints: 100,
    },
    instructorNotes: [
      "The capstone should be scoped during Week 3 so students have time to plan. Hold a 'project proposal' session at the start of Week 4.",
      "The Confidential AMM is the most ambitious project — recommend it only for strong students. The Confidential Payroll is the most achievable while still being impressive.",
      "For the security lesson, create a 'spot the bug' exercise with intentionally vulnerable FHEVM contracts. Competition format works well here.",
      "The gas optimization lesson benefits from live benchmarking. Have students measure actual costs on Sepolia for different approaches.",
      "For the capstone demo video, provide a template/outline: (1) problem statement, (2) architecture overview, (3) live demo, (4) key technical decisions. Keep it under 3 minutes.",
      "Grade capstones with a rubric during a final presentation session. Peer review adds valuable feedback and learning.",
      "After Week 4, point students to the Zama bounty programs and developer community for continued involvement.",
    ],
  },
];

export function getWeek(number: number): Week | undefined {
  return WEEKS.find((w) => w.number === number);
}

export function getTotalLessons(): number {
  return WEEKS.reduce((sum, w) => sum + w.lessons.length, 0);
}

export function getTotalHomeworks(): number {
  return WEEKS.length;
}

export function getLesson(weekNumber: number, lessonId: string): { week: Week; lesson: Lesson; lessonIndex: number } | undefined {
  const week = getWeek(weekNumber);
  if (!week) return undefined;
  const lessonIndex = week.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) return undefined;
  return { week, lesson: week.lessons[lessonIndex], lessonIndex };
}
