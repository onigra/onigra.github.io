---
title: "Ginza.rbのRails Action Mailer Previewのコードリーディングに行ってきた #ginzarb"
slug: "ginzarb-action-mailer-preview-code-reading"
categories:
- ruby-on-rails ruby ginzarb
date: "2014-06-18T10:46:26Z"
---

[これ](http://ginzarb.doorkeeper.jp/events/12380?utm_campaign=event_12380_8395&utm_medium=email&utm_source=registered_message)に行ってきた。  
会場を提供してくださった リクルートライフスタイル様、ありがとうございました。

## 概要

### 機能、使い方
  * [RailsのAction Mailer Previewsについて](http://y-yagi.tumblr.com/post/88746017105/rails-action-mailer-previews)
  * [サンプルアプリ](https://github.com/ginzarb/mailer_previews_sample)

<!--more-->

### 読む所

[https://github.com/rails/rails/blob/4-1-stable/actionmailer/lib/action_mailer/preview.rb](https://github.com/rails/rails/blob/4-1-stable/actionmailer/lib/action_mailer/preview.rb)

### コードリーディングの進め方

[パーフェクトRails](http://www.amazon.co.jp/gp/product/4774165166)の著者の一人である[Willnetさん](https://twitter.com/netwillnet)がPCをプロジェクターに映して解説しつつ読み進め、機能に詳しくてrailsのコミットログ[しょっちゅう読んでる](http://y-yagi.hatenablog.com/)[y_yagi](https://twitter.com/y_yagi)さんが補足説明するという豪華なスタイル。それを参加者が見つつなんか言いつつという方式で進めていた。

## コードリーディング

* [action_mailer / preview.rb](https://github.com/rails/rails/blob/4-1-stable/actionmailer/lib/action_mailer/preview.rb)

今回のスコープだが、ここだけ読んでもピンとこない。  
実際にアプリからpreviewを開いてログを見てみると、railtiesのmailers_controller.rbが実行されていることがわかる。  
なので、そこと合わせて見る。

```
Started GET "/rails/mailers/user_mailer/mail2?part=text%2Fplain" for 127.0.0.1 at 2014-06-17 19:54:00 +0900
Processing by Rails::MailersController#preview as HTML
  Parameters: {"part"=>"text/plain", "path"=>"user_mailer/mail2"}
  Rendered user_mailer/mail1.html.erb (0.1ms)
  Rendered user_mailer/mail1.text.erb (0.0ms)

UserMailer#mail1: processed outbound mail in 14.1ms
  Rendered text template (0.0ms)
Completed 200 OK in 17ms (Views: 0.5ms | ActiveRecord: 0.0ms)


Started GET "/rails/mailers/user_mailer/mail2?part=text%2Fhtml" for 127.0.0.1 at 2014-06-17 19:54:04 +0900
Processing by Rails::MailersController#preview as HTML
  Parameters: {"part"=>"text/html", "path"=>"user_mailer/mail2"}
  Rendered user_mailer/mail1.html.erb (0.1ms)
  Rendered user_mailer/mail1.text.erb (0.0ms)

UserMailer#mail1: processed outbound mail in 13.4ms
  Rendered text template (0.0ms)
Completed 200 OK in 16ms (Views: 0.3ms | ActiveRecord: 0.0ms)
```


* [railties / lib / rails / mailers_controller.rb](https://github.com/rails/rails/blob/4-1-stable/railties/lib/rails/mailers_controller.rb)

`ActionMailer::Preview.all`は作成したpreview配下にあるファイルを全部とってきてるのがわかる。indexメソッドのテンプレートは[これ](https://github.com/rails/rails/blob/4-1-stable/railties/lib/rails/templates/rails/mailers/index.html.erb)。  

で、その後にメールのタイトルと本文をとってきて[これ](https://github.com/rails/rails/blob/4-1-stable/railties/lib/rails/templates/rails/mailers/mailer.html.erb)に表示させてる感じ。あとはプレーンテキストかHTMLで表示するかを条件分岐してて、これをparamsからとってきてる。

* [railties / lib / rails / application / finisher.rb](https://github.com/rails/rails/blob/4-1-stable/railties/lib/rails/application/finisher.rb#L22-L33)

mailer_previewのroutingはここで追加されてて、`Rails.env`が`development`だとroutingが動的に追加されるようになってる。welcomeページと一緒。

## 感想

Railsに詳しい人が解説しながら読み進めてるのを見るのは非常に楽くて勉強になった。ソースの難易度や規模的にも丁度良い感じだったと思う。（自分はアホなので予習しないとたぶんついていけなかったけど）またやってほしいです。

## 余談

少し時間が余ったので、メール周りの話になった

### 開発中のメールを飛ばして閲覧できる（Fake SMTP Server + α）

* サービス
    * [https://mailtrap.io/](https://mailtrap.io/)
* gem
    * [fgrehm/letter_opener_web](https://github.com/fgrehm/letter_opener_web)(Rails)
    * [tyabe/letter_opener-web](https://github.com/tyabe/letter_opener-web)(Sinatra)
        * [tyabe](https://twitter.com/tyabe)さんが、letter_opener_webがRailsベースなのが嫌でSinatraベースで作った
        * [http://qiita.com/tyabe/items/a11e01f6682e3bcbc0aa](http://qiita.com/tyabe/items/a11e01f6682e3bcbc0aa)
 
### メール配信サービス

* [http://mailchimp.com/](http://mailchimp.com/)
* [http://sendgrid.com/](http://sendgrid.com/)
