# UA デフォルト寄りブログデザイン仕様

**Status:** Approved (brainstorming 2026-11-15)  
**Supersedes:** [2026-08-02-minimal-blog-design.md](./2026-08-02-minimal-blog-design.md)

## 概要

onigra.github.io のビジュアルを、AI 生成サイトに多い淡い配色・カスタムタイポから脱却し、[Berkshire Hathaway](https://www.berkshirehathaway.com/) のような「ブラウザ／OS のデフォルト見た目」に近づける。自前 CSS では色・フォントを指定せず、HTML も装飾目的の属性を最小化する。実用性のためレイアウト用 CSS（幅・余白・配置）と外部の highlight.js・Font Awesome は残す。

## スコープ

| リポジトリ | 内容 |
|-----------|------|
| `onigra/onigra.github.io` | layouts, static, docs（本 spec が正） |
| `onigra/theme` | layouts を blog と同期、`static/css/layout.css` を同梱 |
| `onigra/rakuda` | 設計ドキュメント更新、minimal fixture の簡素化とテスト追随 |

## 非目標

- BH 特有の演出（文字間スペース、1990 年代コーポレート風の極端な平坦化）
- ダークモード・テーマ切替の維持
- Google Fonts による見た目のカスタム
- トップページをリンクだけの BH 型に変更（新着抜粋リスト＋ページネーションは維持）

## スタイル方針

### 自前 CSS で禁止するプロパティ

`color`, `background`（系）, `border-color`, `outline-color`, `fill`, `stroke`, `accent-color`, `caret-color`, 色付き `box-shadow`, `font-family`, トーン変更目的の `filter` など。

リンクに `text-decoration: underline` のみ指定することは可（色は伴わない）。フォーカスリングは自前 CSS で上書きしない（UA デフォルトのまま）。

### 自前 CSS で許可するプロパティ

`max-width`, `width`, `margin`, `padding`, `display`, `flex` / `grid`（配置のみ）, `gap`, `overflow`, `list-style`（`disc` 等・色指定なし）, `img { max-width: 100%; height: auto; }`, `pre { overflow-x: auto; }` など。

### 外部依存（色は外部任せ）

| 依存 | 扱い |
|------|------|
| highlight.js 9.x | `github` テーマのみ CDN |
| Font Awesome 4.7 | CDN 維持 |
| Google Fonts | 削除 |
| ダーク hljs / theme-init / theme.js / hljs-theme-init | 削除 |

### タイポグラフィ

システム／UA デフォルトのみ。見出し・本文に `font-family` を自前で指定しない。

### HTML

- `class` / `style` はレイアウト用のみ。BEM の細分化をやめ短い名前に整理。
- `aria-*` は維持。
- 記事本文は Markdown 出力をそのまま。コード色は hljs のみ。

## CSS ファイル構成

**Before:** `tokens.css`, `reset.css`, `base.css`, `layout.css`, `components.css`, `style.css`  
**After:** `static/css/layout.css` のみ。`<head>` は `/css/layout.css` を参照。`style.css` は削除（`@import` エイリアスは作らない）。

### `layout.css` 定数（長さのみ）

```css
:root {
  --content-max: 48rem;
  --space-x: 1.5rem;
  --space-y: 1.5rem;
  --space-block: 2rem;
}
```

### セレクタ一覧

| セレクタ | 役割 |
|----------|------|
| `.content` | `max-width`, 中央寄せ, `padding` |
| `header .content` | ブランド・メニュー・SNS の flex 配置 |
| `header nav` | メニュー行の flex + `gap` |
| `main article` | 抜粋・記事ブロック間の `margin` |
| `main article + article` | 一覧の縦間隔（border なし） |
| `.pager` | Newer / Older の两端配置 |
| `article nav`（記事内） | 前後記事を 2 カラム grid |
| `main img`, `article img` | レスポンシブ画像 |
| `pre` | 横スクロール |

要素セレクタでの `:hover` 色変更、`prefers-color-scheme`、本文向け `blockquote` / `table` の装飾は行わない。

## HTML 構造

### パーシャル責務

- `header.erb`: `<!DOCTYPE>` ～ `</head>`、サイトヘッダー（旧 `nav.erb` を統合）
- `footer.erb`: フッター、hljs 読み込み、`</body></html>`（`theme.js` なし）

`nav.erb` は削除。

### `<head>` から削除

Google Fonts、`meta name="color-scheme"`、`theme-init.js`、hljs ダーク用 link、`hljs-theme-init.js`。

### サイトヘッダー

```text
<header>
  <div class="content">
    <p><a href="/">サイト名</a></p>
    <nav aria-label="Main">… site.yml menu …</nav>
    <nav aria-label="Social">… FA アイコン …</nav>
  </div>
</header>
```

テーマ切替ボタンは削除。

### `list.erb`（トップ・ページネーション付き一覧）

```text
<main>
  <div class="content">
    <article>日付 / h2+リンク / 抜粋</article> × N
  </div>
</main>
<nav class="content pager" aria-label="Pagination">← Newer / Older →</nav>
```

### `single.erb`

```text
<main>
  <article class="content">
    <% if @page[:date] %><p><a href="/post/">← Archives</a></p><% end %>
    <header>
      <% if @page[:date] %><p>日付</p><% end %>
      <h1>タイトル</h1>
    </header>
    <div>本文</div>
    sharing（有効時）
    <% if @page[:date] %>… post_nav partial …<% end %>
  </article>
</main>
```

装飾用 `<hr>` は削除。Post と Page は同一 `single.erb`。区別は **`@page[:date]` の有無**（about など固定ページは日付・Archives 戻り・前後ナビを出さない）。

### `section.erb`（/post/）

年ごとに `<h2>` + `<ul><li><a>タイトル</a> 日付</li></ul>`。親に `class="content"` のみ。

### `sharing.erb`

Twitter 共有リンク + FA アイコン。レイアウト用 CSS を当てないため **class 属性は付けない**。

### `footer.erb`

```text
<footer>
  <div class="content">
    <p>copyright（site.yml の HTML そのまま）</p>
  </div>
</footer>
```

hljs 読み込み script は現状どおり footer 末尾。

## 削除する静的ファイル

```
static/js/theme-init.js
static/js/theme.js
static/js/hljs-theme-init.js
static/css/tokens.css
static/css/reset.css
static/css/base.css
static/css/components.css
static/css/style.css
```

`public/` は次回 `rkd build` で再生成。

## theme リポジトリ

- `layouts/` を onigra.github.io と同一にする。
- `static/css/layout.css` を blog から同梱。

## 検証

1. `rkd build` 成功
2. `rg 'color:|background|font-family' static/css/layout.css` がヒットしない（コメント除く）
3. 手動確認: `/`, `/page/2/`, 記事 1 本, `/post/`, `/about/`
4. コードブロックに hljs が適用されること

## 関連

- SSG: [rakuda](https://github.com/onigra/rakuda) — 補足 spec: `rakuda/docs/superpowers/specs/2026-11-15-blog-layout-css-design.md`