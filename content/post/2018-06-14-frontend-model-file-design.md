---
title: "今やってるプロジェクトでのフロントエンドにおけるモデル層のファイル構成の指針"
slug: "frontend-model-file-design"
categories:
- JavaScript
date: "2018-06-14T23:05:41+09:00"
---

# 経緯

今やってるプロジェクトは[Nuxt](https://nuxtjs.org/)を使ってるんだけど、Nuxtのファイル構成の中でモデルにあたるファイル群をどの辺で管理するか悩んでて、そういえばフロントエンド本格的にやる前に見たこの資料改めて見てみようかな〜と思って見たら、かなりしっくりきたので参考にすることにした。

- [実況中継シリーズ - 複雑なJavaScriptアプリケーションに立ち向かうためのアーキテクチャ](http://techblog.reraku.co.jp/entry/2017/08/08/184313)
- [#builderscon 2017で「複雑なJavaScriptアプリケーションに立ち向かうためのアーキテクチャ」という発表をしてベストスピーカー賞第三位を頂いてきた](https://nekogata.hatenablog.com/entry/2017/08/07/101618)

<iframe width="560" height="315" src="https://www.youtube.com/embed/fWVE1fH0MVE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 結論

この資料を元にチームメンバーと議論し、最終的に以下のような構成になった。

```
$ tree .
.
├── application
│   └── validation
│       ├── email.js
│       └── username.js
├── domain
│   └── user.js
└── presentationHelper
    └── userHelper.js
```

# 解説

- applidation
  - Presentation（View）からの入力を受け取り、操作する層
  - 元の資料では、ここにはバリデーションを行う `command` というクラスが置かれる
  - 今のプロジェクトでは[vee-validate](https://baianat.github.io/vee-validate/)を使っているため、 `validation` というディレクトリを切って、以下に `vee-validate` にInjectionするカスタムバリデータの関数を置くことにした
    - `vee-validate` にはemailのバリデータははじめから用意されてるが、例としてわかりやすくするために `email.js` を置いた
- domain
  - APIから返ってきたプレーンなjsonをドメインモデルに変換して表現する
  - 資料と役割は変わらない
- presentationHelper
  - ドメインロジックに対して、プレゼンテーションに限ったロジックを閉じ込めるレイヤー
  - 資料に則って `presentation` という名前にしてたが、「本来、Presentation層にViewが含まれることを考えると、そこを代表するような名前（Presenter）にするのは違和感がある」という意見（具体的にはこの名前だったら `.vue` も入りそう）があり、一歩踏み込んで具体的な名前にした
  - 名前は異なるが、資料と役割は変わらない
  - 他に `decorator` `viewHelper` が候補に上がった

# 感想

- （実際無いと思うが）プレゼンテーションのフレームワーク(Vue, React)が変わってもモデルはプレーンなJSなため、疎で良い
  - validationだけ `vee-validate` のフレームワークに則った記法になってるが、実態はただの関数なので許容範囲
- 実践的で素晴らしい発表をしてくださった[@shinpei0213](https://twitter.com/shinpei0213)さんには本当に感謝 :pray:

