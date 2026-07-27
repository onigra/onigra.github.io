---
title: "例えば、アプリケーションでWebAPIのバージョニングをしない"
slug: "webapi-versioning"
date: "2015-01-05T14:36:33Z"
---

# 注意

* AWSの前提で話をしています
* 実際にこの構成を試したわけではありません
* 識者のご意見お待ちしております

年末にWebAPIのバージョニングについて考えてて、2014年にその話題で盛り上がった時の記事読みあさったり、[Web API: The Good parts](http://www.oreilly.co.jp/books/9784873116860/)読んだりしたんだけど、[発端になった@kennさんの記事](http://kenn.hatenablog.com/entry/2014/03/06/105249)のブコメで[mod_rewriteでやるべき](http://b.hatena.ne.jp/entry/185302394/comment/ikeike443)っていうのを見てなるほど、と思ったのと同時にそもそもバージョニングをアプリケーションにやらせない方が幸せになれるんじゃないかと思って、思いついたのが下記の方法。

<!--more-->

# Apacheのmod_rewriteなりNginxのrewriteを行うプロキシ層を用意し、バージョンによってアプリケーションを分ける

アプリをバージョン毎に完全に分けちゃって、uriによってリクエストするELBを決定するプロキシ層を作る。
図にするとこんな感じ。図だとサブディレクトリだけど、http headerにバージョン渡してもいいと思う。

![api-versioning](/images/api-versioning.png)

### デメリット

* サーバ台数増える
* プロキシ層を挟む分、レスポンスは遅くなる(どれくらい遅くなるかの計測はしてない)

# 同じサーバに異なるバージョンのアプリを乗せ、mod_rewriteなりrewriteを使う

普通の方法。個人的にはバージョン毎にサーバ分けたい。

# サブドメインでバージョン分ける

例えばSSL証明書を`*.example.com`で取った場合、`api-v1.example.com`みたいな名前をつけれるので、そんな感じでやる。
好みは分かれるかもしれないけど、一番楽な方法だと思う。

# 共通のデメリット

* バージョン毎の共通処理のメンテを行う場合、コストが倍になる

識者のご意見お待ちしてます

# 参考

* [APIのバージョニングは限局分岐でやるのが良い](http://kenn.hatenablog.com/entry/2014/03/06/105249)
* [rebuild.fm Episode35 You Don't Need API Version 2 (Kenn Ejima)](http://rebuild.fm/35/)
