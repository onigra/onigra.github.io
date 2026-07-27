---
title: "Apple Silicon搭載MacにPHPをmise(with vfox)でインストールする（2026年7月版）"
slug: "php-install-with-mise-for-apple-silicon-mac"
categories:
- php
date: "2026-07-20T00:00:00+09:00"
---

## 結論: `mise-plugins/vfox-php` を使う

- https://github.com/mise-plugins/vfox-php
- 必要なライブラリもREADMEにインストールコマンドごと書いてくれてる
    - https://github.com/mise-plugins/vfox-php#macos-homebrew

### インストール

```
# mise-plugins/asdf-php を使わないようにする
mise settings add disable_backends asdf

# mise-plugins/vfox-php を使うようになってるか確認する
mise registry php
# vfox:jdx/vfox-php が出たらOK

mise install php@8.5.8
```

もしくは

```
mise use -g vfox:mise-plugins/vfox-php@8.5.8
```

## 解説

- miseでphpをインストールしようとすると、デフォルトでは `mise-plugins/asdf-php` を使おうとする
- なんだけど、asdfのPHPのインストールは（少なくとも自分の環境下では）できないこともないが、結構厄介
- phpコンパイル時に必要なライブラリの多くは、ひたすらbrew installすればなんとかなるが、 `openssl@1.1` への依存が致命的
    - Macだとasdfは [openssl@1.1](https://github.com/asdf-community/asdf-php/blob/73345d10d2397d7b895b1c62a922dd00da251c57/bin/install#L23L31) に依存している
	      - 既に `openssl@1.1` はEOLなので、代わりに入れる `openssl@3` でビルド時に `--with-openssl=$(brew --prefix openssl@3)` を指定しなければならない
			      - なんだけど、その場合 `PHP_CONFIGURE_OPTIONS` にオプションを指定することになるのだが、 **デフォルトのビルドオプションが上書きされてしまい、大量のビルドオプションを自分で指定しなければいけない**
			      - phpのコンパイルに詳しい人はご存じだと思うが、phpのビルドオプションは非常に数が多くて難解
			      - https://github.com/asdf-community/asdf-php/blob/73345d10d2397d7b895b1c62a922dd00da251c57/bin/install#L117
- 参考
	  - https://github.com/jdx/mise/discussions/4560
	  - https://github.com/asdf-community/asdf-php/pull/200
	  - https://zenn.dev/fagai/articles/3cefcdab2bbf37
	  - https://mise.jdx.dev/dev-tools/backends/vfox.html
- なので（2027年6月時点では） `mise-plugins/vfox-php` を使った方が無難そうである

## 補足: 環境

- 機種: MacBook Air M1 2020
- macOS version: 26.5.2（25F84）

### 付録: Xcode Command Line Tools のインストールしなおし

```
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```
