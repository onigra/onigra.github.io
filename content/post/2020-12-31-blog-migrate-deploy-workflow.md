---
title: "ブログのdeploy workflowをWerckerからGitHub Actionsに移行した"
slug: "blog-migrate-deploy-workflow"
categories:
- wercker gh-actions ci hugo
date: "2020-12-31T14:00:00+09:00"
---

## 概要

このブログのデプロイは [Hugoの公式に載ってることもあり](https://gohugo.io/hosting-and-deployment/deployment-with-wercker/) [Wercker](https://app.wercker.com/) でやってたんだけど、  
GitHub PagesだしGitHub Actionsに移行した。

## 使ったAction

- https://github.com/peaceiris/actions-gh-pages
- https://github.com/peaceiris/actions-hugo

## 余談

- [blogのソースリポジトリ](https://github.com/onigra/blog) と [Hostingするリポジトリ](https://github.com/onigra/blog) を分けてるので
  - `external_repository` オプション使った
  - `GITHUB_TOKEN` ではなくHostingするリポジトリにDeploy用の鍵を設定して `deploy_key` でデプロイした
  - なんでリポジトリ分けてるんだっけと一瞬悩んだけど理由思い出したのでメモっておく
    - 同じリポジトリにHostingすると、必要なソースとそうでないソースがゴッチャになって嫌だった
      - 余計なファイル多くなるし
      - OctopressからHugoに移行した時に、何が必要でそうでないのかわかりにくかった
      - 仮にまたブログ移行する際に、ブログ本文のソースとして何があればいいのかわかりやすいようにしたかった
- GitHub Pagesでブログをやってると、Web上でブログ書けないから不便と思ってたけど、今って普通にWebからファイル編集できるし、そのうちCodespacesもできるじゃんと気がついた
  - この記事もWebからcommitしている
