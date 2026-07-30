---
title: "俺のMySQL秘伝スクリプトが火を噴くぜ #mysqlcasual"
slug: "mysql-hiden-source"
categories:
- MySQL
- MySQLCasualTalk
date: "2013-12-08T00:00:00Z"
---

このエントリーは[MySQL Casual Advent Calendar 2013](http://www.zusaar.com/event/1847003) 8日目の記事です。

<blockquote class="twitter-tweet" lang="ja"><p>MySQL Casual Advent Carenderで秘伝のタレの火を吹かせようかしら</p>&mdash; ネコゲルゲ (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/statuses/400605522706956288">2013, 11月 13</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="ja"><p>ｶﾞﾀｯ RT <a href="https://twitter.com/nekogeruge_987">@nekogeruge_987</a>: MySQL Casual Advent Carenderで秘伝のタレの火を吹かせようかしら</p>&mdash; Tatsuro Hisamori (@myfinder) <a href="https://twitter.com/myfinder/statuses/400606259889459200">2013, 11月 13</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="ja"><p>余計なことつぶやくんじゃなかった</p>&mdash; ネコゲルゲ (@nekogeruge_987) <a href="https://twitter.com/nekogeruge_987/statuses/400606622050832384">2013, 11月 13</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--more-->

というわけで、僕が仕事で書いた秘伝のタレの一つを紹介します。  

まず、秘伝のタレを作った背景というのが、先日mysqlcasualでLTした [IBM DB2からMySQLへの移行](https://speakerdeck.com/onigra/dbyi-xing-wozhi-eruji-shu) の中で、唯一移行できなかったマーケティングの用途で使用されているDBにあります。  

移行できなかった理由は、もういない人が残していった謎の集計用バッチが大量に動いており、何をしているのかわかる人もおらず、当然ドキュメントも残っていないため、動かすことができなかったからでした。  

とはいえ、このままDB2を使い続けるわけにはいかなかったので、僕がブラックボックスに手を入れることになりました。  
蓋を開けてみると、大量のBashスクリプトとSQLファイルが出てきました。  

処理の内容はほぼ全てクエリの結果を外部ファイルにdumpし、テーブルを作り直してロードしなおすという、いわゆる洗い替えを行っていました。  
とりあえずSQLの方言を直して、同様にシェルスクリプトで叩くようにすれば移行できるのですが、大きな問題が出てきます。クエリのパフォーマンスです。  

SQLはオプティマイザの性能に頼りきった作りになっており、データが増え続けることやメンテナンス性を考慮している様子が見られず、数千万件を超えるテーブルをサブクエリのサブクエリのサブクエリの…のようなものばかりでした。こんなSQLでもジョブが破綻しないのはさすがDB2ですね。  

当然チューニングを試みるのですが、エンジニアも分析担当者も、そもそも何を分析したいがためにこのデータを集めているのかが引き継がれておらず、クエリの目的がわからないため、どのような結果にすべきかがわからないという地獄のような現実を聞き、下手にクエリを書き換えられなくなってしまいました。  

どうしようかと考えた結果、一つのアイディアが浮かびます。  

```
　 　　　　 |
　 　＼　　__　　／
　 　＿　（ｍ）　＿  ﾋﾟｺｰﾝ
　 　　　　|ミ|
　 　 ／ 　｀´　 ＼
　　　　　('A`)    < そうだ、SQLの実行ホストを分散させよう
　　　　　ノヽノヽ
　　　　　　　くく
```

スレーブは複数台あったので、それらで負荷分散すればバッチ全体の終了時間を早めることができると考え、ShellScriptの分散バッチフレームワークというよくわからないものを作りました。  
処理の流れは、  

* 各ホストでINTO OUTFILEのSQLを実行
* INTO OUTFILEは実行ホストにしかファイルのエクスポートができないため、rsyncでmasterのホストにもってくる
* masterにLOAD INFILEする
* 件数が多いと [このエラー](http://qiita.com/nekogeruge_987/items/2a274d9b93281346869d) が出るので、自動でsplitするようにする

できたものがこちらです。  

[onigra/mysql_hiden_sauce](https://github.com/onigra/mysql_hiden_sauce)

`batch_example` がサンプルのバッチで、下記の構成になっています  

```
batch_example/
├── data
│   └── example_table
└── sample
    ├── drop_test_database
    │   ├── execute.sh
    │   ├── remote_execute.sh
    │   └── sql
    │       └── drop_test_database.sql
    ├── export_data
    │   ├── execute.sh
    │   ├── remote_execute.sh
    │   └── sql
    │       └── export_members.sql
    └── setup_database
        ├── execute.sh
        ├── remote_execute.sh
        └── sql
            ├── 1.create_test_table.sql
            └── 2.insert_test_data.sql
```

`sample` はテーブル名で、配下にそのテーブルに対して行う処理ごとにディレクトリを作成し、さらにその配下に `sql` ディレクトリを作成し、その中にsqlファイルを置きます。  
例えば、 `setup_database` ディレクトリにはテスト用のテーブルを作成するDDLとテストデータをinsertするDMLが置いてあり、この状態で `execute.sh` を実行するとlocalhostにあるMySQLに対して `sql` 配下に置いてあるSQLを実行します。  

内部はこんな感じです。  

```sh
###
# setting
#
_APP_ROOT=`echo $(cd ../../.. $(dirname $0); pwd)`
. $_APP_ROOT/lib/job_framework/export.sh develop

_SCRIPT_PATH=`echo $(cd $(dirname $0); pwd)`
sql_files=(`ls -dF $_SCRIPT_PATH/sql/*`)

###
# main
#
if [ "$DRYRUN" = "TRUE" ]; then
  for (( i = 0; i < ${#sql_files[@]}; i++ ))
  do
    execute_sql -s ${sql_files[$i]} -n
  done
else
  for (( i = 0; i < ${#sql_files[@]}; i++ ))
  do
    execute_sql -s ${sql_files[$i]}
  done
fi
```

`lib/job_framework/export.sh` には便利関数が書いてあり、 `lib/job_framework/export.sh mysqlのユーザー名` でsourceすると `execute_sql -s 外部sqlファイル` で` config/account.info` からログイン情報取得して外部ファイルに置いたsqlを実行してくれます。 `remote_execute.sh` の方を見てみると、  

```sh
###
# setting
#
_APP_ROOT=`echo $(cd ../../.. $(dirname $0); pwd)`
. $_APP_ROOT/lib/job_framework/remote_export.sh 192.168.50.99 develop

_SCRIPT_PATH=`echo $(cd $(dirname $0); pwd)`
sql_files=(`ls -dF $_SCRIPT_PATH/sql/*`)

###
# main
#
if [ "$DRYRUN" = "TRUE" ]; then
  for (( i = 0; i < ${#sql_files[@]}; i++ ))
  do
    remote_execute_sql -s ${sql_files[$i]} -n
  done
else
  for (( i = 0; i < ${#sql_files[@]}; i++ ))
  do
    remote_execute_sql -s ${sql_files[$i]}
  done
fi
```

こちらはファイルや関数に `remote` がついています。これを `lib/job_framework/export.sh sqlを実行したいホストorIP mysqlのユーザー名` というようにsourceすると、 `sqlを実行したいホストorIP` で実行してくれます。（サンプルでは192.168.50.99になっています）  

次に、実際にslaveのホストからファイルをエクスポートしてmasterにもってくる `export_data` 配下を見てみます。 `remote_execute.sh` のメイン処理部分を見てみると、こんな感じになってます。  

```sh
# 古いエクスポート済みのcsvファイルがあれば削除
remote_remove_exported_files -t example_table -j members

# sql/配下のsqlファイルを取得して順に実行
for (( i = 0; i < ${#sql_files[@]}; i++ ))
do
  remote_execute_sql -s ${sql_files[$i]}
done

# エクスポートしたcsvが行数、バイト数の閾値を超えていればsplit
remote_split_big_file  -t example_table -j members -l 5 -b 50

# masterのホストにrsyncで転送する
remote_transport_csv_files -t example_table -j members
```

これを叩くと、 `sql` ディレクトリに置いた `INTO OUTFILE` のsqlを実行し、 `batch_example/data/example_table` 配下にエクスポートされたcsvを転送してくれ、ファイルサイズが大きければsplitしてくれます。これをまたmasterのテーブルにloadするジョブを追加して書けばいいわけですね。  

※注意点で、リモートホストにもファイルエクスポート用に `batch_example/data/example_table` と同じディレクトリ構成を作り、 `data` 配下のパーミッションを777にしておく必要があります（INTO OUTFILEはmysqlユーザーで行われるため）

これらのジョブ複数作成し、[Jenkins Build Flow Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Build+Flow+Plugin)を使ってパラレルで実行してみたところ、全体で3時間ほど短縮することに成功しました。しかし、根本解決にはなってないのでクエリの分析とチューニングは引き続き行っています…  

ここまでバッチジョブのフレームワークについて紹介しましたが、秘伝のタレには他にもCSV EXPORT/LOADのラッパースクリプト、上記のconfigファイルに書いたログイン情報を取得して外部SQLファイルを実行する関数と、sqlを直接書いて実行できる関数を単体で切り出したもの、レプリケーション設定スクリプト等あったりするのですが、これはまたおいおい書いて行きます。（需要があるかわかりませんが）  

また、 `test` 配下にテストコードもあるのですが、リモートホストに立てたmysqlが必要なものもあるので、環境構築用のVagrantfileも追ってpushしようかと思います。（準備が間に合いませんでした）  

なんか発表資料見るとShellScriptばっか書いてる気がしますが、仕事ではRubyも書いてます。。。  

明日は [@chobi_e](https://twitter.com/chobi_e) さんです！

