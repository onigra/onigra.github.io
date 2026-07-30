---
title: "rubyの排他制御ライブラリ(redis-semaphoreの紹介)"
slug: "introduction-to-redis-semaphore"
categories:
- redis ruby
date: "2014-06-30T19:59:20Z"
---

最近仕事でよく知らなかった排他制御について調べたり勉強する機会があって、セマフォを実現するのによさげなライブラリがあったので書く。

[dv/redis-semaphore](https://github.com/dv/redis-semaphore)

この辺分かってる人だったらライブラリ名でどんなものだか想像できると思うけど、カウンティングセマフォの資源の操作をredisで行うライブラリである。

<!--more-->

# 使い方

基本的にセマフォのインスタンスを作って排他制御を行いたい処理をブロックで囲むだけでOK。  
READMEのコピペで申し訳ない。

```rb
# :semaphore_nameはredisにkeyを作成する際のnamespaceになる
s = Redis::Semaphore.new(:semaphore_name, connection: "localhost")
s.lock do
  # 排他制御したい処理
end
```

資源の数を指定する場合はインスタンスを作成する際に`:resources`を指定する

```rb
s = Redis::Semaphore.new(:semaphore_name, resources: 5, connection: "localhost")
s.lock do
  # 排他制御したい処理
end
```

ブロックじゃなくてインスタンスメソッドでも制御できる。その場合は`#unlock`を忘れないように注意する。

```rb
s = Redis::Semaphore.new(:semaphore_name, resources: 5, connection: "localhost")
s.lock
# 排他制御したい処理
s.unlock
```

内部で何をやってるのか見てみると、`GRABBED`、`EXISTS`、`AVAILABLE`というkey-valueを登録している。

```
127.0.0.1:6379> keys *
1) "SEMAPHORE:semaphore_name:GRABBED"
2) "SEMAPHORE:semaphore_name:EXISTS"
3) "SEMAPHORE:semaphore_name:AVAILABLE"

127.0.0.1:6379> type SEMAPHORE:semaphore_name:GRABBED
hash
127.0.0.1:6379> type SEMAPHORE:semaphore_name:EXISTS
string
127.0.0.1:6379> type SEMAPHORE:semaphore_name:AVAILABLE
list
```

`AVAILABLE`は資源の数がlist型で登録され、例えば`resources: 2`でinitializeした場合`"0"`、`"1"`が登録される。

```
127.0.0.1:6379> lindex SEMAPHORE:semaphore_name:AVAILABLE 0
"0"
127.0.0.1:6379> lindex SEMAPHORE:semaphore_name:AVAILABLE 1
"1"
```

`GRABBED`は`#lock`したタイミングで資源をhash型で登録し、`AVAILABLE`から`blpop`した値をkey、valにタイムスタンプを登録してる。
ちなみに、`#lock`の際に引数で数値を入れると`blpop`する際のタイムアウトの数値になる。

```
127.0.0.1:6379> hkeys SEMAPHORE:semaphore_name:GRABBED
1) "0"
127.0.0.1:6379> hget SEMAPHORE:semaphore_name:GRABBED "0"
"1404128562.538218"
```


`EXISTS`はとりあえず登録してる感じかな？ちょっとよくわかんないです。  
`API_VERSION`という定数を登録してる。

```
127.0.0.1:6379> get SEMAPHORE:semaphore_name:EXISTS
"1"
```

で、`#unlock`が呼ばれたタイミングで`GRABBED`を`hdel`し、`AVAILABLE`に`lpush`している。  
redisのデータ型をうまく使った実装になっている。

[https://github.com/dv/redis-semaphore/blob/master/lib/redis/semaphore.rb#L87-L94](https://github.com/dv/redis-semaphore/blob/master/lib/redis/semaphore.rb#L87-L94)

```rb
    def signal(token = 1)
      token ||= generate_unique_token

      @redis.multi do
        @redis.hdel grabbed_key, token
        @redis.lpush available_key, token
      end
    end
```

雑な紹介でした。
