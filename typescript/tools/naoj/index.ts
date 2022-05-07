import * as fs from 'fs';
import * as path from 'path';

import puppeteer from 'puppeteer';

import { config } from './config';

export function saveFile(year: number, fileName: string, data: any) {
  const p = path.resolve(config.dist, String(year));
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
  fs.writeFileSync(path.resolve(p, fileName), JSON.stringify(data));
}

type Holiday = {
  name: string;
  year: number;
  month: number;
  date: number;
}

export async function fetchHolidays(year: number): Promise<Holiday[]> {
  const y = String(year);
  const url = `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}1.html`;
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const res = await page.goto(url);
  const status = (res as any)._status;

  if (status === 404) {
    throw new Error('not found.');
  }

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
  return holidays;
}

type NewMoon = {
  year: number;
  month: number;
  date: number;
}

export async function fetchNewMoons(year: number): Promise<NewMoon[]> {
  const y = String(year);
  const url = `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}3.html`;
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const res = await page.goto(url);
  const status = (res as any)._status;

  if (status === 404) {
    throw new Error('not found.');
  }

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
  return newMoons;
}

type Term = {
  name: string;
  category: '二十四節気' | '雑節';
  year: number;
  month: number;
  date: number;
}

export async function fetchTerms(year: number): Promise<Term[]> {
  const y = String(year);
  const url = `https://eco.mtk.nao.ac.jp/koyomi/yoko/${y}/rekiyou${y.slice(2)}2.html`;
  console.log(`${year}: fetch to ${url}.`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const res = await page.goto(url);
  const status = (res as any)._status;

  if (status === 404) {
    throw new Error('not found.');
  }

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
  return terms;
}
