---
title: "JenkinsのPublish Over SSH Plugin関連でバージョン下げた話"
slug: "jenkins-downgrade-with-publish-over-ssh-plugin"
categories:
- Jenkins
date: "2013-09-09T00:00:00Z"
---

前回Jenkinsのバージョン上げたんですが、ジョブの設定見たら「ロード中…」が消えず、ジョブのメンテができなくなってしまいました…

![ロード中](/images/jenkins_loading.jpg)

調べてみると、[Publish Over SSH Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over+SSH+Plugin)でエラーが発生しているっぽいです。  
（正確には、プラグインの中で使ってる[publish-over-plugin](https://github.com/jenkinsci/publish-over-plugin)の問題？）  

<!--more-->

[https://issues.jenkins-ci.org/browse/JENKINS-19279](https://issues.jenkins-ci.org/browse/JENKINS-19279)

消せって言われてる…  
[https://issues.jenkins-ci.org/browse/JENKINS-19389](https://issues.jenkins-ci.org/browse/JENKINS-19389)

パッチ当てても別のエラーが出るって言われてる？  
[https://github.com/jenkinsci/publish-over-plugin/pull/3](https://github.com/jenkinsci/publish-over-plugin/pull/3)

ver1.527以下ならエラーは発生しなかったので、今回はバージョンを下げることにしました。  
基本的には、 `jenkins.war` を古い物に変えればいいっぽいです。  

* Homebrewの場合

```
$ brew versions jenkins

1.529    git checkout f3bbec8 /usr/local/Library/Formula/jenkins.rb
1.528    git checkout c8a4d5c /usr/local/Library/Formula/jenkins.rb
1.527    git checkout e35547d /usr/local/Library/Formula/jenkins.rb
1.526    git checkout 72cdbc6 /usr/local/Library/Formula/jenkins.rb

…

$ cd /usr/local/Library/Formula
$ git checkout e35547d /usr/local/Library/Formula/jenkins.rb
$ brew info jenkins

jenkins: stable 1.527, HEAD
http://jenkins-ci.org
/usr/local/Cellar/jenkins/1.527 (3 files, 59M) *
  Built from source
  From: https://github.com/mxcl/homebrew/commits/master/Library/Formula/jenkins.rb

$ brew install jenkins
```

* 会社のがyumで入れてたのでついでにyumの場合

```
$ yum list installed | grep jenkins

jenkins.noarch       1.529-1.1          @jenkins

$ yum downgrade jenkins-1.527

…

$ yum list installed | grep jenkins

jenkins.noarch       1.527-1.1          @jenkins
```

