# 旧暦テストケースメーカ

[旧暦カレンダー - 高精度計算サイト](https://keisan.casio.jp/exec/system/1189993438)からテストケースを作成する。
`index.ts` で、旧暦と六曜を持ったJSONデータ `data.json` を作成し、 `create_testcases_for_go` で、 Goのpkgである `koyomi` 用のテストケースをテキストデータとして作成する。
