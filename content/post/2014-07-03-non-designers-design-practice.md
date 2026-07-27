---
title: "ノンデザイナーのデザイン練習 フライヤー編"
slug: "non-designers-design-practice"
categories:
- design
date: "2014-07-03T10:58:15Z"
---

![完成版](/images/flyer7.jpg)

ベーシストとして参加してる、[バイオリニスト小夜子さん](https://twitter.com/sayoko_vn)率いるBandaCapriccioのフライヤーを作った。
バイオリン、ピアノ、ギター、ベースでジャズ、ゲーム曲、ジブリ曲、歌もの等を演奏するバンドです。  

7/25に岩本町[EggmanTokyoEast](http://www.egg-mte.com/index.html)で。また、毎月第二日曜に本厚木[MacArthurGarrage](http://www.macarthurgarage.com/)にてライブやってます。よかったら聞きにきてください。

[こんな曲をやってます](https://github.com/onigra/repertory/blob/master/banda_capriccio.md)

<!--more-->

で、本題のフライヤーの作成についてなんだけど、作業量や技術的には大したことやってないが、自分は基本サーバサイドのWEBエンジニアなのでそれなりに苦労した。  
作るにあたって考えたことや使ったものを書く。

# 筆者のデザインスキル

CSSフレームワーク頼り。一応[ノンデザイナーズ・デザインブック](http://www.amazon.co.jp/%E3%83%8E%E3%83%B3%E3%83%87%E3%82%B6%E3%82%A4%E3%83%8A%E3%83%BC%E3%82%BA%E3%83%BB%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%96%E3%83%83%E3%82%AF-%E3%83%95%E3%83%AB%E3%82%AB%E3%83%A9%E3%83%BC%E6%96%B0%E8%A3%85%E5%A2%97%E8%A3%9C%E7%89%88-Robin-Williams/dp/4839928401)ぐらいは読んでる。

# TL;DR

[プロのフォトグラファー](http://rising-up-studios.com/)にかっこいい白黒写真撮ってもらって[PicMonkey](http://www.picmonkey.com/)で[GeosansLight](http://www.dafont.com/geo-sans-light.font)乗せろ

# 何はともあれ写真

グラフィックデザインができないので、写真に頼る。バンドなら、ライブの写真をプロに撮ってもらうのが一番だと思う。  
小夜子さんの友達の[StephenJackson](http://rising-up-studios.com/)っていうフォトグラファーが超かっこいい写真を撮ってくれたので、これをフルに活用する。ありがとうStephen!!

![元写真](/images/band.jpg)

# 画像加工

フォトショもGIMPも使えないのでWEBサービスでやる。PicMonkeyというやつがよかった。無料でかなりのことができる。   

[PicMonkey](http://www.picmonkey.com/)

便利なんだけど、作ったやつをjpgとpngでしか保存できなくて、後で文字だけ変えるみたいなことができない。有償アカウントならできるのかな。今後はGIMPでやることになるかも。

紙媒体とWEBってきっとデザインの考え方が違うんだろうけど、WEBしか知らないのでWEBの延長線上で考える。    

最近流行りのかっこいい画像or写真をドーンとやった後にきれいなフォント乗せる感じでやってみる。イメージはこの辺。

* [http://www.consul.io/](http://www.consul.io/)
* [https://squareup.com/](https://squareup.com/)
* [http://domains.google.com/about/index.html](http://domains.google.com/about/index.html)
* [http://www.homelessfonts.org/](http://www.homelessfonts.org/)

はじめに小夜子さんが草案を送ってきてくれて、自分のイメージと近かった。  
これをベースにやってみる。

![flyer1](/images/flyer1.jpg)

フォントを[GeosansLight](http://www.dafont.com/geo-sans-light.font)に変える。ミニマルなデザイン良い。しかもフリー。  
クールでミニマルな印象にしたいのであればこれ選べば間違いなさそうという知見を得た。  

はじめに作った奴。そのままフォント置いたら見えにくいので、黒い半透明のオーバーレイを下に敷いてる。`!`はなんとなくつけてみた。

![flyer2](/images/flyer2.jpg)

バンド名を大文字にしてみてほしいと言われたので大文字にする。

![flyer3](/images/flyer3.jpg)

ふと思い立ってバンド名を極端に大きくしてみる。これがけっこうメンバーにウケた。

![flyer4](/images/flyer4.jpg)

少し小さくしてみる。最終的に大きいほうになった。

![flyer5](/images/flyer5.jpg)

写真が中心にいる小夜子さんに視線がいくようになってるので、それを崩さないように調整。

![flyer6](/images/flyer6.jpg)

オーバーレイを下半分全体にしてもいいんじゃない？と言われたのでやってみた。最終的にこれが採用。

![flyer7](/images/flyer7.jpg)

あと気を使ったことと言えば

* フォントカラーをちゃんと合わせる(当たり前か)
* フォントサイズを合わせる(これも当たり前か)
* オーバーレイの左と下の隙間を同じぐらいにする
  * PicMonkeyはピクセル数が出なかったので感覚でやった
* フォントの左側の並びを合わせる
  * これも仕方ないので感覚で
* 上でも書いたけど、中心にいる小夜子さんに視線が行くように気を使う

# 感想

写真とフォント様々といった感じ。フォントはうまい探し方とか情報の集め方とか覚えたいですね。  
あと本職のデザイナーさんがやるとどんな感じになるのか見てみたい。見て技を盗みたい。 

