---
title: "AMIからアプリケーションの環境ごとの固有の設定をなくし、サーバ起動時に動的に取得することにより、StagingとProductionで同じAMIを使う"
slug: "remove-environment-settings-from-ami"
categories:
- AWS
date: "2018-08-18T18:03:41+09:00"
---

# はじめに

ゴールデンイメージを作成し、それをLaunch TemplateやAuto Scaling Groupで使う運用は多いが、アプリケーションの作りによっては環境ごとの設定をイメージ内に入れ込む必要があったりする。よくあるのは環境変数だ。

環境変数をイメージ内に入れ込んでしまうと、内容が変わるたびにイメージの再作成が必要になる上に、StagingとProductionで使うイメージは異なるものになってしまう。それはもはや、Stagingとは言えない。

とは言え、なかなかそこを切り離すのは難しく、やむなく入れ込むことが多かったのだが、最近、AWSのSecrets ManagerとUser Dataを使うことによって、環境変数をゴールデンイメージに埋め込まない運用を可能にすることができたのでメモ。

# 環境

- AWS
- Ubuntu 18.04

## 使ったもの

- systemd
- Secrets Manager
- Launch Template(User Data)
- jq

# 設定

## AMI作成時にアプリケーションのserviceが読み込む空のEnvironmentFileを用意しておく

アプリケーションはsystemdで起動する。起動する際に読み込むEnvironmentFileを、空のファイルで用意しておく。Ubuntuだったら `/etc/default` 配下でいいだろう。以下のようなserviceが登録されている想定。

```sample.service
[Unit]
Description=sample service

[Service]
Type=simple
User=deploy
Group=deploy
UMask=0002

StandardOutput=journal
StandardError=journal

WorkingDirectory=/opt/sample/sample.jar
PIDFile=/var/run/sample.pid

EnvironmentFile=/etc/default/sample
ExecStart=/usr/bin/java -jar /opt/sample/sample.jar
ExecStop=/bin/kill -TERM $MAINPID

SuccessExitStatus=143
Restart=always

[Install]
WantedBy=multi-user.target
```

## Secrets ManagerにsystemdのEnvironmentFileで使う形式で秘匿情報を登録する

要はこのように登録して

![secrets-manager](/images/secrets.jpg)

このように取得できるようにしたい

```sh
aws secretsmanager get-secret-value --secret-id sample/production --query SecretString | jq fromjson

# {
#   "DB_PASSWORD": "foobar",
#   "API_TOKEN": "baz"
# }
```

そして、このようにパースしたい

```sh
SECRETS=$(aws secretsmanager get-secret-value --secret-id sample/production --query SecretString | jq fromjson)
echo ${SECRETS} | jq -r 'to_entries[] | [.key, .value] | @tsv' | sed 's/\t/=/g'

# DB_PASSWORD=foobar
# API_TOKEN=baz
```

## User DataでSecrets Managerから取得した値をEnvironmentFileにリダイレクトする

上記を踏まえ、User Dataにこのように書いておけば、サーバ起動時に動的に秘匿情報を取得することができる。  
Launch TemplateはStagingとProductionで分けておいて、それぞれの環境ごとのSecret IDをUser Dataに設定すればよい。

```sh
#!/bin/bash

SECRETS=$(aws secretsmanager get-secret-value --secret-id sample/production --query SecretString | jq fromjson)
echo ${SECRETS} | jq -r 'to_entries[] | [.key, .value] | @tsv' | sed 's/\t/=/g' > /etc/default/sample
```

