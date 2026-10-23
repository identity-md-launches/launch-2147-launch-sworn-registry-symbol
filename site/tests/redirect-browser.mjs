// Run from the repository root. External tool paths keep browser dependencies out of the site.
// node site/tests/redirect-browser.mjs --playwright /path/to/playwright/index.mjs --axe /path/to/@axe-core/playwright/dist/index.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const option = name => process.argv[process.argv.indexOf(name) + 1];
assert(process.argv.includes('--playwright'), 'Supply --playwright with an external Playwright module path');
assert(process.argv.includes('--axe'), 'Supply --axe with an external axe module path');
const { chromium, webkit } = await import(pathToFileURL(option('--playwright')).href);
const { default: AxeBuilder } = await import(pathToFileURL(option('--axe')).href);
const target = 'https://swornbyswarm.sites.imd.fun/';
const title = 'Sworn | Wallet facts on Ethereum';
const copy = 'This page served the test deployment of Sworn (swarm launch #2147). Sworn now lives at swornbyswarm.sites.imd.fun.';
const hashes = ['', '#/claim', '#/catalog', '#/about', '#/whitelistcurator', '#/fact-vs-artifact', '#/future/%E2%9C%93?q=a%26b#nested', '#//example.invalid/'];
const out = resolve('test/scratch/redirect');
await mkdir(out, { recursive: true });
const html = await readFile('dist/index.html', 'utf8');
const favicon = await readFile('dist/favicon.svg');
assert.deepEqual((await readdir('dist')).sort(), ['favicon.svg', 'index.html']);
assert.match(html, /<meta http-equiv="refresh" content="1; url=https:\/\/swornbyswarm\.sites\.imd\.fun\/"\s*\/>/);
// A fixture made from the production bytes lets us inspect the fallback after disabling only
// the two automatic navigations. The unmodified export is tested separately below.
const visual = html.replace(/<meta http-equiv="refresh"[^>]*>/, '').replace('window.location.replace(destination);', '');
assert.notEqual(visual, html);
const sentinel = '<!doctype html><html lang="en"><head><title>Before redirect</title><link rel="icon" href="data:,"></head><body>Previous page</body></html>';
const arrived = '<!doctype html><html lang="en"><head><title>Destination intercepted</title><link rel="icon" href="data:,"></head><body>Destination intercepted</body></html>';
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://127.0.0.1').pathname;
  if (path === '/before') return res.writeHead(200, { 'Content-Type': 'text/html' }).end(sentinel);
  if (path === '/preview/index.html') return res.writeHead(200, { 'Content-Type': 'text/html' }).end(html);
  if (path === '/render/index.html') return res.writeHead(200, { 'Content-Type': 'text/html' }).end(visual);
  if (path === '/preview/favicon.svg' || path === '/render/favicon.svg') return res.writeHead(200, { 'Content-Type': 'image/svg+xml' }).end(favicon);
  res.writeHead(404).end();
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const results = [];
let failures = 0;
async function check(name, run) {
  try {
    const details = await run();
    results.push({ name, passed: true, details });
    console.log('PASS', name, JSON.stringify(details ?? {}));
  } catch (error) {
    failures++;
    results.push({ name, passed: false, error: error.message });
    console.log('FAIL', name, error.message);
  }
}

