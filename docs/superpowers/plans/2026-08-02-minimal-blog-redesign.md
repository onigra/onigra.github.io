# ミニマル・ブログ・リデザイン 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development（推奨）または superpowers:executing-plans を使い、タスク単位で実装すること。ステップは checkbox（`- [ ]`）で追跡する。

**Goal:** `docs/superpowers/plans/new-design/` のコンセプト（Zen Old Mincho / Zen Kaku Gothic New、640px 1 カラム、ヘアライン区切り、タイトルホバーアニメーション）を、Phase B 完了済みの rakuda サイトに適用する。

**Architecture:** 既存の CSS モジュール構成（`tokens / reset / base / layout / components`）のトークン値とスタイルを新デザイン仕様に差し替える。テンプレートは記事一覧の要素順序変更・個別記事ページの Prev/Next ナビ追加が主な変更。Prev/Next は rakuda の Post ジェネレーター拡張が必要（現状未サポート）。

**Tech Stack:** rakuda（Ruby SSG）、ERB テンプレート、プレーン CSS + CSS カスタムプロパティ、Google Fonts、highlight.js、Font Awesome 4.7

**Design Source:** `docs/superpowers/plans/new-design/blog-design-prompt.md`（仕様）、`article_page_layout_mockup.html`（記事ページ参考）、`typography_options_comparison.html`（フォント案 A を採用）

## Global Constraints

- カラーパレット: 背景 `#FAF9F6`、メインテキスト `#221F1B`、本文 `#2E2C27`、サブ `#95928A`、引用 `#5C5A54`、ヘアライン `#E7E4DC`、引用ボーダー `#B8B5AB`、アクセント `#4B5A45`（リンク・タイトルホバーのみ）
- フォント: 見出し `Zen Old Mincho`（400–500）、本文 `Zen Kaku Gothic New`（300/400）
- レイアウト: 最大幅 640px、角丸なし、カード・シャドウなし、区切り 0.5px ヘアラインのみ
- サイン要素: 記事一覧タイトルホバー時のみ、左→右 0.6 秒の下線アニメーション + アクセント色
- 日付形式: `YYYY.MM.DD`（例: `2026.03.05`）
- 維持: highlight.js、Font Awesome 4.7、シェアボタン、ページネーション、RSS
- ビルド: `rkd build --source . --destination public`
- ブランチ: `modify-design`

---

## 現状と差分

| 項目 | 現状（Phase A 暫定） | 新デザイン |
|------|---------------------|-----------|
| 背景 | `#fafafa` | `#FAF9F6` |
| アクセント | 青 `#2563eb` | 緑 `#4B5A45` |
| フォント | 游ゴシック | Google Fonts 2 書体 |
| 最大幅 | 680px | 640px |
| 一覧順序 | タイトル → 日付 → 概要 | 日付 → タイトル → 抜粋 |
| Read more | あり | なし |
| 記事ページ | タイトル → 日付+著者 → 本文 | ← Archives → 日付 → タイトル → ヘアライン → 本文 → Prev/Next |
| Prev/Next 記事 | なし | あり（rakuda 拡張必要） |
| border-radius | コードブロック 6px | 角丸なし |

---

## ファイル構成（変更対象）

| ファイル | 責務 |
|---------|------|
| `rakuda` gem `lib/rakuda/generators/post.rb` | `@prev_post` / `@next_post` を single テンプレートに渡す |
| `static/css/tokens.css` | 新カラー・フォント・余白トークン |
| `static/css/base.css` | 基本タイポグラフィ、blockquote、リンク、コード（角丸除去） |
| `static/css/layout.css` | ヘッダー、メイン余白、フッター |
| `static/css/components.css` | 記事一覧、記事詳細、タイトルアニメ、Prev/Next、アーカイブ |
| `layouts/_partials/header.erb` | Google Fonts `<link>` 追加 |
| `layouts/_partials/post_excerpt.erb` | 日付→タイトル→抜粋、Read more 削除 |
| `layouts/_partials/post_nav.erb` | 新規: 記事間 Prev/Next ナビ |
| `layouts/single.erb` | 戻るリンク、ヘアライン、post_nav 組み込み |
| `layouts/list.erb` | 一覧上部余白クラス追加 |
| `layouts/section.erb` | 日付形式を `YYYY.MM.DD` に |

