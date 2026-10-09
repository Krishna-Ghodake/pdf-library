import puppeteer from 'puppeteer-core';

async function verifySlip12() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Verify Java and WT Page 42/43
  console.log('1. Checking Java and WT total pages and last page...');
  await page.goto('http://localhost:3000/viewer/java-wt', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page-wrapper .textLayer span');

  const doc1Info = await page.evaluate(async () => {
    // Jump to page 42
    const input = document.querySelector('.page-input');
    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.form.dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise((res) => setTimeout(res, 800));

    const p42 = document.getElementById('pdf-page-42');
    const p43 = document.getElementById('pdf-page-43');
    const text42 = p42 ? p42.querySelector('.textLayer')?.textContent : '';
    const text43 = p43 ? p43.querySelector('.textLayer')?.textContent : '';

    return {
      numPagesText: document.querySelector('.page-input-wrapper')?.textContent,
      hasSlip12OnP42: text42.includes('Slip12') && text42.includes('Indoor'),
      hasSlip12OnP43: text43.includes('Slip12_2') && text43.includes('total'),
    };
  });

  console.log('Java and WT verification:', doc1Info);

  // 2. Verify F Java WT Page 31/32
  console.log('2. Checking F Java WT total pages and last page...');
  await page.goto('http://localhost:3000/viewer/f-java-wt', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page-wrapper .textLayer span');

  const doc2Info = await page.evaluate(async () => {
    const input = document.querySelector('.page-input');
    input.value = '31';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.form.dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise((res) => setTimeout(res, 800));

    const p31 = document.getElementById('pdf-page-31');
    const p32 = document.getElementById('pdf-page-32');
    const text31 = p31 ? p31.querySelector('.textLayer')?.textContent : '';
    const text32 = p32 ? p32.querySelector('.textLayer')?.textContent : '';

    return {
      numPagesText: document.querySelector('.page-input-wrapper')?.textContent,
      hasSlip12OnP31: text31.includes('Slip 12') && text31.includes('game'),
      hasSlip12OnP32: text32.includes('Slip 12') && text32.includes('template literals'),
    };
  });

  console.log('F Java WT verification:', doc2Info);

  await browser.close();
}

verifySlip12().catch(console.error);
