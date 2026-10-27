// Read-only checks of the exact Sworn 1.0.1 export. This script never invokes a build.
// npm ci in web/ supplies Playwright; an external module may also be selected.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { server, forwardRpc } from '../web/tests/harness.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const out = path.resolve(root, args.includes('--out') ? args[args.indexOf('--out') + 1] : 'test/scratch/release-browser');
await fs.mkdir(out, { recursive: true });
const moduleUrl = process.env.SWORN_PLAYWRIGHT_MODULE
  ? pathToFileURL(path.resolve(process.env.SWORN_PLAYWRIGHT_MODULE)).href
  : new URL('../web/node_modules/@playwright/test/index.mjs', import.meta.url).href;
const { chromium, webkit } = await import(moduleUrl);
const preview = await server();
const origin = new URL(preview.url).origin;
const report = {
  exportCommit: '5e0dce32d16e034d02dc018323c8615f37188383',
  productionBuildRun: false,
  servedUnderSubpath: '/preview/',
  mainnetSource: 'https://ethereum-rpc.publicnode.com',
  rpcTransport: process.env.SWORN_TEST_RPC ? 'Contributor read-only RPC override; exported files unchanged' : 'Public browser RPCs',
  engines: {}, checks: [], layouts: [], screenshots: [], pageErrors: [], consoleErrors: [], localHttpErrors: [], limitations: [],
};
const readRpc = /https:\/\/(?:ethereum-rpc\.publicnode\.com|gateway\.tenderly\.co|rpc\.mevblocker\.io|eth\.drpc\.org|1\.rpc\.thirdweb\.com)(?:\/|$)/;
const check = async (name, fn) => {
  try { const result = await fn(); report.checks.push({ name, passed: true, ...(result ? { result } : {}) }); }
  catch (error) { report.checks.push({ name, passed: false, error: error.message.slice(0, 2000).replaceAll(origin, '<preview>') }); }
};
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const shot = async (page, name) => {
  await page.screenshot({ path: path.join(out, name), fullPage: false });
  report.screenshots.push(name);
};
let browser;
try {
  browser = await chromium.launch({ headless: true });
  report.engines.chromium = browser.version();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  if (process.env.SWORN_TEST_RPC) await context.route(readRpc, async route => {
    try {
      const body = await forwardRpc(process.env.SWORN_TEST_RPC, route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: 'application/json', body });
    } catch { await route.fulfill({ status: 503, body: 'Read-only verification transport unavailable' }); }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push(message.text().replaceAll(origin, '<preview>'));
  });
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(origin))
      report.localHttpErrors.push({ path: new URL(response.url()).pathname, status: response.status() });
  });
  await page.goto(preview.url);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await check('390px first screen contains product, address field and main action', async () => {
    const box = await page.getByRole('button', { name: 'Explore wallet', exact: true }).boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= 844);
    assert.ok(await page.getByLabel('Explore a wallet').isVisible());
    await shot(page, 'landing-390.png');
    return { actionTop: box.y, actionBottom: box.y + box.height, viewportHeight: 844 };
  });
  await check('Invalid address shows a correction, sets aria-invalid and focuses input', async () => {
    await page.getByRole('button', { name: 'Explore wallet', exact: true }).click();
    const input = page.getByLabel('Explore a wallet');
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    assert.ok(await input.evaluate(el => el === document.activeElement));
    assert.ok(await page.getByText('Enter an Ethereum address: 0x followed by 40 hexadecimal characters.', { exact: true }).isVisible());
  });
  await check('Wallet dialog keyboard containment, Escape, backdrop and focus return', async () => {
    const trigger = page.getByRole('button', { name: 'Connect', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Connect a wallet' });
    try {
      await trigger.click();
      await dialog.waitFor();
      assert.ok(await dialog.evaluate(el => el.matches(':modal')));
      assert.ok(await dialog.getByRole('button', { name: 'Browser wallet', exact: true }).isVisible());
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        // Native modal dialogs allow focus to visit browser chrome. In that
        // case the document reports body as active; no background control may be.
        assert.ok(await dialog.evaluate(el => document.activeElement === document.body || el.contains(document.activeElement)));
      }
      await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false);
      assert.ok(await trigger.evaluate(el => el === document.activeElement));
      await trigger.click();
      await page.mouse.click(2, 2);
      assert.equal(await dialog.isVisible(), false);
    } finally {
      if (await dialog.isVisible()) await page.keyboard.press('Escape');
    }
  });
  await check('Ethereum deployment verification and current price read', async () => {
    await page.locator('footer [role="status"]').filter({ hasText: 'Ethereum mainnet · block' }).waitFor({ timeout: 60000 });
    return (await page.locator('footer [role="status"]').allTextContents()).join(' ');
  });
  await check('Valid address loads real Registry/Curator facts and Renderer metadata', async () => {
    const shard = JSON.parse(await fs.readFile(path.join(root, 'dist/data/eligibility/wallets-0.json'), 'utf8'));
    const wallet = Object.keys(shard).find(address => !address.startsWith('0x0000'));
    assert.ok(wallet, 'Use a real address from the pinned census');
    await page.getByLabel('Explore a wallet').fill(wallet);
    await page.getByLabel('Explore a wallet').press('Enter');
    await page.getByText('Wallet facts loaded.', { exact: true }).waitFor({ timeout: 60000 });
    assert.ok(page.url().includes('#/explorer?address='));
    await page.getByText('Lossless raw tokenURI metadata', { exact: true }).click();
    const download = page.getByRole('link', { name: 'Download exact metadata', exact: true });
    const raw = JSON.parse(decodeURIComponent((await download.getAttribute('href')).split(',').slice(1).join(',')));
    assert.equal(typeof raw.name, 'string');
    assert.ok(raw.image.startsWith('data:image/svg+xml'));
    assert.ok(Array.isArray(raw.attributes));
    return { walletSource: 'dist/data/eligibility/wallets-0.json', metadataName: raw.name, attributes: raw.attributes.length };
  });
  const routes = ['/', '/catalog', '/mint', '/request', '/fact-check', '/register', '/wallet', '/curator', '/integrate', '/about'];
  for (const width of [320, 390, 780, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) await check(`Route ${route} at ${width}px: heading and no page overflow`, async () => {
      await page.goto(`${preview.url}#${route}`);
      await page.getByRole('heading', { level: 1 }).waitFor();
      await settle(page);
      const metric = await page.evaluate(() => ({
        heading: document.querySelector('h1').textContent,
        viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      }));
      report.layouts.push({ route, ...metric });
      assert.ok(metric.scrollWidth <= metric.viewport, JSON.stringify(metric));
      if (width === 390 && route !== '/') await shot(page, `${route.slice(1)}-390.png`);
      if (width === 1440 && route === '/') await shot(page, 'landing-1440.png');
    });
  }
  await check('Unknown hash route has a usable return link', async () => {
    await page.goto(`${preview.url}#/missing-page`);
    await page.getByRole('heading', { name: 'Page not found', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Return to Sworn', exact: true }).click();
    await page.getByRole('button', { name: 'Explore wallet', exact: true }).waitFor();
  });
  await check('Legacy claim bookmark resolves to the Mint Card task', async () => {
    await page.goto(`${preview.url}#/claim`);
    await page.getByRole('heading', { level: 1, name: 'Mint Card', exact: true }).waitFor();
  });
  await check('Mint/request tasks offer connection before signing', async () => {
    await page.goto(`${preview.url}#/mint`);
    assert.ok(await page.getByRole('button', { name: /Connect/ }).count());
    await page.goto(`${preview.url}#/request`);
    await page.getByRole('heading', { level: 1, name: 'Mint Wallet Facts', exact: true }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
  });
  await check('Fact Check disconnected action opens the native wallet sheet and restores focus', async () => {
    await page.goto(`${preview.url}#/fact-check`);
    await page.getByRole('heading', { level: 1, name: 'Fact Check', exact: true }).waitFor();
    const connect = page.locator('main').getByRole('button', { name: 'Connect wallet', exact: true });
    const box = await connect.boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= 844);
    await connect.click();
    const dialog = page.getByRole('dialog', { name: 'Connect a wallet' });
    await dialog.waitFor();
    assert.ok(await dialog.evaluate(el => el.matches(':modal')));
    await page.keyboard.press('Escape');
    assert.equal(await dialog.isVisible(), false);
    assert.ok(await connect.evaluate(el => el === document.activeElement));
  });
  await check('Navigation More opens by keyboard, closes on Escape and preserves focus', async () => {
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    const more = nav.locator('summary');
    await more.focus();
    await page.keyboard.press('Enter');
    await nav.getByRole('link', { name: 'Curator', exact: true }).waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    assert.equal(await nav.getByRole('link', { name: 'Curator', exact: true }).isVisible(), false);
    assert.ok(await more.evaluate(el => el === document.activeElement));
  });
  await check('Fact Check legacy bookmarks reach the live page without demo controls', async () => {
    for (const route of ['/fact-check-demo', '/oracle']) {
      await page.goto(`${preview.url}#${route}`);
      await page.getByRole('heading', { name: 'Fact Check', level: 1, exact: true }).waitFor();
      assert.equal(await page.getByText('Choose a static snapshot', { exact: true }).count(), 0);
      assert.ok(await page.locator('main').getByRole('button', { name: 'Connect wallet', exact: true }).isVisible());
    }
  });
  await check('Fact Check loads saved facts for a wallet discovered from Registry logs', async () => {
    const handoff = JSON.parse(await fs.readFile(path.join(root, 'web/deployment-handoff.json'), 'utf8'));
    const registry = handoff.contracts.find(contract => contract.name === 'Registry');
    // keccak256("CardMinted(address,uint256)"), from the pinned Registry ABI.
    const topic = '0x91f9f8eee707de5d1301c45b783fb95d1e7fd7535bf3f7dda2f950a9b488ccb2';
    const response = JSON.parse(await forwardRpc(process.env.SWORN_TEST_RPC || report.mainnetSource, {
      jsonrpc: '2.0', id: 1, method: 'eth_getLogs', params: [{
        address: registry.address,
        fromBlock: `0x${registry.blockNumber.toString(16)}`,
        toBlock: `0x${(registry.blockNumber + 7199).toString(16)}`,
        topics: [topic],
      }],
    }));
    assert.ok(!response.error, JSON.stringify(response.error));
    const mint = response.result?.[0];
    assert.ok(mint, 'No early CardMinted event available from the provider');
    const wallet = `0x${mint.topics[1].slice(-40)}`;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${preview.url}#/fact-check?wallet=${wallet}`);
    await page.getByRole('heading', { level: 1, name: 'Fact Check', exact: true }).waitFor();
    await page.getByText('All fact history loaded.', { exact: true }).waitFor({ timeout: 60000 });
    const row = page.locator('.fc-history-item').first();
    await row.waitFor();
    assert.ok((await row.locator('.fc-history-question').allTextContents()).join(' ').length > 20);
    const transaction = (await row.getByRole('link', { name: /^View transaction for/ }).getAttribute('href')).split('/').at(-1);
    assert.match(transaction, /^0x[0-9a-f]{64}$/i);
    const receipt = JSON.parse(await forwardRpc(process.env.SWORN_TEST_RPC || report.mainnetSource, {
      jsonrpc: '2.0', id: 2, method: 'eth_getTransactionReceipt', params: [transaction],
    })).result;
    assert.equal(receipt.status, '0x1');
    assert.ok(receipt.logs.some(log => log.address.toLowerCase() === registry.address.toLowerCase()
      && log.topics.some(topic => topic.toLowerCase() === `0x${wallet.slice(2).padStart(64, '0')}`)));
    assert.ok(await page.getByRole('button', { name: 'Refresh history', exact: true }).isEnabled());
    const layout = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(layout.scrollWidth <= layout.viewport);
    await shot(page, 'fact-history-390.png');
    return { wallet, source: 'Ethereum Registry logs and successful history transaction receipt', transaction, displayedFacts: await page.locator('.fc-history-item').count(), ...layout };
  });
  await check('An invalid oracle request link explains recovery and returns to Mint Facts', async () => {
    await page.goto(`${preview.url}#/fact-check?request=invalid`);
    await page.getByRole('alert').filter({ hasText: 'This oracle request link is incomplete or invalid.' }).waitFor();
    await page.locator('main').getByRole('link', { name: 'Mint Facts ↗', exact: true }).first().click();
    await page.getByRole('heading', { name: 'Mint Wallet Facts', level: 1, exact: true }).waitFor();
  });
  await check('Mint Facts section jump focuses the choices and keeps the guide available', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${preview.url}#/request`);
    const nav = page.getByRole('navigation', { name: 'Mint Facts sections' });
    await nav.getByRole('link', { name: 'Choose facts to mint' }).click();
    await page.waitForFunction(() => document.getElementById('step-02')?.contains(document.activeElement));
    const box = await page.locator('.trait-picker .picker-row').first().boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height < 844);
    const guide = page.locator('.fact-evidence-guide');
    await guide.locator('summary').click();
    assert.ok(await guide.getByText(/request fee is not refunded/).isVisible());
  });
  await check('Curator fact filtering exports a real historical JSON selection', async () => {
    await page.goto(`${preview.url}#/curator`);
    const exportButton = page.getByRole('button', { name: 'Export wallet list', exact: true });
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some(button => button.textContent === 'Export wallet list' && !button.disabled), null, { timeout: 60000 });
    await page.locator('.curator-facts input[type="checkbox"]').first().check();
    await page.getByRole('combobox', { name: 'Export format', exact: true }).selectOption('json');
    const count = Number(await page.locator('#curator-panel-build [role="status"] strong').textContent());
    assert.ok(count > 0);
    const pendingDownload = page.waitForEvent('download');
    await exportButton.click();
    const download = await pendingDownload;
    assert.equal(download.suggestedFilename(), 'sworn-historical-candidates.json');
    const data = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
    assert.equal(data.wallets.length, count);
    assert.equal(data.selectionSource, 'historical-candidates');
    assert.equal(data.chainId, 1);
    assert.ok(data.wallets.every(row => /^0x[0-9a-f]{40}$/i.test(row.address)));
    assert.ok(data.wallets.every(row => row.matchedFacts.includes(101)));
    return { exportedWallets: count, selectionSource: data.selectionSource };
  });
  await check('Curator tab keyboard navigation and malformed consumer validation', async () => {
    const tab = page.getByRole('tab', { name: 'Build a list', exact: true });
    await tab.focus();
    await page.keyboard.press('ArrowRight');
    const consumer = page.getByRole('tab', { name: 'Consume facts', exact: true });
    assert.equal(await consumer.getAttribute('aria-selected'), 'true');
    await page.locator('#curator-consume-address').fill('invalid-address');
    await page.getByRole('button', { name: 'Check eligibility', exact: true }).click();
    await page.locator('.curator-consumption').waitFor();
    assert.ok(await page.getByRole('heading', { name: 'Enter an address with 0x and 40 hexadecimal characters.', exact: true }).isVisible());
  });
  await check('Documentation search returns local results and Escape clears them', async () => {
    await page.goto(`${preview.url}docs/index.html`);
    const input = page.locator('#doc-search');
    await input.fill('hasTrait');
    await page.locator('#search-results a').first().waitFor();
    const count = await page.locator('#search-results a').count();
    assert.ok(count > 0);
    await input.press('Escape');
    assert.equal(await input.inputValue(), '');
    assert.equal(await page.locator('#search-results').isVisible(), false);
    return { displayedResults: count };
  });
  await check('Explicit RPC failure displays an honest unavailable state', async () => {
    const offline = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await offline.route(readRpc, route => route.fulfill({ status: 503, body: 'Verification: provider unavailable' }));
    const failurePage = await offline.newPage();
    try {
      await failurePage.goto(preview.url);
      await failurePage.getByText('Cannot read the chain, retrying.', { exact: true }).waitFor({ timeout: 60000 });
      assert.ok(await failurePage.getByRole('button', { name: 'Explore wallet', exact: true }).isVisible());
    } finally { await offline.close(); }
  });
  await check('No uncaught page errors or failed local resources', async () => {
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.consoleErrors, []);
    assert.deepEqual(report.localHttpErrors, []);
  });
  await context.close();
  try {
    const safari = await webkit.launch({ headless: true });
    report.engines.webkit = safari.version();
    try {
      const safariPage = await safari.newPage({ viewport: { width: 390, height: 844 } });
      await safariPage.goto(preview.url);
      await safariPage.getByRole('button', { name: 'Explore wallet', exact: true }).waitFor();
      await safariPage.getByRole('button', { name: 'Explore wallet', exact: true }).click();
      assert.equal(await safariPage.getByLabel('Explore a wallet').getAttribute('aria-invalid'), 'true');
      report.checks.push({ name: 'WebKit primary address interaction', passed: true });
    } finally { await safari.close(); }
  } catch (error) {
    report.engines.webkit = 'Unavailable';
    report.limitations.push('WebKit did not run: ' + (error.message.includes('missing dependencies') ? 'host system is missing required shared libraries.' : error.message.split('\n')[0]));
  }
} catch (error) {
  report.checks.push({ name: 'Browser validation completed', passed: false, error: error.message.replaceAll(origin, '<preview>') });
} finally {
  if (browser) await browser.close();
  await preview.close();
  report.limitations.push('No wallet account, signature, transaction broadcast, native-device, screen-reader or browser-native zoom test.');
  await fs.writeFile(path.join(out, 'results.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: report.checks.filter(c => c.passed).length, failed: report.checks.filter(c => !c.passed), limitations: report.limitations }, null, 2));
if (report.checks.some(c => !c.passed)) process.exitCode = 1;
