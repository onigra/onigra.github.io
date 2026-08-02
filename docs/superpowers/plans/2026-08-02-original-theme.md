# オリジナルテーマ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development（推奨）または superpowers:executing-plans を使い、タスク単位で実装すること。ステップは checkbox（`- [ ]`）で追跡する。

**Goal:** Hucore/Bulma 依存を除去したオリジナル CSS 基盤（Phase B）を構築し、ミニマル/エディトリアルなビジュアル（Phase A）を適用する。

**Architecture:** CSS を `tokens / reset / base / layout / components` に分割し、ERB テンプレートのクラス名をセマンティック/BEM 形式に一括置換する。Phase B はプレースホルダートークンで最低限の見た目、Phase A でトークン値とスタイルを仕上げる。

**Tech Stack:** rakuda（Ruby SSG）、ERB テンプレート、プレーン CSS、highlight.js、Font Awesome 4.7

## Global Constraints

- CSS 方針: プレーン CSS + CSS カスタムプロパティ（フレームワーク不使用）
- Phase B 見た目: 読める・使える最低限（プレースホルダートークン可）
- Phase A 方向性: ミニマル/エディトリアル、コンテンツ幅 680px
- 維持: highlight.js、Font Awesome 4.7、シェアボタン、ページネーション、RSS
- 削除: MathJax、Bulma/Hucore CSS、"Powered by Hucore theme"
- CSS 目標サイズ: 合計約 5KB（現状 ~100KB から削減）
- ビルドコマンド: `rkd build --source . --destination public`
- ブランチ: `modify-design`

---

## ファイル構成（変更後）

| ファイル | 責務 |
|---------|------|
| `static/css/tokens.css` | 色・フォント・余白の CSS カスタムプロパティ |
| `static/css/reset.css` | 最小限のブラウザリセット |
| `static/css/base.css` | body、リンク、基本タイポグラフィ |
| `static/css/layout.css` | ヘッダー、メイン、フッター、コンテンツ幅 |
| `static/css/components.css` | 記事一覧/詳細、ページネーション、シェア、アーカイブ |
| `static/css/style.css` | 上記を `@import` で結合するエントリポイント |
| `layouts/_partials/*.erb` | セマンティック HTML + 新クラス名 |
| `site.yml` | copyright から Hucore 表記を削除 |

---

## Phase B: 技術基盤

### Task 1: CSS モジュール作成（プレースホルダートークン）

**Files:**
- Delete: `static/css/style.css`（既存 Bulma/Hucore CSS）
- Create: `static/css/tokens.css`
- Create: `static/css/reset.css`
- Create: `static/css/base.css`
- Create: `static/css/layout.css`
- Create: `static/css/components.css`
- Create: `static/css/style.css`

**Interfaces:**
- Produces: 全 CSS モジュール。以降のタスクは `/css/style.css` を参照する（変更不要）。

- [ ] **Step 1: 既存 CSS を削除**

```bash
rm static/css/style.css
```

- [ ] **Step 2: `static/css/tokens.css` を作成（Phase B プレースホルダー値）**

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-text: #111111;
  --color-text-muted: #666666;
  --color-accent: #0066cc;
  --color-accent-hover: #004499;
  --color-border: #dddddd;
  --color-code-bg: #f4f4f4;

  --font-body: "游ゴシック", YuGothic, "Hiragino Sans", sans-serif;
  --font-code: "Source Code Pro", "SF Mono", monospace;

  --font-size-body: 16px;
  --line-height-body: 1.6;
  --font-size-post-title: 24px;
  --font-size-list-title: 20px;
  --font-size-meta: 14px;

  --space-page-y: 24px;
  --space-page-x: 16px;
  --space-article: 32px;
  --content-max-width: 680px;
}
```

- [ ] **Step 3: `static/css/reset.css` を作成**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
  height: auto;
}

ul, ol {
  list-style: none;
}
```