---

## Task 1: rakuda に Prev/Next 記事ナビを追加

**Files:**
- Modify: `rakuda` リポジトリ `lib/rakuda/generators/post.rb`

**Interfaces:**
- Produces: single テンプレートで `@prev_post` / `@next_post` が利用可能
  - 各値は `nil` または `{ title: String, url: String }`
  - `@posts` は日付降順（新しい順）。`prev_post` = 1 つ古い記事、`next_post` = 1 つ新しい記事

- [ ] **Step 1: rakuda リポジトリを clone（未 clone の場合）**

```bash
git clone https://github.com/onigra/rakuda.git ../rakuda
cd ../rakuda
```

- [ ] **Step 2: `lib/rakuda/generators/post.rb` の `generate` を以下に置換**

```ruby
def generate
  @posts.each_with_index.map do |post, index|
    content_html = @markdown.render(post.body)
    html = @renderer.render("single", {
      site: @site,
      page: post_to_page_hash(post, content_html),
      prev_post: adjacent_post(index, 1),
      next_post: adjacent_post(index, -1)
    })
    { url: post.url, content: html }
  end
end
```

- [ ] **Step 3: `post_to_page_hash` の下に `adjacent_post` プライベートメソッドを追加**

```ruby
def adjacent_post(index, offset)
  post = @posts[index + offset]
  return nil unless post

  { title: post.title, url: post.url }
end
```

- [ ] **Step 4: rakuda を commit & push**

```bash
git add lib/rakuda/generators/post.rb
git commit -m "$(cat <<'EOF'
feat: single テンプレートに prev/next 記事ナビを渡す。

日付降順ソート済み posts 配列から隣接記事を解決する。
EOF
)"
git push origin main
```

- [ ] **Step 5: ブログリポジトリで rakuda を再インストール**

```bash
cd /path/to/onigra.github.io
gem install specific_install
gem specific_install -l https://github.com/onigra/rakuda.git
```

Run: `rkd --version` または `which rkd`
Expected: `rkd` が PATH に存在

---

## Task 2: デザイントークンと Google Fonts

**Files:**
- Modify: `static/css/tokens.css`
- Modify: `layouts/_partials/header.erb`

**Interfaces:**
- Produces: CSS カスタムプロパティ一式。以降タスクは `var(--*)` で参照

- [ ] **Step 1: `static/css/tokens.css` を以下に置換**

```css
:root {
  --color-bg: #FAF9F6;
  --color-text: #221F1B;
  --color-text-body: #2E2C27;
  --color-text-muted: #95928A;
  --color-text-quote: #5C5A54;
  --color-border: #E7E4DC;
  --color-border-quote: #B8B5AB;
  --color-accent: #4B5A45;
  --color-code-bg: #F0EFEB;

  --font-heading: "Zen Old Mincho", serif;
  --font-body: "Zen Kaku Gothic New", sans-serif;
  --font-code: "Source Code Pro", "SF Mono", monospace;

  --font-size-brand: 20px;
  --font-size-nav: 13px;
  --font-size-meta-sm: 12px;
  --font-size-meta: 13px;
  --font-size-list-title: 19px;
  --font-size-list-excerpt: 14px;
  --font-size-post-title: 28px;
  --font-size-body: 15.5px;
  --font-size-h2: 18px;
  --font-size-quote: 16px;
  --font-size-nav-post-title: 14px;
  --font-size-footer: 12px;

  --line-height-body: 2.05;
  --line-height-list-excerpt: 1.9;
  --line-height-heading: 1.65;
  --line-height-h2: 1.8;

  --letter-spacing-meta: 0.08em;
  --letter-spacing-nav: 0.04em;

  --space-page-y: 56px;
  --space-page-x: 24px;
  --space-list-top: 96px;
  --space-excerpt-y: 36px;
  --space-section: 48px;
  --space-paragraph: 28px;
  --space-post-nav-top: 56px;
  --excerpt-max-width: 520px;
  --content-max-width: 640px;

  --hairline: 0.5px solid var(--color-border);
  --transition-title: 0.6s ease;
}

@media (max-width: 767px) {
  :root {
    --space-page-x: 24px;
  }
}
```

