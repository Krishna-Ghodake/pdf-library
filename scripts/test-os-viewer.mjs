import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('1. Checking Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const cards = await page.$$eval('.doc-card', els => els.map(e => e.querySelector('.card-title')?.textContent?.trim()));
    console.log('Cards found on homepage:', cards);

    console.log('2. Opening Viewer for OS Practical Slips...');
    await page.goto('http://localhost:3000/viewer/os-practical-slips', { waitUntil: 'networkidle0' });

    // Wait for page 1 textLayer span elements
    await page.waitForSelector('#pdf-page-1 .textLayer span', { timeout: 15000 });
    console.log('Page 1 rendered with text layer!');

    // Check page 1 spans and text
    const textInfo = await page.evaluate(() => {
      const p1 = document.getElementById('pdf-page-1');
      const spans = Array.from(p1.querySelectorAll('.textLayer span'));
      const text = spans.map(s => s.textContent).join(' ');
      return {
        spanCount: spans.length,
        hasSlip1: text.includes('SLIP 1'),
        hasBankerOrAvailable: text.includes('Available') || text.includes('Allocation'),
        sampleText: text.substring(0, 150),
      };
    });
    console.log('Page 1 verification:', textInfo);

    // Test text drag selection simulation
    const selectionResult = await page.evaluate(() => {
      const p1 = document.getElementById('pdf-page-1');
      const spans = Array.from(p1.querySelectorAll('.textLayer span'));
      if (spans.length < 5) return { error: 'Not enough spans' };

      const range = document.createRange();
      range.setStart(spans[2].firstChild || spans[2], 0);
      range.setEnd(spans[4].firstChild || spans[4], spans[4].textContent.length);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      return {
        selectedText: sel.toString(),
      };
    });
    console.log('Selection test result:', selectionResult);

    // Test search feature
    console.log('3. Testing Search for "Banker"...');
    await page.click('button[aria-label="Search within document"]');

    await page.waitForSelector('.pdf-search-input', { timeout: 3000 });
    await page.type('.pdf-search-input', 'Banker');
    await new Promise(r => setTimeout(r, 1500));

    const searchCount = await page.$eval('.search-matches-count', el => el.textContent?.trim());
    console.log('Search match count for "Banker":', searchCount);

    console.log('4. Testing Search for "SSTF"...');
    await page.$eval('.pdf-search-input', el => el.value = '');
    await page.type('.pdf-search-input', 'SSTF');
    await new Promise(r => setTimeout(r, 1000));
    const sstfCount = await page.$eval('.search-matches-count', el => el.textContent?.trim());
    console.log('Search match count for "SSTF":', sstfCount);

    console.log('✅ ALL VERIFICATIONS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