- [ ] **Step 4: `static/css/base.css` を作成**

```css
html {
  background-color: var(--color-bg);
}

body {
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent-hover);
}

code, pre {
  font-family: var(--font-code);
}

.post-body code {
  background-color: var(--color-code-bg);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.post-body pre {
  background-color: var(--color-code-bg);
  padding: 16px;
  overflow-x: auto;
  border-radius: 4px;
  margin-bottom: 1.5em;
}

.post-body pre code {
  background: none;
  padding: 0;
}
```

- [ ] **Step 5: `static/css/layout.css` を作成**

```css
.content-wrap {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-page-y) var(--space-page-x);
}

.site-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.site-header__brand {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.site-header__brand:hover {
  color: var(--color-accent);
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.site-nav__social {
  margin-left: auto;
}

.site-main {
  min-height: 50vh;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-page-y);
}

.site-footer__inner {
  text-align: center;
  font-size: var(--font-size-meta);
  color: var(--color-text-muted);
  padding-top: 24px;
  padding-bottom: 24px;
}

.site-footer a {
  color: var(--color-text-muted);
}

.site-footer a:hover {
  color: var(--color-accent);
}
```

- [ ] **Step 6: `static/css/components.css` を作成**

```css
.nav-link {
  color: var(--color-text);
  font-size: var(--font-size-meta);
}

.nav-link:hover {
  color: var(--color-accent);
}

.social-link {
  color: var(--color-text-muted);
  font-size: 21px;
}

.social-link:hover {
  color: var(--color-accent);
}

.post-title {
  font-size: var(--font-size-post-title);
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 8px;
}

.post-title a {
  color: var(--color-text);
}

.post-title a:hover {
  color: var(--color-accent);
}

.post-title--list {
  font-size: var(--font-size-list-title);
}

.post-meta {
  font-size: var(--font-size-meta);
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.post-excerpt {
  margin-bottom: var(--space-article);
  padding-bottom: var(--space-article);
  border-bottom: 1px solid var(--color-border);
}

.post-excerpt:last-child {
  border-bottom: none;
}

.post-excerpt__summary {
  margin-bottom: 8px;
}

.read-more {
  font-size: var(--font-size-meta);
}

.post-body h1,
.post-body h2,
.post-body h3,
.post-body h4,
.post-body h5,
.post-body h6 {
  line-height: 1.25;
  margin-top: 32px;
  margin-bottom: 12px;
}

.post-body p,
.post-body ul,
.post-body ol,
.post-body blockquote {
  margin-bottom: 1em;
}

.post-body ul,
.post-body ol {
  list-style: disc;
  margin-left: 1.5em;
}

.pager {
  display: flex;
  justify-content: space-between;
  padding-top: 0;
  padding-bottom: var(--space-page-y);
}

.pager__link {
  font-size: var(--font-size-meta);
}

.sharing {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.sharing__link {
  color: var(--color-text-muted);
}

.sharing__link:hover {
  color: var(--color-accent);
}

.archive__year {
  font-size: var(--font-size-list-title);
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
}

.archive__year:first-child {
  margin-top: 0;
}

.archive__list {
  list-style: none;
  margin-left: 0;
}

.archive__item {
  margin-bottom: 12px;
}

.archive__link {
  color: var(--color-text);
}

.archive__link:hover {
  color: var(--color-accent);
}
```

- [ ] **Step 7: `static/css/style.css` を作成**

```css
@import "tokens.css";
@import "reset.css";
@import "base.css";
@import "layout.css";
@import "components.css";
```

- [ ] **Step 8: CSS ファイルサイズを確認**

Run: `wc -c static/css/*.css | tail -1`
Expected: 合計 5000 バイト以下（目標 ~5KB）

- [ ] **Step 9: Commit**

```bash
git add static/css/
git commit -m "$(cat <<'EOF'
Phase B: CSS をモジュール構成に置き換え。

Bulma/Hucore の monolithic CSS を tokens/reset/base/layout/components に分割する。
EOF
)"
```