- [ ] **Step 2: `layouts/_partials/header.erb` の `<title>` 行の直後に Google Fonts を追加**

```erb
<link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Commit**

```bash
git add static/css/tokens.css layouts/_partials/header.erb
git commit -m "$(cat <<'EOF'
新デザインのトークンと Google Fonts を追加。

Zen Old Mincho / Zen Kaku Gothic New と新カラーパレットを定義する。
EOF
)"
```

---

## Task 3: base.css を新タイポグラフィに更新

**Files:**
- Modify: `static/css/base.css`

**Interfaces:**
- Consumes: Task 2 のトークン
- Produces: body / リンク / 本文 / blockquote / コードの基本スタイル

- [ ] **Step 1: `static/css/base.css` を以下に置換**

```css
html {
  background-color: var(--color-bg);
}

body {
  color: var(--color-text-body);
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
}

a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

a:hover {
  color: var(--color-accent);
}

a:focus-visible {
  outline: 1px solid var(--color-accent);
  outline-offset: 2px;
}

code, pre {
  font-family: var(--font-code);
}

.post-body code {
  background-color: var(--color-code-bg);
  padding: 2px 4px;
  font-size: 0.9em;
}

.post-body pre {
  background-color: var(--color-code-bg);
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 1.5em;
}

.post-body pre code {
  background: none;
  padding: 0;
}

.post-body p {
  margin: 0 0 var(--space-paragraph);
}

.post-body h2 {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: var(--font-size-h2);
  line-height: var(--line-height-h2);
  color: var(--color-text);
  margin: var(--space-section) 0 24px;
}

.post-body h3,
.post-body h4,
.post-body h5,
.post-body h6 {
  font-family: var(--font-heading);
  font-weight: 500;
  color: var(--color-text);
  margin: var(--space-section) 0 16px;
}

.post-body blockquote {
  margin: 36px 0;
  padding-left: 20px;
  border-left: 0.5px solid var(--color-border-quote);
  font-family: var(--font-heading);
  font-size: var(--font-size-quote);
  line-height: 1.9;
  color: var(--color-text-quote);
}

.post-body ul,
.post-body ol {
  list-style: disc;
  margin: 0 0 var(--space-paragraph) 1.5em;
}

.post-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5em;
}

.post-body th,
.post-body td {
  border: var(--hairline);
  padding: 8px 10px;
  text-align: left;
}
```

- [ ] **Step 2: Commit**

```bash
git add static/css/base.css
git commit -m "$(cat <<'EOF'
base.css を新デザインのタイポグラフィに更新。

角丸を除去し、Zen 書体と引用・見出しスタイルを適用する。
EOF
)"
```

---

## Task 4: layout.css を新レイアウトに更新

**Files:**
- Modify: `static/css/layout.css`

- [ ] **Step 1: `static/css/layout.css` を以下に置換**

```css
.content-wrap {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-page-y) var(--space-page-x);
}

.site-header {
  background-color: var(--color-bg);
}

.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: var(--space-page-y);
  padding-bottom: 0;
}

.site-header__brand {
  font-family: var(--font-heading);
  font-size: var(--font-size-brand);
  font-weight: 400;
  color: var(--color-text);
  text-decoration: none;
}

