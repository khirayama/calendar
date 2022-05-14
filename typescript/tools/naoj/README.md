# NAOJ(National Astronomical Observatory of Japan)

このツールでは、日本の祝日、朔望月、二十四節気、雑節をnaojより取得することを目的とします。
国立天文台では、上記情報を翌年まで掲載しており、定期的に取得します。
また取得したデータはJSONファイルに変換に、 `config.dist` で指定されたディレクトリに作成します。

## 使用例

```
# 祝日を取得する
npm run fetch:holidays 2022
# /data/2022/holidays.json
# [{
#   name: '元旦',
#   year: 2022,
#   month: 1,
#   date: 1,
# }, ...]

# 朔望月(朔)を取得する
npm run fetch:newmoons 2022
# /data/2022/newmoons.json
# [{
#   year: 2022,
#   month: 1,
#   date: 1,
# }, ...]

# 二十四節気と雑節を取得する
npm run fetch:terms 2022
# /data/2022/terms.json
# [{
#   name: '小寒',
#   category: '二十四節気',
#   year: 2022,
#   month: 1,
#   date: 1,
# }, ...]
```

## 用語集

|用語|英語|意味|
|:-|:-|:-|
|朔望月(さくぼうげつ)|synodic month|月の満ち欠けの周期|
|二十四節気(にじゅうしせっき)|solar terms||
|雑節|special terms||

## 参考

- [日本の美しい｢季節の変化｣を英語で読んでみる | 実践！伝わる英語トレーニング | 東洋経済オンライン | 社会をよくする経済ニュース](https://toyokeizai.net/articles/-/416280?page=5)
