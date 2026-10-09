import puppeteer from 'puppeteer-core';

async function testSelection() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000/viewer/java-wt', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page-wrapper .textLayer span', { timeout: 15000 });

  // Get the bounding rect of the span containing "Slip1:"
  const slipSpanInfo = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('.pdf-page-wrapper .textLayer span'));
    const target = spans.find((s) => s.textContent.includes('Slip1:'));
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    return {
      text: target.textContent,
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  });

  console.log('Target span "Slip1:":', slipSpanInfo);

  // Perform a mouse double click on "Slip1:" to select the word
  await page.mouse.click(slipSpanInfo.x, slipSpanInfo.y, { clickCount: 2 });

  const selectedWord = await page.evaluate(() => window.getSelection().toString());
  console.log('Word selected by mouse double-click:', JSON.stringify(selectedWord));

  // Perform mouse drag across "import java.util.*;"
  const importSpanInfo = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('.pdf-page-wrapper .textLayer span'));
    const target = spans.find((s) => s.textContent.includes('import java.util.*;'));
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    return {
      text: target.textContent,
      startX: rect.left,
      endX: rect.right,
      y: rect.top + rect.height / 2,
    };
  });

  console.log('Target line "import java.util.*;":', importSpanInfo);

  await page.mouse.move(importSpanInfo.startX, importSpanInfo.y);
  await page.mouse.down();
  await page.mouse.move(importSpanInfo.endX, importSpanInfo.y, { steps: 5 });
  await page.mouse.up();

  const selectedLine = await page.evaluate(() => window.getSelection().toString());
  console.log('Line selected by mouse drag:', JSON.stringify(selectedLine));

  await page.screenshot({ path: 'scratch_mouse_selection.png' });
  console.log('Saved scratch_mouse_selection.png');

  await browser.close();
}

testSelection().catch(console.error);
