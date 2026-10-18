# Adaptation for the Sworn (SWORN) launch on Ethereum mainnet

## Changes

No executable change. `src/`, `lib/`, `foundry.toml` (already `bytecode_hash = "none"`) and
`remappings.txt` are byte-identical to the frozen candidate (baseCommit), so the creation and
runtime bytes are the same as that candidate's build.

Files added:

- `test/SpecIdCap.t.sol`: a test that reproduces audit finding 602ef563 and pins its behaviour (see below).
- `ADAPTATION.md`: this file.

## Launch fit (already met, nothing adapted)

- Renderer and Composer have no constructor arguments. Registry takes 8 address arguments in this
  order: curator, idmd, imd, intake, attester, renderer, composer, burnExecutor. Its constructor is
  nonpayable.
- On an empty chain all four of Curator, IDMD, IMD and Intake have no code, so the Registry
  constructor skips its dependency checks and does not revert (this is the documented floor).
- There are no owner or admin roles, so `$owner` is not used. There is no pause, upgrade, proxy,
  DELEGATECALL, CALLCODE or SELFDESTRUCT.
- Deployment order and arguments for the manifest step: Renderer [], Composer [], Registry
  [0xcb0b0531e86a9ac36fa865ca8e3dbccf047fda91, 0x0000ec93127baa929e58e97dd0095a2bfb38ec1d,
  0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7, 0xa43e6f75ee006411f79ac1c84120606c2330de82,
  0x5598aa9146215bc13eb26f2c692ad1461fd32982, $contract:Renderer, $contract:Composer,
  0xe29386719C155B6847aD5a4E97C6674f10ffc750].

## Audit findings

- **602ef563 (low): uint16 spec ids run out. Reproduced, not fixed, non-blocking.**
  `nextSpecId++` at 65535 reverts with Panic(0x11). After that, `registerSpec` is closed
  permanently. `test/SpecIdCap.t.sol` shows that id 65535 still registers and the call after it
  reverts. Fixing it would mean widening the id types in `src/` (or adding an explicit cap error),
  which changes both the creation and runtime bytes. The frozen-candidate rule forbids that. The
  only impact is that community specs stop after 55,535 registrations, which costs about
  355k IMD to force. No funds are at risk.
- **4ed21049 (info): review scope.** Nothing to reproduce. Its manifest and its "no adapt changes"
  conclusion match this result.

## Checks

`forge build` passes. `forge test --no-match-path 'test/fork/*'` with the job's fuzz seed gives
182 passed, 0 failed, plus 2 passed in the new suite. The fork tests were not run because there
is no network in verification.
