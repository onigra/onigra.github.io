---
title: "Digdagで実行するRubyのTaskのテスト書きたい時に使うDigdagのMock"
slug: "digdag-mock"
categories:
- Digdag Ruby
date: "2018-10-27T10:43:41+09:00"
---

```ruby
class Digdag
  STORE_PARAMS = {}

  def self.env
    self
  end

  def self.store(params)
    STORE_PARAMS.merge!(params.transform_keys(&:to_s))
  end

  def self.params
    STORE_PARAMS
  end
end

Digdag.env.store(foo: 'bar') #=> {"foo"=>"bar"}
Digdag.env.params['foo']     #=> "bar"
```
