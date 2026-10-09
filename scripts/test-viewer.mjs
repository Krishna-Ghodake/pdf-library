import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('1. Testing Homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'scratch_clean_homepage.png' });
  console.log('Saved scratch_clean_homepage.png');

  console.log('2. Testing Viewer for Java and WT...');
  await page.goto('http://localhost:3000/viewer/java-wt', { waitUntil: 'networkidle0' });

  // Wait for at least one pdf-page-wrapper to have rendered spans
  await page.waitForSelector('.pdf-page-wrapper .textLayer span', { timeout: 15000 });
  await page.screenshot({ path: 'scratch_java_viewer.png' });
  console.log('Saved scratch_java_viewer.png');

  // Check text spans on page 1
  const spansInfo = await page.evaluate(() => {
    const p1 = document.getElementById('pdf-page-1');
    if (!p1) return null;
    const textLayer = p1.querySelector('.textLayer');
    const spans = Array.from(textLayer.querySelectorAll('span'));
    const firstFew = spans.slice(0, 10).map((s) => ({
      text: s.textContent,
      top: s.style.top,
      left: s.style.left,
      fontSize: s.style.fontSize,
      rect: s.getBoundingClientRect(),
    }));

    // Select text using Range and Selection API
    const sel = window.getSelection();
    sel.removeAllRanges();
    const range = document.createRange();
    if (spans.length > 2) {
      range.setStart(spans[2].firstChild || spans[2], 0);
      range.setEnd(spans[2].lastChild || spans[2], spans[2].textContent.length);
      sel.addRange(range);
    }

    return {
      totalSpans: spans.length,
      sampleSpans: firstFew,
      selectedText: sel.toString(),
      scaleFactor: textLayer.style.getPropertyValue('--scale-factor'),
    };
  });

  console.log('Page 1 TextLayer diagnostics:', JSON.stringify(spansInfo, null, 2));

  await browser.close();
}

test().catch(console.error);
