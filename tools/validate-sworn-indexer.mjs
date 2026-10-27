// Supplemental 1.0.1 checks. Serves the submitted dist; never builds or signs.
// SWORN_VALIDATION_WEB may point to an exact temporary web copy with npm ci.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { server } from '../web/tests/harness.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dependencyWeb = path.resolve(process.env.SWORN_VALIDATION_WEB || path.join(root, 'web'));
const require = createRequire(path.join(dependencyWeb, 'package.json'));
const { chromium } = require('@playwright/test');
const { toHex } = require('viem');
// Helpers contain deterministic RPC replies; compare them to the delivered source before loading.
const helper = path.join(dependencyWeb, 'tests/fake-chain.mjs');
assert.deepEqual(await fs.readFile(helper), await fs.readFile(path.join(root, 'web/tests/fake-chain.mjs')));
const { fakeChain, fakeWallet, mockPage, registryLog, inspectAllFacts } = await import(pathToFileURL(helper));
const fixture = async name => JSON.parse(await fs.readFile(path.join(root, `web/tests/fixtures/indexer/${name}.json`)));
const rules = await fixture('rules'), history = await fixture('wallet');
const eligible = await fixture('eligible'), negative = await fixture('ineligible');
const spec = { ...rules.rules[0], threshold: 5n, fixedVal: BigInt(rules.rules[0].fixedVal), fromBlock: 26038414n, toBlock: 26279931n };
const output = path.join(root, 'test/scratch/release-indexer');
await fs.mkdir(output, { recursive: true });
const report = { commit: '5e0dce32d16e034d02dc018323c8615f37188383', fixtureReads: true, checks: [], errors: [], requests: [], screenshots: [] };
const preview = await server();
const browser = await chromium.launch({ headless: true });
let context, page, outage = false;
const check = async (name, run) => {
  try { const result = await run(); report.checks.push({ name, passed: true, ...(result ? { result } : {}) }); }
  catch (e) { report.checks.push({ name, passed: false, error: e.message }); }
};
async function setup(wallet = history.wallet) {
  await context?.close();
  outage = false;
  context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await fakeWallet(context, wallet);
  const events = history.requests.flatMap((r, i) => [
    registryLog('Verified', { claimant: wallet, traitId: r.traitId, requestId: r.requestId, oracleRequestId: r.oracleRequestId }, { blockNumber: toHex(r.resolvedBlock), transactionHash: r.resolvedTx, logIndex: toHex(i) }),
    registryLog('TraitRequested', { claimant: wallet, traitId: r.traitId, requestId: r.requestId, questionHash: r.questionHash }, { blockNumber: toHex(r.requestedBlock), transactionHash: r.requestedTx, logIndex: toHex(i) }),
  ]);
  events.push(registryLog('CardMinted', { claimant: wallet, tokenId: 2n }, { blockNumber: toHex(history.card.mintBlock), transactionHash: history.card.mintTx }));
  const chain = fakeChain({ token: 2n, balance: 10n ** 22n, allowance: 10n ** 22n, nextSpecId: 10002, specs: { 10001: spec }, proven: [601, 701, 1105, 1301], mintedAtBlock: BigInt(history.card.mintBlock), verifiedEvents: events });
  const answer = chain.answer;
  chain.answer = payload => payload.method === 'eth_blockNumber' ? toHex(history.lastIndexedBlock) : answer(payload);
  page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.errors.push(e.message));
  await mockPage(page, chain);
  await page.route('https://api.imd.fun/**', r => r.fulfill({ contentType: 'application/json', body: '[]' }));
  await page.route('https://sworn.vibingco.de/api/**', r => {
    const url = new URL(r.request().url());
    report.requests.push(url.pathname + url.search);
    if (outage) return r.abort('failed');
    const data = url.pathname === '/api/rules' ? rules : url.pathname.includes('/eligibility') ? wallet === negative.wallet ? negative : eligible : { ...history, wallet };
    return r.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
  return chain;
}
async function connect() {
  await page.getByRole('button', { name: 'Connect', exact: true }).click();
  await page.getByRole('button', { name: 'Browser wallet', exact: true }).click();
}
async function shot(name) {
  await page.screenshot({ path: path.join(output, name) });
  report.screenshots.push(name);
}
try {
  for (const [wallet, count, met] of [[history.wallet, 5, true], [negative.wallet, 0, false]]) {
    await check(`Indexer eligibility ${count}; current compact rule and paid-action review`, async () => {
      await setup(wallet);
      await page.goto(preview.url + '#/request?trait=10001');
      await page.locator('footer [role=status]').filter({ hasText: /Ethereum mainnet · block/ }).waitFor();
      await connect();
      await inspectAllFacts(page);
      // Known negative rows live behind the site's counted disclosure.
      const row = page.locator('#pick-10001');
      await row.getByText(/Source: indexer, block/).waitFor({ timeout: 5000 });
      const text = await row.innerText();
      assert.ok(text.includes('At least 5 paid requests to the swarm since the start'));
      assert.ok(text.includes('Until block 26,279,931'));
      assert.ok(text.includes(rules.rules[0].registrant));
      assert.ok(text.includes(`${count} matching`));
      assert.ok(text.includes(met ? 'finds this rule met' : 'does not meet this rule'));
      assert.equal(await row.locator('.mini-card img').count(), 1);
      await row.scrollIntoViewIfNeeded();
      await shot(`eligibility-${count}-390.png`);
      if (met) {
        await row.getByRole('button', { name: 'Mint Fact: 10001 / Early Flock', exact: true }).click();
        await page.locator('dialog[open]').waitFor();
        assert.equal(await page.evaluate(() => window.__signing.length), 0);
        await page.keyboard.press('Escape');
      }
      assert.equal(await page.evaluate(() => window.__signing.length), 0);
      return { count, met };
    });
  }
  await check('Indexed history opens saved results and remains unique after scan fallback', async () => {
    await setup();
    await page.goto(preview.url + `#/fact-check?wallet=${history.wallet}`);
    await page.getByText('All fact history loaded.', { exact: true }).waitFor();
    const list = page.locator('.fc-history-list');
    assert.equal(await list.locator('.fc-history-item').count(), 5);
    for (const id of [601, 701, 1105, 1301]) assert.ok((await list.innerText()).includes(`Fact ${id}`));
    await list.scrollIntoViewIfNeeded();
    await shot('fact-history-390.png');
    await list.getByRole('link', { name: 'View agents and results' }).first().click();
    await page.getByText('✓ FACT SAVED', { exact: true }).waitFor();
    outage = true;
    await page.getByRole('button', { name: 'Refresh history', exact: true }).click();
    await page.getByText('All fact history loaded.', { exact: true }).waitFor();
    assert.equal(await page.locator('.fc-history-list .fc-history-item').count(), 5);
    assert.equal(await page.evaluate(() => window.__signing.length), 0);
  });
  await check('Keyboard focus is visible and the first mobile action remains above the fold', async () => {
    await setup();
    await page.goto(preview.url);
    await page.getByRole('button', { name: 'Explore wallet', exact: true }).waitFor();
    const input = page.getByLabel('Explore a wallet');
    await input.focus();
    await page.keyboard.press('Tab');
    const style = await page.getByRole('button', { name: 'Explore wallet', exact: true }).evaluate(el => ({ focused: el === document.activeElement, width: getComputedStyle(el).outlineWidth, color: getComputedStyle(el).outlineColor, style: getComputedStyle(el).outlineStyle }));
    assert.equal(style.focused, true);
    assert.equal(style.width, '2px');
    assert.equal(style.style, 'solid');
    await shot('focus-390.png');
    return style;
  });
  await check('No uncaught application errors in supplemental scenarios', async () => assert.deepEqual(report.errors, []));
} finally {
  await context?.close();
  await browser.close();
  await preview.close();
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: report.checks.filter(c => c.passed).length, failed: report.checks.filter(c => !c.passed) }, null, 2));
if (report.checks.some(c => !c.passed)) process.exitCode = 1;
