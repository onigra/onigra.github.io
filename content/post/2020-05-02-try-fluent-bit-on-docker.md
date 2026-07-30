---
title: "fluent-bitをdockerのlog driverとして試す"
slug: "try-fluent-bit-on-docker"
categories:
- fluent-bit docker
date: "2020-05-02T00:00:00+09:00"
---

## 結論

```sh
# 他のコンテナからログを受けられる fluent-bit コンテナの起動
docker run -it -p 24224:24224 fluent/fluent-bit:latest /fluent-bit/bin/fluent-bit -i forward -o stdout

# ログドライバを指定して標準出力を出せば、forwardされて fluent-bit のログが出る
docker run --log-driver=fluentd -t debian:buster-slim echo "Testing a log message"
```

## 本文

[fluent-bit](https://fluentbit.io/) を docker の log driver として試そうとしたんだけど、 [dockerhub の README](https://hub.docker.com/r/fluent/fluent-bit/) の通りにやっても動かない。cpu のログがずっと出ている。

[Dockerfile](https://github.com/fluent/fluent-bit-docker-image/blob/1.4/Dockerfile.x86_64#L106) で見てる [config](https://github.com/fluent/fluent-bit-docker-image/blob/1.4/conf/fluent-bit.conf#L38L44) 見ると、INPUT が cpu になっててるからこうなってるっぽい。

なので、input を他のコンテナのログドライバから受けれるように、forward に変えてコンテナ起動すればよい。

## 参考

- https://github.com/fluent/fluent-bit-docker-image/issues/25
- https://github.com/fluent/fluent-bit-docker-image/issues/11
