---
title: "nginxのリバプロの設定をスモークテストしたい"
slug: "nginx-reverse-proxy-smoke-test"
categories:
- infra nginx
date: "2021-01-01T13:00:00+09:00"
---

## やりたいこと

- nginxのリバプロの設定をスモークテストしたい

## 方針

- proxy先のhttpサーバをdocker-composeでまとめて立ち上げる
- テスト用の `server_name` を指定する
  - hostsにも追記する
- VirtualHostに対してhttpリクエスト投げるテストを実行

## やったやつ

- https://github.com/onigra/reverse_proxy_sandbox
