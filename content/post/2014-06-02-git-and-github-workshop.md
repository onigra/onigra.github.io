---
title: "gitとgithubについて初心者に教える時にやってるやり方"
slug: "git-and-github-workshop"
categories:
- git github
date: "2014-06-02T20:03:28Z"
---

2度ほどgit&github初心者(gitは多少使えて、githubは使えない、あるいはほとんど使っていないエンジニア及びデザイナー)に対して使い方を教えるのをワークショップ形式でやったことがあるんですが、  
今後の教えることになった時に備えて備忘兼ねて書いておきます。他にこんなやりかたしてるというのがあったら教えてほしいです。

簡単に言うと1つのhtmlファイルのみ置いてあるリポジトリをgithubに用意し、それをみんなでプルリクエストで編集するということをしてます。  

<!--more-->

ワークショップで使ったリポジトリ  

* [onigra/github-flow](https://github.com/onigra/github-flow)
* [yudai-ez/github_study](https://github.com/yudai-ez/github_study)

参加者のスキルによって教えなきゃいけないことの量は増減するのですが、下記については必ず教えるようにしています。

* ブランチ名は説明的な名前にする
* masterに直接pushするな
* rebase
  * rebase -i
* push -f
  * push -fはmasterにはやっちゃだめだけど、開発中のbranchは別にいいよ
* コミットログは複数行書いていい
* コミットの粒度は適切に。squash覚えるとたくさんまとめたくなるけど、まとめすぎると色々辛い
* hubotとかチャットとかと連携すると便利

この辺り教えた後に、あとはこの辺の開発フローのエントリ読んどいてみたいな感じで閉めてます。

* [github-flow](https://gist.github.com/Gab-km/3705015)
* [Quipper](http://blog.madoro.org/mn/93)
* [paperboy](https://pepabo.github.io/docs/github/workflow.html)
* [OSSの開発モデルを、そのまま社内に持ち込むのは止めたほうがいい（もしくはコードレビューの話）](http://d.hatena.ne.jp/kazuhooku/20140313/1394687353)
* [テストファーストなGitワークフローについて](http://d.hatena.ne.jp/kazuhooku/20140204/1391479663)

ちなみにこのやりかたは、[@tushuhei](https://twitter.com/tushuhei)さんがやってた"gitを使って小説を一行ずつ書く"というワークショップを参考にしてます。  
あと個人的に重要だと思ってるのは、教える人1人、教わる人は4~5人ぐらいのグループでやるといいと思います。たぶんこのぐらいが1人で教える限界かなと。  

