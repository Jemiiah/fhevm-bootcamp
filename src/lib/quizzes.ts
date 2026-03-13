export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonQuiz {
  lessonId: string;
  questions: QuizQuestion[];
}

export const QUIZZES: LessonQuiz[] = [
  // ── Week 1 ──
  {
    lessonId: "w1-l1",
    questions: [
      {
        id: "w1-l1-q1",
        question: "What is the fundamental limitation of public blockchains that FHE addresses?",
        options: [
          "Slow transaction speeds",
          "All on-chain data is publicly visible",
          "High gas costs",
          "Limited smart contract functionality",
        ],
        correctIndex: 1,
        explanation:
          "Public blockchains expose all transaction data, balances, and contract state to everyone. FHE enables computation on encrypted data, keeping sensitive information private while still allowing on-chain processing.",
      },
      {
        id: "w1-l1-q2",
        question: "What makes FHE unique compared to other privacy approaches like ZK proofs or TEEs?",
        options: [
          "It is faster than all other approaches",
          "It requires specialized hardware",
          "It allows arbitrary computation on encrypted data without decryption",
          "It only works on Ethereum",
        ],
        correctIndex: 2,
        explanation:
          "FHE's unique property is enabling arbitrary computation on encrypted data without ever decrypting it. ZK proofs verify computations but don't compute on encrypted data. TEEs rely on trusted hardware.",
      },
      {
        id: "w1-l1-q3",
        question: "Which of these is a real-world attack enabled by blockchain transparency?",
        options: [
          "Front-running transactions by reading the mempool",
          "Breaking encryption keys",
          "Corrupting validator nodes",
          "Modifying past blocks",
        ],
        correctIndex: 0,
        explanation:
          "Front-running and MEV extraction are enabled by the fact that pending transactions are visible in the mempool. Attackers can see trades before they execute and profit by inserting their own transactions first.",
      },
    ],
  },
  {
    lessonId: "w1-l2",
    questions: [
      {
        id: "w1-l2-q1",
        question: "In the Zama Protocol architecture, what is the role of coprocessors?",
        options: [
          "They store encrypted data on-chain",
          "They perform the actual FHE computations off-chain",
          "They manage user wallets",
          "They validate block transactions",
        ],
        correctIndex: 1,
        explanation:
          "Coprocessors are a network of 5 operators that perform the actual FHE computations off-chain. The host chain emits operation events via symbolic execution, and coprocessors process these computationally intensive FHE operations.",
      },
      {
        id: "w1-l2-q2",
        question: "What does 'symbolic execution' mean in the context of FHEVM?",
        options: [
          "The EVM executes FHE operations directly on-chain",
          "The host chain emits operation events instead of computing FHE directly",
          "Smart contracts are compiled to symbolic bytecode",
          "Users submit symbolic proofs with their transactions",
        ],
        correctIndex: 1,
        explanation:
          "Symbolic execution means the host chain doesn't perform FHE computation itself. Instead, it emits events describing the operations to perform, and coprocessors handle the actual encrypted computations off-chain.",
      },
      {
        id: "w1-l2-q3",
        question: "How many nodes form the KMS for threshold decryption, and what majority is needed?",
        options: [
          "5 nodes, simple majority",
          "10 nodes, 3/4 majority",
          "13 nodes, 2/3 majority",
          "21 nodes, 1/2 majority",
        ],
        correctIndex: 2,
        explanation:
          "The KMS consists of 13 nodes using MPC (Multi-Party Computation) for threshold decryption. A 2/3 majority (at least 9 of 13 nodes) is required to decrypt data, ensuring no single party can access private information.",
      },
    ],
  },
  {
    lessonId: "w1-l3",
    questions: [
      {
        id: "w1-l3-q1",
        question: "In fhEVM v0.9+, which library import do you use for encrypted operations?",
        options: [
          "import { TFHE } from '@fhevm/solidity'",
          "import { FHE } from '@fhevm/solidity'",
          "import { Encrypt } from '@zama/fhevm'",
          "import { Homomorphic } from '@fhevm/core'",
        ],
        correctIndex: 1,
        explanation:
          "Since fhEVM v0.7+, the library was renamed from TFHE to FHE. In v0.9+, you import { FHE } from '@fhevm/solidity'. Older tutorials referencing TFHE are outdated.",
      },
      {
        id: "w1-l3-q2",
        question: "What does FHE.allowThis(ciphertext) do?",
        options: [
          "Makes the ciphertext publicly readable",
          "Grants the contract itself permission to reuse the encrypted handle",
          "Allows any user to decrypt the value",
          "Transfers ownership of the ciphertext",
        ],
        correctIndex: 1,
        explanation:
          "FHE.allowThis(ciphertext) grants the contract permission to reuse its own encrypted handle in subsequent operations. Without it, the contract cannot perform further computations on that encrypted value — it's the #1 source of bugs.",
      },
      {
        id: "w1-l3-q3",
        question: "Which config should you inherit from in fhEVM v0.9+?",
        options: [
          "SepoliaConfig",
          "GatewayCaller",
          "ZamaEthereumConfig",
          "FHEConfig",
        ],
        correctIndex: 2,
        explanation:
          "In fhEVM v0.9+, contracts inherit from ZamaEthereumConfig. SepoliaConfig was removed, and GatewayCaller is deprecated. ZamaEthereumConfig handles all the necessary protocol configuration.",
      },
    ],
  },
  {
    lessonId: "w1-l4",
    questions: [
      {
        id: "w1-l4-q1",
        question: "Why are encrypted inputs bound to a specific (contract, user) pair?",
        options: [
          "For gas optimization purposes",
          "To prevent replay attacks — inputs can't be reused across contracts or users",
          "Because the EVM requires it",
          "To reduce storage costs",
        ],
        correctIndex: 1,
        explanation:
          "Encrypted inputs include ZKPoK (Zero-Knowledge Proof of Knowledge) proofs that bind them to a specific contract address and user address. This prevents replay attacks where someone could submit the same encrypted input to a different contract or pretend to be a different user.",
      },
      {
        id: "w1-l4-q2",
        question: "What is the three-step testing pattern for FHEVM contracts?",
        options: [
          "Deploy, call, verify",
          "Encrypt inputs client-side with ZKPoK, submit bound data, decrypt outputs",
          "Compile, test, deploy",
          "Mock, stub, assert",
        ],
        correctIndex: 1,
        explanation:
          "The FHEVM testing pattern is: (1) encrypt inputs client-side with ZKPoK proofs, (2) submit encrypted data bound to contract+user pairs, (3) decrypt outputs with authorized signers. This mirrors the production flow.",
      },
      {
        id: "w1-l4-q3",
        question: "What value does an uninitialized encrypted variable return?",
        options: [
          "Zero (0)",
          "null",
          "ethers.ZeroHash",
          "It throws an error",
        ],
        correctIndex: 2,
        explanation:
          "Uninitialized encrypted variables in FHEVM return ethers.ZeroHash, not zero. This is important to test for — checking if a value is initialized requires comparing the handle against ZeroHash, or using FHE.isInitialized().",
      },
    ],
  },

  // ── Week 2 ──
  {
    lessonId: "w2-l1",
    questions: [
      {
        id: "w2-l1-q1",
        question: "Why should you always use the smallest encrypted type that fits your data?",
        options: [
          "Smaller types are more secure",
          "The compiler only supports small types",
          "Gas costs increase dramatically with larger types (euint8 << euint256)",
          "Larger types are not supported on mainnet",
        ],
        correctIndex: 2,
        explanation:
          "FHE operations on smaller types cost dramatically less gas. euint8 operations are far cheaper than euint256. Always choose the smallest type that fits your data range to minimize costs.",
      },
      {
        id: "w2-l1-q2",
        question: "Which encrypted types were removed in fhEVM v0.7 and should NOT be used?",
        options: [
          "euint128 and euint256",
          "ebytes64, ebytes128, and ebytes256",
          "eint8 and eint16",
          "eaddress",
        ],
        correctIndex: 1,
        explanation:
          "The ebytesXXX types (ebytes64, ebytes128, ebytes256) were removed in fhEVM v0.7. If you need to encrypt arbitrary data, use eaddress or euint256 instead. Older tutorials referencing ebytes types are outdated.",
      },
      {
        id: "w2-l1-q3",
        question: "What does FHE.isInitialized() check?",
        options: [
          "If the FHE library is loaded",
          "If an encrypted value has been set (vs default zero-handle)",
          "If the contract is deployed",
          "If the user has permission to decrypt",
        ],
        correctIndex: 1,
        explanation:
          "FHE.isInitialized() checks whether an encrypted variable has been assigned a value, as opposed to having the default zero-handle. This is useful for checking if a user has deposited or if a value has been set.",
      },
    ],
  },
  {
    lessonId: "w2-l2",
    questions: [
      {
        id: "w2-l2-q1",
        question: "Why can't you use if/else with encrypted comparison results?",
        options: [
          "Solidity doesn't support if/else",
          "FHE comparisons return ebool (encrypted), not bool — you can't branch on encrypted values",
          "It's a compiler limitation that will be fixed",
          "You can, but it costs more gas",
        ],
        correctIndex: 1,
        explanation:
          "FHE comparisons (eq, lt, gt, etc.) return ebool — an encrypted boolean. The EVM cannot branch on encrypted values because it doesn't know the actual value. You must use FHE.select(condition, ifTrue, ifFalse) instead.",
      },
      {
        id: "w2-l2-q2",
        question: "What is the gas advantage of using scalar operands?",
        options: [
          "No advantage — they cost the same",
          "FHE.add(x, 42) is cheaper than FHE.add(x, FHE.asEuint32(42))",
          "Scalar operands are only for testing",
          "They bypass FHE entirely",
        ],
        correctIndex: 1,
        explanation:
          "Using a plaintext scalar (e.g., FHE.add(x, 42)) is cheaper than encrypting the scalar first (FHE.add(x, FHE.asEuint32(42))). The coprocessor can optimize when one operand is known plaintext.",
      },
      {
        id: "w2-l2-q3",
        question: "How does FHE.div() differ from standard Solidity division?",
        options: [
          "It rounds up instead of down",
          "It only works with a plaintext divisor — you cannot divide by an encrypted value",
          "It returns a float instead of integer",
          "There is no difference",
        ],
        correctIndex: 1,
        explanation:
          "FHE.div() only accepts a plaintext (non-encrypted) divisor. Dividing by an encrypted value is not supported because it would leak information about the divisor through the result structure.",
      },
    ],
  },
  {
    lessonId: "w2-l3",
    questions: [
      {
        id: "w2-l3-q1",
        question: "What is the difference between FHE.allow() and FHE.allowTransient()?",
        options: [
          "allow() is for contracts, allowTransient() is for users",
          "allow() is permanent (persistent ACL), allowTransient() lasts only one transaction (EIP-1153)",
          "allow() costs more gas",
          "They are identical",
        ],
        correctIndex: 1,
        explanation:
          "FHE.allow() creates a persistent permission that lasts across transactions. FHE.allowTransient() creates a temporary permission using EIP-1153 transient storage that only lasts for the current transaction — useful for gas savings when permanent access isn't needed.",
      },
      {
        id: "w2-l3-q2",
        question: "What is the #1 most common ACL bug in FHEVM contracts?",
        options: [
          "Granting too many permissions",
          "Forgetting FHE.allowThis() — the contract can't reuse its own handles",
          "Using the wrong address format",
          "Not importing the ACL library",
        ],
        correctIndex: 1,
        explanation:
          "Forgetting FHE.allowThis() is the most common FHEVM bug. Without it, the contract loses permission to use its own encrypted handles in subsequent operations. Every time you store an encrypted value, you must call FHE.allowThis().",
      },
      {
        id: "w2-l3-q3",
        question: "What does FHE.makePubliclyDecryptable() do?",
        options: [
          "Immediately decrypts the value on-chain",
          "Marks an encrypted value for permanent global access by anyone",
          "Sends the value to the KMS for decryption",
          "Makes the value visible only to the contract owner",
        ],
        correctIndex: 1,
        explanation:
          "FHE.makePubliclyDecryptable() marks an encrypted handle so that anyone can request its decryption. It doesn't decrypt immediately — the actual decryption happens off-chain via the Relayer SDK's publicDecrypt() call.",
      },
    ],
  },
  {
    lessonId: "w2-l4",
    questions: [
      {
        id: "w2-l4-q1",
        question: "What are the 3 steps of public decryption in fhEVM v0.9+?",
        options: [
          "requestDecryption → waitForCallback → readResult",
          "makePubliclyDecryptable → publicDecrypt (Relayer) → checkSignatures (on-chain)",
          "encrypt → compute → decrypt",
          "submit → approve → reveal",
        ],
        correctIndex: 1,
        explanation:
          "The 3-step public decryption flow: (1) Call FHE.makePubliclyDecryptable() on-chain, (2) Use the Relayer SDK's publicDecrypt() to request off-chain KMS decryption, (3) Call FHE.checkSignatures() on-chain to verify and store the decrypted result.",
      },
      {
        id: "w2-l4-q2",
        question: "Why was the Oracle-based decryption pattern (GatewayCaller) removed in v0.9?",
        options: [
          "It was too expensive",
          "The client-side Relayer approach is more decentralized and doesn't require callback oracles",
          "It had security vulnerabilities",
          "It was too slow",
        ],
        correctIndex: 1,
        explanation:
          "The old Oracle-based pattern (FHE.requestDecryption / GatewayCaller) was replaced with the client-side Relayer SDK approach. The new pattern is more decentralized — the dApp client handles decryption relay instead of relying on an oracle callback.",
      },
      {
        id: "w2-l4-q3",
        question: "Why must handle ordering in checkSignatures match the decryption request?",
        options: [
          "For gas optimization",
          "It's a style convention",
          "The KMS signs results in order — mismatched ordering invalidates the proof",
          "The compiler enforces it",
        ],
        correctIndex: 2,
        explanation:
          "The KMS produces signatures for decrypted values in the exact order the handles were submitted. If you pass handles to checkSignatures in a different order, the signature verification fails because the proof no longer matches.",
      },
    ],
  },

  // ── Week 3 ──
  {
    lessonId: "w3-l1",
    questions: [
      {
        id: "w3-l1-q1",
        question: "Why is FHE.select + FHE.add used instead of if/else for conditional vote counting?",
        options: [
          "It's a coding style preference",
          "You cannot branch on encrypted values — FHE.select performs encrypted conditional logic",
          "if/else is slower",
          "The compiler doesn't support if/else",
        ],
        correctIndex: 1,
        explanation:
          "Since vote values are encrypted (ebool, euint64), you can't use if/else because the actual values are unknown to the EVM. FHE.select(hasVoted, currentCount, FHE.add(currentCount, voteWeight)) performs the conditional addition entirely in encrypted space.",
      },
      {
        id: "w3-l1-q2",
        question: "What state machine phases does a confidential voting contract need?",
        options: [
          "Open → Closed",
          "Voting → DecryptionRequested → ResultsRevealed",
          "Setup → Run → Done",
          "Create → Vote → Count",
        ],
        correctIndex: 1,
        explanation:
          "Because decryption is asynchronous in FHEVM, voting contracts need explicit phases: Voting (accepting encrypted ballots), DecryptionRequested (waiting for KMS), and ResultsRevealed (tallies are public). This is fundamentally different from standard Solidity where results are immediate.",
      },
    ],
  },
  {
    lessonId: "w3-l2",
    questions: [
      {
        id: "w3-l2-q1",
        question: "How do you find the maximum bid in a sealed-bid auction without revealing any bids?",
        options: [
          "Sort all bids and pick the largest",
          "Use FHE.select + FHE.gt to iteratively compare encrypted bids",
          "Decrypt all bids and compare off-chain",
          "Use a random selection",
        ],
        correctIndex: 1,
        explanation:
          "You iterate through all encrypted bids, using FHE.gt to compare each bid against the current maximum, and FHE.select to update the maximum. All comparisons happen in encrypted space — individual bid values are never revealed.",
      },
      {
        id: "w3-l2-q2",
        question: "In a sealed-bid auction, what happens to losing bids?",
        options: [
          "They are decrypted for the auctioneer",
          "They remain permanently encrypted — only the winning bid is revealed",
          "They are deleted from the blockchain",
          "They are revealed after a cooling period",
        ],
        correctIndex: 1,
        explanation:
          "Losing bids remain permanently encrypted. Only the winning bid amount is revealed via public decryption. This is a key privacy guarantee — losers' bid strategies are never exposed.",
      },
    ],
  },
  {
    lessonId: "w3-l3",
    questions: [
      {
        id: "w3-l3-q1",
        question: "What does a confidential token wrapper do?",
        options: [
          "Compresses tokens to reduce storage",
          "Locks standard ERC-20 tokens and mints encrypted equivalents for private transfers",
          "Converts tokens between different chains",
          "Wraps ETH into WETH",
        ],
        correctIndex: 1,
        explanation:
          "A confidential token wrapper accepts standard ERC-20 tokens, locks them in the contract, and mints encrypted equivalents (using euint64 balances). Users can then transfer these confidential tokens privately. Unwrapping decrypts and releases the original ERC-20 tokens.",
      },
      {
        id: "w3-l3-q2",
        question: "What standard defines confidential token wrappers in the Zama ecosystem?",
        options: [
          "ERC-20",
          "ERC-721",
          "ERC-7984",
          "EIP-1153",
        ],
        correctIndex: 2,
        explanation:
          "ERC-7984 is the confidential token standard that defines how to build wrappers that convert standard ERC-20 tokens into confidential equivalents with encrypted balances and private transfers.",
      },
    ],
  },
  {
    lessonId: "w3-l4",
    questions: [
      {
        id: "w3-l4-q1",
        question: "What does the Relayer SDK abstract away for frontend developers?",
        options: [
          "Smart contract compilation",
          "Gateway Chain interactions — clients only need a wallet on the host chain",
          "CSS styling",
          "Database management",
        ],
        correctIndex: 1,
        explanation:
          "The Relayer SDK (@zama-fhe/relayer-sdk) abstracts all Gateway Chain (Arbitrum rollup) interactions. Frontend developers only need a wallet connection on the host chain — the SDK handles encrypted input creation, decryption requests, and cross-chain coordination via HTTP calls.",
      },
      {
        id: "w3-l4-q2",
        question: "What is createEncryptedInput() used for in the browser?",
        options: [
          "Creating a new wallet",
          "Encrypting user inputs client-side with ZKPoK proofs before submitting to the contract",
          "Generating random numbers",
          "Connecting to MetaMask",
        ],
        correctIndex: 1,
        explanation:
          "createEncryptedInput() encrypts values in the browser and generates ZKPoK (Zero-Knowledge Proof of Knowledge) proofs. The encrypted data is bound to a specific contract address and user address, then submitted as transaction parameters.",
      },
    ],
  },

  // ── Week 4 ──
  {
    lessonId: "w4-l1",
    questions: [
      {
        id: "w4-l1-q1",
        question: "What is fhevm-contracts comparable to in the standard Solidity ecosystem?",
        options: [
          "Hardhat",
          "OpenZeppelin — audited, battle-tested contract templates",
          "Ethers.js",
          "Foundry",
        ],
        correctIndex: 1,
        explanation:
          "fhevm-contracts is the FHEVM equivalent of OpenZeppelin — a library of audited, production-ready contract templates. It includes ConfidentialERC20, governance contracts, vesting wallets, and more.",
      },
      {
        id: "w4-l1-q2",
        question: "What does the EncryptedErrors utility provide?",
        options: [
          "Better error messages in the console",
          "Error handling using encrypted error codes instead of revert strings",
          "Automatic bug fixing",
          "Error logging to a database",
        ],
        correctIndex: 1,
        explanation:
          "EncryptedErrors provides error handling with encrypted error codes. Since you can't use require() with encrypted conditions, EncryptedErrors lets you track error states as encrypted values that can be checked later without revealing failure details.",
      },
    ],
  },
  {
    lessonId: "w4-l2",
    questions: [
      {
        id: "w4-l2-q1",
        question: "Why is using require() with encrypted comparisons a vulnerability?",
        options: [
          "It costs too much gas",
          "It either won't compile (ebool != bool) or leaks information by revealing the comparison result via revert/success",
          "It's just bad style",
          "It creates infinite loops",
        ],
        correctIndex: 1,
        explanation:
          "Using require() with encrypted values is a critical mistake: FHE comparisons return ebool, not bool, so it won't compile. Even if you could, the revert/success outcome would leak whether the encrypted condition was true or false — destroying privacy.",
      },
      {
        id: "w4-l2-q2",
        question: "How can gas usage patterns leak information about encrypted values?",
        options: [
          "Gas is always constant for encrypted operations",
          "Different execution paths may consume different gas, revealing which branch was taken",
          "Gas patterns can't leak information",
          "Only miners can see gas patterns",
        ],
        correctIndex: 1,
        explanation:
          "If your contract has different code paths that consume different amounts of gas, an observer can infer which path was taken by looking at the gas used. This side-channel attack can reveal information about encrypted values. Use FHE.select to ensure both paths execute.",
      },
      {
        id: "w4-l2-q3",
        question: "Why is FHE.fromExternal() mandatory for external encrypted inputs?",
        options: [
          "It's a naming convention",
          "It validates the ZKPoK proof — without it, attackers could submit invalid ciphertexts",
          "It converts the type",
          "It saves gas",
        ],
        correctIndex: 1,
        explanation:
          "FHE.fromExternal() validates the ZKPoK proof attached to external encrypted inputs. Without this validation, an attacker could submit malformed ciphertexts that could cause undefined behavior or break the contract's invariants.",
      },
    ],
  },
  {
    lessonId: "w4-l3",
    questions: [
      {
        id: "w4-l3-q1",
        question: "Which gas optimization rule has the biggest impact?",
        options: [
          "Caching intermediate results",
          "Using the smallest encrypted type that fits (euint8 costs dramatically less than euint256)",
          "Minimizing function calls",
          "Using shorter variable names",
        ],
        correctIndex: 1,
        explanation:
          "Type size has the biggest impact on gas costs. FHE operations on euint8 are exponentially cheaper than euint256. Always analyze your value ranges and choose the smallest type that fits.",
      },
      {
        id: "w4-l3-q2",
        question: "What is the current FHE computation throughput, and where is it heading?",
        options: [
          "1 TPS now, 10 TPS with GPUs",
          "20 TPS (CPU) → 500-1000 TPS (GPU) → 100K+ TPS (ASIC)",
          "1000 TPS now, no improvement planned",
          "Same as regular EVM throughput",
        ],
        correctIndex: 1,
        explanation:
          "Current CPU-based FHE processes about 20 TPS. GPU acceleration will bring 500-1000 TPS, and future dedicated FHE ASICs target 100,000+ TPS. The performance roadmap shows dramatic improvements ahead.",
      },
    ],
  },
  {
    lessonId: "w4-l4",
    questions: [
      {
        id: "w4-l4-q1",
        question: "What is the ZAMA token used for in the protocol?",
        options: [
          "Only for paying gas fees",
          "Protocol fees, operator staking, and governance voting",
          "Buying NFTs",
          "Only for governance voting",
        ],
        correctIndex: 1,
        explanation:
          "The ZAMA token serves three purposes: paying protocol fees (ZKPoK verification, decryption, bridging), staking for coprocessor and KMS operators, and governance voting on protocol parameters.",
      },
      {
        id: "w4-l4-q2",
        question: "What is the planned timeline for Zama Protocol multi-chain expansion?",
        options: [
          "Already live on all chains",
          "Ethereum → other EVM chains (H1 2026) → Solana (H2 2026)",
          "Only Ethereum, no expansion planned",
          "Solana first, then Ethereum",
        ],
        correctIndex: 1,
        explanation:
          "Zama Protocol launched on Ethereum first, with expansion to other EVM chains planned for H1 2026 and Solana support targeted for H2 2026. The architecture supports multi-chain through the Gateway on Arbitrum.",
      },
    ],
  },
];

export function getQuizForLesson(lessonId: string): LessonQuiz | undefined {
  return QUIZZES.find((q) => q.lessonId === lessonId);
}
