- [ISO 8601 - Wikipedia](https://ja.wikipedia.org/wiki/ISO_8601)

## メモ

/api/v1/holidays?from=2022-01-01&to=2022-12-31&limit=10
[
  {
    date: '2022-01-01'
    name: '元旦',
    kana: 'がんたん',
    note: 'hogehoge',
  },
  ...
]

/api/v1/terms?from=2022-01-01&to=2022-12-31&category=二十四節気&limit=10
[
  {
    date: '2022-04-01'
    name: '小寒',
    kana: 'しょうかん',
    note: 'hogehoge',
    category: '二十四節気',
  },
  ...
]

/api/v1/rokuyo?from=2022-01-01&to=2022-12-31
[
  {
    date: '2022-01-01',
    rokuyo: '先負',
    kana: 'せんぷ',
    note: 'hogehoge',
  }
  ...
]

/api/v1/days?from=2022-01-01&to=2022-12-31
[
  {
    year: {
      ad: 2022,
      lunar: 2021,
      ja: '令和4年',
      era: '令和',
      eraKana: 'れいわ',
      eraYear: 4,
    },
    month: {
      ad: 1,
      lunar: 12,
      ja: '睦月',
      kana: 'むつき',
    },
    date: {
      ad: 1,
      lunar: 10,
    },
    day: {
      ad: 'Monday',
      ja: '月曜日',
      kana: 'げつようび',
    }
    rokuyo: {
      name: '先負',
      kana: 'せんぷ',
      note: 'hogehoge',
    },
    holidays: [
      {
        name: '元旦',
        kana: 'がんたん',
        note: 'hogehoge',
      }
    ],
    terms: [
      {
        name: '小寒',
        kana: 'しょうかん',
        note: 'hogehoge',
        category: '二十四節気',
      }
    ],
  },
  ...
]
