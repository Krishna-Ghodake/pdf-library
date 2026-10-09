import puppeteer from 'puppeteer-core';

async function testBothPdfs() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Test Java and WT
  console.log('Testing PDF 1 (Java and WT)...');
  await page.goto('http://localhost:3000/viewer/java-wt', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page-wrapper .textLayer span');

  const doc1Selection = await page.evaluate(() => {
    const p1 = document.getElementById('pdf-page-1');
    const span = Array.from(p1.querySelectorAll('.textLayer span')).find((s) =>
      s.textContent.includes('import')
    );
    const r = span.getBoundingClientRect();
    return {
      text: span.textContent,
      left: r.left,
      right: r.right,
      midY: r.top + r.height / 2,
    };
  });

  await page.mouse.move(doc1Selection.left + 5, doc1Selection.midY);
  await page.mouse.down();
  await page.mouse.move(doc1Selection.right - 5, doc1Selection.midY, { steps: 10 });
  await page.mouse.up();

  const sel1 = await page.evaluate(() => window.getSelection().toString());
  console.log('PDF 1 Selected Text:', JSON.stringify(sel1));

  // 2. Test F Java WT
  console.log('Testing PDF 2 (F Java WT)...');
  await page.goto('http://localhost:3000/viewer/f-java-wt', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page-wrapper .textLayer span');

  const doc2Selection = await page.evaluate(() => {
    const p1 = document.getElementById('pdf-page-1');
    const span = Array.from(p1.querySelectorAll('.textLayer span')).find((s) =>
      s.textContent.includes('Practical Exam Solutions')
    );
    const r = span.getBoundingClientRect();
    return {
      text: span.textContent,
      left: r.left,
      right: r.right,
      midY: r.top + r.height / 2,
    };
  });

  await page.mouse.move(doc2Selection.left + 5, doc2Selection.midY);
  await page.mouse.down();
  await page.mouse.move(doc2Selection.right - 5, doc2Selection.midY, { steps: 10 });
  await page.mouse.up();

  const sel2 = await page.evaluate(() => window.getSelection().toString());
  console.log('PDF 2 Selected Text:', JSON.stringify(sel2));

  await browser.close();
}

testBothPdfs().catch(console.error);
