const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data.json'));

let result = [];
for (let i = 0; i < data.length; i += 1) {
  const d = data[i];
  const [year, month, date] = d.ad.split('/')
  let [qy, qm, qd] = d.kyureki.split('/')
  let isLeap = 'false';
  if (qm.indexOf('閏') !== -1) {
    isLeap = 'true';
    qm = qm.replace('閏', '').trim();
  }
  result.push(`{time.Date(${Number(year)}, ${Number(month)}, ${Number(date)}, 0, 0, 0, 0, JST), Kyureki{${Number(qy)}, ${Number(qm)}, ${Number(qd)}, ${isLeap}, "${d.rokuyo}"}},`);
}
fs.writeFileSync('./testcases/koyomi.go.txt', result.join('\n'));
