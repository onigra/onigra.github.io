---
title: "Ansible Extraとalternativesモジュールの話 | Ansible Advent Calendar2014"
slug: "ansible-extra-and-alternatives-module"
date: "2014-12-11T19:17:43Z"
---

この記事は[Ansible Advent Calendar 2014](http://qiita.com/advent-calendar/2014/ansible) 16日目の記事です。
前日は、[piohoさん](https://twitter.com/pioho07)の[Ansible Galaxy にロールを登録してバージョン管理してみる(Aerospike構築Roleで)](http://qiita.com/pioho07/items/683323611d4669ca368c)でした。

本エントリーでは、先日Ansible Extraの`alternatives`モジュールを使おうとして、最終的にやめた話について書きます。


# Ansible Extraとは？

> This repo contains a subset of ansible-modules with slightly lower use or priority than "core" modules.
>
> All new modules should be submitted here, and have a chance to be promoted to core over time.

[ansible/ansible-modules-extras](https://github.com/ansible/ansible-modules-extras)リポジトリのREADMEより引用

> v1.8でCoreとExtraに分割されました。
> Coreが優先的にメンテナンスされます。
> 新しいモジュールはExtraにまず登録され、使用頻度・必要性などによりCoreに昇格されます。

AdventCalendar1日目、[volanjaさん](https://twitter.com/volanja)の[今年1年間でAnsible界隈ではどのような変化が起こったのか。](http://qiita.com/volanja/items/2ffa1599fc9a1fae39a1)より引用。

<!--more-->

Ansible Extraとは、Ansible Coreに登録されているモジュールよりも利用頻度、優先度が低いと判断されているモジュール群です。
新しく作成されたモジュールはまずこのリポジトリにプルリクをし、おそらくコミッタの判断を経て最終的にCoreに昇格されるのでしょう。
分かりやすく言うと2軍ですね。

ExtraはAnsibleバージョン1.7まではCoreのリポジトリで一緒に管理されていましたが、1.8からは別々のリポジトリに分かれ、submoduleとしてAnsible本体のリポジトリで管理されています。

* [ansible/ansible-module-core](https://github.com/ansible/ansible-modules-core)
* [ansible/ansible-module-extras](https://github.com/ansible/ansible-modules-extras)


# alternativesモジュールについて

注意: 筆者はpythonを書いたことがないので、言ってることが間違ってる可能性があります。間違いがありましたら[@nekogeruge_987](https://twitter.com/nekogeruge_987)までお手数ですがご指摘お願いします。  

ここから本題なのですが、`alternatives`を使いたい状況があったのでモジュールを探してみた所下記のドキュメントに辿り着きました。

[alternatives - Manages alternative programs for common commands](http://docs.ansible.com/alternatives_module.html)

使ってみたらエラー吐きました。

```sh
$ ansible-playbook -i dev_hosts provisioning_test.yml
 
PLAY [test] *******************************************************************
 
GATHERING FACTS ***************************************************************
ok: [pro_test]
 
TASK: [agent/postfix | MTA change to postfix] *********************************
fatal: [pro_test] => failed to parse: SUDO-SUCCESS-grtqdpoqwzskgcjfiecurouhaywxelgq
Traceback (most recent call last):
  File "/home/ec2-user/.ansible/tmp/ansible-tmp-1415702504.53-4900359849119/alternatives", line 1486, in <module>
    main()
  File "/home/ec2-user/.ansible/tmp/ansible-tmp-1415702504.53-4900359849119/alternatives", line 122, in main
    check_rc=True
  File "/home/ec2-user/.ansible/tmp/ansible-tmp-1415702504.53-4900359849119/alternatives", line 1339, in run_command
    args = [ os.path.expandvars(os.path.expanduser(x)) for x in args ]
  File "/usr/lib64/python2.6/posixpath.py", line 251, in expanduser
    if not path.startswith('~'):
AttributeError: 'NoneType' object has no attribute 'startswith'
 
 
FATAL: all hosts have already failed -- aborting
 
PLAY RECAP ********************************************************************
           to retry, use: --limit @/Users/yudai/provisioning_test.retry
 
pro_test                   : ok=1    changed=0    unreachable=1    failed=0
```

発生当時の環境。

* OSX 10.9.4
* Ansible 1.7.2 (Homebrewでインストール)
* Python 2.7.5 (OSXにデフォルトで入っているPythonを使用)
* Ansible実行対象OS: AmazonLinux

playbookはこんな感じ。

```yml
---
- name: MTA change to postfix
  alternatives: name=mta path=/usr/sbin/sendmail.postfix
```


# 調査

## 結論から言うと

`link`オプションを指定すれば使えます。

```yml
---
- name: MTA change to postfix
  alternatives: name=mta path=/usr/sbin/sendmail.postfix link=/usr/sbin/sendmail
```

shellモジュールでやるとこんな感じ

```yml
- name: MTA change to postfix
  shell: alternatives --set mta /usr/sbin/sendmail.postfix
```


## ググる

同様の問題が発生しているissuesがありました。

- CentOSで発生している模様
  [https://github.com/ansible/ansible-modules-extras/issues/46](https://github.com/ansible/ansible-modules-extras/issues/46)
  この中で`link`オプションを指定すればいけるというレスがあります。

- こちらはScientific Linux
  [https://github.com/ansible/ansible/issues/7414](https://github.com/ansible/ansible/issues/7414)


# ソースを読んでみる

- moduleのソースはこれ(発生して調べてた当時は1.7.2)
  [https://github.com/ansible/ansible/blob/release1.7.2/library/system/alternatives](https://github.com/ansible/ansible/blob/release1.7.2/library/system/alternatives)

[この部分](https://github.com/ansible/ansible/blob/release1.7.2/library/system/alternatives#L29)

> Manages symbolic links using the 'update-alternatives' tool provided on debian-like systems.

なるほど、そもそもdebianしか想定してないってことですね。

`path`で指定したコマンドがalternativesに無い場合、インストールしてます。その際、`link`オプションの指定が必要になるわけですね。  
でも無いから落ちてて、`link`オプションがあるとちゃんとインストールされるからうまくいくってことかな。


# 1.8になってRedHat系OSも対応された模様

[https://github.com/ansible/ansible-modules-extras/blob/devel/system/alternatives.py](https://github.com/ansible/ansible-modules-extras/blob/devel/system/alternatives.py)

あれ、`--list`オプションってRedHat系のOSの`update-alternatives`で使えましたっけ...ちょっとVagrant使って調べてみます。

* CentOS6.5

```sh
[vagrant@vagrant-centos65 ~]$ update-alternatives --version
alternatives version 1.3.49.3
[vagrant@vagrant-centos65 ~]$ update-alternatives
alternatives version 1.3.49.3 - Copyright (C) 2001 Red Hat, Inc.
This may be freely redistributed under the terms of the GNU Public License.

usage: alternatives --install <link> <name> <path> <priority>
                    [--initscript <service>]
                    [--slave <link> <name> <path>]*
       alternatives --remove <name> <path>
       alternatives --auto <name>
       alternatives --config <name>
       alternatives --display <name>
       alternatives --set <name> <path>

common options: --verbose --test --help --usage --version
                --altdir <directory> --admindir <directory>
```

* AmazonLinux release 2014.09

```sh
[ec2-user@ip-10-1-1-31 ~]$ update-alternatives --version
alternatives バージョン 1.3.49.3
[ec2-user@ip-10-1-1-31 ~]$ update-alternatives
alternatives バージョン 1.3.49.3 - Copyright (C) 2001 Red Hat, Inc.
これは GNU 一般公有使用許諾書の規定の元で自由に再配布することができます。

使用法: alternatives --install <リンク> <名前> <パス> <優先度>
                    [--initscript <サービス>]

                    [--slave <リンク> <名前> <パス>]*
       alternatives --remove <名前> <パス>
       alternatives --auto <名前>
       alternatives --config <名前>
       alternatives --display <名前>
       alternatives --set <名前> <パス>

共通のオプション: --verbose --test --help --usage --version
                --altdir <ディレクトリ> --admindir <ディレクトリ>
```

* CentOS7

```sh
[vagrant@localhost ~]$ update-alternatives --version
alternatives バージョン 1.3.61
[vagrant@localhost ~]$ update-alternatives
alternatives バージョン 1.3.61 - Copyright (C) 2001 Red Hat, Inc.
これは GNU 一般公有使用許諾書の規定の元で自由に再配布することができます。

使用法: alternatives --install <リンク> <名前> <パス> <優先度>
                    [--initscript <サービス>]

                    [--slave <リンク> <名前> <パス>]*
       alternatives --remove <名前> <パス>
       alternatives --auto <名前>
       alternatives --config <名前>
       alternatives --display <名前>
       alternatives --set <名前> <パス>
       alternatives --list

共通のオプション: --verbose --test --help --usage --version
                --altdir <ディレクトリ> --admindir <ディレクトリ>
```

* Fedora20 

```sh
[vagrant@vagrant-fedora20 ~]$ update-alternatives --version
alternatives バージョン 1.3.60
[vagrant@vagrant-fedora20 ~]$ update-alternatives
alternatives バージョン 1.3.60 - Copyright (C) 2001 Red Hat, Inc.
これは GNU 一般公有使用許諾書の規定の元で自由に再配布することができます。

使用法: alternatives --install <リンク> <名前> <パス> <優先度>
                    [--initscript <サービス>]

                    [--slave <リンク> <名前> <パス>]*
       alternatives --remove <名前> <パス>
       alternatives --auto <名前>
       alternatives --config <名前>
       alternatives --display <名前>
       alternatives --set <名前> <パス>
       alternatives --list

共通のオプション: --verbose --test --help --usage --version
                --altdir <ディレクトリ> --admindir <ディレクトリ>
```

* Ubuntu14.04

```sh
vagrant@vagrant-ubuntu-trusty-64:~$ update-alternatives --version
Debian update-alternatives version 1.17.5.

This is free software; see the GNU General Public License version 2 or
later for copying conditions. There is NO warranty.
vagrant@vagrant-ubuntu-trusty-64:~$ update-alternatives
update-alternatives: need --display, --query, --list, --get-selections, --config, --set, --set-selections, --install, --remove, --all, --remove-all or --auto

Use 'update-alternatives --help' for program usage information.
```

* Debian7.4

```sh
vagrant@vagrant-debian-wheezy:~$ update-alternatives --version
Debian update-alternatives version 1.16.12.

This is free software; see the GNU General Public License version 2 or
later for copying conditions. There is NO warranty.
vagrant@vagrant-debian-wheezy:~$ update-alternatives
update-alternatives: need --display, --query, --list, --get-selections, --config, --set, --set-selections, --install, --remove, --all, --remove-all or --auto

Usage: update-alternatives [<option> ...] <command>

Commands:
  --install <link> <name> <path> <priority>
    [--slave <link> <name> <path>] ...
                           add a group of alternatives to the system.
  --remove <name> <path>   remove <path> from the <name> group alternative.
  --remove-all <name>      remove <name> group from the alternatives system.
  --auto <name>            switch the master link <name> to automatic mode.
  --display <name>         display information about the <name> group.
  --query <name>           machine parseable version of --display <name>.
  --list <name>            display all targets of the <name> group.
  --get-selections         list master alternative names and their status.
  --set-selections         read alternative status from standard input.
  --config <name>          show alternatives for the <name> group and ask the
                           user to select which one to use.
  --set <name> <path>      set <path> as alternative for <name>.
  --all                    call --config on all alternatives.

<link> is the symlink pointing to /etc/alternatives/<name>.
  (e.g. /usr/bin/pager)
<name> is the master name for this link group.
  (e.g. pager)
<path> is the location of one of the alternative target files.
  (e.g. /usr/bin/less)
<priority> is an integer; options with higher numbers have higher priority in
  automatic mode.

Options:
  --altdir <directory>     change the alternatives directory.
  --admindir <directory>   change the administrative directory.
  --log <file>             change the log file.
  --force                  allow replacing files with alternative links.
  --skip-auto              skip prompt for alternatives correctly configured
                           in automatic mode (relevant for --config only)
  --verbose                verbose operation, more output.
  --quiet                  quiet operation, minimal output.
  --help                   show this help message.
  --version                show the version.
```

あー、alternativesのバージョンが古いと`--list`オプション使えないですね。CentOS6系とAmazonLinuxは注意が必要です。  
そして`--list`オプションってDebianとRedHatのものだと全然動きが違うんですね。`name`ついてないよってプルリク送る所でした。

個人的に、ディストリビューション判定の部分が気になります。`update-alternatives`を叩いてReturn Code見てDebianかRedHatかの判定してます。
`ansible_os_family`とか呼べないんですかね？この辺各モジュールごとの独自実装になっちゃったら大変な気がするんですが。

なおせるかなと思って`ansible_os_family`呼べるモジュールなりメソッドなりをCoreの方で探してみたんですが、ちょっと見つけられませんでした。  
または、上記ディストリビューションでコマンド叩いて思ったのですが、`update-alternatives`はDebian製とRedHat製のものしか無いとか？だとしたらこれでもまあいいのかな。

あとちょっと思ったのは、モジュールの方でディストリビューション判別してくれるのは助かるんですけど、例えばansibleって`yum`と`apt`でモジュールが異なっているので、こういう場合はモジュールをディストリビューション毎に分けて、playbook書く側が分けて使うほうがansibleの設計思想にあってるんじゃないかなと思ったりしました。

まあでもこれはコマンド一緒だし、物によるか。識者からご意見いただけると幸いです。


# 何が言いたいか

こんな感じで、Extraモジュールを使う際には(当たり前ですが)注意が必要です。
筆者は知らずに使ってしまったのでちょっと嵌りました。`alternatives`モジュールに関しては、まだshellで対応する方がいい気がします。

Ansible Extraに関してはまだ日本語記事が少なかったので今回の記事を書いてみました。
逆に言えば、Contributeのチャンスがありそうということですね。


# 僕はこう思ったっス

ちゃんと読まなかった自分が悪いんですが、[このページ](http://docs.ansible.com/alternatives_module.html)は少しわかりづらいかなと思いました。
 _This is an Extras Module_ のくだりは上の方にあってもいいんじゃないっすかね。

明日は[tnayuki](https://twitter.com/tnayuki)さんです。
