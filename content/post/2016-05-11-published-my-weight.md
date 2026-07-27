---
title: "体重を公開しました"
slug: "published-my-weight"
categories:
- 健康
date: "2016-05-11T00:19:35Z"
---

ゴールデンウィーク中に体重記録&公開用のアプリをRails作って公開しました

- [My Weight](https://damp-citadel-87713.herokuapp.com/)
- [onigra/my_weight](https://github.com/onigra/my_weight)

# 背景

会社のSlackで `#kenkou` というチャンネルの主をしていて、そこでは体重の公開義務があり参加者は毎日体重をポストしています。  
これが1年間ぐらい続いたので、ポストした体重を抽出してグラフ化して公開しました。

![体重公開を義務付けたら誰もいなくなって1人で体重をポストし続けている初期の健康チャンネルの様子](/images/kenkou.png)

体重を公開するという発想は[パーフェクトBody(仮)](http://www.slideshare.net/yuusakuiwamoto/perfect-body-48193674)というスライドに影響を受けています。

# 使用技術

SlackAPI使って体重のPOST抽出してseedにしてDBに入れて[Highcharts](http://www.highcharts.com/)で描画しただけ

# その後

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">GWに作った体重記録アプリ、彼女から私にも使わせろという要望がきた</p>&mdash; 健康 (@onigra_) <a href="https://twitter.com/onigra_/status/730053099813883904">2016年5月10日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">構築は俺がするんだけど俺にはアクセスできないようにしろという要件でなかなかハードル高い</p>&mdash; 健康 (@onigra_) <a href="https://twitter.com/onigra_/status/730053461543292928">2016年5月10日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

# その他

http://www.amazon.co.jp/dp/B00V35HEIC
