import * as fs from 'fs';
import * as path from 'path';

import puppeteer from 'puppeteer';
import minimist from 'minimist';

import { config } from './config';

type Holiday = {
  name: string;
  year: number;
  month: number;
  date: number;
}

function getNAOJHolidaysUrl(year: number): string {
  const y = String(year);
  return `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}1.html`;
}

(async () => {
  const argv = minimist(process.argv.slice(2));
  if (!argv._[0]) {
    throw new Error('no required arg, year. please run with year like `npm run fetch:holidays 2022`.');
    return;
  }

  const year: number = Number(argv._[0]);
  const url = getNAOJHolidaysUrl(year);
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const holidays: Holiday[] = await page.evaluate((year) => {
    const holidays = [];
    const rows = window.document.querySelectorAll('table[summary="国民の祝日"] tr:not(:nth-child(1))');
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const cells = row.querySelectorAll('td');
      const name = cells[0].innerText.trim();
      const [month, date] = cells[1].innerText.trim().replace('日', '').split('月').map((n: string) => Number(n));

      holidays.push({
        name,
        year,
        month,
        date,
      });
    }
    return holidays;
  }, year);
  await browser.close();

  const p = path.resolve(config.dist, String(year));
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
  fs.writeFileSync(path.resolve(p, 'holidays.json'), JSON.stringify(holidays));
})();
