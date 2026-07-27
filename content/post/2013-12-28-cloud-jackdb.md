---
title: "SQL入門用の環境としてJackDB（webサービス）が便利"
slug: "cloud-jackdb"
categories:
- db sql JackDB
date: "2013-12-28T00:00:00Z"
---

職場で非エンジニアからSQLをやってみたいと言われたので、JackDBというサービスを使って教えてみることにしました。  

[http://www.jackdb.com/](http://www.jackdb.com/)

[goで書かれたデータストア](https://github.com/tristanwietsma/jack)とは異なります  

このサービス自体はwebブラウザで操作するDBクライアントなんですが、無料サンプルでPostgreSQLが扱えます。  
DBに限った話じゃないですが、DBは環境やサンプルデータを用意するのがダルいので、前に少し触った事を思い出して使ってみました。  

<!--more-->

### 使い方

[https://cloud.jackdb.com/signup](https://cloud.jackdb.com/signup)からサインアップします。  

![サインアップ](/images/signup.png)

サインアップすると接続するDBを選ぶ画面が出るので、 `sample PostgreSQL database.` をクリックします。  

![DB選択](/images/newdb.png)

すると、サンプルのDBが使えるようになります。ここまでくれば何をすればいいか分かると思います。  

![エディタ1](/images/editor1.png)

いくつかテーブルが用意されてるので、好きに触らせてみてください。  

![エディタ2](/images/editor2.png)

JackDBというサービス自体は使い込んでないのでぶっちゃけよくわかりません。  
SQL覚えて自分で分析やら抽出やらできるようになってくれるといいな。。。  

