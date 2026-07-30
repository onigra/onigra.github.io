---
title: "【何番煎じ】OctopressとGitHub Pagesを使用したブログの構築手順"
slug: "introduction-of-octopress"
categories:
- octopress ruby
date: "2013-04-28T00:00:00Z"
---

[UT Startup Gym](http://ut-gym.jp/)の第3期成果発表会も終わった事ですし、  
前からやろうと思ってた技術ブログを立ち上げました。  

日本のエンジニアのブログといえば[はてなブログ](http://hatenablog.com/)が多い印象ですが、  
最近は[Octopress](http://octopress.org/)と[GitHub Pages](http://pages.github.com/)を使った運用がナウいらしいので  
流行に乗っかってみます。  

<!--more-->

#### 参考（というか、ほぼ同じ内容）

[GithubとOctopressでモダンな技術系ブログを作ってみる](http://blog.glidenote.com/blog/2011/11/07/install-octopress-on-github/)

## 環境

前提として、gitとrubyがインストールされてる必要があります。  

* OS X Lion 
* ruby 1.9.3p392(rbenv)
* git 1.8.2.1

## 導入

Octopressのリポジトリをクローン  

```
cd ~
git clone git://github.com/imathis/octopress.git octopress
cd octopress
```

bundle install  

```
bundle install --path vendor/bundle
rbenv: version `1.9.3-p194' is not installed
```

うん？rubyのバージョンがこれじゃないとインストールできないの？  
いやいやそんなことはないでしょう。と思い、ファイル一覧を見てみると  
`.rbenv-version`というファイルがあることに気付きました。  

中を見ると、1.9.3-p194とだけ書いてあります。  
これを1.9.3-p392に修正すると動くかな？  

```
bundle install --path vendor/bundle
Fetching gem metadata from http://rubygems.org/.......
```

お、いった。大した問題じゃなくてよかった。  
gemがインストールできたら、テーマをインストールします。  
インストールすると、プレビューできるようになります。  

```
bundle exec rake install
bundle exec rake preview
```

でもデフォルトは嫌なので[サードパーティー制のテーマを導入します。](https://github.com/imathis/octopress/wiki/3rd-Party-Octopress-Themes)  
今回は、[Whitespace](https://github.com/lucaslew/whitespace)というのを導入しました。  
インストールの際に、既にインストールしたファイルを上書くか聞かれるのでyを入力します。  

zshを使ってて`zsh: no matches found`が出てしまう方は[をエスケープするか  
.zshrcに`setopt nonomatch`を記述しておきましょう。  

```
git clone git://github.com/lucaslew/whitespace.git .themes/whitespace
bundle exec rake install['whitespace']
A theme is already installed, proceeding will overwrite existing files. Are you sure? [y/n]

bundle exec rake preview
```

ブログタイトルなどは_config.ymlの中で設定できます。  
titleやauthor等を編集すると、ヘッダーやフッターが自動的に変わってくれます。  
SNSのURLも設定できるようですが、Whitespaceはデフォルトだと何も出ません。  
他のテーマだとリンクがアイコンで表示されたりするんでしょうね。  

```yaml
# ----------------------- #
#      Main Configs       #
# ----------------------- #


title: My Octopress Blog
subtitle: A blogging framework for hackers.
author: Your Name
simple_search: http://google.com/search
description:

...

```

## GitHub Pagesの設定

Githubにusername.github.comというリポジトリを作成します。
例えば僕の場合、[onigraというusername](https://github.com/onigra)なので[onigra.github.com](https://github.com/onigra/onigra.github.com)となります。  

## デプロイ

OctopressをGithub Pagesにデプロイするための設定をします。  

```
bundle exec rake setup_github_pages
```

コマンドを叩くと、Github PagesのリポジトリのURLを入力しろと出ますので、  
先程作ったリポジトリのURLを入力しましょう。  

```
Enter the read/write url for your repository:
git@github.com:onigra/onigra.github.com.git
```

入力したら、下記コマンドを入力するとデプロイできます。  
しばらくすると、[http://onigra.github.io/](http://onigra.github.io/)にブログができあがります。  

```
bundle exec rake generate
bundle exec rake deploy
```

## 自己紹介の追加

自己紹介ページが無い事に気付いたので、追加してみます。  
rakeタスクを確認すると、new_pageというタスクがあるのでこれを使います。  

自己紹介のページは、aboutという名前にします。  

```
bundle exec rake new_page['about']
```

すると、`source/about/index.markdown`というディレクトリができるので  
これを編集します。編集したら、ナビゲーションにリンクを追記します。  
Whitespaceの場合は、 `source/_includes/custom/navigation.html`を編集すればOKでした。  

## 感想

簡単でした。rubyで何か作ったことある人でしたら1時間もあれば立てれるでしょう。markdownで書けるのも楽で良いです。   
よくわからない管理ツール使わずに、コマンドラインで全部完結するのもいいですね。エンジニアっぽくて。  