try {
  for (const [engine, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
    let browser;
    try { browser = await launcher.launch({ headless: true }); }
    catch {
      results.push({ name: `${engine}: availability`, passed: null, limitation: 'Browser could not launch; rendered and interaction checks not performed in this engine.' });
      console.log('NOT VERIFIED', engine, 'could not launch');
      continue;
    }
    try {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const errors = [], forbidden = [], resourceFailures = [];
      await context.route('**/*', route => {
        const request = route.request(), url = request.url();
        if (url.startsWith(target) && request.isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: arrived });
        if (url.startsWith(origin + '/') || url.startsWith('file:')) return route.continue();
        forbidden.push(new URL(url).origin);
        return route.abort();
      });
      context.on('page', page => {
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('response', response => { if (response.status() >= 400) resourceFailures.push(response.status()); });
        page.on('requestfailed', request => {
          if (!/ABORTED|cancelled/i.test(request.failure()?.errorText ?? '')) resourceFailures.push(request.failure()?.errorText);
        });
      });

      for (const entry of ['subpath', 'file']) for (const hash of hashes) {
        await check(`${engine}: ${entry} redirects ${hash || '(no hash)'} without a history entry`, async () => {
          const page = await context.newPage();
          try {
            await page.goto(origin + '/before');
            const before = await page.evaluate(() => history.length);
            const source = entry === 'file' ? pathToFileURL(resolve('dist/index.html')).href : origin + '/preview/index.html';
            let sent, elapsed;
            page.on('request', request => {
              if (request.url().split('#')[0] === source) sent = Date.now();
              if (request.url().startsWith(target) && request.isNavigationRequest()) elapsed = Date.now() - sent;
            });
            await page.goto(source + hash, { waitUntil: 'commit' });
            await page.waitForURL(target + hash, { waitUntil: 'load' });
            assert.equal(page.url(), target + hash);
            assert.equal(await page.evaluate(() => history.length), before + 1);
            assert(elapsed < 1000, `Redirect took ${elapsed}ms`);
            await page.goBack();
            assert.equal(page.url(), origin + '/before');
            return { redirectMs: elapsed, backSkipsRedirect: true };
          } finally { await page.close(); }
        });
      }

      const page = await context.newPage();
      for (const hash of hashes) await check(`${engine}: fallback link preserves ${hash || '(no hash)'}`, async () => {
        await page.goto(origin + '/before');
        await page.goto(origin + '/render/index.html' + hash);
        assert.equal(await page.getByRole('link', { name: 'Open Sworn', exact: true }).getAttribute('href'), target + hash);
      });
      await check(`${engine}: exact copy, metadata and semantics`, async () => {
        await page.goto(origin + '/render/index.html');
        assert.equal(await page.title(), title);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('main > *').count(), 3);
        assert.equal(await page.locator('h1').innerText(), 'Sworn has moved');
        assert.equal(await page.locator('p').innerText(), copy);
        assert.equal(await page.locator('body').innerText(), 'Sworn has moved\n\n' + copy + '\n\nOpen Sworn');
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), target);
        for (const selector of ['meta[name=description]', 'meta[property="og:title"]', 'meta[property="og:image"]', 'link[rel=icon]']) assert.equal(await page.locator(selector).count(), 1);
        assert.equal(await page.locator('script[src], link[rel=stylesheet], iframe, img, button, input').count(), 0);
      });
      for (const width of [320, 390, 600, 780, 1440]) await check(`${engine}: fallback layout at ${width}`, async () => {
        await page.setViewportSize({ width, height: 844 });
        const box = await page.getByRole('link', { name: 'Open Sworn' }).boundingBox();
        assert(box && box.height >= 44 && box.y + box.height <= 844);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
        if ([320, 390, 1440].includes(width)) await page.screenshot({ path: `${out}/${engine}-${width}.png` });
        return { actionBottom: box.y + box.height, targetHeight: box.height };
      });
      await check(`${engine}: keyboard focus and Enter follow the hash link`, async () => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(origin + '/before');
        await page.goto(origin + '/render/index.html#/claim');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'open-sworn');
        const outline = await page.locator('#open-sworn').evaluate(el => {
          const style = getComputedStyle(el);
          return { width: style.outlineWidth, style: style.outlineStyle, color: style.outlineColor };
        });
        assert.equal(outline.width, '2px');
        assert.equal(outline.style, 'solid');
        await page.screenshot({ path: `${out}/${engine}-focus.png` });
        await page.keyboard.press('Enter');
        await page.waitForURL(target + '#/claim');
        return outline;
      });
      await check(`${engine}: text enlargement and reduced motion`, async () => {
        await page.goto(origin + '/render/index.html');
        await page.addStyleTag({ content: ':root { font-size: 26px; } h1 { font-size: 48px; }' });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
        assert(await page.getByRole('link', { name: 'Open Sworn' }).isVisible());
        await page.emulateMedia({ reducedMotion: 'reduce' });
        assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
      });
      await check(`${engine}: axe WCAG 2.2 AA scan of the fallback`, async () => {
        await page.goto(origin + '/render/index.html');
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(scan.violations.map(item => item.id), []);
        return { violations: 0, incomplete: scan.incomplete.map(item => item.id) };
      });
      await page.close();
      await context.close();

      for (const hash of ['', '#/claim']) await check(`${engine}: no-JavaScript refresh ${hash || '(no hash)'}`, async () => {
        const noJS = await browser.newContext({ javaScriptEnabled: false });
        await noJS.route(target + '**', route => route.fulfill({ contentType: 'text/html', body: arrived }));
        const fallback = await noJS.newPage();
        try {
          let sent, elapsed;
          fallback.on('request', request => {
            if (request.url().startsWith(origin)) sent = Date.now();
            if (request.url().startsWith(target)) elapsed = Date.now() - sent;
          });
          await fallback.goto(origin + '/preview/index.html' + hash);
          assert.equal(await fallback.getByRole('link', { name: 'Open Sworn' }).getAttribute('href'), target);
          await fallback.waitForURL(target, { timeout: 5000 });
          assert.equal(fallback.url(), target);
          assert(elapsed >= 800 && elapsed < 3000, `Refresh took ${elapsed}ms`);
          return { refreshMs: elapsed };
        } finally { await noJS.close(); }
      });
      await check(`${engine}: no console errors, unexpected requests or resource errors`, async () => {
        assert.deepEqual(errors, []);
        assert.deepEqual(forbidden, []);
        assert.deepEqual(resourceFailures, []);
      });
    } finally { await browser.close(); }
  }
} finally {
  await new Promise(done => server.close(done));
  await writeFile(`${out}/results.json`, JSON.stringify({ checks: results, passed: results.filter(item => item.passed === true).length, failed: failures, notVerified: results.filter(item => item.passed === null).length }, null, 2) + '\n');
}
process.exitCode = failures ? 1 : 0;
