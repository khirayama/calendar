import minimist from 'minimist';

import {saveFile, fetchHolidays, fetchNewMoons, fetchTerms} from './index';

(async () => {
  const argv = minimist(process.argv.slice(2));
  if (!argv._[0]) {
    throw new Error('no required arg, resource. please run with resource like `npm run fetch holidays 2022`.');
    return;
  }

  if (!argv._[1]) {
    throw new Error('no required arg, year. please run with year like `npm run fetch holidays 2022`.');
    return;
  }

  const resource = argv._[0];
  const year: number = Number(argv._[1]);

  if (resource === 'holidays') {
    const holidays = await fetchHolidays(year);
    saveFile(year, 'holidays.json', holidays);
  } else if (resource === 'newmoons') {
    const newMoons = await fetchNewMoons(year);
    saveFile(year, 'newmoons.json', newMoons);
  } else if (resource === 'terms') {
    const terms = await fetchTerms(year);
    saveFile(year, 'terms.json', terms);
  } else if (resource === 'terms') {
  } else if (resource === 'all') {
    const holidays = await fetchHolidays(year);
    saveFile(year, 'holidays.json', holidays);

    const newMoons = await fetchNewMoons(year);
    saveFile(year, 'newmoons.json', newMoons);

    const terms = await fetchTerms(year);
    saveFile(year, 'terms.json', terms);
  } else {
    throw new Error('no resources');
    return;
  }
})();
