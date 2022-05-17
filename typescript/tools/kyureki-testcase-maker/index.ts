import * as fs from 'fs';

import puppeteer from 'puppeteer';

async function fillForm(page: puppeteer.Page, year: number, month: number) {
  // await page.type('input[name="var_year"]', '' + year);
  await page.evaluate((y) => {
    const el = window.document.querySelector<HTMLInputElement>('input[name="var_year"]');
    if (el) {
      el.value = '' + y
    }
  }, year);
  await page.select('select[name="var_month"]', '' + month);
  await page.select('select[name="var_cntM"]', '' + 6);
}

async function extractData(page: puppeteer.Page) {
  return await page.evaluate(() => {
    const result = [];
    const rows = document.querySelectorAll('.htCore tr');
    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i];
      const cells = row.querySelectorAll('td');
      result.push({
        ad: cells[0].innerText.trim(),
        adDay: cells[1].innerText.trim(),
        season: cells[2].innerText.trim(),
        kyureki: cells[3].innerText.trim(),
        rokuyo: cells[4].innerText.trim(),
      });
    }
    return result;
  });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 30000,
  });
  await page.goto('https://keisan.casio.jp/exec/system/1189993438');

  const args = [];
  for (let year = 2005; year <= 2023; year += 1) {
    args.push([year, 1])
    args.push([year, 7])
  }

  const result = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    await fillForm(page, arg[0], arg[1]);
    await page.click('#executebtn');
    await page.waitForTimeout(5000);
    // await page.waitForNavigation({timeout: 10000, waitUntil: "load"});
    console.log(`Running ${arg[0]}.${arg[1]}`);
    const data = await extractData(page);
    for (let j = 0; j < data.length; j += 1) {
      result.push(data[j]);
    }
    fs.writeFileSync('data.json', JSON.stringify(result));
  }

  await browser.close();
})();
