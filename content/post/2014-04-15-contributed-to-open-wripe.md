---
title: "open-wripeが動かなかったのでプルリクしてマージされた"
slug: "contributed-to-open-wripe"
date: "2014-04-15T10:54:47Z"
---

[@masuidrive](https://twitter.com/masuidrive)さんのメモアプリ、[wri.pe](https://wri.pe/)がオープンソースになったので触ってみた。

[masuidrive/open-wripe](https://github.com/masuidrive/open-wripe)

cloneしてsolr入れてREADMEの手順でコマンド叩いたらsolrの起動でこける。

<!--more-->

```sh
$ be rake sunspot:solr:run

rake aborted!
NoMethodError: undefined method `new' for URI:Module
/Users/onigra/sandbox/test/open-wripe/config/environments/development.rb:3:in `block in <top (required)>'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/railtie/configurable.rb:24:in `class_eval'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/railtie/configurable.rb:24:in `configure'
/Users/onigra/sandbox/test/open-wripe/config/environments/development.rb:1:in `<top (required)>'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `block in require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:214:in `load_dependency'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/engine.rb:591:in `block (2 levels) in <class:Engine>'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/engine.rb:590:in `each'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/engine.rb:590:in `block in <class:Engine>'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:30:in `instance_exec'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:30:in `run'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:55:in `block in run_initializers'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:44:in `each'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:44:in `tsort_each_child'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/initializable.rb:54:in `run_initializers'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/application.rb:215:in `initialize!'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/railtie/configurable.rb:30:in `method_missing'
/Users/onigra/sandbox/test/open-wripe/config/environment.rb:8:in `<top (required)>'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `block in require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:214:in `load_dependency'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/activesupport-4.0.3/lib/active_support/dependencies.rb:229:in `require'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/application.rb:189:in `require_environment!'
/Users/onigra/sandbox/test/open-wripe/vendor/bundle/ruby/2.0.0/gems/railties-4.0.3/lib/rails/application.rb:250:in `block in run_tasks_blocks'
Tasks: TOP => sunspot:solr:run => environment
(See full trace by running task with --trace)
```

`config/environments/development.rb`のURIモジュールがnewしようとしてこけてる。 
下記のプルリクのように修正して無事マージされた。  
（productionも同じようになってたようで、後のプルリクでマージされてた。詰めが甘い）

https://github.com/masuidrive/open-wripe/pull/1

これですぐ動くようになった。
