---
title: "コーポレートサイトのNginxの設定をチューニングも兼ねていじった"
slug: "corporate-site-tuning-with-nginx"
categories:
- Nginx
date: "2015-01-07T23:52:08Z"
---

年末にリニューアルしたコーポレートサイトのNginxの設定をチューニングも兼ねていじった。

[年末ハッカソンしてコーポレートサイトをAWS + Nginx + Unicorn + Sinatra構成でリニューアルした](http://onigra.github.io/blog/2015/01/03/the-year-end-hackathon/)

# 構成

- Amazon EC2 t2.small 1台
  - Amazon Linux
  - ELB無し
  - Public Subnetのみ
  - EC2インスタンスにEIP割り当てて、DNSのAレコード設定してるだけ
- Nginx 1.7.7
- Ruby 2.2.0
  - Sinatra
    - 基本的に分割したhtmlをpartialでマージしてindex.htmlを返してるだけ
  - Unicorn
    - worker 4

### 最終的なnginx.confとビルド時のコマンド

[https://gist.github.com/onigra/ff92467d1107a5b868e1](https://gist.github.com/onigra/ff92467d1107a5b868e1)

# やったこと

httpサーバの設定を本格的にいじったのが初めてなので、インフラ専門の人から見て特に目新しいことはしてないと思う。

- チューニング
  - worker_processesをautoにする
  - worker_rlimit_nofileとworker_connectionsの数値をいじる
  - use epoll
  - 静的コンテンツをgzipで返す設定
  - proxy cacheを使う
  - 静的コンテンツはNginxに返させる
- セキュリティ
  - server_tokens off
  - DDos対策
- 趣味
  - GeoIPの情報をログに出す

<!--more-->
 
# チューニング

厳密な検証はしてないけど、プロキシキャッシュを有効にしたこと以外は大して差が出なかった印象。
まあこれはサイトの特性もあるだろうけど。

一応、Vagrantに対してApache Benchを叩いた結果をGistに残してある。

[https://gist.github.com/onigra/85cd9b282dc7b2db5405](https://gist.github.com/onigra/85cd9b282dc7b2db5405)

productionはこっち

[https://gist.github.com/onigra/32548e563877c1c5b00c](https://gist.github.com/onigra/32548e563877c1c5b00c)

## 外部サイトの診断結果

- [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=www.exvisionz.jp)
- [Website Speed Test](http://tools.pingdom.com/fpt/#!/elTyp5/http://exvisionz.jp/)
- [Load Impact](https://loadimpact.com/load-test/exvisionz.jp-afcf26a91d5e700383be82fd8a02587d)

まあ、t2.small1台なら十分だと思うんですがいかがでしょうか。

# DDos対策

Nginxのデフォルトモジュールで[ngx_http_limit_conn_module](http://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)と[ngx_http_limit_req_module](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)っていうのがあったので、それを使う。

```
http {

    ...

    # 同時接続数制限を行う際のメモリ領域を10MB確保
    limit_conn_zone $binary_remote_addr zone=limit_conn_zone1:10m;

    # 1秒あたり50リクエストを超えるペースだと503を返す
    limit_req_zone $binary_remote_addr zone=limit_rec_zone1:10m rate=50r/s;

    server {

        ...

        location / {
            # 1つのIPからの同時接続数が100を超えると503が返る
            limit_conn limit_conn_zone1 100;

            # 1秒あたり50リクエストを超えた場合、100リクエスト超えるまで待ってから503を返す
            limit_req zone=limit_rec_zone1 burst=100;
        }
    }
}
```

# ログに国籍と都市情報を出す

なんとなく面白そうなのと、後で解析する時に遊べそうかなと思って[ngx_http_geoip_module](http://nginx.org/en/docs/http/ngx_http_geoip_module.html)を入れた。
ビルドの際に`GeoIP-devel`が必要。

confの`geoip_country`に`GeoIP.dat`、`geoip_city`に`GeoLiteCity.dat`のパスを書くと、GeoIP関連の変数が使えるようになる。

ちゃんと調べてないんだけど、CentOS6.5だとGeoIP系のファイルが最初から入ってたか、`GeoIP-devel`が入れたのか揃ってたけど、AmazonLinuxは`GeoLiteCity.dat`が無かったので取ってくるようにしてる。

```
http {

    ...

    geoip_country /usr/share/GeoIP/GeoIP.dat;
    geoip_city /usr/share/GeoIP/GeoLiteCity.dat;

    log_format ltsv "geoip_country_name:$geoip_city_country_name\t"
                    "geoip_country_code3:$geoip_city_country_code3\t"
                    "geoip_city:$geoip_city";

    access_log /var/log/nginx/access.log ltsv;

    ...
}
```

# あとできそうなこと

- 静的コンテンツを予めまとめてminifyしてgzipしておく

ダルい。

- SPDY対応

これはそのうちやると思う。なってるとカッコいいし。冗長化も含めて[この構成](http://dev.classmethod.jp/cloud/aws/aws-elb-ssh/)がよさそう。

# まとめ

<blockquote class="twitter-tweet" lang="ja"><p>昨日コーポレートサイトを散々おもちゃにしたおかげでNginxとチューニングについての知見が溜まった</p>&mdash; フルパワーで対応 (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/status/552651833080954880">2015, 1月 7</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
