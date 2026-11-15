# UA デフォルト寄りブログデザイン Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** onigra.github.io の見た目を自前 CSS 無着色・UA デフォルト寄りに置き換え、theme/ と rakuda fixture を spec に追随させる。

**Architecture:** `static/css/layout.css` 単体で幅・余白・flex/grid のみ指定。ERB を簡素化し `nav.erb` を `header.erb` に統合。色・フォントは hljs/FA の CDN のみ。ビルドは既存の rakuda `rkd build`。

**Tech Stack:** rakuda (ERB), plain CSS, highlight.js 9.x CDN, Font Awesome 4.7 CDN

**Spec:** [2026-11-15-ua-default-blog-design.md](../specs/2026-11-15-ua-default-blog-design.md)

## Global Constraints

- 自前 CSS に `color`, `background`, `font-family`, `border-color`, `:hover` 色変更を書かない
- `<head>` は `/css/layout.css` のみ（`style.css` 削除、エイリアスなし）
- Google Fonts / `color-scheme` / theme-init / theme.js / hljs-dark / hljs-theme-init 削除
- hljs は `github.min.css` のみ。FA 4.7 CDN 維持
- Post と Page の区別は `single.erb` で `@page[:date]` の有無
- トップは抜粋リスト + ページネーション維持

---

## File Map

| Repo | Create | Modify | Delete |
|------|--------|--------|--------|
| onigra.github.io | `static/css/layout.css` | `layouts/**` | `layouts/_partials/nav.erb`, `static/css/{tokens,reset,base,components,style}.css`, `static/js/{theme-init,theme,hljs-theme-init}.js` |
| theme | `static/css/layout.css` | `layouts/**`（blog と同一） | — |
| rakuda | — | `test/fixtures/minimal/layouts/post_excerpt.erb`（class 整理） | —（spec/docs は済） |

---

### Task 1: `layout.css` を追加し旧 CSS を削除（onigra.github.io）

**Files:**
- Create: `onigra.github.io/static/css/layout.css`
- Delete: `onigra.github.io/static/css/tokens.css`, `reset.css`, `base.css`, `components.css`, `style.css`
- Test: 手動 `rg`（後述）

**Interfaces:**
- Produces: 全 HTML が参照する唯一のスタイルシート

- [ ] **Step 1: `layout.css` を作成**

```css
:root {
  --content-max: 48rem;
  --space-x: 1.5rem;
  --space-y: 1.5rem;
  --space-block: 2rem;
}

.content {
  max-width: var(--content-max);
  margin-inline: auto;
  padding: var(--space-y) var(--space-x);
}

header .content {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 1rem;
}

header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

main article + article {
  margin-block-start: var(--space-block);
}

.pager {
  display: flex;
  justify-content: space-between;
  margin-block: var(--space-block);
}

article nav[aria-label="Post navigation"] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-x);
  margin-block-start: var(--space-block);
}

main img,
article img {
  max-width: 100%;
  height: auto;
}

pre {
  overflow-x: auto;
}

footer {
  margin-block-start: var(--space-block);
}
```

- [ ] **Step 2: 旧 CSS 5 ファイルを削除**

```bash
cd /Users/onigra/src/github.com/onigra/onigra.github.io
rm static/css/tokens.css static/css/reset.css static/css/base.css \
   static/css/components.css static/css/style.css
```

- [ ] **Step 3: 禁止プロパティが無いことを確認**

```bash
rg -n 'color\s*:|background|font-family' static/css/layout.css
```

Expected: 出力なし（exit 1）

- [ ] **Step 4: Commit（任意）**

```bash
git add static/css/
git commit -m "style: replace tokenized CSS with layout-only layout.css"
```

---

### Task 2: `header.erb` にナビ統合、`footer.erb` 整理

**Files:**
- Modify: `onigra.github.io/layouts/_partials/header.erb`, `footer.erb`
- Delete: `onigra.github.io/layouts/_partials/nav.erb`

**Interfaces:**
- Consumes: `layout.css`（Task 1）
- Produces: 全ページの `<head>` とサイトヘッダー。`footer` が `</body></html>` を閉じる

- [ ] **Step 1: `header.erb` を全文差し替え**

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
<link rel="stylesheet" href="/css/layout.css">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=" crossorigin="anonymous" />
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/github.min.css">
</head>
<body>
<header>
  <div class="content">
    <p><a href="<%= @site[:base_url] %>/"><%= @site[:title] %></a></p>
    <nav aria-label="Main">
      <% Array(@site[:params]["menu"]).each do |item| %>
      <a href="<%= item["url"] %>"><%= item["title"] %></a>
      <% end %>
    </nav>
    <nav aria-label="Social">
      <% Array(@site[:params]["social"]).each do |item| %>
      <a href="<%= item["url"] %>" target="_blank" rel="noopener noreferrer">
        <i class="fa <%= item["fa_icon"] %>" aria-hidden="true"></i>
      </a>
      <% end %>
    </nav>
  </div>
