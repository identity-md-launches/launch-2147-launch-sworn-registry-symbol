import { parseAbiItem, toHex } from "viem";

const number = (value) => BigInt(value).toLocaleString("en-US");
const comparison = (op) =>
  ({
    0: "at least",
    1: "at least",
    2: "more than",
    3: "at most",
    4: "less than",
    5: "exactly",
  })[Number(op)] || "at least";

// The ABI's field type, rather than the magnitude of a uint, determines whether
// a fixed filter is an address. Registry fallback has no fixedValAsAddress.
export function fixedRuleValue(spec) {
  try {
    const item = parseAbiItem(spec.item);
    const field = item.inputs?.find((input) => input.name === spec.fixedArg);
    if (field?.type === "address")
      return toHex(BigInt(spec.fixedVal), { size: 20 });
    if (field?.type === "bool")
      return BigInt(spec.fixedVal) === 0n ? "false" : "true";
    if (/^bytes\d+$/.test(field?.type))
      return toHex(BigInt(spec.fixedVal), {
        size: Number(field.type.slice(5)),
      });
  } catch {
    /* Unsupported signatures still show their original fields below. */
  }
  return String(spec.fixedVal);
}

export function describeCommunityRule(spec) {
  const kind = Number(spec.kind),
    threshold = number(spec.threshold);
  const item = spec.item.match(/^(?:event|function)\s+(\w+)/)?.[1] || spec.item;
  const window = `between blocks ${number(spec.fromBlock)} and ${number(spec.toBlock)}`;
  const fixed = spec.fixedArg ? fixedRuleValue(spec) : "";
  let filter = `with ${spec.arg} equal to the wallet${spec.fixedArg ? ` and ${spec.fixedArg} equal to ${fixed}` : ""}`;
  if (item === "Transfer" && spec.arg === "from")
    filter = `sent by the wallet${spec.fixedArg === "to" ? ` to ${fixed}` : spec.fixedArg ? ` with ${spec.fixedArg} equal to ${fixed}` : ""}`;
  if (item === "Transfer" && spec.arg === "to")
    filter = `received by the wallet${spec.fixedArg === "from" ? ` from ${fixed}` : spec.fixedArg ? ` with ${spec.fixedArg} equal to ${fixed}` : ""}`;
  if (kind === 1)
    return `${comparison(spec.op)} ${threshold} ${item} events of ${spec.target} ${filter} ${window}`;
  if (kind === 2)
    return `${comparison(spec.op)} ${threshold} in summed ${spec.sumArg} (raw units) from ${item} events of ${spec.target} ${filter} ${window}`;
  if (kind === 3)
    return `top ${threshold} wallets by summed ${spec.sumArg} (raw units), grouped by ${spec.arg} in ${item} events of ${spec.target}${spec.fixedArg ? ` with ${spec.fixedArg} equal to ${fixed}` : ""} ${window}`;
  if (kind === 4)
    return `${item}(wallet) on ${spec.target} returns ${comparison(spec.op)} ${threshold} at block ${number(spec.toBlock)}`;
  if (kind === 5)
    return `wallet account nonce is at least ${threshold} at block ${number(spec.toBlock)}`;
  if (kind === 6)
    return `at least ${threshold} accepted feedback entries during qualifying seat ownership of ${spec.target} ${window}; the panel checks seat history and agent bindings`;
  return `${spec.item} on ${spec.target}, ${filter}, threshold ${threshold}, ${window}`;
}

export function communityFact(spec) {
  return {
    id: spec.id,
    name: spec.name,
    kind: Number(spec.kind),
    class:
      Number(spec.kind) === 3
        ? "shared"
        : Number(spec.kind) >= 5
          ? "panel"
          : "chain",
    rule: describeCommunityRule(spec),
    window: "",
    registrant: spec.registrant,
  };
}
