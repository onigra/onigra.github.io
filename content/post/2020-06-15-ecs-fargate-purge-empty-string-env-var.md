---
title: "ECS Fargate Platform Version 1.4.0 は空文字列の環境変数を設定できない"
slug: "ecs-fargate-purge-empty-string-env-var"
categories:
- ecs Fargate
date: "2020-06-15T00:00:00+09:00"
---

Task Definition に空文字列を設定した環境変数があるアプリをPlatform Version 1.4.0 で起動したら、アプリ実行時に環境変数が存在しないエラーが発生した。
1.3.0 では普通に動くので、1.4.0だと空文字列を設定した環境変数は消えてしまうようだ。

マジで〜と思ってAWSのサポートに問い合わせた所、その通りで現時点では 1.4.0 は空文字列の環境変数を設定できないとの返答だった。  
改善要望としてフィードバックしてもらったので、修正されるといいですね。