---

### Task 2: header.erb から MathJax を削除

**Files:**
- Modify: `layouts/_partials/header.erb`

- [ ] **Step 1: MathJax 設定ブロック（13–20 行目）を削除し、ファイル全体を以下に置換**

```erb
<!DOCTYPE html>
<html<% if @site[:language] %> lang="<%= @site[:language] %>"<% end %>>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta content="<%= Array(@site[:params]["keywords"]).join(", ") %>" name="keywords">
<meta content="<%= @site[:author] %>" name="author">
<meta property="og:title" content="<%= @page[:title] %><% unless @page[:is_home] %> - <%= @site[:title] %><% end %>">
<meta property="og:url" content="<%= @site[:base_url] %><%= @page[:url] %>">
<meta property="og:description" content="<%= @site[:params]["description"] %>">
<meta property="og:type" content="website" />
<title><%= @page[:title] %><% unless @page[:is_home] %> | <%= @site[:title] %><% end %></title>
<link rel="stylesheet" href="/css/style.css">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=" crossorigin="anonymous" />
<% highlight_style = @site[:params].dig("highlight", "style") %>
<% if highlight_style %>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/<%= highlight_style %>.min.css">
<% else %>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css" integrity="sha256-Zd1icfZ72UBmsId/mUcagrmN7IN5Qkrvh75ICHIQVTk=" crossorigin="anonymous" />
<% end %>
</head>
<body>
```

- [ ] **Step 2: MathJax が残っていないことを確認**

Run: `rg -i mathjax layouts/`
Expected: マッチなし（footer.erb は Task 3 で削除）

- [ ] **Step 3: Commit**

```bash
git add layouts/_partials/header.erb
git commit -m "$(cat <<'EOF'
Phase B: header から MathJax を削除。
EOF
)"
```

---

### Task 3: footer.erb を更新

**Files:**
- Modify: `layouts/_partials/footer.erb`

- [ ] **Step 1: ファイル全体を以下に置換**

```erb
<footer class="site-footer">
  <div class="content-wrap site-footer__inner">
    <p><%= @site[:params]["copyright"] %></p>
  </div>
</footer>

<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/highlight.min.js" integrity="sha256-+bhVTaRmJ/c07eV80nU8gD2cBBF0rYkf1txqXlrbvb0=" crossorigin="anonymous"></script>
<% Array(@site[:params].dig("highlight", "languages")).each do |lang| %>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/languages/<%= lang %>.min.js"></script>
<% end %>
<script>hljs.initHighlightingOnLoad();</script>
</body>
</html>
```

- [ ] **Step 2: MathJax が残っていないことを確認**

Run: `rg -i mathjax layouts/`
Expected: マッチなし

- [ ] **Step 3: Commit**

```bash
git add layouts/_partials/footer.erb
git commit -m "$(cat <<'EOF'
Phase B: footer をセマンティック HTML に更新し MathJax を削除。
EOF
)"
```

---

### Task 4: nav.erb をセマンティック HTML に書き換え

**Files:**
- Modify: `layouts/_partials/nav.erb`

- [ ] **Step 1: ファイル全体を以下に置換**

