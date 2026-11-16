---
title: "AIっぽいブログデザインをやめて、できるだけ無指定のブログデザインにした"
slug: "new-blog-design"
date: "2026-11-16T00:00:00+09:00"
---

[先日ブログのデザインを変えたんだけど](https://onigra.github.io/blog/2026/08/06/original-ssg/) 、なんかAIくさいなと感じて嫌になったので変えた。
ここで言う「AIくさい」とは、 [Claudeのブログっぽい淡い配色（よく見るのはベージュ系のトーン）と、整いすぎたタイポグラフィ](https://claude.com/ja/resources/articles/build-plugins-for-claude) のことを指している。

### コンセプト

- 無指定
- なるべく素のHTMLとレイアウトだけのCSS
- 参考にしたのは [BERKSHIRE HATHAWAY INC.](https://www.berkshirehathaway.com/)
- 色と装飾はブラウザとOSに任せ、幅・余白・行間だけ整える
- インラインコードのために [highlight.js](https://highlightjs.org/) は維持
- アイコンのために [Font Awesome](https://fontawesome.com/) は維持
- フォントはOSのUIフォントを使う
  - Webフォントをやめ、system-uiとOS同梱のヒラギノ・游ゴシック・メイリオを候補に並べただけにした
