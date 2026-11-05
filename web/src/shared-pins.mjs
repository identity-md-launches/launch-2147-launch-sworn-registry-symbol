// Shared facts whose log window closed for good, read once and pinned here, so a request does not
// rescan their history in the visitor's browser (tens of thousands of logs through public RPCs).
// A pin is used only for a spec equal to it in every field that decides the answer, and only after
// the RPC confirms the closing block hash; every other spec is still read from the chain.
//
// Fact 1201, Top Weights, read 2026-11-05: 28,353 Deposited logs in blocks 25,769,870 to 25,789,604,
// identical on gateway.tenderly.co and rpc.mevblocker.io; ranked by the Composer recipe (summed
// weightAdded descending, numeric address ascending on ties); keccak256(abi.encode(list)) equals the
// answerHash the v1 Registry 0x39bec764…95a6 stored for the same window (oracle panel 4 of 4).
export const SHARED_PINS = [
  {
    id: 1201,
    target: "0xcB0b0531e86A9aC36Fa865cA8e3dbccF047FDA91",
    item: "event Deposited(address indexed contributor, uint256 indexed hour, uint256 amount, uint256 creditedDelta, uint256 weightAdded, uint256 newWeight, uint256 txCount, uint256 hourTotal, uint256 earlyBps)",
    arg: "contributor",
    sumArg: "weightAdded",
    threshold: 32n,
    fromBlock: 25769870n,
    toBlock: 25789604n,
    blockHash:
      "0x57852dbfd56daf8e7b4bf68c2e25f73dd583f99eac5b00c03a50603e4a2cef37",
    count: 28353,
    list: [
      "0x2fe4093c894749e596f458764c377bf4f1337b58",
      "0xe781b28e02ed5fc4b989905cb6848d318f4735fd",
      "0x383f42b5de515c564641f65f5da3bd8b4a35b4b4",
      "0x1aa780bb10425b86bcf05ecbb7953f9a93729ed9",
      "0x75d51517b90cc5c8873c631ddc177a1bfd96b074",
      "0x5d13fd37e8758030a6a10857c0cb699b2bff7a83",
      "0x2d3fd4eb27e1ff622eb699c1b10cc7663be70ab5",
      "0x381fe486d87c7f2633c777f1b5be3105a2a51744",
      "0x000461a73d3985eef4923655782aa5d0de75c111",
      "0x193e75b60a4ca8bc842dc28604afc6c41afe972a",
      "0x9fa60c355816a28ffb76d77c30b06952f413b1df",
      "0xd8222670b20761708d32a6a9b5e2f3a266d9673d",
      "0xbb24cda09cb5a838ec93bae56278dc799f34feb4",
      "0x82c4426b73929c9b2a373b3a902ae7471abf0914",
      "0xad468e8336182e2cec7022f3434f91227c33a723",
      "0x7f2fc61aab7ae63eb8192bb7ec36709917707f7a",
      "0x2bdf1a698d39a4358e2c162deacc038fadb8a9d5",
      "0xd891769ecec9dc911441a15b1a090cc9af1d9eee",
      "0x9572cbe40ff2ed3dd1a4c0fa1c4a89bae0decccb",
      "0x85e3f17c84e239cec91e42ab3df021db45febf17",
      "0xec82a7912aeef74fb212e799f25468d96fb68635",
      "0xd3474bd2f558b12e83810ec7d8af14f2d1d08137",
      "0x62ee30f8a0357d2196450cc2b0d6441f8a92d981",
      "0xd15031d0942634ccac10274e68945a23d2720922",
      "0x626a4912f9671ecb7ff42c85f0392fd437875d51",
      "0x4fb24fb1cdf7a990fa8df38f78c1d49f1f74bea3",
      "0x3e89d442c94c8760029bc952ec2068194a4fa7cb",
      "0x6c59ee4552f44dd93841a2b39304c3ed7e1935b4",
      "0xcecc592a6c188f3b59ea0fc06f4f4fbb42e637d8",
      "0x1b6020630c59b1ca6f2391c102f8614a2380ebd1",
      "0x225c94b665f915ef85e6fd7f6fb2ff514daa6733",
      "0x85a8fa8eae4d5ce10cc287da19030a87174491aa",
    ],
  },
];

/** The pin for a spec equal to it in target, event, grouping, sum, head and window; otherwise null. */
export function pinFor(spec) {
  return (
    SHARED_PINS.find(
      (p) =>
        String(spec.target).toLowerCase() === p.target.toLowerCase() &&
        spec.item === p.item &&
        spec.arg === p.arg &&
        spec.sumArg === p.sumArg &&
        BigInt(spec.threshold) === p.threshold &&
        BigInt(spec.fromBlock) === p.fromBlock &&
        BigInt(spec.toBlock) === p.toBlock,
    ) || null
  );
}