```erb
<header class="site-header">
  <div class="content-wrap site-header__inner">
    <a class="site-header__brand" href="<%= @site[:base_url] %>/"><%= @site[:title] %></a>
    <nav class="site-nav" aria-label="Main">
      <% Array(@site[:params]["menu"]).each do |item| %>
      <a class="nav-link" href="<%= item["url"] %>"><%= item["title"] %></a>
      <% end %>
    </nav>
    <nav class="site-nav site-nav__social" aria-label="Social">
      <% Array(@site[:params]["social"]).each do |item| %>
      <a class="social-link" href="<%= item["url"] %>" target="_blank" rel="noopener noreferrer">
        <i class="fa <%= item["fa_icon"] %>" aria-hidden="true"></i>
      </a>
      <% end %>
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Bulma クラスが残っていないことを確認**

Run: `rg 'nav-item|nav-left|nav-right|level-item|is-mobile|is-4' layouts/_partials/nav.erb`
Expected: マッチなし

- [ ] **Step 3: Commit**

```bash
git add layouts/_partials/nav.erb
git commit -m "$(cat <<'EOF'
Phase B: nav をセマンティック HTML に書き換え。
EOF
)"
```

---

### Task 5: ページテンプレートを更新（single / list / section）

**Files:**
- Modify: `layouts/single.erb`
- Modify: `layouts/list.erb`
- Modify: `layouts/section.erb`

- [ ] **Step 1: `layouts/single.erb` を以下に置換**

```erb
<%= render_partial "header" %>
<%= render_partial "nav" %>
<main class="site-main">
  <article class="content-wrap post">
    <h1 class="post-title"><%= @page[:title] %></h1>
    <% if @page[:date] %>
    <p class="post-meta"><%= @page[:date].strftime("%B %-d, %Y") %> by <%= @site[:author] %></p>
    <% end %>
    <div class="post-body">
      <%= @page[:content] %>
    </div>
    <% if @site[:params]["sharingicons"] %>
    <%= render_partial "sharing" %>
    <% end %>
  </article>
</main>
<%= render_partial "footer" %>
```

- [ ] **Step 2: `layouts/list.erb` を以下に置換**

```erb
<%= render_partial "header" %>
<%= render_partial "nav" %>
<main class="site-main">
  <div class="content-wrap">
    <% @pages.each do |entry| %>
      <%= render_partial("post_excerpt", entry: entry) %>
    <% end %>
  </div>
</main>
<%= render_partial "pager" %>
<%= render_partial "footer" %>
```

- [ ] **Step 3: `layouts/section.erb` を以下に置換**

```erb
<%= render_partial "header" %>
<%= render_partial "nav" %>
<main class="site-main">
  <div class="content-wrap archive">
    <% @grouped_by_year.each do |year, entries| %>
      <h2 class="archive__year"><%= year %></h2>
      <ul class="archive__list">
        <% entries.each do |entry| %>
        <li class="archive__item">
          <a class="archive__link" href="<%= entry[:url] %>"><%= entry[:title] %></a>
          <% if entry[:date] %>
          <span class="post-meta"><%= entry[:date].strftime("%B %-d, %Y") %></span>
          <% end %>
        </li>
        <% end %>
      </ul>
    <% end %>
  </div>
</main>
<%= render_partial "footer" %>
```

- [ ] **Step 4: Commit**

```bash
git add layouts/single.erb layouts/list.erb layouts/section.erb
git commit -m "$(cat <<'EOF'
Phase B: ページテンプレートをセマンティック HTML に更新。
EOF
)"
```

---

### Task 6: partials を更新（post_excerpt / pager / sharing）

**Files:**
- Modify: `layouts/_partials/post_excerpt.erb`
- Modify: `layouts/_partials/pager.erb`
- Modify: `layouts/_partials/sharing.erb`

- [ ] **Step 1: `layouts/_partials/post_excerpt.erb` を以下に置換**

```erb
<article class="post-excerpt">
  <h2 class="post-title post-title--list"><a href="<%= @entry[:url] %>"><%= @entry[:title] %></a></h2>
  <% if @entry[:date] %>
  <p class="post-meta"><%= @entry[:date].strftime("%B %-d, %Y") %></p>
  <% end %>
  <p class="post-excerpt__summary"><%= @entry[:summary] %></p>
  <% if @entry[:has_more] %>
  <p><a href="<%= @entry[:url] %>" class="read-more">Read more</a></p>
  <% end %>
