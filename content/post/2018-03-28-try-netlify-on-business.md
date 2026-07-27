---
title: "Netlifyが仕事で使えるか試す（追記あり）"
slug: "try-netlify-on-buisiness"
categories:
- Netlify
date: "2018-03-28T23:47:36+09:00"
---

[Netlify](https://www.netlify.com/)がすごく便利なので仕事で使えそうか検証した結果のメモ。  
何ができるかはいくらでも記事があるので書かない。 
# 検証した内容

試したいのはいわゆるアクセス制限で、例えばAWSだとS3のBucket Policy使ったりWAF使ったりしてIP制限がかけられるんだけど[^1]、Netlifyには今の所IP制限がかけられない。

その代わりに、[サイトにパスワード認証をかける機能](https://www.netlify.com/docs/visitor-access-control/#password-protection)が用意されている。
しかし、サイト全体にかかってしまうので、[Preview](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/)だけに認証をかけるということができない。既に公開されてるサイトだと問題がある。

回避する手段を考えて、SiteをProductionとStaging用に2つ作って（リポジトリは1つ）Stagingには常にAccess Controlをかけるという方法を試してみたんだけど、Production Branchに対してプルリク作った時に、Previewができてしまう問題がある。

PreviewはいわゆるURL知らないとアクセスできない形式で、組織のセキュリティのレギュレーションによっては許容されるかもしれないけど、今回のお仕事では厳しい。

Preview作成するのを止められればいいんだけど、設定やドキュメントを見た限り見当たらなかった。  
[この辺](https://www.netlify.com/docs/continuous-deployment/#deploy-contexts)見て、 `netlify.toml` で Productionの `site-id` 指定して `context.deploy-preview` の `command` を失敗するようにすればProductionのビルドだけ失敗するかなと思って試してみたけど駄目だった。両方ビルドされてしまう。

最後に、ProductionはGitHubと連携させずに、ビルドしたコンテンツをアップロードするだけという方法でこの問題は回避できた。  
しかし、Productionはデプロイの方法を別で作っておかないといけないという面倒なことになってしまう。つらいね。

この方法の注意点は、一度Gitリポジトリを連携させてしまうと、それを解除する方法が（たぶん）無いことである。（変更することはできた）
それを試すために、一度作ったサイトを消す羽目になった。

なので、新しくサイトを作る際にGitリポジトリの連携はさせずに、コンテンツを直接アップロードすること。

また、Previewで作ったサイトはいつになったら消えるのがわからない。誰かいつ消えるのかと、消す方法があるなら教えてほしい。


https://5abb071c92226a0b2b358790--onigra-com.netlify.com/

これは `2018-03-28 12:09:01 JST` あたりに公開されたんだけど、この記事書いてる `2018-03-28 23:35:25 JST` の時点ではまだ見えている。

追記1: `2018-03-29 21-05-51 JST` あたりに見たら `Not Found` になっていた。有効期間は24時間ぐらいなのかもしれない。

# まとめ

- NetlifyでホスティングしたサイトでProductionと公開制限をかけたStaging環境を作って運用することはできるけど、ちょっと特殊な方法になる
- Previewの作成をオフにすることができれば、自分のやりたいことは実現できる
- IP制限もかけられれば完璧

なんだかんだ書いたけど、Netlifyめっちゃ便利で可能性感じるので、これからもガンガン使っていきたいと思ってる。

仕事以外で使うなら機能は申し分ないし、新しい機能もどんどん増えてるし、今後解消されることに期待してる。

# 余談1

これ書いてる最中に同僚から[こんなの](https://www.netlify.com/blog/2017/04/07/selective-password-protection/)教えてもらったので試してみる。でもBasic認証なのでちょっと厳しいかな...

# 余談2

Netlifyでホスティングしてるのはこれ

https://onigra.com/

# 追記2

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="ja"><p lang="ja" dir="ltr">deploy previewを無効にする設定について、試してないんですけどGitHubリポジトリにNetlifyが作ったwebhookからPRのイベントを外せばpreview作らないようにできるかなあと思いました</p>&mdash; みやおか (@miyaoka) <a href="https://twitter.com/miyaoka/status/979277406702718976?ref_src=twsrc%5Etfw">2018年3月29日</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="ja"><p lang="ja" dir="ltr">おー、なるほど！ちょっと試してみます！ありがとうございます🙏🏻</p>&mdash; 1540kcal (@onigra_) <a href="https://twitter.com/onigra_/status/979283831139139584?ref_src=twsrc%5Etfw">2018年3月29日</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="ja"><p lang="ja" dir="ltr">確かにPRのイベント外せばPreview作られなくなりました！一方で、stgとprdでサイトを分けた場合、stgのPreviewも作られなくなってしまいますね...prdのPulishを手動にして、stgは全てのブランチをデプロイするようにすればやりたいことは実現できそうですが、やっぱり正攻法ではない感じですねー</p>&mdash; 1540kcal (@onigra_) <a href="https://twitter.com/onigra_/status/979348798248951809?ref_src=twsrc%5Etfw">2018年3月29日</a></blockquote>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">あーなるほど、配信毎にwebhook作られるのかと思ったら同じURLだから同じ設定になっちゃうんですね。うーん確かにちょっとこれだと違いますね</p>&mdash; みやおか (@miyaoka) <a href="https://twitter.com/miyaoka/status/979356175832510464?ref_src=twsrc%5Etfw">2018年3月29日</a></blockquote>

[@miyaoka](https://twitter.com/miyaoka)さんからPreviewを作成しなくする方法について、Netlifyが作ったWebhookからのPullRequestのイベントを外してみるのはどうかというアドバイスを頂きました。ありがとうございます！ :pray: [soussune](https://soussune.com/)聞きます！


[^1]: 実際の所、S3 + CloudFront + WAFだと色々機能不足があり、断念した経緯もあってNetlifyを検証した

