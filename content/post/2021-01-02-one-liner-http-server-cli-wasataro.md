---
title: "ワンライナーでお手軽にhttpサーバを立てるcliを作った"
slug: "one-liner-http-server-cli-wasataro"
categories:
- wasataro
date: "2021-01-02T15:00:00+09:00"
---

[nginxのリバプロの設定をスモークテストしたい](https://onigra.github.io/blog/2021/01/01/nginx-reverse-proxy-smoke-test/) と思った時に、ワンコマンドでhttpサーバで起動できるお手軽なcliと、それが使えるコンテナイメージが欲しいなと思って、せっかくなので作った。

ワンライナーHTTPサーバー太郎略してワサ太郎  
https://github.com/onigra/wasataro

[Caddy](https://caddyserver.com/) でもいいんだけど、以下の理由もあった。

- 設定ファイルではなくcliのオプションでお手軽にレスポンス指定したかった
- その程度のツールだったらgolangでシュッと作れるだろ
- packageとかimageの配布とかある程度体裁整えるのの素振りをしたかった

## 余談

- せっかくなのでDockerHubじゃなくてGitHub Container RegistryでPublishするかと思ってやってみたら、GitHubの `Feature preview` の `Improved container support` をenableにする必要があった
  - https://docs.github.com/en/free-pro-team@latest/packages/guides/about-github-container-registry
