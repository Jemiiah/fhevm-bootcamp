export interface Challenge {
  id: string;
  weekNumber: number;
  title: string;
  difficulty: "Starter" | "Easy" | "Medium" | "Hard";
  description: string;
  instructions: string[];
  hints: string[];
  starterCode: string;
  testCode: string;
  solutionCode: string;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  type: "contains" | "notContains" | "compiles" | "regex";
  value: string;
  message: string;
  points: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export const CHALLENGES: Challenge[] = [
  // ── Week 1 Challenges ──
  {
    id: "w1-c1",
    weekNumber: 1,
    title: "Hello Encrypted World",
    difficulty: "Starter",
    description:
      "Your first FHEVM contract! Create a contract that stores a single encrypted unsigned integer and allows reading it. This introduces the basic pattern: import FHE, declare an encrypted variable, and set up permissions.",
    instructions: [
      "Import the FHE library from @fhevm/solidity",
      "Inherit from ZamaEthereumConfig",
      "Declare a state variable of type euint32 called 'secretValue'",
      "Create a constructor that initializes secretValue to an encrypted 42 using FHE.asEuint32(42)",
      "Call FHE.allowThis() on secretValue so the contract can reuse it",
      "Create a getSecret() function that returns the euint32 handle",
    ],
    hints: [
      "Remember: FHE.asEuint32(42) converts a plaintext number to an encrypted value",
      "FHE.allowThis(secretValue) must be called after any assignment to an encrypted variable",
      "The return type of getSecret() should be euint32",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Import FHE library
// TODO: Import ZamaEthereumConfig

contract HelloEncrypted /* TODO: inherit ZamaEthereumConfig */ {
    // TODO: Declare an encrypted uint32 state variable called 'secretValue'

    constructor() {
        // TODO: Initialize secretValue to encrypted 42
        // TODO: Allow this contract to reuse the handle
    }

    function getSecret() public view returns (/* TODO: return type */) {
        // TODO: Return the encrypted value
    }
}`,
    testCode: `// Test Suite — Read Only
// These tests validate your HelloEncrypted contract

describe("HelloEncrypted", function () {
  it("should compile without errors", function () {
    // ✓ Contract compiles with correct FHE imports
    assert(compiled === true, "Contract must compile");
  });

  it("should inherit ZamaEthereumConfig", function () {
    // ✓ Contract inherits from ZamaEthereumConfig
    assert(hasInheritance("ZamaEthereumConfig"));
  });

  it("should declare euint32 secretValue", function () {
    // ✓ State variable is encrypted type
    assert(hasStateVar("euint32", "secretValue"));
  });

  it("should call FHE.allowThis in constructor", function () {
    // ✓ Contract grants itself permission to reuse handle
    assert(containsCall("FHE.allowThis"));
  });

  it("should have getSecret() returning euint32", function () {
    // ✓ Getter function returns encrypted handle
    assert(hasFunction("getSecret", "euint32"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract HelloEncrypted is ZamaEthereumConfig {
    euint32 private secretValue;

    constructor() {
        secretValue = FHE.asEuint32(42);
        FHE.allowThis(secretValue);
    }

    function getSecret() public view returns (euint32) {
        return secretValue;
    }
}`,
    validationRules: [
      { type: "contains", value: "import", message: "Missing FHE import statement", points: 10 },
      { type: "contains", value: "FHE", message: "Must use the FHE library", points: 10 },
      { type: "contains", value: "ZamaEthereumConfig", message: "Must inherit ZamaEthereumConfig", points: 15 },
      { type: "contains", value: "euint32", message: "Must use euint32 encrypted type", points: 15 },
      { type: "contains", value: "FHE.asEuint32", message: "Must encrypt value with FHE.asEuint32()", points: 20 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() for contract self-access", points: 20 },
      { type: "contains", value: "getSecret", message: "Must implement getSecret() function", points: 10 },
    ],
  },
  {
    id: "w1-c2",
    weekNumber: 1,
    title: "Encrypted Counter",
    difficulty: "Easy",
    description:
      "Build an encrypted counter contract. Users can increment and decrement the counter, but the actual count value remains encrypted. Only authorized users can view the count.",
    instructions: [
      "Create an encrypted euint32 counter initialized to 0",
      "Implement increment() that adds 1 to the counter using FHE.add()",
      "Implement decrement() that subtracts 1 using FHE.sub()",
      "After each update, call FHE.allowThis() on the new counter value",
      "Implement getCount() to return the encrypted counter handle",
      "In getCount(), call FHE.allow(counter, msg.sender) so the caller can decrypt",
    ],
    hints: [
      "Use FHE.add(counter, 1) for scalar addition — it's cheaper than encrypting the 1",
      "Remember to call FHE.allowThis() after EVERY reassignment of the counter",
      "FHE.allow(counter, msg.sender) in the getter grants the caller read access",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract EncryptedCounter is ZamaEthereumConfig {
    // TODO: Declare encrypted counter

    constructor() {
        // TODO: Initialize counter to encrypted 0
        // TODO: Allow contract to reuse handle
    }

    function increment() public {
        // TODO: Add 1 to counter
        // TODO: Allow contract to reuse new handle
    }

    function decrement() public {
        // TODO: Subtract 1 from counter
        // TODO: Allow contract to reuse new handle
    }

    function getCount() public returns (euint32) {
        // TODO: Grant caller permission to decrypt
        // TODO: Return counter
    }
}`,
    testCode: `describe("EncryptedCounter", function () {
  it("should compile without errors", function () {
    assert(compiled === true);
  });

  it("should use FHE.add for increment", function () {
    assert(containsCall("FHE.add"));
  });

  it("should use FHE.sub for decrement", function () {
    assert(containsCall("FHE.sub"));
  });

  it("should call FHE.allowThis after each update", function () {
    // Must appear in both increment and decrement
    assert(countOccurrences("FHE.allowThis") >= 3);
  });

  it("should call FHE.allow for msg.sender in getCount", function () {
    assert(containsCall("FHE.allow"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract EncryptedCounter is ZamaEthereumConfig {
    euint32 private counter;

    constructor() {
        counter = FHE.asEuint32(0);
        FHE.allowThis(counter);
    }

    function increment() public {
        counter = FHE.add(counter, 1);
        FHE.allowThis(counter);
    }

    function decrement() public {
        counter = FHE.sub(counter, 1);
        FHE.allowThis(counter);
    }

    function getCount() public returns (euint32) {
        FHE.allow(counter, msg.sender);
        return counter;
    }
}`,
    validationRules: [
      { type: "contains", value: "euint32", message: "Must declare an euint32 counter", points: 10 },
      { type: "contains", value: "FHE.add", message: "Must use FHE.add() for increment", points: 20 },
      { type: "contains", value: "FHE.sub", message: "Must use FHE.sub() for decrement", points: 20 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() after updates", points: 20 },
      { type: "contains", value: "FHE.allow", message: "Must grant caller permission with FHE.allow()", points: 20 },
      { type: "notContains", value: "TFHE", message: "Do not use deprecated TFHE library — use FHE", points: 10 },
    ],
  },
  {
    id: "w1-c3",
    weekNumber: 1,
    title: "Encrypted Input Handling",
    difficulty: "Easy",
    description:
      "Learn to accept encrypted inputs from users. Build a contract that lets users store a personal encrypted number. Each user has their own private encrypted value that only they can read.",
    instructions: [
      "Create a mapping from address to euint32 for user values",
      "Implement storeValue(externalEuint32 encValue, bytes calldata inputProof) that accepts encrypted input",
      "Use FHE.fromExternal() to validate and convert the external input",
      "Store the result and set proper permissions (allowThis + allow for sender)",
      "Implement getMyValue() that returns the caller's encrypted value",
    ],
    hints: [
      "externalEuint32 is the input type — FHE.fromExternal() converts it to euint32",
      "The inputProof contains the ZKPoK proof that the encrypted value is valid",
      "Always validate external inputs with FHE.fromExternal() — never skip this step",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract PersonalVault is ZamaEthereumConfig {
    // TODO: Mapping from address to encrypted value

    function storeValue(
        externalEuint32 encValue,
        bytes calldata inputProof
    ) public {
        // TODO: Validate and convert the external encrypted input
        // TODO: Store in mapping
        // TODO: Set permissions
    }

    function getMyValue() public view returns (euint32) {
        // TODO: Return caller's encrypted value
    }
}`,
    testCode: `describe("PersonalVault", function () {
  it("should compile without errors", function () {
    assert(compiled === true);
  });

  it("should use FHE.fromExternal for input validation", function () {
    assert(containsCall("FHE.fromExternal"));
  });

  it("should use a mapping for per-user storage", function () {
    assert(contains("mapping"));
  });

  it("should set FHE.allowThis on stored values", function () {
    assert(containsCall("FHE.allowThis"));
  });

  it("should grant sender permission with FHE.allow", function () {
    assert(containsCall("FHE.allow"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract PersonalVault is ZamaEthereumConfig {
    mapping(address => euint32) private values;

    function storeValue(
        externalEuint32 encValue,
        bytes calldata inputProof
    ) public {
        euint32 value = FHE.fromExternal(encValue, inputProof);
        values[msg.sender] = value;
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);
    }

    function getMyValue() public view returns (euint32) {
        return values[msg.sender];
    }
}`,
    validationRules: [
      { type: "contains", value: "mapping", message: "Must use a mapping for per-user storage", points: 15 },
      { type: "contains", value: "externalEuint32", message: "Must accept externalEuint32 input", points: 15 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate input with FHE.fromExternal()", points: 25 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() on stored value", points: 20 },
      { type: "contains", value: "FHE.allow", message: "Must grant sender permission with FHE.allow()", points: 15 },
      { type: "contains", value: "msg.sender", message: "Must use msg.sender for user-specific storage", points: 10 },
    ],
  },
  {
    id: "w1-c4",
    weekNumber: 1,
    title: "Confidential Vault — Deposit",
    difficulty: "Medium",
    description:
      "Build the deposit function of a confidential vault. Users deposit encrypted amounts that get added to their encrypted balance. No one can see individual balances — not even the contract deployer.",
    instructions: [
      "Create a mapping(address => euint64) for user balances",
      "Implement deposit(externalEuint64 amount, bytes calldata inputProof)",
      "Convert the external input with FHE.fromExternal()",
      "Check if the user has an existing balance using FHE.isInitialized()",
      "If initialized: add to existing balance with FHE.add(). If not: set directly",
      "Set permissions: FHE.allowThis() and FHE.allow() for the depositor",
      "Implement getBalance() that returns the caller's encrypted balance",
    ],
    hints: [
      "Use euint64 (not euint32) for balances — larger range for token amounts",
      "FHE.isInitialized(balances[msg.sender]) returns true if the balance has been set before",
      "For the first deposit, just assign. For subsequent deposits, use FHE.add()",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function deposit(
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        // TODO: Validate external input
        // TODO: Check if balance is initialized
        // TODO: Add to balance or set initial balance
        // TODO: Set permissions
    }

    function getBalance() public returns (euint64) {
        // TODO: Grant caller permission and return balance
    }
}`,
    testCode: `describe("ConfidentialVault — Deposit", function () {
  it("should compile without errors", function () {
    assert(compiled === true);
  });

  it("should validate external input", function () {
    assert(containsCall("FHE.fromExternal"));
  });

  it("should check if balance is initialized", function () {
    assert(containsCall("FHE.isInitialized"));
  });

  it("should use FHE.add for accumulating deposits", function () {
    assert(containsCall("FHE.add"));
  });

  it("should set proper permissions", function () {
    assert(containsCall("FHE.allowThis"));
    assert(containsCall("FHE.allow"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function deposit(
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        euint64 encAmount = FHE.fromExternal(amount, inputProof);

        if (FHE.isInitialized(balances[msg.sender])) {
            balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        } else {
            balances[msg.sender] = encAmount;
        }

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function getBalance() public returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    validationRules: [
      { type: "contains", value: "euint64", message: "Must use euint64 for balances", points: 10 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate input with FHE.fromExternal()", points: 20 },
      { type: "contains", value: "FHE.isInitialized", message: "Must check if balance is initialized", points: 15 },
      { type: "contains", value: "FHE.add", message: "Must use FHE.add() to accumulate deposits", points: 20 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() on updated balance", points: 15 },
      { type: "contains", value: "FHE.allow", message: "Must grant sender permission with FHE.allow()", points: 10 },
      { type: "notContains", value: "require", message: "Avoid require() on encrypted values — use FHE.select", points: 10 },
    ],
  },
  {
    id: "w1-c5",
    weekNumber: 1,
    title: "Confidential Vault — Withdraw with Underflow Protection",
    difficulty: "Medium",
    description:
      "Add withdrawal functionality with encrypted underflow protection. The key FHEVM pattern: you CANNOT use require() to check if balance >= amount because both are encrypted. Instead, use FHE.select to make the withdrawal a no-op when insufficient.",
    instructions: [
      "Add a withdraw function that accepts an encrypted withdrawal amount",
      "Use FHE.ge(balance, amount) to check if balance >= amount (returns ebool)",
      "Use FHE.select(hasEnough, amount, FHE.asEuint64(0)) to get the actual withdrawal amount",
      "Subtract the actual amount from the balance",
      "Set proper permissions on the updated balance",
    ],
    hints: [
      "FHE.ge() returns ebool — you CANNOT use it in an if/else or require()",
      "FHE.select(condition, valueIfTrue, valueIfFalse) is the encrypted ternary operator",
      "If balance < amount, actualAmount becomes 0, so nothing is subtracted",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    // Assume deposit() already works (from previous challenge)

    function withdraw(
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        euint64 encAmount = FHE.fromExternal(amount, inputProof);

        // TODO: Check if balance >= withdrawal amount (encrypted comparison)
        // TODO: Use FHE.select to set actual withdrawal to 0 if insufficient
        // TODO: Subtract actual amount from balance
        // TODO: Set permissions on updated balance
    }

    function getBalance() public returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    testCode: `describe("ConfidentialVault — Withdraw", function () {
  it("should compile without errors", function () {
    assert(compiled === true);
  });

  it("should use FHE.ge for encrypted comparison", function () {
    assert(containsCall("FHE.ge"));
  });

  it("should use FHE.select for conditional withdrawal", function () {
    assert(containsCall("FHE.select"));
  });

  it("should use FHE.sub to deduct from balance", function () {
    assert(containsCall("FHE.sub"));
  });

  it("should NOT use require() on encrypted values", function () {
    assert(notContains("require("));
  });

  it("should set permissions after update", function () {
    assert(containsCall("FHE.allowThis"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function withdraw(
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        euint64 encAmount = FHE.fromExternal(amount, inputProof);

        ebool hasEnough = FHE.ge(balances[msg.sender], encAmount);
        euint64 actualAmount = FHE.select(hasEnough, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function getBalance() public returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.ge", message: "Must use FHE.ge() for encrypted balance comparison", points: 20 },
      { type: "contains", value: "FHE.select", message: "Must use FHE.select() for conditional logic", points: 25 },
      { type: "contains", value: "FHE.sub", message: "Must use FHE.sub() to deduct from balance", points: 15 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() on updated balance", points: 15 },
      { type: "notContains", value: "require(", message: "NEVER use require() on encrypted values", points: 15 },
      { type: "contains", value: "ebool", message: "Must use ebool for the comparison result", points: 10 },
    ],
  },

  // ── Week 2 Challenges ──
  {
    id: "w2-c1",
    weekNumber: 2,
    title: "Encrypted Type Casting",
    difficulty: "Easy",
    description:
      "Practice converting between encrypted types. Build a contract that demonstrates type casting, showing how to move between euint8, euint32, euint64, and ebool.",
    instructions: [
      "Create a function castUp(externalEuint8, bytes) that converts euint8 to euint32 and euint64",
      "Use FHE.asEuint32() and FHE.asEuint64() for upcasting",
      "Create a function isNonZero(externalEuint32, bytes) that returns ebool",
      "Use FHE.ne(value, 0) to check if value != 0",
      "Store results and set proper permissions",
    ],
    hints: [
      "FHE.asEuint32(euint8Value) upcasts a euint8 to euint32",
      "FHE.ne(value, 0) returns an encrypted boolean (ebool)",
      "Always use the smallest type that fits your data for gas efficiency",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, euint64, ebool, externalEuint8, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract TypeCaster is ZamaEthereumConfig {
    euint32 public result32;
    euint64 public result64;
    ebool public isNonZeroResult;

    function castUp(
        externalEuint8 input,
        bytes calldata proof
    ) public {
        // TODO: Convert external input to euint8
        // TODO: Cast euint8 to euint32 and store
        // TODO: Cast euint8 to euint64 and store
        // TODO: Set permissions
    }

    function checkNonZero(
        externalEuint32 input,
        bytes calldata proof
    ) public {
        // TODO: Convert external input
        // TODO: Check if value != 0 using FHE.ne
        // TODO: Store the ebool result
        // TODO: Set permissions
    }
}`,
    testCode: `describe("TypeCaster", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.asEuint32 for upcasting", function () { assert(containsCall("FHE.asEuint32")); });
  it("should use FHE.asEuint64 for upcasting", function () { assert(containsCall("FHE.asEuint64")); });
  it("should use FHE.ne for non-zero check", function () { assert(containsCall("FHE.ne")); });
  it("should call FHE.allowThis on results", function () { assert(countOccurrences("FHE.allowThis") >= 3); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, euint64, ebool, externalEuint8, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract TypeCaster is ZamaEthereumConfig {
    euint32 public result32;
    euint64 public result64;
    ebool public isNonZeroResult;

    function castUp(
        externalEuint8 input,
        bytes calldata proof
    ) public {
        euint8 val = FHE.fromExternal(input, proof);
        result32 = FHE.asEuint32(val);
        result64 = FHE.asEuint64(val);
        FHE.allowThis(result32);
        FHE.allowThis(result64);
    }

    function checkNonZero(
        externalEuint32 input,
        bytes calldata proof
    ) public {
        euint32 val = FHE.fromExternal(input, proof);
        isNonZeroResult = FHE.ne(val, 0);
        FHE.allowThis(isNonZeroResult);
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.asEuint32", message: "Must use FHE.asEuint32() for upcasting", points: 20 },
      { type: "contains", value: "FHE.asEuint64", message: "Must use FHE.asEuint64() for upcasting", points: 20 },
      { type: "contains", value: "FHE.ne", message: "Must use FHE.ne() for non-zero check", points: 20 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate all external inputs", points: 20 },
      { type: "contains", value: "FHE.allowThis", message: "Must set permissions on results", points: 20 },
    ],
  },
  {
    id: "w2-c2",
    weekNumber: 2,
    title: "Encrypted Arithmetic Operations",
    difficulty: "Easy",
    description:
      "Master all FHE arithmetic operations by building a calculator contract. Practice add, sub, mul, min, max, and the critical scalar optimization pattern.",
    instructions: [
      "Store two encrypted euint32 values: valueA and valueB",
      "Implement setValues() that accepts two encrypted inputs",
      "Implement computeSum() — returns FHE.add(valueA, valueB)",
      "Implement computeProduct() — returns FHE.mul(valueA, valueB)",
      "Implement computeMin() — returns FHE.min(valueA, valueB)",
      "Implement doubleA() — returns FHE.mul(valueA, 2) using SCALAR operand for gas savings",
    ],
    hints: [
      "FHE.mul(valueA, 2) is cheaper than FHE.mul(valueA, FHE.asEuint32(2))",
      "This is the scalar optimization — always use plaintext when one operand is known",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract EncryptedCalc is ZamaEthereumConfig {
    euint32 private valueA;
    euint32 private valueB;

    function setValues(
        externalEuint32 a, bytes calldata proofA,
        externalEuint32 b, bytes calldata proofB
    ) public {
        // TODO: Convert and store both values
        // TODO: Set permissions
    }

    function computeSum() public returns (euint32) {
        // TODO: Return encrypted sum
    }

    function computeProduct() public returns (euint32) {
        // TODO: Return encrypted product
    }

    function computeMin() public returns (euint32) {
        // TODO: Return encrypted minimum
    }

    function doubleA() public returns (euint32) {
        // TODO: Return valueA * 2 using SCALAR operand
    }
}`,
    testCode: `describe("EncryptedCalc", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.add", function () { assert(containsCall("FHE.add")); });
  it("should use FHE.mul", function () { assert(containsCall("FHE.mul")); });
  it("should use FHE.min", function () { assert(containsCall("FHE.min")); });
  it("should use scalar operand for doubleA (gas optimization)", function () {
    assert(contains("FHE.mul(valueA, 2)") || contains("FHE.mul(valueA,2)"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract EncryptedCalc is ZamaEthereumConfig {
    euint32 private valueA;
    euint32 private valueB;

    function setValues(
        externalEuint32 a, bytes calldata proofA,
        externalEuint32 b, bytes calldata proofB
    ) public {
        valueA = FHE.fromExternal(a, proofA);
        valueB = FHE.fromExternal(b, proofB);
        FHE.allowThis(valueA);
        FHE.allowThis(valueB);
    }

    function computeSum() public returns (euint32) {
        euint32 result = FHE.add(valueA, valueB);
        FHE.allow(result, msg.sender);
        return result;
    }

    function computeProduct() public returns (euint32) {
        euint32 result = FHE.mul(valueA, valueB);
        FHE.allow(result, msg.sender);
        return result;
    }

    function computeMin() public returns (euint32) {
        euint32 result = FHE.min(valueA, valueB);
        FHE.allow(result, msg.sender);
        return result;
    }

    function doubleA() public returns (euint32) {
        euint32 result = FHE.mul(valueA, 2);
        FHE.allow(result, msg.sender);
        return result;
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.add", message: "Must use FHE.add()", points: 15 },
      { type: "contains", value: "FHE.mul", message: "Must use FHE.mul()", points: 15 },
      { type: "contains", value: "FHE.min", message: "Must use FHE.min()", points: 15 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate external inputs", points: 15 },
      { type: "regex", value: "FHE\\.mul\\(valueA,\\s*2\\)", message: "doubleA should use scalar operand: FHE.mul(valueA, 2)", points: 20 },
      { type: "contains", value: "FHE.allowThis", message: "Must set permissions on stored values", points: 10 },
      { type: "contains", value: "FHE.allow", message: "Must grant caller permissions on results", points: 10 },
    ],
  },
  {
    id: "w2-c3",
    weekNumber: 2,
    title: "Confidential Transfer with FHE.select",
    difficulty: "Medium",
    description:
      "Build the core transfer logic for a confidential token. The critical pattern: when balance < amount, the transfer becomes a no-op (transfers 0) instead of reverting. This is THE most important FHEVM pattern.",
    instructions: [
      "Create a mapping(address => euint64) for balances",
      "Implement transfer(address to, externalEuint64 amount, bytes proof)",
      "Check if sender has sufficient balance: FHE.le(encAmount, balances[sender])",
      "Use FHE.select to set actual transfer amount to 0 if insufficient",
      "Subtract from sender, add to receiver",
      "Set permissions for both sender and receiver on their new balances",
    ],
    hints: [
      "FHE.le(amount, balance) checks amount <= balance, returns ebool",
      "FHE.select(sufficient, amount, FHE.asEuint64(0)) — if not sufficient, transfer 0",
      "Both sender and receiver balances need FHE.allowThis() + FHE.allow()",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    // Assume mint() already exists for testing

    function transfer(
        address to,
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        euint64 encAmount = FHE.fromExternal(amount, inputProof);

        // TODO: Check if sender has enough balance
        // TODO: Use FHE.select for actual transfer amount (0 if insufficient)
        // TODO: Subtract from sender
        // TODO: Add to receiver (handle uninitialized receiver balance)
        // TODO: Set permissions for both parties
    }
}`,
    testCode: `describe("ConfidentialToken Transfer", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.le or FHE.ge for balance check", function () {
    assert(containsCall("FHE.le") || containsCall("FHE.ge"));
  });
  it("should use FHE.select for conditional transfer", function () {
    assert(containsCall("FHE.select"));
  });
  it("should use FHE.sub for sender deduction", function () {
    assert(containsCall("FHE.sub"));
  });
  it("should use FHE.add for receiver credit", function () {
    assert(containsCall("FHE.add"));
  });
  it("should NOT use require() on encrypted values", function () {
    assert(notContains("require("));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ConfidentialToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function transfer(
        address to,
        externalEuint64 amount,
        bytes calldata inputProof
    ) public {
        euint64 encAmount = FHE.fromExternal(amount, inputProof);

        ebool sufficient = FHE.le(encAmount, balances[msg.sender]);
        euint64 actualAmount = FHE.select(sufficient, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        if (FHE.isInitialized(balances[to])) {
            balances[to] = FHE.add(balances[to], actualAmount);
        } else {
            balances[to] = actualAmount;
        }
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.select", message: "Must use FHE.select() for conditional transfer", points: 25 },
      { type: "regex", value: "FHE\\.(le|ge)", message: "Must use FHE.le() or FHE.ge() for balance check", points: 20 },
      { type: "contains", value: "FHE.sub", message: "Must use FHE.sub() for sender deduction", points: 10 },
      { type: "contains", value: "FHE.add", message: "Must use FHE.add() for receiver credit", points: 10 },
      { type: "notContains", value: "require(", message: "NEVER use require() on encrypted values", points: 15 },
      { type: "contains", value: "FHE.allowThis", message: "Must set FHE.allowThis on both balances", points: 10 },
      { type: "contains", value: "FHE.allow", message: "Must grant permissions to both parties", points: 10 },
    ],
  },
  {
    id: "w2-c4",
    weekNumber: 2,
    title: "ACL Permission Patterns",
    difficulty: "Medium",
    description:
      "Master all three ACL tiers: persistent (FHE.allow), transient (FHE.allowTransient), and public (FHE.makePubliclyDecryptable). Build a contract that demonstrates each pattern.",
    instructions: [
      "Store a private encrypted value (euint32) — accessible only to specific addresses",
      "Store a shared encrypted value (euint32) — temporarily accessible during a transaction",
      "Store a public encrypted value (euint32) — permanently accessible to everyone",
      "Implement setPrivate() using FHE.allow() for persistent per-address access",
      "Implement processShared() using FHE.allowTransient() for one-tx-only access",
      "Implement publishResult() using FHE.makePubliclyDecryptable() for global access",
    ],
    hints: [
      "FHE.allow() = permanent. FHE.allowTransient() = this transaction only (EIP-1153). FHE.makePubliclyDecryptable() = everyone forever.",
      "Use allowTransient when another contract needs temporary read access within the same transaction",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ACLDemo is ZamaEthereumConfig {
    euint32 private privateValue;
    euint32 private sharedValue;
    euint32 private publicValue;

    function setPrivate(uint32 val, address reader) public {
        // TODO: Encrypt value, grant persistent access to 'reader' only
    }

    function processShared(uint32 val, address tempReader) public {
        // TODO: Encrypt value, grant transient access to 'tempReader'
    }

    function publishResult(uint32 val) public {
        // TODO: Encrypt value, make it publicly decryptable by anyone
    }
}`,
    testCode: `describe("ACLDemo", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.allow for persistent access", function () { assert(containsCall("FHE.allow")); });
  it("should use FHE.allowTransient for temporary access", function () { assert(containsCall("FHE.allowTransient")); });
  it("should use FHE.makePubliclyDecryptable for public access", function () { assert(containsCall("FHE.makePubliclyDecryptable")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/lib/ZamaEthereumConfig.sol";

contract ACLDemo is ZamaEthereumConfig {
    euint32 private privateValue;
    euint32 private sharedValue;
    euint32 private publicValue;

    function setPrivate(uint32 val, address reader) public {
        privateValue = FHE.asEuint32(val);
        FHE.allowThis(privateValue);
        FHE.allow(privateValue, reader);
    }

    function processShared(uint32 val, address tempReader) public {
        sharedValue = FHE.asEuint32(val);
        FHE.allowThis(sharedValue);
        FHE.allowTransient(sharedValue, tempReader);
    }

    function publishResult(uint32 val) public {
        publicValue = FHE.asEuint32(val);
        FHE.allowThis(publicValue);
        FHE.makePubliclyDecryptable(publicValue);
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.allow(", message: "Must use FHE.allow() for persistent access", points: 25 },
      { type: "contains", value: "FHE.allowTransient", message: "Must use FHE.allowTransient() for transient access", points: 25 },
      { type: "contains", value: "FHE.makePubliclyDecryptable", message: "Must use FHE.makePubliclyDecryptable()", points: 25 },
      { type: "contains", value: "FHE.allowThis", message: "Must call FHE.allowThis() on all stored values", points: 15 },
      { type: "contains", value: "FHE.asEuint32", message: "Must encrypt plaintext values", points: 10 },
    ],
  },

  // ── Week 3 Challenges ──
  {
    id: "w3-c1",
    weekNumber: 3,
    title: "Confidential Voting — Basic",
    difficulty: "Medium",
    description:
      "Build a confidential voting contract where votes are encrypted. No one can see individual votes — only the final tally is revealed after voting ends. This is the core pattern for any privacy-preserving governance system.",
    instructions: [
      "Create encrypted euint64 vote counters for 'yesVotes' and 'noVotes'",
      "Create a mapping(address => bool) public hasVoted to track who has voted",
      "Implement vote(externalEbool encSupport, bytes calldata proof) that accepts an encrypted vote",
      "Use FHE.select to add 1 to yesVotes if support is true, else add 1 to noVotes",
      "Update BOTH counters on every vote to prevent gas side-channel attacks",
      "Implement requestReveal() that calls FHE.makePubliclyDecryptable on both counters",
    ],
    hints: [
      "Import ebool and externalEbool for encrypted boolean input",
      "FHE.select(support, FHE.asEuint64(1), FHE.asEuint64(0)) gives 1 if yes, 0 if no",
      "Always update BOTH counters — if only one updates per vote, gas differences leak the vote direction",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialVoting is ZamaEthereumConfig {
    // TODO: Declare encrypted vote counters
    // TODO: Track who has voted

    constructor() {
        // TODO: Initialize counters to encrypted 0
        // TODO: Set permissions
    }

    function vote(externalEbool encSupport, bytes calldata proof) external {
        // TODO: Check hasn't voted
        // TODO: Validate encrypted input
        // TODO: Update BOTH counters using FHE.select
        // TODO: Set permissions
    }

    function requestReveal() external {
        // TODO: Make both counters publicly decryptable
    }
}`,
    testCode: `describe("ConfidentialVoting", function () {
  it("should compile", function () { assert(compiled); });
  it("should use externalEbool for vote input", function () { assert(contains("externalEbool")); });
  it("should use FHE.fromExternal for vote validation", function () { assert(containsCall("FHE.fromExternal")); });
  it("should use FHE.select for conditional counting", function () { assert(containsCall("FHE.select")); });
  it("should update both counters (no gas side-channel)", function () {
    assert(countOccurrences("FHE.add") >= 2);
  });
  it("should use FHE.makePubliclyDecryptable for reveal", function () { assert(containsCall("FHE.makePubliclyDecryptable")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialVoting is ZamaEthereumConfig {
    euint64 private yesVotes;
    euint64 private noVotes;
    mapping(address => bool) public hasVoted;

    constructor() {
        yesVotes = FHE.asEuint64(0);
        noVotes = FHE.asEuint64(0);
        FHE.allowThis(yesVotes);
        FHE.allowThis(noVotes);
    }

    function vote(externalEbool encSupport, bytes calldata proof) external {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        ebool support = FHE.fromExternal(encSupport, proof);

        yesVotes = FHE.add(yesVotes, FHE.select(support, FHE.asEuint64(1), FHE.asEuint64(0)));
        noVotes = FHE.add(noVotes, FHE.select(support, FHE.asEuint64(0), FHE.asEuint64(1)));
        FHE.allowThis(yesVotes);
        FHE.allowThis(noVotes);
    }

    function requestReveal() external {
        FHE.makePubliclyDecryptable(yesVotes);
        FHE.makePubliclyDecryptable(noVotes);
    }
}`,
    validationRules: [
      { type: "contains", value: "externalEbool", message: "Must accept externalEbool vote input", points: 10 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate vote with FHE.fromExternal()", points: 15 },
      { type: "contains", value: "FHE.select", message: "Must use FHE.select for conditional counting", points: 25 },
      { type: "regex", value: "FHE\\.add.*FHE\\.add", message: "Must update BOTH counters to prevent gas side-channel", points: 20 },
      { type: "contains", value: "FHE.makePubliclyDecryptable", message: "Must use FHE.makePubliclyDecryptable for reveal", points: 15 },
      { type: "contains", value: "hasVoted", message: "Must track who has voted", points: 15 },
    ],
  },
  {
    id: "w3-c2",
    weekNumber: 3,
    title: "Sealed-Bid Auction",
    difficulty: "Medium",
    description:
      "Build a sealed-bid auction where bid amounts are encrypted. No one can see any bid until the auction ends, when only the winning bid is revealed. Losing bids remain permanently secret.",
    instructions: [
      "Store the highest bid as euint64 and highest bidder tracking",
      "Implement bid(externalEuint64, bytes) that accepts encrypted bids",
      "Use FHE.gt to compare new bid against current highest",
      "Use FHE.select to update highest bid and track the winner",
      "Implement closeBidding() that reveals only the winning bid via FHE.makePubliclyDecryptable",
      "Each bidder should be able to see their own bid via FHE.allow",
    ],
    hints: [
      "Use eaddress to track the highest bidder in encrypted form",
      "FHE.asEaddress(msg.sender) converts an address to encrypted eaddress",
      "FHE.select works with eaddress too — FHE.select(isHigher, newBidder, currentHighest)",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, eaddress, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract SealedBidAuction is ZamaEthereumConfig {
    euint64 private highestBid;
    // TODO: Track highest bidder
    mapping(address => euint64) private bids;
    bool public biddingOpen;

    constructor() {
        biddingOpen = true;
        // TODO: Initialize highest bid to 0
        // TODO: Set permissions
    }

    function bid(externalEuint64 encBid, bytes calldata proof) external {
        require(biddingOpen, "Bidding closed");
        // TODO: Validate input
        // TODO: Store bidder's bid
        // TODO: Compare with highest using FHE.gt
        // TODO: Update highest bid and bidder using FHE.select
        // TODO: Set permissions
    }

    function closeBidding() external {
        biddingOpen = false;
        // TODO: Reveal only the winning bid
    }
}`,
    testCode: `describe("SealedBidAuction", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.gt for bid comparison", function () { assert(containsCall("FHE.gt")); });
  it("should use FHE.select for conditional update", function () { assert(containsCall("FHE.select")); });
  it("should use FHE.makePubliclyDecryptable to reveal winner", function () { assert(containsCall("FHE.makePubliclyDecryptable")); });
  it("should track bids per address", function () { assert(contains("mapping")); });
  it("should allow bidders to see their own bid", function () { assert(containsCall("FHE.allow")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, eaddress, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract SealedBidAuction is ZamaEthereumConfig {
    euint64 private highestBid;
    eaddress private highestBidder;
    mapping(address => euint64) private bids;
    bool public biddingOpen;

    constructor() {
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
        FHE.allow(bidAmount, msg.sender);

        ebool isHigher = FHE.gt(bidAmount, highestBid);
        highestBid = FHE.select(isHigher, bidAmount, highestBid);
        highestBidder = FHE.select(isHigher, FHE.asEaddress(msg.sender), highestBidder);
        FHE.allowThis(highestBid);
        FHE.allowThis(highestBidder);
    }

    function closeBidding() external {
        biddingOpen = false;
        FHE.makePubliclyDecryptable(highestBid);
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.gt", message: "Must use FHE.gt() for bid comparison", points: 20 },
      { type: "contains", value: "FHE.select", message: "Must use FHE.select() for conditional update", points: 20 },
      { type: "contains", value: "FHE.makePubliclyDecryptable", message: "Must reveal winning bid", points: 15 },
      { type: "contains", value: "eaddress", message: "Should track highest bidder with eaddress", points: 15 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate bid input", points: 15 },
      { type: "contains", value: "FHE.allow", message: "Must allow bidders to see their own bid", points: 15 },
    ],
  },
  {
    id: "w3-c3",
    weekNumber: 3,
    title: "Confidential Token Wrapper",
    difficulty: "Medium",
    description:
      "Build a token wrapper that converts plaintext ERC-20 deposits into encrypted balances. Users deposit public tokens and receive a confidential balance. They can then transfer confidentially between wrapped holders.",
    instructions: [
      "Create a mapping(address => euint64) for encrypted balances",
      "Implement wrap(uint64 amount) that creates an encrypted balance from a plaintext deposit",
      "Handle both first-time wrapping and adding to existing balances using FHE.isInitialized",
      "Implement confidentialTransfer(address to, externalEuint64 amount, bytes proof) with the no-op pattern",
      "Set proper permissions on all balance updates",
    ],
    hints: [
      "FHE.isInitialized(balances[addr]) returns true if the balance was ever set",
      "For first-time wrap: assign directly. For subsequent: FHE.add to existing balance",
      "The transfer uses the same no-op pattern from week 2 — FHE.select with FHE.le",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialWrapper is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function wrap(uint64 amount) external {
        // TODO: Create encrypted balance from plaintext amount
        // TODO: Handle first-time vs existing balance
        // TODO: Set permissions
    }

    function confidentialTransfer(
        address to,
        externalEuint64 encAmount,
        bytes calldata proof
    ) external {
        // TODO: Validate input
        // TODO: Check sufficient balance (encrypted)
        // TODO: Use FHE.select for no-op pattern
        // TODO: Update sender and receiver balances
        // TODO: Set permissions for both
    }

    function getBalance() external returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    testCode: `describe("ConfidentialWrapper", function () {
  it("should compile", function () { assert(compiled); });
  it("should use FHE.isInitialized for balance check", function () { assert(containsCall("FHE.isInitialized")); });
  it("should use FHE.add for accumulation", function () { assert(containsCall("FHE.add")); });
  it("should use FHE.select for transfer no-op pattern", function () { assert(containsCall("FHE.select")); });
  it("should use FHE.le or FHE.ge for balance check", function () {
    assert(containsCall("FHE.le") || containsCall("FHE.ge"));
  });
  it("should set permissions for both sender and receiver", function () {
    assert(countOccurrences("FHE.allowThis") >= 2);
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialWrapper is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function wrap(uint64 amount) external {
        if (FHE.isInitialized(balances[msg.sender])) {
            balances[msg.sender] = FHE.add(balances[msg.sender], FHE.asEuint64(amount));
        } else {
            balances[msg.sender] = FHE.asEuint64(amount);
        }
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function confidentialTransfer(
        address to,
        externalEuint64 encAmount,
        bytes calldata proof
    ) external {
        euint64 amount = FHE.fromExternal(encAmount, proof);
        ebool sufficient = FHE.le(amount, balances[msg.sender]);
        euint64 actual = FHE.select(sufficient, amount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actual);
        if (FHE.isInitialized(balances[to])) {
            balances[to] = FHE.add(balances[to], actual);
        } else {
            balances[to] = actual;
        }
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }

    function getBalance() external returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.isInitialized", message: "Must check if balance is initialized", points: 15 },
      { type: "contains", value: "FHE.select", message: "Must use FHE.select for no-op transfer pattern", points: 20 },
      { type: "regex", value: "FHE\\.(le|ge)", message: "Must check sufficient balance", points: 15 },
      { type: "contains", value: "FHE.sub", message: "Must deduct from sender", points: 10 },
      { type: "contains", value: "FHE.add", message: "Must credit receiver", points: 10 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate encrypted input", points: 15 },
      { type: "contains", value: "FHE.allowThis", message: "Must set self-permissions on balances", points: 15 },
    ],
  },
  {
    id: "w3-c4",
    weekNumber: 3,
    title: "Phase-Based State Machine",
    difficulty: "Hard",
    description:
      "Build a contract with a complete phase-based state machine — the fundamental architecture for any FHEVM app that reveals results. Implement: Active → DecryptionRequested → Revealed phases with proper transition guards.",
    instructions: [
      "Define an enum Phase { Active, DecryptionRequested, Revealed }",
      "Store an encrypted euint64 result and a public uint64 revealedResult",
      "In the Active phase, allow updating the result with FHE operations",
      "Implement requestDecryption() that transitions to DecryptionRequested and calls makePubliclyDecryptable",
      "Implement finalize(uint256[] handles, bytes cleartexts, bytes proof) that calls checkSignatures",
      "Add phase guards using require() to enforce valid transitions",
    ],
    hints: [
      "Phase transitions are standard (non-encrypted) — use regular require() for these guards",
      "FHE.checkSignatures verifies that decrypted values are authentic from the KMS",
      "The abi.decode step converts the cleartext bytes back to the original type",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PhaseContract is ZamaEthereumConfig {
    enum Phase { Active, DecryptionRequested, Revealed }
    Phase public currentPhase;

    euint64 private encryptedResult;
    uint64 public revealedResult;

    constructor() {
        // TODO: Initialize phase and encrypted result
    }

    function updateResult(uint64 value) external {
        // TODO: Phase guard — must be Active
        // TODO: Update encrypted result
        // TODO: Set permissions
    }

    function requestDecryption() external {
        // TODO: Phase guard — must be Active
        // TODO: Transition to DecryptionRequested
        // TODO: Make result publicly decryptable
    }

    function finalize(
        uint256[] calldata handles,
        bytes calldata cleartexts,
        bytes calldata proof
    ) external {
        // TODO: Phase guard — must be DecryptionRequested
        // TODO: Verify signatures from KMS
        // TODO: Decode and store revealed result
        // TODO: Transition to Revealed
    }
}`,
    testCode: `describe("PhaseContract", function () {
  it("should compile", function () { assert(compiled); });
  it("should define Phase enum", function () { assert(contains("enum Phase")); });
  it("should use FHE.makePubliclyDecryptable", function () { assert(containsCall("FHE.makePubliclyDecryptable")); });
  it("should use FHE.checkSignatures", function () { assert(containsCall("FHE.checkSignatures")); });
  it("should use abi.decode for cleartext", function () { assert(contains("abi.decode")); });
  it("should have phase guards with require", function () { assert(countOccurrences("require") >= 3); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PhaseContract is ZamaEthereumConfig {
    enum Phase { Active, DecryptionRequested, Revealed }
    Phase public currentPhase;

    euint64 private encryptedResult;
    uint64 public revealedResult;

    constructor() {
        currentPhase = Phase.Active;
        encryptedResult = FHE.asEuint64(0);
        FHE.allowThis(encryptedResult);
    }

    function updateResult(uint64 value) external {
        require(currentPhase == Phase.Active, "Not in active phase");
        encryptedResult = FHE.asEuint64(value);
        FHE.allowThis(encryptedResult);
    }

    function requestDecryption() external {
        require(currentPhase == Phase.Active, "Not in active phase");
        currentPhase = Phase.DecryptionRequested;
        FHE.makePubliclyDecryptable(encryptedResult);
    }

    function finalize(
        uint256[] calldata handles,
        bytes calldata cleartexts,
        bytes calldata proof
    ) external {
        require(currentPhase == Phase.DecryptionRequested, "Not awaiting decryption");
        FHE.checkSignatures(handles, cleartexts, proof);
        revealedResult = abi.decode(cleartexts, (uint64));
        currentPhase = Phase.Revealed;
    }
}`,
    validationRules: [
      { type: "contains", value: "enum Phase", message: "Must define Phase enum", points: 15 },
      { type: "contains", value: "FHE.makePubliclyDecryptable", message: "Must call makePubliclyDecryptable in request phase", points: 20 },
      { type: "contains", value: "FHE.checkSignatures", message: "Must verify decryption proof with checkSignatures", points: 20 },
      { type: "contains", value: "abi.decode", message: "Must decode cleartexts with abi.decode", points: 15 },
      { type: "regex", value: "require.*Phase", message: "Must have phase guards using require()", points: 15 },
      { type: "contains", value: "FHE.allowThis", message: "Must set self-permissions", points: 15 },
    ],
  },

  // ── Week 4 Challenges ──
  {
    id: "w4-c1",
    weekNumber: 4,
    title: "Using the Standard Library — ConfidentialERC20",
    difficulty: "Easy",
    description:
      "Build a confidential token by extending Zama's audited ConfidentialERC20 standard library contract. Instead of writing everything from scratch, leverage production-ready code.",
    instructions: [
      "Import ConfidentialERC20 from @fhevm/contracts",
      "Create a contract that inherits from ConfidentialERC20",
      "Call the ConfidentialERC20 constructor with a name and symbol",
      "In the constructor, mint initial supply using _unsafeMint()",
      "The standard library handles all transfer logic, ACL, and error handling for you",
    ],
    hints: [
      "ConfidentialERC20 constructor takes (string name, string symbol)",
      "_unsafeMint(address, uint64) is the internal mint function — 'unsafe' means no overflow check on total supply",
      "All transfer, approve, and allowance logic is inherited — you don't need to implement it",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Import ConfidentialERC20 from @fhevm/contracts

contract MyConfidentialToken /* TODO: inherit */ {
    constructor() /* TODO: call parent constructor */ {
        // TODO: Mint 1,000,000 tokens to deployer
    }
}`,
    testCode: `describe("MyConfidentialToken", function () {
  it("should compile", function () { assert(compiled); });
  it("should import ConfidentialERC20", function () { assert(contains("ConfidentialERC20")); });
  it("should inherit from ConfidentialERC20", function () { assert(contains("is ConfidentialERC20")); });
  it("should mint initial supply", function () { assert(contains("_unsafeMint")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ConfidentialERC20 } from "@fhevm/contracts/token/ERC20/ConfidentialERC20.sol";

contract MyConfidentialToken is ConfidentialERC20 {
    constructor()
        ConfidentialERC20("MyConfidentialToken", "MCT")
    {
        _unsafeMint(msg.sender, 1_000_000 * 1e6);
    }
}`,
    validationRules: [
      { type: "contains", value: "ConfidentialERC20", message: "Must import/inherit ConfidentialERC20", points: 25 },
      { type: "contains", value: "is ConfidentialERC20", message: "Must inherit from ConfidentialERC20", points: 25 },
      { type: "contains", value: "_unsafeMint", message: "Must mint initial supply with _unsafeMint()", points: 25 },
      { type: "notContains", value: "TFHE", message: "Do not use deprecated TFHE library", points: 10 },
      { type: "contains", value: "constructor", message: "Must have a constructor", points: 15 },
    ],
  },
  {
    id: "w4-c2",
    weekNumber: 4,
    title: "Spot the Security Bugs",
    difficulty: "Medium",
    description:
      "This contract has 4 critical FHEVM security bugs. Your task is to fix ALL of them. The contract compiles but has logic errors, missing permissions, and a side-channel vulnerability.",
    instructions: [
      "Fix Bug #1: FHE.fromExternal is missing — external input is used without validation",
      "Fix Bug #2: FHE.allowThis is missing after balance update — contract loses handle access",
      "Fix Bug #3: FHE.allow is missing — users can't decrypt their own balance",
      "Fix Bug #4: The transfer only updates one balance per branch — add no-op pattern to prevent gas leak",
    ],
    hints: [
      "Raw externalEuint64 MUST be validated with FHE.fromExternal before any operation",
      "Every assignment to encrypted state needs FHE.allowThis immediately after",
      "Use FHE.select so both sender and receiver balances update in every code path",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract BuggyToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function mint(externalEuint64 amount, bytes calldata proof) external {
        // BUG #1: Missing input validation!
        euint64 encAmount = FHE.fromExternal(amount, proof);  // Fix this if needed
        balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        // BUG #2: What's missing after this assignment?
        // BUG #3: Can the user decrypt their balance?
    }

    function transfer(address to, externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        ebool sufficient = FHE.le(encAmount, balances[msg.sender]);

        // BUG #4: This leaks information through gas costs!
        // Both balances should ALWAYS update using FHE.select
        euint64 actualAmount = FHE.select(sufficient, encAmount, FHE.asEuint64(0));
        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        balances[to] = FHE.add(balances[to], actualAmount);
        // Don't forget permissions for BOTH parties!
    }

    function getBalance() external returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    testCode: `describe("BuggyToken — Fixed", function () {
  it("should compile", function () { assert(compiled); });
  it("should validate input with FHE.fromExternal", function () { assert(containsCall("FHE.fromExternal")); });
  it("should call FHE.allowThis after every balance update", function () {
    assert(countOccurrences("FHE.allowThis") >= 3);
  });
  it("should call FHE.allow for users to read balances", function () {
    assert(countOccurrences("FHE.allow(") >= 3);
  });
  it("should use FHE.select for transfer no-op pattern", function () { assert(containsCall("FHE.select")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract BuggyToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function mint(externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function transfer(address to, externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        ebool sufficient = FHE.le(encAmount, balances[msg.sender]);
        euint64 actualAmount = FHE.select(sufficient, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        balances[to] = FHE.add(balances[to], actualAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }

    function getBalance() external returns (euint64) {
        FHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}`,
    validationRules: [
      { type: "contains", value: "FHE.fromExternal", message: "Bug #1: Must validate input with FHE.fromExternal()", points: 20 },
      { type: "regex", value: "FHE\\.allowThis.*FHE\\.allowThis.*FHE\\.allowThis", message: "Bug #2: Must call FHE.allowThis after EVERY balance update (need 3+)", points: 25 },
      { type: "regex", value: "FHE\\.allow\\(.*FHE\\.allow\\(.*FHE\\.allow\\(", message: "Bug #3: Must grant FHE.allow for all affected users (need 3+)", points: 25 },
      { type: "contains", value: "FHE.select", message: "Bug #4: Must use FHE.select for no-op transfer pattern", points: 20 },
      { type: "notContains", value: "require(sufficient", message: "Never use require() on encrypted values", points: 10 },
    ],
  },
  {
    id: "w4-c3",
    weekNumber: 4,
    title: "Gas-Optimized Encrypted Operations",
    difficulty: "Medium",
    description:
      "Refactor an unoptimized FHEVM contract to be gas-efficient. Apply scalar optimization, use smaller types, and cache intermediate results.",
    instructions: [
      "Change euint256 to euint64 where the full range isn't needed",
      "Replace encrypted constants with scalar operands (e.g., FHE.add(x, 1) instead of FHE.add(x, FHE.asEuint64(1)))",
      "Cache the FHE.le comparison result instead of computing it twice",
      "Use FHE.allowTransient instead of FHE.allow for temporary cross-contract access",
      "Ensure all operations use the smallest viable type",
    ],
    hints: [
      "FHE.add(x, 1) is scalar — much cheaper than FHE.add(x, FHE.asEuint64(1))",
      "euint64 operations cost ~5-10x less than euint256",
      "If a helper contract only needs access during this transaction, use allowTransient",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

// GOAL: Optimize this contract for minimal gas usage
// Apply: scalar operands, smallest types, caching, transient ACL

contract OptimizedVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function deposit(externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        // TODO: Add to balance using scalar addition if possible
        // TODO: Set permissions efficiently
        balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function withdraw(externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);

        // TODO: Use scalar comparison where possible
        // TODO: Cache comparison result — don't compute twice
        ebool hasEnough = FHE.ge(balances[msg.sender], encAmount);
        euint64 actualAmount = FHE.select(hasEnough, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function grantTempAccess(address helper) external {
        // TODO: Use FHE.allowTransient instead of FHE.allow for temp access
        FHE.allowTransient(balances[msg.sender], helper);
    }
}`,
    testCode: `describe("OptimizedVault", function () {
  it("should compile", function () { assert(compiled); });
  it("should use euint64 (not euint256)", function () { assert(contains("euint64")); assert(notContains("euint256")); });
  it("should use FHE.select for withdrawal", function () { assert(containsCall("FHE.select")); });
  it("should use FHE.allowTransient for temp access", function () { assert(containsCall("FHE.allowTransient")); });
  it("should NOT use deprecated TFHE library", function () { assert(notContains("TFHE")); });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract OptimizedVault is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    function deposit(externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function withdraw(externalEuint64 amount, bytes calldata proof) external {
        euint64 encAmount = FHE.fromExternal(amount, proof);
        ebool hasEnough = FHE.ge(balances[msg.sender], encAmount);
        euint64 actualAmount = FHE.select(hasEnough, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function grantTempAccess(address helper) external {
        FHE.allowTransient(balances[msg.sender], helper);
    }
}`,
    validationRules: [
      { type: "contains", value: "euint64", message: "Must use euint64 for gas efficiency", points: 20 },
      { type: "notContains", value: "euint256", message: "Must NOT use euint256 — too expensive", points: 20 },
      { type: "contains", value: "FHE.select", message: "Must use FHE.select for conditional withdrawal", points: 20 },
      { type: "contains", value: "FHE.allowTransient", message: "Must use FHE.allowTransient for temp access", points: 20 },
      { type: "notContains", value: "TFHE", message: "Do not use deprecated TFHE library", points: 10 },
      { type: "contains", value: "FHE.fromExternal", message: "Must validate all inputs", points: 10 },
    ],
  },
  {
    id: "w4-c4",
    weekNumber: 4,
    title: "Encrypted Error Handling",
    difficulty: "Hard",
    description:
      "Implement a transfer function that returns encrypted error codes instead of reverting. Since you can't revert on encrypted conditions, use encrypted error codes that the user can decrypt to understand what went wrong.",
    instructions: [
      "Define error code constants: NO_ERROR = 0, INSUFFICIENT_BALANCE = 1, ZERO_AMOUNT = 2",
      "Implement transfer() that returns an encrypted euint8 error code",
      "Check for zero amount: FHE.eq(amount, 0) — if true, return ZERO_AMOUNT error",
      "Check for insufficient balance: FHE.le(amount, balance) — if false, return INSUFFICIENT_BALANCE",
      "Use nested FHE.select to determine the correct error code",
      "Execute the transfer as a no-op if any error occurred",
    ],
    hints: [
      "Use FHE.select(isZero, FHE.asEuint8(2), ...) to set error code for zero amount",
      "Nest FHE.select: first check zero, then check balance, then NO_ERROR",
      "The transfer should still execute (as no-op) regardless — never revert on encrypted conditions",
    ],
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ErrorHandlingToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    uint8 constant NO_ERROR = 0;
    uint8 constant INSUFFICIENT_BALANCE = 1;
    uint8 constant ZERO_AMOUNT = 2;

    function transfer(
        address to,
        externalEuint64 amount,
        bytes calldata proof
    ) external returns (euint8 errorCode) {
        euint64 encAmount = FHE.fromExternal(amount, proof);

        // TODO: Check for zero amount
        // TODO: Check for insufficient balance
        // TODO: Determine error code using nested FHE.select
        // TODO: Execute transfer as no-op if error
        // TODO: Set permissions on error code and balances
    }
}`,
    testCode: `describe("ErrorHandlingToken", function () {
  it("should compile", function () { assert(compiled); });
  it("should return euint8 error code", function () { assert(contains("returns (euint8")); });
  it("should check for zero amount with FHE.eq", function () { assert(containsCall("FHE.eq")); });
  it("should use nested FHE.select for error determination", function () {
    assert(countOccurrences("FHE.select") >= 2);
  });
  it("should define error constants", function () {
    assert(contains("NO_ERROR"));
    assert(contains("INSUFFICIENT_BALANCE"));
    assert(contains("ZERO_AMOUNT"));
  });
});`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ErrorHandlingToken is ZamaEthereumConfig {
    mapping(address => euint64) private balances;

    uint8 constant NO_ERROR = 0;
    uint8 constant INSUFFICIENT_BALANCE = 1;
    uint8 constant ZERO_AMOUNT = 2;

    function transfer(
        address to,
        externalEuint64 amount,
        bytes calldata proof
    ) external returns (euint8 errorCode) {
        euint64 encAmount = FHE.fromExternal(amount, proof);

        ebool isZero = FHE.eq(encAmount, 0);
        ebool hasFunds = FHE.le(encAmount, balances[msg.sender]);

        errorCode = FHE.select(
            isZero,
            FHE.asEuint8(ZERO_AMOUNT),
            FHE.select(hasFunds, FHE.asEuint8(NO_ERROR), FHE.asEuint8(INSUFFICIENT_BALANCE))
        );

        ebool shouldTransfer = FHE.and(FHE.not(isZero), hasFunds);
        euint64 actualAmount = FHE.select(shouldTransfer, encAmount, FHE.asEuint64(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
        balances[to] = FHE.add(balances[to], actualAmount);

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
        FHE.allow(errorCode, msg.sender);
    }
}`,
    validationRules: [
      { type: "contains", value: "returns (euint8", message: "Must return encrypted error code (euint8)", points: 15 },
      { type: "contains", value: "FHE.eq", message: "Must check for zero amount with FHE.eq", points: 15 },
      { type: "regex", value: "FHE\\.select.*FHE\\.select", message: "Must use nested FHE.select for error determination", points: 20 },
      { type: "contains", value: "NO_ERROR", message: "Must define NO_ERROR constant", points: 5 },
      { type: "contains", value: "INSUFFICIENT_BALANCE", message: "Must define INSUFFICIENT_BALANCE constant", points: 5 },
      { type: "contains", value: "ZERO_AMOUNT", message: "Must define ZERO_AMOUNT constant", points: 5 },
      { type: "contains", value: "FHE.allowThis", message: "Must set permissions on updated balances", points: 15 },
      { type: "notContains", value: "require(isZero", message: "Never require() on encrypted conditions", points: 10 },
      { type: "contains", value: "FHE.allow(errorCode", message: "Must allow sender to decrypt error code", points: 10 },
    ],
  },
];

export function getChallengesForWeek(weekNumber: number): Challenge[] {
  return CHALLENGES.filter((c) => c.weekNumber === weekNumber);
}

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function getTotalChallenges(): number {
  return CHALLENGES.length;
}

export function validateCode(code: string, rules: ValidationRule[]): TestResult[] {
  return rules.map((rule) => {
    let passed = false;
    switch (rule.type) {
      case "contains":
        passed = code.includes(rule.value);
        break;
      case "notContains":
        passed = !code.includes(rule.value);
        break;
      case "regex":
        passed = new RegExp(rule.value).test(code);
        break;
      case "compiles":
        passed = true; // Placeholder — full compilation check is separate
        break;
    }
    return {
      name: rule.message,
      passed,
      message: passed ? "Passed" : rule.message,
    };
  });
}
