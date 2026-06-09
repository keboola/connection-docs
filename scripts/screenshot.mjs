import { chromium } from 'playwright';

const path = process.argv[2] || '/overview/';
const url = `http://localhost:4321${path}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: 'screenshot-current.png',
    fullPage: false
  });
  console.log(`Screenshot saved: screenshot-current.png (${url})`);
} finally {
  await browser.close();
}
