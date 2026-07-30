---
title: "Macで適当な画像ファイルをファイルサイズ指定して作成する"
slug: "create-some-image-files-on-mac"
categories:
- command
date: "2025-05-27T00:00:00Z"
---

```sh
# 300MBのランダムデータファイルを作成
dd if=/dev/urandom of=test_image.jpg bs=1m count=300

## または、ゼロで埋めたファイル
dd if=/dev/zero of=test_image.jpg bs=1m count=300
```

## 解説

`dd`（Data Duplicator）コマンドは、ファイルやデバイスからデータを読み取り、別の場所にコピーするUnix系OSの標準コマンドです。  
ブロック単位でデータを処理するため、大きなファイルの作成やディスクイメージの操作によく使われます。

```
if=/dev/urandom: ランダムなデータを読み取り元とする
of=test_image.jpg: test_image.jpgというファイルに出力
bs=1m: 1メガバイト単位でデータを処理
count=300: 1メガバイトを300回繰り返す
```

結果: 1MB × 300 = 300MBのファイルが作成される

## ファイルを20個つくる

```sh
for i in {1..20}; do
  dd if=/dev/urandom of=test_image_${i}.jpg bs=1m count=300
done
```

## その他

これは全部Claude Sonnet 4くんに教えてもらいました