</article>
```

- [ ] **Step 2: `layouts/_partials/pager.erb` を以下に置換**

```erb
<nav class="pager content-wrap" aria-label="Pagination">
  <% if @paginator[:prev] %>
  <a class="pager__link pager__link--prev" href="<%= @paginator[:prev] %>">← Newer</a>
  <% else %>
  <span></span>
  <% end %>
  <% if @paginator[:next] %>
  <a class="pager__link pager__link--next" href="<%= @paginator[:next] %>">Older →</a>
  <% end %>
</nav>
```

- [ ] **Step 3: `layouts/_partials/sharing.erb` を以下に置換**

```erb
<div class="sharing">
  <a class="sharing__link" href="https://twitter.com/home?status=<%= ERB::Util.url_encode("#{@page[:title]} - #{@site[:base_url]}#{@page[:url]}") %>" title="Tweet this" target="_blank" rel="noopener noreferrer">
    <span class="fa fa-twitter fa-2x" aria-hidden="true"></span>
  </a>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add layouts/_partials/post_excerpt.erb layouts/_partials/pager.erb layouts/_partials/sharing.erb
git commit -m "$(cat <<'EOF'
Phase B: partials をセマンティック HTML に更新。
EOF
)"
```

---

### Task 7: site.yml の copyright を更新

**Files:**
- Modify: `site.yml`

- [ ] **Step 1: `params.copyright` を以下に置換**

```yaml
  copyright: '&copy; 2017 | <a href="https://twitter.com/onigra_" target="_blank">Onigra</a> | Powered by <a href="https://github.com/onigra/rakuda" target="_blank">rakuda</a>'
```

- [ ] **Step 2: Hucore 表記が残っていないことを確認**

Run: `rg -i hucore .`
Expected: spec/plan ファイルのみ（site.yml にはマッチなし）

- [ ] **Step 3: Commit**

```bash
git add site.yml
git commit -m "$(cat <<'EOF'
Phase B: copyright から Hucore 表記を削除。
EOF
)"
```

---

### Task 8: Phase B 検証

**Files:** なし（検証のみ）

- [ ] **Step 1: rakuda をインストール（未インストールの場合）**

```bash
gem install specific_install
gem specific_install -l https://github.com/onigra/rakuda.git
```

- [ ] **Step 2: ビルド実行**

Run: `rkd build --source . --destination public`
Expected: エラーなく完了、`public/` に HTML が生成される

- [ ] **Step 3: Bulma/Hucore クラス名が残っていないことを確認**

Run: `rg 'class="(section|container|nav-item|nav-left|nav-right|level-item|subtitle|content|title is-|button|has-text-centered)"' layouts/`
Expected: マッチなし

- [ ] **Step 4: 生成物の確認**

Run: `ls public/index.html public/post/index.html public/about/index.html public/index.xml`
Expected: 全ファイルが存在

- [ ] **Step 5: CSS が HTML にリンクされていることを確認**

Run: `rg 'css/style.css' public/index.html`
Expected: `<link rel="stylesheet" href="/css/style.css">` が含まれる

---

## Phase A: ミニマル / エディトリアル デザイン

### Task 9: tokens.css を最終値に更新

**Files:**
- Modify: `static/css/tokens.css`

- [ ] **Step 1: `static/css/tokens.css` を以下に置換**

```css
:root {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-border: #e5e7eb;
  --color-code-bg: #f3f4f6;

  --font-body: "游ゴシック", YuGothic, "Hiragino Sans", sans-serif;
  --font-code: "Source Code Pro", "SF Mono", monospace;

  --font-size-body: 17px;
  --line-height-body: 1.8;
  --font-size-post-title: 28px;
  --font-size-list-title: 22px;
  --font-size-meta: 14px;

  --space-page-y: 48px;
  --space-page-x: 24px;
  --space-article: 64px;
  --content-max-width: 680px;
}

