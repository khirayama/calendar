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

function getNAOJHolidaysUrl(year: string): string {
  return `https://eco.mtk.nao.ac.jp/koyomi/yoko/${year}/rekiyou${year.slice(2)}1.html`;
}

(async () => {
  const argv = minimist(process.argv.slice(2));
  const year = String(argv._[0]);
  console.log(`target: ${year}`);
  const holidays: Holiday[] = [];
  const url = getNAOJHolidaysUrl(year);
  console.log(`fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await browser.close();

  const p = path.resolve(config.dist, year);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
  fs.writeFileSync(path.resolve(p, 'holidays.json'), JSON.stringify(holidays));
})();
