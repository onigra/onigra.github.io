---
title: "ブログを Hugo から自作の Static Site Generator に移行した"
slug: "original-ssg"
date: "2026-08-06T00:00:00+09:00"
---

このブログはHugoで動かして（Hugoの前はOctopress）たんだけど、あんまり頻繁に投稿するわけではないから、Hugoのバージョンが上がった時にバージョン追従するのがちょっとしんどい時があった。

なので、老後の盆栽プログラミングも兼ねて自作のStatic Site Generatorを作って移行した。
ついでにデザインも自作のものにした。

https://github.com/onigra/rakuda

cliにする時にタイプ数が短い名前にしたくて、パッと思いついたのが `raku（楽）` だったんだけど、 [Raku言語](https://raku.org/) と被っちゃうから  
怠惰の `da` を付けて `rakuda(楽惰)` とした。コマンドは `rkd` 。

Cursor（Composer2.5） + superpowers で `/brainstorming` からの理解負債を産まないように `/executing-plans` でいっこいっこやってたまに自分で手を入れながら楽しく作れました。
