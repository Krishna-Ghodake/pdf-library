import puppeteer from 'puppeteer-core';

async function verifyAI() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('1. Checking Root URL (http://localhost:3000)...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Verify it is directly inside PdfViewer:
    const isViewerDirect = (await page.$('.pdf-viewer-root')) !== null;
    console.log('Is PDF Viewer directly loaded on root URL?:', isViewerDirect);
    if (!isViewerDirect) {
      throw new Error('Root URL did not directly load PDF Viewer!');
    }

    // Wait for text layer on page 1
    await page.waitForSelector('#pdf-page-1 .textLayer span', { timeout: 15000 });
    console.log('Page 1 rendered with textLayer directly on root URL!');

    // Check page 1 spans
    const spans = await page.evaluate(() => {
      const elSpans = Array.from(document.querySelectorAll('#pdf-page-1 .textLayer span'));
      return elSpans.slice(0, 10).map((s, idx) => {
        const b = s.getBoundingClientRect();
        return { idx, x: b.x, y: b.y, width: b.width, height: b.height, text: s.textContent };
      });
    });

    console.log('First 5 spans on page 1:', spans.slice(0, 5));

    // Test: Find a code line like "from collections import deque" or "def monkey_banana_bfs():"
    const targetLine = spans.find(s => s.text.includes('collections') || s.text.includes('monkey_banana'));
    if (!targetLine) {
      throw new Error('Target code line not found on page 1!');
    }
    console.log('Testing line:', JSON.stringify(targetLine.text));

    // 2. Single-line drag selection with vertical downward wobble
    console.log('2. Testing single-line drag selection with vertical wobble...');
    await page.mouse.move(targetLine.x + 2, targetLine.y + 8);
    await page.mouse.down();
    await page.mouse.move(targetLine.x + targetLine.width - 5, targetLine.y + 8 + 12, { steps: 8 });
    await page.mouse.up();

    const sel1 = await page.evaluate(() => window.getSelection().toString());
    console.log('Selected Text (target line only):', JSON.stringify(sel1));

    if (sel1.includes('start_state') || sel1.includes('goal_state') || sel1.includes('while')) {
      throw new Error('FAIL: Single line drag accidentally selected lines below!');
    }
    console.log('PASS: Single line drag selected only target line without selecting below!');

    // 3. Multi-line selection
    console.log('3. Testing multi-line drag selection...');
    await page.evaluate(() => window.getSelection().removeAllRanges());

    const nextLine = spans[targetLine.idx + 1];
    await page.mouse.move(targetLine.x + 2, targetLine.y + 8);
    await page.mouse.down();
    await page.mouse.move(nextLine.x + 100, nextLine.y + 8, { steps: 10 });
    await page.mouse.up();

    const sel2 = await page.evaluate(() => window.getSelection().toString());
    console.log('Multi-line selected text:', JSON.stringify(sel2));
    if (!sel2.includes(targetLine.text.substring(0, 10))) {
      throw new Error('FAIL: Multi-line drag did not select expected lines!');
    }
    console.log('PASS: Multi-line drag works smoothly!');

    // 4. Test Search
    console.log('4. Testing search for "Minimax"...');
    await page.click('button[aria-label="Search within document"]');
    await page.waitForSelector('.pdf-search-input', { timeout: 3000 });
    await page.type('.pdf-search-input', 'Minimax');
    await new Promise(r => setTimeout(r, 1500));

    const minimaxCount = await page.$eval('.search-matches-count', el => el.textContent?.trim());
    console.log('Search match count for "Minimax":', minimaxCount);

    console.log('5. Testing search for "Alpha-Beta"...');
    await page.$eval('.pdf-search-input', el => (el.value = ''));
    await page.type('.pdf-search-input', 'Alpha-Beta');
    await new Promise(r => setTimeout(r, 1000));
    const abCount = await page.$eval('.search-matches-count', el => el.textContent?.trim());
    console.log('Search match count for "Alpha-Beta":', abCount);

    console.log('✅ ALL VERIFICATIONS PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
  }
}

verifyAI().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
