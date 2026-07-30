---
title: "個人TDDBCを開いてもらった その1"
slug: "kojin-tddbc"
categories:
- ruby ruby-on-rails TDD test unit-test
date: "2013-05-01T00:00:00Z"
---

以前に[t_wadaさん](https://twitter.com/t_wada)の[RSpec入門記事](http://d.hatena.ne.jp/t-wada/20100228)を写経し、なんとなくユニットテストの書き方とTDDのプロセスは理解したものの、より深くテストについて理解したかったため[sunaotさん](https://twitter.com/sunaot)に個人TDDBCをやってもらいました。  

ネタはこんな感じです。    

* 自分が作ってるrailsアプリを元にテストコードを書いてみつつリファクタリング
* sunaotさんによるTDDお手本

<!--more-->

## 自分が作ってるアプリのテストを書いてみる

今回やってみたのは、下記のメソッドです。  
リファクタリング前のコードを載せるのはかなり抵抗ありますね。  

```ruby
module UsersHelper
  def name_check_of_uniquness(update_name, target_user_id)
    check_name = User.find_by_name(update_name)
    if check_name.blank? || check_name.id == target_user_id
      return true
    else
      return false
    end
  end
end
```

やりたいことはこんな感じです。   

* usersのnameはユニークであってほしいが、退会を[acts_as_paranoid](https://github.com/goncalossilva/rails3_acts_as_paranoid)で管理しているため、nameに一意制約はつけられない
* usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK
* 又は、更新しようとしているusers.nameがtarget_user_idと一致していれば更新OK。users.nameは変更せず、usersの他の項目のみ更新する場合があるため
* もともとはhelperに書いてあったものをmodelに移す

まず、失敗するテストを書きます。  
(RSpecは使いませんでした)  

```ruby
# coding: utf-8
require 'test_helper'

# no method errorで失敗する
class UserTest < ActiveSupport::TestCase
  test "#usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK" do
    assert User.name_check_of_uniquness
  end
end
```

テストを実行します。  

```
bundle exec ruby -I test test/unit/user_test.rb
```

次に、何も実装していないメソッドを書きます。  

```ruby
class User < ActiveRecord::Base
  acts_as_paranoid

  def self.name_check_of_uniquness
  end
end
```

テストを実行し、通ったら実装部分を書いていきます。まずは、下記の実装を行います。  

* usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK  

(ついでに、冗長な記述をリファクタリングします)  

```ruby
class User < ActiveRecord::Base
  acts_as_paranoid

  def self.name_check_of_uniquness(update_name)
    check_name = User.find_by_name(update_name)
    check_name.blank?
  end
end
```

ここで一度テストを実行。引数エラーで失敗します。  
そして、テストを修正します。  

```ruby
# coding: utf-8
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "#usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK" do
    assert User.name_check_of_uniquness('new_user_name')
  end
end
```

これでテストが通ります。次に、下記の実装を行います。  

* 又は、更新しようとしているusers.nameがtarget_user_idと一致していれば更新OK。users.nameは変更せず、usersの他の項目のみ更新する場合があるため

そしてこの実装は、users.nameの更新は無いがusersの他の項目は更新がある場合のケースのテストを行いたいため、テストケースを追加します。  

```ruby
# coding: utf-8
require 'test_helper'

# users.id = 1は退会していないアクティブなユーザーのテストデータ
class UserTest < ActiveSupport::TestCase
  test "#usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK" do
    assert User.name_check_of_uniquness('new_user_name') 
  end

  test "#更新しようとしているusers.nameがtarget_user_idと一致していれば更新OK" do
    assert User.name_check_of_uniquness('active_user_name') 
  end
end
```

ここでテストを実行。`active_user_name`はfixtureで作成しているユーザーなので、falseが返ってきて失敗します。  
実装に入ります。  

```ruby
class User < ActiveRecord::Base
  acts_as_paranoid

  def self.name_check_of_uniquness(update_name, target_user_id)
    check_name = User.find_by_name(update_name)
    check_name.blank? || check_name.id == target_user_id
  end
end
```

テストが通りました。さらに、falseを返すパターンもテストケースに追加したいため下記テストを追加します。  

* ユーザー名は一致しているが、パラメータで渡されたtarget_user_idが一致していなかったらエラーを返す  

```ruby
# coding: utf-8
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "#usersを更新する際、更新しようとしているusers.nameが退会していない全ユーザーとかぶらなければ更新OK" do
    assert User.name_check_of_uniquness('new_user_name', 1) 
  end

  test "#更新しようとしているusers.nameがtarget_user_idと一致していれば更新OK" do
    assert User.name_check_of_uniquness('active_user_name', 1) 
  end

  test '#ユーザー名は一致しているが、パラメータで渡されたユーザーIDと一致していないとエラー' do
    assert !User.name_check_of_uniquness('active_user_name', 3) 
  end
end
```

こんな感じでユニットテストを書きました。  
コードへの突っ込みはあると思いますが、ユニットテストを考えるプロセスと書くプロセスについては理解を深めることができました。  

ちょっと長くなったので、TDDお手本は次回に回します。

