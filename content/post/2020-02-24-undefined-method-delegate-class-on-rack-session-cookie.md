---
title: "undefined method `DelegateClass' for Rack::Session::Cookie:Class"
slug: "undefined-method-delegate-class-on-rack-session-cookie"
categories:
- ruby rack
date: "2020-02-24T00:00:00+09:00"
---

## 2020-02-25 09:25 JST 追記

マージされたのでそのうち解消されると思う。

## 原文

SidekiqのWeb ConsoleをDockerでスタンドアローンで運用してるんだけど、ベースイメージを `2.7.0` に上げたらタイトルのエラーが出るようになった。
詳細はこのリポジトリのREADME見といて。

https://github.com/onigra/rack-undefined-method-delegate-class

で、「ああ、delegateをrequireすればいいんだなと」深く考えずにrackにプルリク上げたら、メンテナ的には即マージとはいかない感じ。
rack的には単体でrequireするのではなく、 `require 'rack'` するのが推奨みたい。
2.2からそうなったらしい。

https://github.com/rack/rack/pull/1610

元を辿っていくと、 Sidekiq::Web が単体で使うような呼び方をしている。
これを上記の通り、 require 'rack' にすれば解決するはず。

https://github.com/mperham/sidekiq/blob/ccc71d18a23250f813ba6835f8d4eeba298696b4/lib/sidekiq/web.rb#L14L18

まあでも、このプルリクでもメンテナ内で意見を聞いてみたいっていう流れになってるので、静観してマージされなかったらSidekiqにプルリク出してみようと思う。
今困ってる人は、 `require 'sidekiq'` の前に `require 'rack'` しておけば回避はできる。

```ruby
# config.ru
require 'rack' # require 'delegate' でも動く
require 'sidekiq'
require 'sidekiq/web'

run Sidekiq::Web
```