@media (max-width: 767px) {
  :root {
    --space-page-x: 16px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add static/css/tokens.css
git commit -m "$(cat <<'EOF'
Phase A: デザイントークンをエディトリアルな最終値に更新。
EOF
)"
```

---

### Task 10: base.css / layout.css / components.css を仕上げ

**Files:**
- Modify: `static/css/base.css`
- Modify: `static/css/layout.css`
- Modify: `static/css/components.css`

- [ ] **Step 1: `static/css/base.css` に以下を追加（既存内容の末尾に追記）**

```css
.post-body h2,
.post-body h3 {
  margin-top: 48px;
  margin-bottom: 16px;
}

.post-body blockquote {
  border-left: 4px solid var(--color-border);
  padding-left: 16px;
  color: var(--color-text-muted);
}

.post-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5em;
}

.post-body th,
.post-body td {
  border: 1px solid var(--color-border);
  padding: 8px 10px;
  text-align: left;
}
```

- [ ] **Step 2: `static/css/components.css` の `.post-body pre` 相当を更新 — `base.css` の pre ルールを以下に置換**

`static/css/base.css` 内の `.post-body pre` ブロックを:

```css
.post-body pre {
  background-color: var(--color-code-bg);
  padding: 16px;
  overflow-x: auto;
  border-radius: 6px;
  margin-bottom: 1.5em;
}
```

- [ ] **Step 3: `static/css/components.css` の `.post-excerpt` を更新**

```css
.post-excerpt {
  margin-bottom: var(--space-article);
  padding-bottom: var(--space-article);
  border-bottom: 1px solid var(--color-border);
}
```

（値はトークン参照のまま。Task 9 で `--space-article: 64px` に更新済み）

- [ ] **Step 4: `static/css/layout.css` の `.site-header__inner` padding を調整**

```css
.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
}
```

- [ ] **Step 5: Commit**

```bash
git add static/css/base.css static/css/layout.css static/css/components.css
git commit -m "$(cat <<'EOF'
Phase A: タイポグラフィとコンポーネントのエディトリアルな仕上げを適用。
EOF
)"
```

---

### Task 11: Phase A 最終検証

**Files:** なし（検証のみ）

- [ ] **Step 1: ビルド実行**

Run: `rkd build --source . --destination public`
Expected: エラーなく完了

- [ ] **Step 2: CSS サイズ確認**

Run: `wc -c static/css/*.css | tail -1`
Expected: 合計 5000 バイト以下

- [ ] **Step 3: 生成 HTML の確認項目**

以下をブラウザまたは `rg` で確認:

| ページ | 確認内容 |
|--------|----------|
| `/` | 記事一覧、日付、Read more、ページネーション |
| 記事詳細 | タイトル、本文、コードブロックのハイライト |
| `/about/` | 画像、見出し、リンク |
| `/post/` | 年別アーカイブ一覧 |
| モバイル（375px） | ヘッダー折り返し、コンテンツ全幅 |
| フッター | "Powered by rakuda" のみ（Hucore なし） |
| `/index.xml` | RSS フィード生成 |

- [ ] **Step 4: 最終 grep チェック**

Run: `rg -i 'hucore|bulma|mathjax' --glob '!docs/**' .`
Expected: マッチなし

---

## Spec カバレッジ（セルフレビュー）

| Spec 要件 | 対応タスク |
|-----------|-----------|
| Bulma/Hucore CSS 削除 | Task 1 |
| CSS モジュール分割 (~5KB) | Task 1, 8, 11 |
| テンプレートクラス置換 | Task 4, 5, 6 |
| MathJax 削除 | Task 2, 3 |
| Hucore copyright 削除 | Task 7 |
| highlight.js 維持 | Task 3（変更なし） |
| Font Awesome 維持 | Task 2, 4（変更なし） |
| シェアボタン維持 | Task 6 |
| Phase A カラートークン | Task 9 |
| Phase A タイポグラフィ | Task 9, 10 |
| Phase A レイアウト 680px | Task 9（tokens） |
| レスポンシブ | Task 9（メディアクエリ） |
| ダークモード対象外 | 計画に含めず（YAGNI） |