</header>
```

- [ ] **Step 2: `footer.erb` を全文差し替え（`theme.js` 削除）**

```erb
<footer>
  <div class="content">
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

- [ ] **Step 3: `nav.erb` を削除**

```bash
rm layouts/_partials/nav.erb
```

- [ ] **Step 4: Commit（任意）**

---

### Task 3: レイアウトテンプレートと partials を更新

**Files:**
- Modify: `layouts/list.erb`, `section.erb`, `single.erb`, `_partials/{post_excerpt,pager,post_nav,sharing}.erb`

**Interfaces:**
- Consumes: Task 2 の header/footer（`render_partial "nav"` を呼ばない）

- [ ] **Step 1: `list.erb`**

```erb
<%= render_partial "header" %>
<main>
  <div class="content">
    <% @pages.each do |entry| %>
      <%= render_partial("post_excerpt", entry: entry) %>
    <% end %>
  </div>
</main>
<%= render_partial "pager" %>
<%= render_partial "footer" %>
```

- [ ] **Step 2: `post_excerpt.erb`**

```erb
<article>
  <% if @entry[:date] %>
  <p><%= @entry[:date].strftime("%Y.%m.%d") %></p>
  <% end %>
  <h2><a href="<%= @entry[:url] %>"><%= @entry[:title] %></a></h2>
  <p><%= @entry[:summary] %></p>
</article>
```

- [ ] **Step 3: `pager.erb`**

```erb
<nav class="content pager" aria-label="Pagination">
  <% if @paginator[:prev] %>
  <a href="<%= @paginator[:prev] %>">← Newer</a>
  <% else %>
  <span></span>
  <% end %>
  <% if @paginator[:next] %>
  <a href="<%= @paginator[:next] %>">Older →</a>
  <% end %>
</nav>
```

- [ ] **Step 4: `single.erb`**

```erb
<%= render_partial "header" %>
<main>
  <article class="content">
    <% if @page[:date] %>
    <p><a href="/post/">&larr; Archives</a></p>
    <% end %>
    <header>
      <% if @page[:date] %>
      <p><%= @page[:date].strftime("%Y.%m.%d") %></p>
      <% end %>
      <h1><%= @page[:title] %></h1>
    </header>
    <div>
      <%= @page[:content] %>
    </div>
    <% if @site[:params]["sharingicons"] %>
    <%= render_partial "sharing" %>
    <% end %>
    <% if @page[:date] %>
    <%= render_partial "post_nav" %>
    <% end %>
  </article>
</main>
<%= render_partial "footer" %>
```

- [ ] **Step 5: `post_nav.erb`**

```erb
<nav aria-label="Post navigation">
  <div>
    <% if @prev_post %>
    <p>&larr; Prev</p>
    <p><a href="<%= @prev_post[:url] %>"><%= @prev_post[:title] %></a></p>
    <% end %>
  </div>
  <div>
    <% if @next_post %>
    <p>Next &rarr;</p>
    <p><a href="<%= @next_post[:url] %>"><%= @next_post[:title] %></a></p>
    <% end %>
  </div>
</nav>
```

- [ ] **Step 6: `section.erb`**

```erb
<%= render_partial "header" %>
<main>
  <div class="content">
    <% @grouped_by_year.each do |year, entries| %>
      <h2><%= year %></h2>
      <ul>
        <% entries.each do |entry| %>
        <li>
          <a href="<%= entry[:url] %>"><%= entry[:title] %></a>
          <% if entry[:date] %>
          <%= entry[:date].strftime("%Y.%m.%d") %>
          <% end %>
        </li>
        <% end %>
      </ul>
    <% end %>
  </div>
</main>
<%= render_partial "footer" %>
```

- [ ] **Step 7: `sharing.erb`（class 削除）**

```erb
<p>
  <a href="https://twitter.com/home?status=<%= ERB::Util.url_encode("#{@page[:title]} - #{@site[:base_url]}#{@page[:url]}") %>" target="_blank" rel="noopener noreferrer">
    <span class="fa fa-twitter fa-2x" aria-hidden="true"></span>
  </a>
</p>
```

