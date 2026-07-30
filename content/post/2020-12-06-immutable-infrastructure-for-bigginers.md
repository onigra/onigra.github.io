---
title: "2020年に初めて学ぶImmutable Infrastructure"
slug: "immutable-infrastructure-for-bigginers"
categories:
- infra architecture
date: "2020-12-06T00:00:00+09:00"
---

この記事は[Classi Advent Calendar 2020](https://qiita.com/advent-calendar/2020/classi) 6 日目の記事です。  
前回は、[lacolaco](https://twitter.com/laco2net)さんによる[Nx monorepo での npm パッケージ管理と GitHub Actions](https://zenn.dev/lacolaco/articles/github-actions-nx-monorepo-tips)でした。

## 背景

仕事でインフラやコンテナについて人に教える際に、前提知識として Immutable Infrastructure の考え方を  
知っていることが重要だと感じることが多く、話す機会も多いので文章に残しておくことにしました。

自分は Immutable Infrastructure や Infrastructure as Code の流行の際に触れてきたのですが、比較的若い世代は初めて知ることも多いので、主にそういった世代に向けての文章です。

## 前提

- 主に社内の新卒・若手向けの内容です
- 既に Immutable Infrastructure を知ってる人にとって新しい内容は無いので読まなくて大丈夫です

## Immutable Infrastructure とは？

Immutable Infrastructure を直訳すると「不変のインフラ」なんですが、これは意味が伝わりにくいです。

逆に言うと、Mutable Infrastructure（変更可能なインフラ）、つまり「変更されることがあるインフラ」が  
あるということなんですが、ここから話した方がわかりやすいです。

「変更されることがあるインフラ」とはどういうものかというと、 **稼働中のサーバに対して変更を行う運用** のことです。

## 稼働中のサーバに変更を行うのは難しい

例えば、Amazon EC2 で動いている Ruby on Rails のアプリケーションに対して、Ruby のバージョンを上げるのを想像すると結構面倒くさいです。
言語のバージョンが上がりつつ依存関係の解決(bundle install)を改めて行う必要があるので、アプリケーションサーバを無停止で行うのは難しいです。

その場合、リクエストを受け付けないようにロードバランサーから切り離して作業を行う必要があるので、サービスを止められない場合は（極端な場合）1 台ずつ作業を行う必要があります。
そもそも、バージョンを上げてもアプリケーションが起動しない可能性だってあります。

このように、稼働中のサーバに対して変更を行う運用というのは難易度・リスクが高いです。

ソースコードを多少変更するぐらいではそうでもないんですが、ライブラリの依存関係の変更、言語のバージョンアップ、ミドルウェアのバージョンアップ、OS のバージョンアップ、設定の更新などでアプリケーションが起動しなかったり、起動してもちゃんと動かないことがあったりするので、デプロイやサーバのメンテナンスというのは恐怖の作業でした。
しかも、そのサーバの稼働期間が長く、全くメンテナンスされていないサーバだったら目も当てられません。

## 新しく構築したサーバを入れ替えればよい

しかし、クラウドインフラの発展と共に、 **[「稼働中のサーバをいじらずに、新しいサーバを構築して入れ替えて、古いのは捨てればいいじゃん」](http://chadfowler.com/2013/06/23/immutable-deployments.html)** という発想が出てきました。
オンプレミスでもこういった運用は可能ではありますが、クラウドインフラの進化と共にやりやすくなってきたのは間違いありません。
[BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)を想像するとわかりやすいと思います。

## Docker の登場

しかし EC2 の場合、デプロイのたびに AMI を作り直すのは割とコストが高いです。

そんな中登場したのが Docker で、コンテナ仮想化を用いてソースコードを含めた環境の構築と実行が容易になったため、より Immutable Infrastructure の実現がしやすくなっていきました。
このように、Immutable Infrastructure の考え方、運用が加速して一般化してきたのには、クラウドサービスの進化、Docker の登場が大きく関わっていると私は思っています。

## The Twelve-Factor App

Immutable Infrastructure な環境でアプリケーションを運用するのは、割とコツがいります。
例えば、突然サーバが廃棄（Shutdown）される可能性があるため、ストレージに廃棄されたら困るような情報を置きっぱなしにすることはできません。わかりやすいのはログです。

また、サーバに固有の設定を入れ込んでしまうと、環境ごとの差異が出てしまうため、例えば Staging と Production では厳密に同じではないという状態になってしまいます。
環境ごとの設定は環境変数でアプリケーション実行時に設定できるようにしておき、サーバイメージとアプリケーションのバイナリに変更は加えない状態を保つのが望ましいです。

これらのプラクティスは、 **[The Twelve-Factor App](https://12factor.net/ja/)** と言う名で体系立ててまとめられています。
The Twelve-Factor App は Immutable Infrastructure とは直接関係は無いのですが、[Heroku](https://jp.heroku.com/) の人が Heroku で動かす前提でアプリケーションを開発する中で、
環境と設定がうまく分離され、再現性が向上して実行環境の移行が容易になり、運用しやすいアプリケーションにするためのプラクティスをまとめたものです。

Immutable Infrastructure は、The Twelve-Factor App に沿って設計・運用されたアプリケーションと組み合わせることによってより運用しやすくなります。

※ 技術の変化に合わせて少し見直された **[Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/)** もあります

## まとめ

このように、現代的なインフラ・アプリケーション実行環境は、Immutable Infrastructure、そして The Twelve-Factor App の考え方が基礎にあります。

逆に言うと、これらの考え方を知らずに現代的なクラウドインフラ、ツールをうまく使いこなして運用することは難しいでしょう。

明日は[shio312](https://twitter.com/shio312)さんです。

## 参考

- [Trash Your Servers and Burn Your Code: Immutable Infrastructure and Disposable Components](http://chadfowler.com/2013/06/23/immutable-deployments.html)
- [BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Immutable Infrastructure はアプリケーションのアーキテクチャを変えていく、伊藤直也氏（前編）](https://www.publickey1.jp/blog/14/immutable_infrastructure_1.html)
- [Immutable Infrastructure はアプリケーションのアーキテクチャを変えていく、伊藤直也氏（後編）](https://www.publickey1.jp/blog/14/immutable_infrastructure_2.html)
- [The Twelve-Factor App （日本語訳）](https://12factor.net/ja/)
- [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/)

## 余談（個人の感想です）

Docker は確かにパラダイムシフトなのですが、登場当初は正直使いやすいとは思えず(個人の感想です)、EC2 でも Immutable Infrastructure を実現できるので、
世の中の流行に反して個人的にはしばらく本番投入する気になりませんでした。（AutoScalingGroup の ELB のアタッチ機能や LaunchConfig, LaunchTemplate は十分便利）

しかしコミュニティやファーストペンギンの方々のおかげで Docker 自体が年々使いやすくなってきたり、Fargate や GKE の登場などにより、2020 年においてはコンテナで動かす前提で考えた方が基本的には良いと個人的には思います。
