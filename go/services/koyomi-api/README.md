- [ISO 8601 - Wikipedia](https://ja.wikipedia.org/wiki/ISO_8601)

## メモ

/api/v1/holidays?from=2022-01-01&to=2022-12-31&limit=10
[
  {
    name: '元旦',
    date: '2022-01-01'
  },
  ...
]

/api/v1/terms?from=2022-01-01&to=2022-12-31&category=二十四節気&limit=10
[
  {
    name: '小寒',
    category: '二十四節気',
    date: '2022-04-01'
  },
  ...
]

/api/v1/day?from=2022-01-01&to=2022-12-31
[
  {
    year: 2022,
    yearJa: '令和4年',
    era: '令和',
    eraKana: 'れいわ',
    eraYear: 4,
    month: 1,
    monthJa: '睦月',
    monthJaKana: 'むつき',
    date: 1,
    day: 'Monday',
    dayJa: '月曜日',
    dayJaKana: '月曜日',
    rokuyo: '先負',
    rokuyoKana: 'せんぷ',
    rokuyoNote: 'hogehoge',
    holidays: [
      {
        name: '元旦',
        note: 'hogehoge',
      }
    ],
    terms: [
      {
        name: '小寒',
        category: '二十四節気',
        note: 'hogehoge',
      }
    ],
  },
  ...
]

/calendar?from=2020-12-01&to=2020-12-31&limit=10
/calendar/2020-12-31
/schedules?from=2020-12-01&to=2020-12-31&limit=10