.site-header__brand:hover {
  color: var(--color-text);
}

.site-header__brand:focus-visible {
  outline: 1px solid var(--color-accent);
  outline-offset: 2px;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.site-nav__social {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-main--list {
  padding-top: var(--space-list-top);
}

.site-footer {
  margin-top: var(--space-section);
}

.site-footer__inner {
  text-align: center;
  font-size: var(--font-size-footer);
  color: var(--color-text-muted);
  padding-top: 32px;
  padding-bottom: 48px;
}

.site-footer a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 2: Commit**

```bash
git add static/css/layout.css
git commit -m "$(cat <<'EOF'
layout.css を 640px・余白多めの新レイアウトに更新。
EOF
)"
```

---

## Task 5: components.css を新コンポーネントスタイルに更新

**Files:**
- Modify: `static/css/components.css`

- [ ] **Step 1: `static/css/components.css` を以下に置換**

```css
/* ナビゲーション */
.nav-link {
  color: var(--color-text-muted);
  font-size: var(--font-size-nav);
  letter-spacing: var(--letter-spacing-nav);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.social-link {
  color: var(--color-text-muted);
  font-size: 16px;
  text-decoration: none;
}

.social-link:hover {
  color: var(--color-accent);
}

/* 記事一覧 */
.post-excerpt {
  padding: var(--space-excerpt-y) 0;
  border-top: var(--hairline);
}

.post-excerpt:last-child {
  border-bottom: var(--hairline);
}

.post-excerpt__date {
  font-size: var(--font-size-meta-sm);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-meta);
  margin-bottom: 8px;
}

.post-title {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: var(--font-size-post-title);
  line-height: var(--line-height-heading);
  color: var(--color-text);
  margin: 0 0 40px;
}

.post-title--list {
  font-size: var(--font-size-list-title);
  line-height: 1.7;
  margin: 0 0 12px;
}

.post-title--list a {
  color: var(--color-text);
  text-decoration: none;
  background-image: linear-gradient(var(--color-accent), var(--color-accent));
  background-size: 0% 0.5px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: color var(--transition-title), background-size var(--transition-title);
}

.post-title--list a:hover {
  color: var(--color-accent);
  background-size: 100% 0.5px;
}

.post-excerpt__summary {
  font-size: var(--font-size-list-excerpt);
  color: var(--color-text-muted);
  line-height: var(--line-height-list-excerpt);
  max-width: var(--excerpt-max-width);
  margin: 0;
}

/* 記事詳細 */
.post-back {
  font-size: var(--font-size-nav);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-nav);
  text-decoration: none;
}

.post-back:hover {
  color: var(--color-text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-header {
  margin-top: var(--space-list-top);
}

.post-meta {
  font-size: var(--font-size-meta);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-meta);
  margin-bottom: 8px;
}

.post-divider {
  border: none;
  border-top: var(--hairline);
  margin: 0 0 44px;
}

.post-divider--bottom {
  margin: var(--space-post-nav-top) 0 32px;
}

.post-body a {
  color: var(--color-accent);
}

/* 記事間ナビ */
.post-nav {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-nav);
  color: var(--color-text-muted);
}

.post-nav__col {
  max-width: 45%;
}

.post-nav__col--next {
  text-align: right;
}

.post-nav__label {
  margin-bottom: 6px;
}

.post-nav__title {
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-nav-post-title);
  line-height: 1.6;
  text-decoration: none;
}

.post-nav__title:hover {
  color: var(--color-accent);
}

/* ページネーション（一覧ページ） */
.pager {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--space-page-y);
}

.pager__link {
  font-size: var(--font-size-nav);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-nav);
  text-decoration: none;
}

.pager__link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* シェア */
.sharing {
  margin-top: var(--space-section);
  padding-top: var(--space-excerpt-y);
  border-top: var(--hairline);
}

.sharing__link {
  color: var(--color-text-muted);
  text-decoration: none;
}

.sharing__link:hover {
  color: var(--color-accent);
}

/* アーカイブ */
.archive__year {
  font-family: var(--font-heading);
  font-size: var(--font-size-list-title);
  font-weight: 400;
  margin-top: var(--space-section);
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
  font-family: var(--font-heading);
  text-decoration: none;
}

.archive__link:hover {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 2: Commit**

```bash
git add static/css/components.css
git commit -m "$(cat <<'EOF'
components.css を新デザインのコンポーネントスタイルに更新。

タイトルホバー下線アニメーションと Prev/Next ナビスタイルを追加する。
EOF
)"
```

---

## Task 6: 記事一覧テンプレート更新

**Files:**
- Modify: `layouts/_partials/post_excerpt.erb`
- Modify: `layouts/list.erb`

- [ ] **Step 1: `layouts/_partials/post_excerpt.erb` を以下に置換**

```erb
<article class="post-excerpt">
  <% if @entry[:date] %>
  <p class="post-excerpt__date"><%= @entry[:date].strftime("%Y.%m.%d") %></p>
  <% end %>
  <h2 class="post-title post-title--list"><a href="<%= @entry[:url] %>"><%= @entry[:title] %></a></h2>
  <p class="post-excerpt__summary"><%= @entry[:summary] %></p>
</article>
```

- [ ] **Step 2: `layouts/list.erb` の `<main>` にクラスを追加**

```erb
<%= render_partial "header" %>
<%= render_partial "nav" %>
<main class="site-main site-main--list">
  <div class="content-wrap">
    <% @pages.each do |entry| %>
      <%= render_partial("post_excerpt", entry: entry) %>
    <% end %>
  </div>
</main>
<%= render_partial "pager" %>
<%= render_partial "footer" %>
```

- [ ] **Step 3: Commit**

```bash
git add layouts/_partials/post_excerpt.erb layouts/list.erb
git commit -m "$(cat <<'EOF'
記事一覧を新デザインの要素順序（日付→タイトル→抜粋）に更新。
EOF
)"
```

---

## Task 7: 個別記事ページと Prev/Next ナビ

**Files:**
- Create: `layouts/_partials/post_nav.erb`
- Modify: `layouts/single.erb`

**Interfaces:**
- Consumes: Task 1 の `@prev_post` / `@next_post`（`{ title:, url: }` または `nil`）

- [ ] **Step 1: `layouts/_partials/post_nav.erb` を作成**

```erb
<nav class="post-nav" aria-label="Post navigation">
  <div class="post-nav__col">
    <% if @prev_post %>
    <div class="post-nav__label">&larr; &nbsp;Prev</div>
    <a class="post-nav__title" href="<%= @prev_post[:url] %>"><%= @prev_post[:title] %></a>
    <% end %>
  </div>
  <div class="post-nav__col post-nav__col--next">
    <% if @next_post %>
    <div class="post-nav__label">Next &nbsp;&rarr;</div>
    <a class="post-nav__title" href="<%= @next_post[:url] %>"><%= @next_post[:title] %></a>
    <% end %>
  </div>
