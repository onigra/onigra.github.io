---
title: "rails_semantic_loggerでヘルスチェックのログを止める"
slug: "disable-health-check-log-on-rails-semantic-logger"
categories:
- rails semantic_logger log
date: "2020-05-06T00:00:00+09:00"
---

[rails_semantic_logger](http://rocketjob.github.io/semantic_logger/rails.html) は [Rails::Rack::Logger を swap してる](https://github.com/rocketjob/rails_semantic_logger/blob/74c4e921a90da328edae171710f03e9f8c67e44d/lib/rails_semantic_logger/engine.rb#L38L40) ので、以下のような swap がうまく動かない。

- [Rails::Rack::Logger を継承した middleware を swap する際は引数に log_tags を忘れずに](https://qiita.com/onigra/items/2509da4543e52cad947d)

特定のログを抑制する方法として、SemanticLogger には Filtering という機能がある。

- [Filtering](http://rocketjob.github.io/semantic_logger/filtering.html)

こんな感じに書いておけばヘルスチェックのエンドポイントへリクエストされた時のログは出なくなる。

```rb
config.semantic_logger.add_appender(
  io: STDOUT,
  level: config.log_level,
  formatter: :json,
  filter: -> log { log.payload[:path] !~ /^\/healthcheck$/ }
)
```

## 追記

なんかpayloadにnilが入ってくる時があるっぽい。あと別に正規表現じゃなくてもいい。

```rb
config.semantic_logger.add_appender(
  io: STDOUT,
  level: config.log_level,
  formatter: :json,
  filter: -> log {
    unless log.payload.nil?
      log.payload[:path] != "/healthcheck"
    end
  }
)
```