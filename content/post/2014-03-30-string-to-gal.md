---
title: "文字列をギャル文字に置換するgem、String#to_galを作って（はじめて）rubygems.orgに公開した"
slug: "string-to-gal"
categories:
- ruby gem
date: "2014-03-30T01:47:54Z"
---

<blockquote class="twitter-tweet" lang="ja"><p>ぁゃぴさんのブログを社内チャットでシェアしたらみんなギャル文字で会話しはじめてる</p>&mdash; nekogeruge (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/statuses/449031574621675520">2014, 3月 27</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

ギャルで[自作PCアイドル](http://ameblo.jp/upgrade-ayp)で[jsプログラマ](http://ayapi.github.io/)の[ぁゃぴ](https://twitter.com/upgrade_ayp)さんのブログを社内のチャットでシェアしたらみんなギャル文字で会話しはじめた。

<!--more-->

<script type="text/javascript" src="http://iiirc.org/api/snippets/411.js"></script>

しかし、いかんせんおじさん達にはギャル文字を入力し続けるのは辛い。

<blockquote class="twitter-tweet" lang="ja"><p>ギャル文字変換ソリューションが求められてる</p>&mdash; nekogeruge (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/statuses/449033678618779649">2014, 3月 27</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

おじさん達にギャル文字変換ソリューションが求められてる旨をつぶやいたらぁゃぴさんが拾ってくれて、置換するスクリプトをシェアしてくれた。  

<blockquote class="twitter-tweet" lang="ja"><p>javascript:K=&#39;あいうえおやゆよわつは。&#39;;k=&#39;ぁぃぅぇぉゃゅょゎっゎo&#39;;with(document.body){for(i in K){innerHTML=innerHTML.replace(RegExp(K[i],&#39;g&#39;),k[i])}}focus();</p>&mdash; ぁゃぴ (@upgrade_ayp) <a href="https://twitter.com/upgrade_ayp/statuses/449036965619310592">2014, 3月 27</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="ja"><p>↓このスクリプト、どんな文章でもぁゃぴみたぃになるから、困った時ゎっかってね</p>&mdash; ぁゃぴ (@upgrade_ayp) <a href="https://twitter.com/upgrade_ayp/statuses/449037129440428033">2014, 3月 27</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

なんとなくRubyで書き直し、せっかくなのでgemにして公開した。  
報告したら喜んでもらえたようでよかった。  

[rubygems.org](https://rubygems.org/gems/to_gal)  
[github](https://github.com/onigra/to_gal)  

実はgemを作るのは初めてで、gemを公開するのは今年の目標の一つにしていた。  
ネタは人のものだし、大したコードじゃないが、いざ公開してみると思い入れができるもので、いろいろやりたくなってくる。  

とりあえずちゃんとしようと思って、最低限のテストは書いていてたのでTravisCI使うようにしておいた。
あとはもうちょっとテスト追加したり、置換表を外部のメソッドにしたり、置換表をもう少し増やしたりしようと思ってる。

ちなみに、本来ギャル文字はもっと色々バリエーションがあるもので、完全なギャル文字（？）に置換できるわけではない。

[Wikipedia/ギャル文字](http://ja.wikipedia.org/wiki/%E3%82%AE%E3%83%A3%E3%83%AB%E6%96%87%E5%AD%97#.E6.96.87.E5.AD.97.E4.B8.80.E8.A6.A7])

なのでぁゃぴさんも言ってるように、正確にはぁゃぴさんの文体に置換するメソッドなんだと思う。  
で、はじめに書いた時は`String#to_ayp`って名前にしてたんだけど、さすがに人の名前を勝手に使って公開するのはアレなので`String#to_gal`にした。
