---
title: "コンテナに対してルーティングするリバースプロキシを何でやるか"
slug: "container-reverse-proxy-idea"
categories:
- infra container
date: "2020-12-31T00:00:00+09:00"
---

## お題

- httpサーバを複数のコンテナで並べた時に、各コンテナに対してルーティングするリバースプロキシを何でやるか
- ドキュメントルートに対してのリクエストをどうやって返すか
- 開発環境及び、ミッションクリティカルではないサービスでのユースケース

## ALB

- パスベースルーティングでやる
  - https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/listener-update-rules.html
- ドキュメントルート
  - 固定レスポンスアクション
    - https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-listeners.html#fixed-response-actions
  - ドキュメントルートのレスポンス用のコンテナを用意する

## Caddy

- https://caddyserver.com/
- お手軽リバプロ
  - 必要最低限の記述でお手軽にリバプロ立てられる
    - ワンライナーでも立てられる
    - Caddyfile便利
    - 開発環境(localhost)のhttps化もお手軽
      - コンテナで起動するとブラウザの警告画面が出ちゃう
      - 開発用途だとホストOSで起動した方がよさそうな気がする
- ドキュメントルート
  - Caddyfileで簡単にレスポンスを記述できる

## ECSで考える場合

- Serviceを複数作る
  - ListnerRuleが長くなる
  - デプロイが複数回
- 1Service1タスク
  - クソ長TaskDefinition
  - 料金節約できるかも？

## 雑感

- ECSではパスベースルーティングでやって、開発環境でそれを再現する際にCaddy使うって感じかな
