---
title: "年末ハッカソンしてコーポレートサイトをAWS + Nginx + Unicorn + Sinatra構成でリニューアルした"
slug: "the-year-end-hackathon"
date: "2014-12-30T12:02:55Z"
---

弊社コーポレートサイトのデザインが非常に味わい深く、以前から作り直そうという話題が出てたものの、なかなか実施されなかったので、年末全社員（5名）集まってハッカソン形式で1日で作り直すことにした。  

自分が言い出しっぺなのでオーガナイザーをやった。

## Before

![old_design](/images/old_design.png)

<!--more-->

#### 使用技術

- どっかのVPS（忘れた）
- Apache
- 静的コンテンツのみ

## After

[http://www.exvisionz.jp/](http://www.exvisionz.jp/)

トップのメッセージがなかなかクサい。このメッセージになった理由は後述。

#### 使用技術

- Ruby2.2.0
- Sinatra
- Unicorn
- Nginx
- AWS
- [Gumba](http://pixelsbyrick.com/downloads/gumba-template.html)(BootstrapベースのCSSフレームワーク)
- Ansible
- rspec
- wercker 
- Capistrano

# 事前準備

まず、1名が実家に帰ってるのでリモートで参加できる状態を準備した。githubとslackがあるので基本的には問題無いが、ビデオチャットに[Hangouts](http://www.google.com/+/learnmore/hangouts/?hl=ja)を使うことにした。  

こちらで会話してることなどをそのまま相手に垂れ流したかったので、後半は付けっぱなしだった。マイク、カメラ、スピーカーはMBPデフォルトの物を使った。少し声が聞き取りづらかったが、特にストレスは無かった。今後リモート会議はこれでやるのがよさそう。  

その他の準備は以下

- リポジトリ用意
  - 旧デザインはリポジトリも無かった
- 準備や課題はissueで雑に行った
- 準備
  - 食ベ物
  - 飲み物
- 課題
  - コンテンツ
    - 会社概要
    - 事業内容
    - 採用情報
    - お問い合わせ
  - ルーティング
  - デザイン
  - インフラ

# 自分が作業したこと

- ベースになるアプリの作成
  - Sinatra + BootStrapのサンプルアプリ作成
  - Sinatraが採用されたので、BootstrapベースのCSSフレームワーク探し
    - [Gumba](http://pixelsbyrick.com/downloads/gumba-template.html)を採用
  - 上記の適用
  - Unicornの導入
- コンテンツのブレスト（途中で抜けた）
- プロビジョニング(Configuration)
  - ansible-playbookの作成と実行
- プロビジョニング(Orchestration)
  - Capistranoタスクの作成
- テスト書く
  - rspec
- CI環境の構築
  - wercker
- デプロイ

## もろもろ感想等

基本的にコンテンツ考える所とデザインのカスタマイズ以外の所をやった。最近DevOpsっぽいことをよくやってたので、そのあたりの所が詰まること無くスムーズにいってよかった。  

CI通ったら自動でデプロイするところまでやりたかった。あとでやる。

新デザインはシングルページになったんだけど、ルーティングは`/`のみにして`index`に各コンテンツごとのファイルを`partial`で合体させることにした。

Gumbaは途中までいじってもらってて微妙かなって思いはじめてたんだけど、ノってきた[youkaiantena](https://twitter.com/youkaiantena)さんがいい感じにカスタマイズしてくれた。

旧デザインは別ブランチにあるので、後でSinatra化してcheckoutすれば戻せるようにする予定。

Sinatraはやっぱり触ってて楽しい。もっと使う期会がほしい。

Nginxのチューニングしたい。

# トップのメッセージについて

Gumbaの[デモ](http://pixelsbyrick.com/demos/gumba.html)にある

> *Hello, we are here to help you.(私たちはあなたの手助けをするためにここにいます)*

っていうメッセージが格好良くて、これをパクることにした。  弊社のメイン事業は受託開発なんだけど、

- 顧客がやりたいことの実現方法を考えて実行するのが弊社の事業
- システム開発はあくまで手段の一つ

というのを表現したかったので、抽象的な言い方になった。
クサいけどまあいいかな。*Survivable Professional Team*も、なんか由来があった気がするけど忘れた。

まあそんな感じです。