</nav>
```

- [ ] **Step 2: `layouts/single.erb` を以下に置換**

```erb
<%= render_partial "header" %>
<%= render_partial "nav" %>
<main class="site-main">
  <article class="content-wrap post">
    <a class="post-back" href="/post/">&larr; &nbsp;Archives</a>
    <header class="post-header">
      <% if @page[:date] %>
      <p class="post-meta"><%= @page[:date].strftime("%Y.%m.%d") %></p>
      <% end %>
      <h1 class="post-title"><%= @page[:title] %></h1>
    </header>
    <hr class="post-divider">
    <div class="post-body">
      <%= @page[:content] %>
    </div>
    <% if @site[:params]["sharingicons"] %>
    <%= render_partial "sharing" %>
    <% end %>
    <hr class="post-divider post-divider--bottom">
    <%= render_partial "post_nav" %>
  </article>
</main>
<%= render_partial "footer" %>
```

- [ ] **Step 3: Commit**

```bash
git add layouts/_partials/post_nav.erb layouts/single.erb
git commit -m "$(cat <<'EOF'
個別記事ページに Archives 戻りリンクと Prev/Next ナビを追加。
EOF
)"
```

---

## Task 8: アーカイブページの日付形式統一

**Files:**
- Modify: `layouts/section.erb`

- [ ] **Step 1: `layouts/section.erb` の日付 strftime を変更**

`strftime("%B %-d, %Y")` を `strftime("%Y.%m.%d")` に置換:

```erb
<span class="post-meta"><%= entry[:date].strftime("%Y.%m.%d") %></span>
```

- [ ] **Step 2: Commit**

```bash
git add layouts/section.erb
git commit -m "$(cat <<'EOF'
アーカイブページの日付形式を YYYY.MM.DD に統一。
EOF
)"
```

---

## Task 9: 最終検証

**Files:** なし（検証のみ）

- [ ] **Step 1: rakuda ビルド**

```bash
rkd build --source . --destination public
```

Expected: エラーなく完了

- [ ] **Step 2: CSS サイズ確認**

```bash
wc -c static/css/*.css | tail -1
```

Expected: 8000 バイト以下（Google Fonts 外部読み込みのため CSS 本体は小さいまま）

- [ ] **Step 3: 生成 HTML の構造確認**

```bash
rg 'post-excerpt__date|post-nav|Zen Old Mincho|post-back' public/index.html public/blog/ -l | head -5
```

Expected: 該当クラス・要素が含まれる HTML が生成されている

- [ ] **Step 4: 旧デザイントークンが CSS に残っていないことを確認**

```bash
rg '#2563eb|#fafafa|680px|游ゴシック' static/css/
```

Expected: マッチなし

- [ ] **Step 5: ブラウザ確認チェックリスト**

| ページ | 確認内容 |
|--------|----------|
| `/` | 日付→タイトル→抜粋の順、タイトルホバー下線アニメ、96px 上部余白 |
| 記事詳細 | ← Archives、日付、タイトル、ヘアライン、本文、Prev/Next |
| `/post/` | アーカイブ一覧、YYYY.MM.DD 形式 |
| `/about/` | 本文タイポグラフィ、リンク色 |
| 375px 幅 | 左右 24px 余白、1 カラム維持 |
| キーボード Tab | リンクにアクセント色 1px アウトライン |
| コードブロック | highlight.js 動作、角丸なし |

---

## Spec カバレッジ（セルフレビュー）

| 新デザイン要件 | 対応タスク |
|---------------|-----------|
| カラーパレット 8 色 | Task 2 |
| Zen Old Mincho / Zen Kaku Gothic New | Task 2, 3 |
| 640px 1 カラム | Task 2, 4 |
| 角丸なし・ヘアラインのみ | Task 3, 5 |
| トップ: 日付→タイトル→抜粋 | Task 6 |
| タイトルホバー下線 0.6s | Task 5 |
| 記事: ← Archives、Prev/Next | Task 1, 7 |
| 本文 15.5px / line-height 2.05 | Task 2, 3 |
| blockquote スタイル | Task 3 |
| モバイル 24px 余白 | Task 2 |
| フォーカスアウトライン | Task 3, 4 |
| highlight.js / Font Awesome 維持 | 変更なし |
| シェアボタン維持 | Task 7（single.erb に残す） |
| Read more 削除 | Task 6 |
| 著者表示削除 | Task 7 |

**スコープ外（YAGNI）:**
- ダークモード
- ハンバーガーメニュー
- Font Awesome → SVG 置換
- highlight.js テーマ変更
- About / Archives ページ専用レイアウト（共通 CSS で十分）
