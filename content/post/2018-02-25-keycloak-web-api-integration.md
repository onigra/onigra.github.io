---
title: "Keycloakを使ってWeb APIに対してアクセストークンを使ったリクエストを行う"
slug: "kc-with-webapi"
categories:
- keycloak
date: "2018-02-25T03:19:15+09:00"
---

Web API の認証を[Keycloak](http://www.keycloak.org/)で行いたい場合の設定と構成の話。

クライアントサイドの JavaScript アプリケーションがリソースをバックエンドの Web API から取得するような、今時の Web アプリケーションを想定している。

Keycloak と連携したアプリケーションで、OpenID Connect で認証したアプリケーションから Web API に対して Access Token を使って認証する場合、以下の 2 つの SSO Client の準備が必要。

* Access Type を `public` に設定した SSO Client
* Access Type を `bearer-only` に設定した SSO Client

Web API のような  アクセストークンだけで認証チェックを行いたいアプリケーションの場合、Access Type を `bearer-only`に設定した Client と連携したアプリケーションを用意する必要があるが、 `bearer-only` のクライアントはログイン（アクセストークン発行）を行うことができない。

なので、Web API とは別のクライアントアプリケーションを用意してそちらでログインを行なった後、そこで取得したアクセストークンを `Authorization: Bearer` ヘッダに渡して HTTP Request を投げる必要がある。

![kc_with_webapi](/images/kc_with_webapi.png)

認証には Keycloak が用意しているアダプタを使う。

Public client（ブラウザアプリ）には[JavaScript Adapter](http://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter)、Bearer-only のクライアント（Web API）には、例えば Node.js の場合は[keycloak-nodejs-connect](https://github.com/keycloak/keycloak-nodejs-connect)が用意されてるが、keycloak-nodejs-connect を Bearer-only の client で使う際にはちょっと注意が必要なんだけど、それはまた別の記事で書く。
