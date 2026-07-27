---
title: "Array#slice_by_indexesというgemを作った"
slug: "slice-by-indexes"
categories:
- ruby
date: "2014-08-01T21:48:55Z"
---

### 2014/8/5 修正 名前変えた

Array#slice_indexes -> Array#slice_by_indexes

<blockquote class="twitter-tweet" lang="ja"><p>引数に該当する要素から次の該当する要素までを取得してarrayで返すライブラリ書いたんだけど名前が思いつかない <a href="https://t.co/cUKuSnFvQk">https://t.co/cUKuSnFvQk</a></p>&mdash; †堕天使BLUE† (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/statuses/494793733921976320">2014, 7月 31</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

名前全然思いつかなくて仮で付けてた名前そのまま採用した。コードもきれいとはいえないと思う。やりたいことができたので一旦公開した。

[onigra/slice_by_indexes](https://github.com/onigra/slice_by_indexes)

<!--more-->

何ができるのかは言葉で説明し辛いのでREADMEの内容そのまま書く。

## Array#Indexes

arrayから引数に該当するindexの位置を取得してarrayで返す

```rb
require 'slice_by_indexes'

[1, 2, 3, 1, 2].indexes 1

#=> [0, 3]

["foo", "bar", "baz", "foo", "baz", "foo"].indexes "foo"

#=> [0, 3, 5]

["foo", 1, 2, "foo", 3, "foo"].indexes { |i| i.class == String }

#=> [0, 3, 5]
```

## Array#slice_by_indexes

引数に該当する要素から次の該当する要素までを取得してarrayで返す

```rb
require 'slice_by_indexes'

[1, 2, 3, 1, 2].slice_by_indexes 1

#=> [[1, 2, 3], [1, 2]]

["foo", "bar", "baz", "foo", "baz", "foo"].slice_by_indexes "foo"

#=> [["foo", "bar", "baz"], ["foo", "baz"], ["foo"]]

["foo", 1, 2, "foo", 3, "foo"].slice_by_indexes { |i| i.class == String }

#=> [["foo", 1, 2], ["foo", 3], ["foo"]]
```
---
