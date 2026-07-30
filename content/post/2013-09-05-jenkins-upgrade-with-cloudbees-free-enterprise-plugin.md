---
title: "JenkinsのアップデートしたらCloudbees Free Enterprise Plugins関連で焦った話"
slug: "jenkins-upgrade-with-cloudbees-free-enterprise-plugin"
categories:
- Jenkins
date: "2013-09-05T00:00:00Z"
---

日本語の記事がほとんど見当たらなかったので書きます。  

Jenkinsのプラグインで[CloudBees Free Enterprise Plugins](https://wiki.jenkins-ci.org/display/JENKINS/CloudBees+Free+Enterprise+Plugins)というのがあり、会社でがっつり使われてるのですが、バージョンが上がった際に[cloudbees](http://www.cloudbees.com/)のアカウント登録が必要になったようです。サインアップしてこのプラグインを使う事は無料なのですが、けっこう焦りました。

<!--more-->

1. こんな感じの画面が出ます
![サインアップしろよ！](https://wiki.jenkins-ci.org/download/attachments/60917181/Screen+shot+2012-04-16+at+22.29.44.png?version=1&modificationDate=1334611834000)

1. 既にアカウントを作成している場合は、 `I already have a CloudBees account, 〜` にチェックしてCloudbeesサービスへのログイン情報を入力します
![ログインしろよ！](https://wiki.jenkins-ci.org/download/attachments/60917181/Screen+shot+2012-04-16+at+22.30.45.png?version=1&modificationDate=1334611949000)

1. サインアップはGithubアカウントでも行えるのでサクッとできます
![サインアップ画面](/images/cloudbees_signup.jpg)

1. サインアップせずに先に進んでしまうと、bootstrapのアラートみたいなのが出て怒られます。当然、プラグインは使用できません
![サインアップしろって言ってんだろ！](/images/signup_shiro.jpg)

1. アラートに出てる `Add CloudBees credentials!` を押すと Jenkinsの管理 -> 認証情報の管理 に遷移します。すると、 「認証情報の追加」の所に `CloudBees User Account` というのが追加されているので、ここからログイン情報を入力し、改めてプラグインをインストールすると使用できるようになります
![ログイン情報入力](/images/cloudbees_account_irero.jpg)

ここでちょっとわからなかったのが、Githubアカウントのパスワードでは認証が通らなかったことです。パスワード再登録したので問題なかったのですが、謎です。  

これでCloudBees Free Enterprise Pluginsが使用できるようになります。4でサインアップせずに先に進んでしまうと、既にインストールしてたプラグインが使えなくなってるので、インストールしなおしましょう。

こんな感じで事なきを得たのですが、CloudBees Free Enterprise Pluginsなどの日本語情報がほぼなかったので焦りました。Folder Pluginsとか[Build Flow Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Build+Flow+Plugin)とか凄く便利だと思うんですけど、使ってる人見ないですね。自分はもう辞めてしまった[Jenkins大好きおじさん](https://github.com/shiraji)からこの辺のプラグインを教わりました。

しかし、Build Flow Pluginは「読めないデータ」が大量に出るのが気になります。。。普通にジョブは動いてるので問題は無さそうなんですが。。。この辺の情報ってどっかまとまってないのかな？

