---
title: "MacのMySQLがなんかおかしかったので環境整理するついでに5.6にした"
slug: "mysql-cleanup-and-upgrade"
categories:
- MySQL ruby-on-rails
date: "2013-05-13T00:00:00Z"
---

MySQLのログを[td-agent](https://github.com/treasure-data/td-agent)で集めて[riak](http://basho.com/riak/)に突っ込んで遊ぼうかなーと思って私物のMacに環境構築してたら、
どうもMySQLの構成ファイルの位置がおかしい。  
調べてみると、Mac買ってよくわかってない頃にMySQLをOSX用のインストーラーでインスコしてて、その後Homebrewでもインスコしてたのでなんかおかしくなってたらしい。備忘を兼ねて手順を晒します。

とりあえずインストーラー版もHomebrew版も両方アンインストールして、[せっかくだから](http://dic.nicovideo.jp/a/%E3%81%9B%E3%81%A3%E3%81%8B%E3%81%8F%E3%81%A0%E3%81%8B%E3%82%89)バージョン5.6を選んでみます。

<!--more-->

Homebrew版MySQLのアンインストール  

```
brew uninstall mysql 
```

そして、Homebrewでは5.5.29をインスコしてるはずなのに、なぜか5.5.24というファイルが存在する…  

```
cd /usr/local

# ファイルの削除
sudo rm -rf mysql-5.5.24-osx10.6-x86_64

# シンボリックリンクの削除
sudo rm -rf mysql
```

余計なファイルの削除

```
cd /Library/Caches/Homebrew/
rm -rf mysql*
```

`brew install`の前にupdate & upgrade

```
brew update && brew upgrade
```

HomebrewでMySQLのインストール手順はググれば腐るほど[出るので](http://www.karakaram.com/install-mysql56-homebrew)割愛。  
さて、無事MySQLがインストールできたのでrailアプリを動かしてみる。

```
bundle exec rails s

Incorrect MySQL client library version! This gem was compiled for 5.5.29 but the client library is 5.6.10
```

怒られました。ググってみると、[mysql2をインストールしなおせばOKっぽい](http://klalex.com/2013/02/upgrading-mysql-to-5-6-10-on-mac-os-and-fixing-mysql2-gem/)ですね。でもbundlerで管理してるgemを単体でアンインストールして入れ直す手順がよくわからなかったので、ダサいですが全部インストールしなおしました。

```
rm -rf .bundle
rm -rf vendor/bundle

bundle install --path vendor/bundle
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rails s
```

動きました。これでキレイになりました。