- [ ] **Step 8: `nav` partial 参照が残っていないか確認**

```bash
rg 'render_partial "nav"' layouts/
```

Expected: 出力なし

- [ ] **Step 9: Commit（任意）**

---

### Task 4: テーマ用 JS 削除とビルド検証（onigra.github.io）

**Files:**
- Delete: `static/js/theme-init.js`, `theme.js`, `hljs-theme-init.js`

- [ ] **Step 1: JS 削除**

```bash
rm -f static/js/theme-init.js static/js/theme.js static/js/hljs-theme-init.js
```

- [ ] **Step 2: ビルド**

```bash
cd /Users/onigra/src/github.com/onigra/onigra.github.io
bundle exec rkd build
```

Expected: エラーなし

- [ ] **Step 3: 生成 HTML の head を確認**

```bash
rg 'style\.css|theme-init|googleapis|color-scheme' public/index.html
```

Expected: 出力なし

```bash
rg 'layout\.css' public/index.html
```

Expected: 1 行ヒット

- [ ] **Step 4: 固定ページ about に Archives リンクが無いこと**

```bash
rg 'Archives' public/about/index.html
```

Expected: 出力なし

- [ ] **Step 5: Commit（任意）**

---

### Task 5: `theme` リポジトリ同期

**Files:**
- Create: `theme/static/css/layout.css`（blog と同一）
- Modify: `theme/layouts/**`（blog の `layouts/` と一致）

**Interfaces:**
- Consumes: Task 1–3 の blog 成果物

- [ ] **Step 1: CSS コピー**

```bash
mkdir -p /Users/onigra/src/github.com/onigra/theme/static/css
cp /Users/onigra/src/github.com/onigra/onigra.github.io/static/css/layout.css \
   /Users/onigra/src/github.com/onigra/theme/static/css/layout.css
```

- [ ] **Step 2: layouts を rsync（blog 正）**

```bash
rsync -a --delete \
  /Users/onigra/src/github.com/onigra/onigra.github.io/layouts/ \
  /Users/onigra/src/github.com/onigra/theme/layouts/
```

- [ ] **Step 3: theme に `nav.erb` が無いことを確認**

```bash
test ! -f /Users/onigra/src/github.com/onigra/theme/layouts/_partials/nav.erb && echo OK
```

- [ ] **Step 4: Commit（任意）**

---

### Task 6: rakuda minimal fixture の軽微整理

**Files:**
- Modify: `rakuda/test/fixtures/minimal/layouts/_partials/post_excerpt.erb`（装飾 class のみ削除、`summary` / `read-more` class はテスト用に維持）

**Interfaces:**
- Produces: `test/generators/home_test.rb` の assert を満たす HTML

- [ ] **Step 1: `post_excerpt.erb` を確認し、必要なら class 名だけ残してマークアップ簡素化**

現状:

```erb
<article class="post-excerpt">
  ...
  <p class="summary">...</p>
  <p><a ... class="read-more">Read more</a></p>
</article>
```

`post-excerpt` class のみ削除してよい（テストは `summary` / `read-more` を assert）:

```erb
<article>
  <h2><a href="<%= @entry[:url] %>"><%= @entry[:title] %></a></h2>
  <p class="summary"><%= @entry[:summary] %></p>
  <% if @entry[:has_more] %>
    <p><a href="<%= @entry[:url] %>" class="read-more">Read more</a></p>
  <% end %>
</article>
```

（`has_more` 行が無い場合は fixture 原文を読んで `read-more` 条件を合わせる）

- [ ] **Step 2: テスト実行**

```bash
cd /Users/onigra/src/github.com/onigra/rakuda
bundle exec rake test
```

Expected: 0 failures

- [ ] **Step 3: Commit（任意）**

---

## Plan Self-Review

| Spec 要件 | Task |
|-----------|------|
| layout.css のみ | Task 1 |
| head 整理・nav 統合 | Task 2 |
| list/single/section/partials | Task 3 |
| JS/CSS 削除・build 検証 | Task 4 |
| theme 同期 | Task 5 |
| rakuda fixture | Task 6 |
| `@page[:date]` 分岐 | Task 3 Step 4 |
| sharing class なし | Task 3 Step 7 |

Placeholder: なし

## Execution Handoff

Plan complete and saved to `onigra.github.io/docs/superpowers/plans/2026-11-15-ua-default-blog-design.md`.

**1. Subagent-Driven（推奨）** — タスクごとにサブエージェント、間にレビュー

**2. Inline Execution** — このセッションで `executing-plans` に沿って一気に実装

どちらで進めますか？