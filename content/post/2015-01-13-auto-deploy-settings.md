---
title: "コーポレートサイトを自動デプロイするようにした"
slug: "auto-deploy-settings"
date: "2015-01-13T19:37:36Z"
---

このコーポレートサイトはCIに[wercker](http://wercker.com/)使ってて、この間自動デプロイするようにした。

[http://www.exvisionz.jp/](http://www.exvisionz.jp/)

関連記事

- [年末ハッカソンしてコーポレートサイトをAWS + Nginx + Unicorn + Sinatra構成でリニューアルした](http://onigra.github.io/blog/2015/01/03/the-year-end-hackathon/) 
- [コーポレートサイトのNginxの設定をチューニングも兼ねていじった](http://onigra.github.io/blog/2015/01/07/corporate-site-tuning-with-nginx/)

# ざっくり概要

- デプロイツールはcapistano3を使用
  - デプロイ先のipは`deploy/production.rb`で[aws-sdk](https://github.com/aws/aws-sdk-ruby)を使って取得
  - プライベートリポジトリからのソースの取得はSSH Agent Forwadingで行っている
- デプロイ開始時、終了時にslackに通知
  - [capistano-slackify](https://github.com/onthebeach/capistrano-slackify)を使用
- masterのテストが通ったらで`wercker.yml`に記述したデプロイタスクが動くようにしてある
  - 基本的な話は[このあたり](http://milk1000cc.hatenablog.com/entry/20131130/1385810747)が参考になる
- 要は、werckerがCI用に立てたUbuntuのインスタンスからcapistranoを叩くようにすればいい

<!--more-->

# 事前準備

- 必要な情報を`PIPELINE`に登録しておく
  - 秘密鍵
    - プライベートリポジトリアクセス用
    - ec2
  - AWSのアクセスキー
    - `cap production deploy`する時に環境変数に入れて叩くようにしてる
      - AWS_ACCESS_KEY_ID
      - AWS_SECRET_ACCESS_KEY
  - slackのwebhook url

# デプロイタスク

wercker.ymlの中身を見た方が早いと思うので載せる

```yml
deploy:
    steps:
        - script:
            name: make .ssh directory
            code: mkdir -p "$HOME/.ssh/corporate_site"
        - create-file:
            name: write deploy ssh key
            filename: $HOME/.ssh/corporate_site/deploy.rsa
            overwrite: true
            hide-from-log: true
            content: $DEPLOY_KEY
        - script:
            name: set permissions for deploy ssh key
            code: chmod 0400 $HOME/.ssh/corporate_site/deploy.rsa
        - create-file:
            name: write aws ssh key
            filename: $HOME/.ssh/corporate_site/corporate_site.kp.pem
            overwrite: true
            hide-from-log: true
            content: $AWS_PEM
        - script:
            name: set permissions for aws ssh key
            code: chmod 0400 $HOME/.ssh/corporate_site/corporate_site.kp.pem
        - script:
            name: add ssh agent
            code: |
              eval `ssh-agent`
              ssh-add $HOME/.ssh/corporate_site/deploy.rsa
        - script:
            name: deploy
            code: AWS_ACCESS_KEY_ID=$KEY_ID AWS_SECRET_ACCESS_KEY=$KEY_SECRET bundle exec cap production deploy BRANCH=master
```

## 解説

1. make .ssh directory
    - `$HOME/.ssh/corporate_site`ディレクトリを作成
    - 秘密鍵を置くディレクトリを作ってる
1. write deploy ssh key
    - `$HOME/.ssh/corporate_site/deploy.rsa`というファイルを作成する
    - 内容は事前に`PIPELINE`で登録した`DEPLOY_KEY`を使用する
1. set permissions for deploy ssh key
    - `$HOME/.ssh/corporate_site/deploy.rsa`のパーミッションを0400に変更
1. write aws ssh key
    - `$HOME/.ssh/corporate_site/corporate_site.kp.pem`というファイルを作成する
    - 内容は事前に`PIPELINE`で登録した`AWS_PEM`を使用する
1. set permissions for aws ssh key
    - `$HOME/.ssh/corporate_site/corporate_site.kp.pem`のパーミッションを0400に変更
1. add ssh agent
    - ssh-agentを起動し、`$HOME/.ssh/corporate_site/deploy.rsa`を登録する
1. deploy
    - デプロイタスクの実行
    - 環境変数`AWS_ACCESS_KEY_ID``AWS_SECRET_ACCESS_KEY`には事前に`PIPELINE`で登録した値を使用している

# ハマった所

`ssh-agent`起動してなくてちょっとハマった。capistranoのログにはこんなエラーが吐かれる。

```
Permission denied (publickey).
fatal: Could not read from remote repository.
```
