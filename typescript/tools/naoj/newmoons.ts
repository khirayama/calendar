import * as fs from 'fs';
import * as path from 'path';

import puppeteer from 'puppeteer';
import minimist from 'minimist';

import { config } from './config';

type NewMoon = {
  year: number;
  month: number;
  date: number;
}

function getNAOJSynodicMonthUrl(year: number): string {
  const y = String(year);
  return `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}3.html`;
}

(async () => {
  const argv = minimist(process.argv.slice(2));
  if (!argv._[0]) {
    throw new Error('no required arg, year. please run with year like `npm run fetch:newmoons 2022`.');
    return;
  }

  const year: number = Number(argv._[0]);
  const url = getNAOJSynodicMonthUrl(year);
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const newMoons: NewMoon[] = await page.evaluate((year) => {
    const newMoons = [];
    const rows = window.document.querySelectorAll('table[summary="朔弦望"] tr');
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const cells = row.querySelectorAll('td');
      if (cells[0]) {
        const name = cells[0].innerText.trim();
        if (name === '朔') {
          const [month, date] = cells[1].innerText.trim().replace('日', '').split('月').map((n: string) => Number(n));
          newMoons.push({
            year,
            month,
            date,
          });
        }
      }
    }
    return newMoons;
  }, year);
  await browser.close();

  const p = path.resolve(config.dist, String(year));
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
  fs.writeFileSync(path.resolve(p, 'newmoons.json'), JSON.stringify(newMoons));
})();
