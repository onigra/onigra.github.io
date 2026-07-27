---
title: "個人TDDBCを開いてもらった その2"
slug: "kojin-tddbc-2"
categories:
- ruby ruby-on-rails TDD test unit-test
date: "2013-05-02T00:00:00Z"
---

[前回](http://onigra.github.io/blog/2013/05/01/kojin-tddbc/)の続きです。  

## TDDはテンポが重要

sunaotさん曰くTDDはテンポが重要で、これらの一連の流れがサクサクいくようになってくるとコーディングが楽しいとのこと。なので、bundle execでテンポが悪くなるのが好きじゃないらしいです。  

## sunaotさんによるTDDお手本

うまくノリを伝えられるか自信が無いですが、僕の中で非常に分かりやすかったので書き出してみます。渡した数を2倍にして返すという単純なメソッドを例にして説明してくださいました。  

<!--more-->

まずは、テストコードを書きます。  

* foo_test.rb

```ruby
require 'test/unit'

class TC_Foo < Test::Unit::TestCase
end
```

テストを実行します。  

```
Run options: 

# Running tests:



Finished tests in 0.000401s, 0.0000 tests/s, 0.0000 assertions/s.

0 tests, 0 assertions, 0 failures, 0 errors, 0 skips

```

実装コードを書きます。まだ中身は空っぽです。  

* foo.rb

```ruby
class Foo
end
```

* foo_test.rb

```ruby
require 'test/unit'
require './foo'

class TC_Foo < Test::Unit::TestCase
end
```

テストを実行します。  

```
Run options: 

# Running tests:



Finished tests in 0.000363s, 0.0000 tests/s, 0.0000 assertions/s.

0 tests, 0 assertions, 0 failures, 0 errors, 0 skips

```

テストを書いていきます。12を渡してdoubleというメソッドを呼ぶと24が返ってくるというテストです。  

* foo_test.rb

```ruby
require 'test/unit'
require './foo'

class TC_Foo < Test::Unit::TestCase
  def setup
    @foo = Foo.new(12)
  end

  def test_double
    assert_equal(24, @foo.double)
  end
end
```

テストを実行します。  

```
Run options: 

# Running tests:

E

Finished tests in 0.000519s, 1926.7823 tests/s, 0.0000 assertions/s.

  1) Error:
test_double(TC_Foo):
ArgumentError: wrong number of arguments(1 for 0)
    /Users/nekogeruge/tdd/foo_test.rb:6:in `initialize'
    /Users/nekogeruge/tdd/foo_test.rb:6:in `new'
    /Users/nekogeruge/tdd/foo_test.rb:6:in `setup'

1 tests, 0 assertions, 0 failures, 1 errors, 0 skips

```

引数が不正だと怒られました。コンストラクタを作成します。

* foo.rb

```ruby
class Foo
  def initialize(int)
    @int = int
  end
end
```

テストを実行します。  

```
Run options: 

# Running tests:

E

Finished tests in 0.000515s, 1941.7476 tests/s, 0.0000 assertions/s.

  1) Error:
test_double(TC_Foo):
NoMethodError: undefined method `double' for #<Foo:0x007fc983890fe0 @int=12>
    /Users/nekogeruge/tdd/foo_test.rb:10:in `test_double'

1 tests, 0 assertions, 0 failures, 1 errors, 0 skips

```

doubleというメソッドが無いよと怒られました。はい、作ります。  

* foo.rb

```ruby
class Foo
  def initialize(int)
    @int = int
  end

  def double
  end
end
```

テストを実行します。  

```
Run options: 

# Running tests:

F

Finished tests in 0.000665s, 1503.7594 tests/s, 1503.7594 assertions/s.

  1) Failure:
test_double(TC_Foo) [/Users/nekogeruge/tdd/foo_test.rb:10]:
<24> expected but was
<nil>.

1 tests, 1 assertions, 1 failures, 0 errors, 0 skips

```

doubleの返してくるものがnilなので怒られました。このテストを通す為の一番簡単な実装をしてみます。   

* foo.rb

```ruby
class Foo
  def initialize(int)
    @int = int
  end

  def double
    24
  end
end
```

テストを実行します。   

```
Run options: 

# Running tests:

.

Finished tests in 0.000464s, 2155.1724 tests/s, 2155.1724 assertions/s.

1 tests, 1 assertions, 0 failures, 0 errors, 0 skips

```

通りました。次に、別のデータを使ったパターンのテストを書きます。  

* foo_test.rb

```ruby
require 'test/unit'
require './foo'

class TC_Foo < Test::Unit::TestCase
  def setup
    @foo = Foo.new(12)
    @moo = Foo.new(15)
  end

  def test_double
    assert_equal(24, @foo.double)
  end

  def test_another
    assert_equal(30, @moo.double)
  end
end
```

テストを実行します。  

```
Run options: 

# Running tests:

F.

Finished tests in 0.000714s, 2801.1204 tests/s, 2801.1204 assertions/s.

  1) Failure:
test_another(TC_Foo) [/Users/nekogeruge/tdd/foo_test.rb:15]:
<30> expected but was
<24>.

2 tests, 2 assertions, 1 failures, 0 errors, 0 skips

```

当然コケます。なので、本格的な実装に入ります。  

* foo.rb

```ruby
class Foo
  def initialize(int)
    @int = int
  end

  def double
    @int * 2
  end
end
```

テストを実行します。  

```
Run options: 

# Running tests:

..

Finished tests in 0.000537s, 3724.3948 tests/s, 3724.3948 assertions/s.

2 tests, 2 assertions, 0 failures, 0 errors, 0 skips

```

通りました。2つ目のテストは考えを整理する為に書いたもので不要なので消します。残したければ残しておいても問題ありません。  

* foo_test.rb

```ruby
require 'test/unit'
require './foo'

class TC_Foo < Test::Unit::TestCase
  def setup
    @foo = Foo.new(12)
  end

  def test_double
    assert_equal(24, @foo.double)
  end
end
```

念のためテストを実行します。  

```
Run options: 

# Running tests:

.

Finished tests in 0.000450s, 2222.2222 tests/s, 2222.2222 assertions/s.

1 tests, 1 assertions, 0 failures, 0 errors, 0 skips

```

これで実装完了です。  
こうして書き出してみると、[t_wadaさんの記事](http://d.hatena.ne.jp/t-wada/20100228)とプロセスは全く一緒ですね。やはりお手本を見せてもらうのは分かりやすかったです。  

