---
title: "keycloak-nodejs-connectを使ってBearer-only clientの認証を行う際の注意点"
slug: "keycloak-nodejs-connect-with-bearer-only-client"
categories:
- keycloak nodejs
date: "2018-02-25T11:05:15+09:00"
---

[前回の続き](https://onigra.github.io/blog/2018/02/25/kc-with-webapi/)

[Keycloak](http://www.keycloak.org/)の Bearer-oncly client を使って認証の検証を行おうと思い、[Express.js](https://expressjs.com/)と[keycloak-nodejs-connect](https://github.com/keycloak/keycloak-nodejs-connect)を使った際に嵌った内容の話。

# `Keycloak.prototype.redirectToLogin` をオーバーライドする

これ。  
https://github.com/keycloak/keycloak-nodejs-connect/blob/master/index.js#L332L334

見ての通り、Bearer-only のクライアント前提だとデフォルトではリダイレクトされる判定になっている。
Bearer-only でアクセスする場合は認証している前提なので、この条件は正しい。

しかし、Web API のようなアプリケーションの場合だとこのままではリダイレクトのレスポンスが返ってきてしまう。なので、オーバーライドして条件を修正する必要がある。テストでは以下のようになっている。

https://github.com/keycloak/keycloak-nodejs-connect/blob/master/test/fixtures/node-console/index.js#L26L29

で、これはドキュメントに書いてない。正確には書いてあった。

https://github.com/keycloak/keycloak-nodejs-connect/commit/954d7a8b1fc610d9a32f72b3f98718314edc812b

> ### Advanced Login Configuration
>
> By default, all unauthorized requests will be redirected to the Keycloak login
> page unless your client is bearer-only. However, a confidential or public client
> may host both browsable and API endpoints. To prevent redirects on unauthenticated
> API requests and instead return an HTTP 401, you can override the `redirectToLogin`
> function.
>
> For example, this override checks if the url contains /api/ and disables login
> redirects:
>
>     Keycloak.prototype.redirectToLogin = function(req) {
>       var apiReqMatcher = /\/api\//i;
>       return !apiReqMatcher.test(req.originalUrl || req.url);
>     };

その後、[アダプタのドキュメント](http://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter)を移した際に README から消されたのだが、移行先のドキュメントにはこの内容は書いていない。

https://github.com/keycloak/keycloak-nodejs-connect/commit/ba22890df34a526754dad9bbe9b200612fb7d3f2#diff-04c6e90faac2675aa89e2176d2eec7d8

# Keycloak サーバのドメインが自己証明書を使っているとエラーになる

これは keycloak-nodejs-connect の問題ではないし、当たり前っちゃ当たり前なんだけど、検証用でサーバ立ててる場合は注意が必要。  
結論からいうと、Node(Express)のアプリ環境変数 `NODE_TLS_REJECT_UNAUTHORIZED=0` を設定して起動すればよい。

これはアクセストークンの検証の処理内でエラー理由を吐いてくれてなかったので、気づくのに時間がかかった。  
ので、[プルリク送っておいた](https://github.com/keycloak/keycloak-nodejs-connect/pull/117)。
