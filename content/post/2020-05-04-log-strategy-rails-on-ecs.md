---
title: "RailsをECSで動かす時のログをどうするか考える"
slug: "log-strategy-rails-on-ecs"
categories:
- rails docker ecs log
date: "2020-05-04T00:00:00+09:00"
---

## 実験リポジトリ

- https://github.com/onigra/rails_sandbox

## 制約

- Fargate
- リバースプロキシは別の Service で動いている
  - h2o, nginx など http server のログは考慮しない
- Application Server は Unicorn

## 方針

- Rails, Unicorn のログは全部 STDOUT に出す
  - STDOUT に両方のログがまとめて出る
- Log Format は JSON
  - Unicorn のログ も JSON にする
- ~~ログは FireLens と fluent-bit 使っていい感じに集約する~~ ログは全部CloudWatch Logsに吐いて、その先はKinesis Firehose

## Rails, Unicorn のログは全部 STDOUT に出す

- 環境変数 `RAILS_LOG_TO_STDOUT` を設定すれば STDOUT にログが出る
  - `config/environment/production.rb` にデフォルトで設定が書いてある
- Unicorn の場合、`RACK_ENV` を `none` にしておかないと `Rack::CommonLogger` が `use` されて余計なログが出ちゃうので設定しておく

## Log Format は JSON

### Rails

Rails でサクッと Log Format を JSON にする場合、 [lograge](https://github.com/roidrage/lograge) を使うのがメジャーだが、一つ問題があり、Rack で処理されるリクエストがログに出なくなってしまう。

- [Move logging into Rack middleware](https://github.com/roidrage/lograge/issues/48)

それを回避するために、 [rails_semantic_logger](https://github.com/rocketjob/rails_semantic_logger) を使う。

- http://rocketjob.github.io/semantic_logger/rails.html

### Unicorn

Unicorn の log の Formatter を変更するには、 `Configurator::DEFAULTS[:logger].formatter` をいじる。

- https://yhbt.net/unicorn/FAQ.html
  - `Why are log messages from Unicorn are unformatted when using Rails?` に書いてある

```ruby
require 'json'

Configurator::DEFAULTS[:logger].formatter = proc do |severity, timestamp, progname, msg|
  "#{JSON.dump(service: 'unicorn', severity: severity, timestamp: timestamp, progname: progname, msg: msg)}\n"
end
```

### その他

- フィルターするために、ログに識別子を追加しておく
  - `"{ "service": "rails" }"` みたいな
  - rails は `config.log_tags` に設定するのが楽
  - unicorn は Formatter の lambda の中で設定するのが楽

## ~~ログは FireLens と fluent-bit 使っていい感じに集約する~~ ログは全部CloudWatch Logsに吐いて、その先はKinesis Firehose

firelensの送信先をCloudWatch Logsにすれば、の複数のコンテナのログを1つのLog Streamに集約してくれるかと思ったけど、してくれなかった。  
そういうことがしたい場合、Datadog Logsとかに送った方がいいと思う。  
まあS3に送ってAthenaで色々やりたいみたいな用途もあるから、firelensの用途は普通にあると思う。

-> 結局、CloudWatch Logsに全部流してCW Logs -> Kinesis Firehose -> S3 <- Athena が楽だと思った。
あとCW LogsからDatadogに送りたいけど無限に金がかかる。
