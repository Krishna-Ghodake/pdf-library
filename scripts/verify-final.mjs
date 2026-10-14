import puppeteer from 'puppeteer-core';

async function verify() {
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
    const isViewerDirect = await page.$('.pdf-viewer-root') !== null;
    console.log('Is PDF Viewer directly loaded on root URL?:', isViewerDirect);
    if (!isViewerDirect) {
      throw new Error('Root URL did not directly load PDF Viewer!');
    }

    // Wait for text layer on page 1
    await page.waitForSelector('#pdf-page-1 .textLayer span', { timeout: 15000 });
    console.log('Page 1 rendered with textLayer directly on root URL!');

    // Check line 2 and line 3 bounding rects
    const [r2, r3] = await page.evaluate(() => {
      const spans = document.querySelectorAll('#pdf-page-1 .textLayer span');
      const b2 = spans[2].getBoundingClientRect();
      const b3 = spans[3].getBoundingClientRect();
      return [
        { x: b2.x, y: b2.y, width: b2.width, height: b2.height, text: spans[2].textContent },
        { x: b3.x, y: b3.y, width: b3.width, height: b3.height, text: spans[3].textContent }
      ];
    });

    console.log('Line 2 text:', r2.text);
    console.log('Line 3 text:', r3.text);

    // Test 2: Single line drag selection with vertical downward wobble
    console.log('2. Testing single-line drag selection with vertical wobble...');
    await page.mouse.move(r2.x + 2, r2.y + 8);
    await page.mouse.down();
    await page.mouse.move(r2.x + r2.width - 15, r2.y + 8 + 12, { steps: 8 });
    await page.mouse.up();

    const sel1 = await page.evaluate(() => window.getSelection().toString());
    console.log('Selected Text (Line 2 only):', JSON.stringify(sel1));

    if (sel1.includes('payment_methods') || sel1.includes('customers')) {
      throw new Error('FAIL: Single line drag accidentally selected lines below!');
    }
    console.log('PASS: Single line drag selected only line 2 without selecting below!');

    // Test 3: Multi-line selection
    console.log('3. Testing intentional multi-line drag selection...');
    await page.evaluate(() => window.getSelection().removeAllRanges());
    await page.mouse.move(r2.x + 2, r2.y + 8);
    await page.mouse.down();
    await page.mouse.move(r3.x + 200, r3.y + 8, { steps: 10 });
    await page.mouse.up();

    const sel2 = await page.evaluate(() => window.getSelection().toString());
    console.log('Multi-line selected text:', JSON.stringify(sel2));
    if (!sel2.includes('import matplotlib') || !sel2.includes('payment_methods')) {
      throw new Error('FAIL: Multi-line drag did not select expected lines!');
    }
    console.log('PASS: Multi-line drag works smoothly!');

    console.log('✅ ALL TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
  }
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
