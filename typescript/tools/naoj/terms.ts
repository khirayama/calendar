import * as fs from 'fs';
import * as path from 'path';

import puppeteer from 'puppeteer';
import minimist from 'minimist';

import { config } from './config';

type Term = {
  name: string;
  category: '二十四節気' | '雑節';
  year: number;
  month: number;
  date: number;
}

function getNAOJTermsUrl(year: number): string {
  const y = String(year);
  return `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}2.html`;
}

(async () => {
  const argv = minimist(process.argv.slice(2));
  if (!argv._[0]) {
    throw new Error('no required arg, year. please run with year like `npm run fetch:terms 2022`.');
    return;
  }

  const year: number = Number(argv._[0]);
  const url = getNAOJTermsUrl(year);
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const terms: Term[] = await page.evaluate((year) => {
    const terms = [];
    const rows = window.document.querySelectorAll('table[summary="二十四節気および雑節"] tr:not(:nth-child(1))');
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const cells = row.querySelectorAll('td');
      if (cells.length > 1) {
        const name = cells[0].innerText.trim();
        const [month, date] = cells[2].innerText.trim().replace('日', '').split('月').map((n: string) => Number(n));
        terms.push({
          name,
          category: (cells[0].classList.contains('zasetu') ? '雑節' : '二十四節気') as Term['category'],
          year,
          month,
          date,
        });
      }
    }
    return terms;
  }, year);
  await browser.close();

  const p = path.resolve(config.dist, String(year));
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
  fs.writeFileSync(path.resolve(p, 'terms.json'), JSON.stringify(terms));
})();
