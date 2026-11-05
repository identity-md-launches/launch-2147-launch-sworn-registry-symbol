import test from "node:test";
import assert from "node:assert/strict";
import { encodeAbiParameters, keccak256 } from "viem";
import { checkSharedSpec } from "../src/shared-safety.mjs";
import { SHARED_PINS } from "../src/shared-pins.mjs";

// Fact 1201 exactly as the live Registry's specOf(1201) returns it (read 2026-11-05).
const spec1201 = {
  kind: 3,
  target: "0xcB0b0531e86A9aC36Fa865cA8e3dbccF047FDA91",
  item: "event Deposited(address indexed contributor, uint256 indexed hour, uint256 amount, uint256 creditedDelta, uint256 weightAdded, uint256 newWeight, uint256 txCount, uint256 hourTotal, uint256 earlyBps)",
  arg: "contributor",
  fixedArg: "",
  fixedVal: 0n,
  sumArg: "weightAdded",
  op: 0,
  threshold: 32n,
  fromBlock: 25769870n,
  toBlock: 25789604n,
  name: "Top Weights",
};
const CLOSING_1201 =
  "0x57852dbfd56daf8e7b4bf68c2e25f73dd583f99eac5b00c03a50603e4a2cef37";

function client(hash = CLOSING_1201) {
  const c = {
    blocks: [],
    logReads: 0,
    getBlock: async ({ blockNumber }) => {
      c.blocks.push(blockNumber);
      return { hash };
    },
    request: async () => {
      c.logReads++;
      return [];
    },
  };
  return c;
}

test("B a spec equal to the 1201 pin returns its list without reading logs", async () => {
  const c = client();
  const result = await checkSharedSpec(c, spec1201);
  assert.equal(c.logReads, 0);
  assert.deepEqual(c.blocks, [25789604n]);
  assert.equal(result.list.length, 32);
  assert.equal(result.list[0], "0x2fe4093c894749e596f458764c377bf4f1337b58");
  assert.equal(result.list[31], "0x85a8fa8eae4d5ce10cc287da19030a87174491aa");
  assert.equal(result.count, 28353);
  assert.equal(result.blockHash, CLOSING_1201);
});

test("B a pinned spec on a chain with another closing block is refused", async () => {
  await assert.rejects(
    checkSharedSpec(client("0x" + "ab".repeat(32)), spec1201),
    /Historical block changed; payment blocked/,
  );
});

for (const [field, value] of [
  ["toBlock", 25789603n],
  ["fromBlock", 25769871n],
  ["threshold", 31n],
  ["sumArg", "amount"],
  ["target", "0x1000000000000000000000000000000000000000"],
])
  test(`B a spec that differs from the pin in ${field} is read from the chain`, async () => {
    const c = client();
    await assert.rejects(checkSharedSpec(c, { ...spec1201, [field]: value }));
    assert.ok(c.logReads > 0);
  });

test("B the 1201 pin hashes to the answer the v1 oracle panel attested", () => {
  const pin = SHARED_PINS.find((p) => p.id === 1201);
  assert.equal(pin.list.length, 32);
  assert.equal(new Set(pin.list).size, 32);
  assert.ok(pin.list.every((a) => BigInt(a) >= 2n ** 80n));
  assert.equal(
    keccak256(encodeAbiParameters([{ type: "address[]" }], [pin.list])),
    "0xe2321ca26c74668346a694beb25439aeb99e38e8cc1195d134ee9b22f9a52543",
  );
});
