# ミニマル・ブログ デザイン仕様

onigra.github.io の現行デザイン仕様。2026-08-02 時点の実装（`static/css/`、`layouts/`）を反映している。

## コンセプト

ミニマル、スタイリッシュ、余白多め、色数少なめ。装飾やアニメーションは最小限に抑え、**記事一覧タイトルのホバー時下線アニメーション**のみをサイン要素として残す。

長文ブログとして読みやすさを重視し、ライトモードは落ち着いた紙のようなトーン、ダークモードは暖色系の暗色背景で目に優しい配色とする。

## 技術基盤

| 項目 | 内容 |
|------|------|
| SSG | [rakuda](https://github.com/onigra/rakuda) |
| テンプレート | ERB（`layouts/`） |
| CSS | プレーン CSS + CSS カスタムプロパティ（フレームワーク不使用） |
| 外部依存 | Google Fonts、Font Awesome 4.7、highlight.js 9.x |

### CSS 構成

```
static/css/
  tokens.css       # 色・フォント・余白トークン（ライト/ダーク）
  reset.css        # 最小限のリセット
  base.css         # body、リンク、本文タイポグラフィ
  layout.css       # ヘッダー、メイン、フッター
  components.css   # 記事一覧/詳細、ナビ、ページネーション等
  style.css        # @import で上記を結合
```

---

## カラーパレット

すべての色は CSS カスタムプロパティ（`static/css/tokens.css`）で管理する。ハードコードは避ける。

### ライトモード（`:root` / `[data-theme="light"]`）

| トークン | 値 | 用途 |
|---------|-----|------|
| `--color-bg` | `#F0EDE6` | ページ背景（温かみのあるオフホワイト） |
| `--color-text` | `#221F1B` | 見出し・タイトル |
| `--color-text-body` | `#252219` | 本文 |
| `--color-text-muted` | `#7A756C` | 日付・メタ情報・ナビ |
| `--color-text-quote` | `#5C5A54` | 引用 |
| `--color-border` | `#D9D4CA` | ヘアライン（境界線） |
| `--color-border-quote` | `#B8B5AB` | 引用の左ボーダー |
| `--color-accent` | `#4B5A45` | タイトルホバー・SNS ホバー等 |
| `--color-link` | `#3A6B52` | **本文内リンクのみ** |
| `--color-link-hover` | `#2F5544` | 本文内リンク hover |
| `--color-code-bg` | `#E6E2DA` | インラインコード・コードブロック背景 |

### ダークモード（`[data-theme="dark"]`）

| トークン | 値 | 用途 |
|---------|-----|------|
| `--color-bg` | `#1C1B18` | ページ背景（暖色系ダーク） |
| `--color-text` | `#F0EDE6` | 見出し・タイトル |
| `--color-text-body` | `#E5E1D9` | 本文 |
| `--color-text-muted` | `#9A958A` | 日付・メタ情報・ナビ |
| `--color-text-quote` | `#B8B4AA` | 引用 |
| `--color-border` | `#3A3833` | ヘアライン |
| `--color-border-quote` | `#5C5850` | 引用の左ボーダー |
| `--color-accent` | `#8BA888` | タイトルホバー・SNS ホバー等 |
| `--color-link` | `#7CB896` | 本文内リンク |
| `--color-link-hover` | `#95D4AD` | 本文内リンク hover |
| `--color-code-bg` | `#2A2824` | コード背景 |

### 色の使い分けルール

- **`--color-link`**: `.post-body a`（記事本文・About ページ本文）のみ。ナビ・フッター・タイトルには使わない。
- **`--color-accent`**: 記事一覧タイトル hover、Prev/Next タイトル hover、SNS アイコン hover、フッターリンク hover、テーマトグル hover。
- **ナビゲーション（About / Archives 等）**: 常に `--color-text-muted`。hover 時は下線のみ（色は変えない）。
- カード、シャドウ、バッジ、ボタン背景色は使用しない。

---

## タイポグラフィ

### フォント

| 用途 | フォント | weight |
|------|---------|--------|
| 見出し・タイトル | Zen Old Mincho | 400（タイトル）/ 500（h2） |
| 本文・UI | Zen Kaku Gothic New | 400（本文）/ 300・400（Google Fonts 読み込み） |
| コード | Source Code Pro, SF Mono | — |

Google Fonts 読み込み:

```html
<link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap" rel="stylesheet">
```

### サイズ・行間

| 要素 | サイズ | 行間 | 字間 | 色 |
|------|--------|------|------|-----|
| サイト名（brand） | 20px | — | — | `--color-text` |
| ナビ・戻るリンク | 13px | — | 0.04em | `--color-text-muted` |
| 一覧日付 | 12px | — | 0.08em | `--color-text-muted` |
| 一覧タイトル | 19px | 1.7 | — | `--color-text` |
| 一覧抜粋 | 14px | 1.9 | — | `--color-text-muted` |
| 記事タイトル（h1） | 28px | 1.65 | — | `--color-text` |
| 記事日付 | 13px | — | 0.08em | `--color-text-muted` |
| 本文 | 15.5px | 2.05 | — | `--color-text-body` |
| 記事内 h2 | 18px | 1.8 | — | `--color-text` |
| 引用（blockquote） | 16px | 1.9 | — | `--color-text-quote` |
| Prev/Next ラベル | 13px | — | — | `--color-text-muted` |
| Prev/Next タイトル | 14px | 1.6 | — | `--color-text` |
| フッター | 12px | — | — | `--color-text-muted` |

---

## レイアウト

### 共通

- **1 カラム、中央寄せ**
- **コンテンツ最大幅**: 960px（`--content-max-width`）
- **一覧抜粋最大幅**: 800px（`--excerpt-max-width`）
- **ページ余白**: 上下 56px、左右 24px
- **区切り**: 0.5px ヘアライン（`--hairline`）のみ
- **角丸なし**（コードブロック含む）
- **カード・ドロップシャドウなし**

### レスポンシブ

| ブレークポイント | 挙動 |
|----------------|------|
| `< 768px` | 左右 padding 24px を維持、1 カラム |
| `≥ 768px` | max-width 960px、中央寄せ |

ヘッダーは折り返し表示（ハンバーガーメニューは作らない）。

---

## ページ別仕様

### 共通ヘッダー

```
[ サイト名 ]          [ About ] [ Archives ]    [ 🌙 ] [ GitHub ] [ Twitter ] [ RSS ]
```

- 左: サイト名（`Zen Old Mincho`, 20px）
- 中央〜右: メニューリンク（13px, muted）
- 右端: テーマトグル + SNS アイコン（16px, muted → hover で accent）
- ヘッダー下にボーダーなし。背景は `--color-bg` と同一

### トップページ（記事一覧）

- ヘッダー下 **96px** の余白（`--space-list-top`）を空けて一覧開始
- 記事 1 件ごとに上下 **36px** padding、**0.5px ヘアライン**で区切る
- 要素順序:
  1. 日付（`YYYY.MM.DD` 形式）
  2. タイトル（リンク）— hover 時のみ下線が左→右 **0.6 秒**で伸び、文字色が accent に変化
  3. 抜粋
- 「Read more」リンクは表示しない
- 下部: ページネーション（← Newer / Older →）

### 個別記事ページ

1. `← Archives` リンク（13px, muted）
2. **56px** 余白
3. 日付（`YYYY.MM.DD`）
4. タイトル（h1, 28px）
5. ヘアライン
6. 本文
7. シェアボタン（`site.yml` で有効時）
8. ヘアライン
9. Prev / Next ナビ（左右配置、各 max-width 45%）
   - Prev = 1 つ古い記事、Next = 1 つ新しい記事

著者名は表示しない。

### アーカイブページ（`/post/`）

- 年別見出し（`Zen Old Mincho`, 19px）
- 記事リンク + 日付（`YYYY.MM.DD`）
- hover 時: accent 色 + 下線

### About ページ

- 個別記事と同じ `single.erb` レイアウト
- 本文内リンクは `--color-link` が適用される

### フッター

- 中央寄せ、12px、muted
- リンク hover 時: accent + 下線

---

## サイン要素（唯一のアニメーション）

記事一覧タイトル（`.post-title--list a`）の hover:

- 文字色: `--color-text` → `--color-accent`
- 下線: `background-image` linear-gradient、`background-size` 0% → 100%
- トランジション: **0.6s ease**（`--transition-title`）

その他の hover は色変化または下線のみ（アニメーションなし）。

---

## ダークモード

### 切り替え方式

- `<html data-theme="light|dark">` 属性で制御
- 初期値: `localStorage.theme` → 未設定時は `prefers-color-scheme` に追従
- 手動トグル: ヘッダーの 🌙 / ☀️ ボタン
- 設定は `localStorage` に `"theme"` キーで永続化

### 関連ファイル

| ファイル | 役割 |
|---------|------|
| `static/js/theme-init.js` | `<head>` 内で同期的実行。FOUC 防止 |
| `static/js/hljs-theme-init.js` | highlight.js テーマの初期切り替え |
| `static/js/theme.js` | トグル操作、システム設定変更の監視 |

### highlight.js テーマ

| モード | テーマ |
|--------|--------|
| ライト | `github` |
| ダーク | `atom-one-dark` |

`<link id="hljs-light">` / `<link id="hljs-dark">` の `disabled` 属性で切り替える。

---

## アクセシビリティ

- リンクに `:focus-visible` アウトライン（本文リンク: `--color-link`、その他: `--color-border-quote` または `--color-accent`）
- テーマトグル: `aria-label`、`aria-pressed` を JS で更新
- ナビゲーション: `aria-label` 付与（Main / Social / Post navigation / Pagination）
- SNS リンク: `aria-hidden="true"` のアイコン + 外部リンク属性
- `<meta name="color-scheme" content="light dark">` でブラウザ UI も連動

---

## 維持する機能（変更しない）

- highlight.js によるシンタックスハイライト
- Font Awesome 4.7 ソーシャルアイコン
- シェア partial（Twitter）
- ページネーション
- RSS フィード
- rakuda による Prev/Next 記事ナビ（`@prev_post` / `@next_post`）

---

## スコープ外

- ハンバーガーメニュー
- Font Awesome → SVG 置換
- カテゴリ / タグページの専用デザイン
- 検索機能
- ナビリンクへの `--color-link` 適用

---

## 変更対象ファイル一覧

### CSS

- `static/css/tokens.css`
- `static/css/reset.css`
- `static/css/base.css`
- `static/css/layout.css`
- `static/css/components.css`
- `static/css/style.css`

### テンプレート

- `layouts/_partials/header.erb`
- `layouts/_partials/nav.erb`
- `layouts/_partials/footer.erb`
- `layouts/_partials/post_excerpt.erb`
- `layouts/_partials/post_nav.erb`
- `layouts/_partials/pager.erb`
- `layouts/_partials/sharing.erb`
- `layouts/single.erb`
- `layouts/list.erb`
- `layouts/section.erb`

### JavaScript

- `static/js/theme-init.js`
- `static/js/hljs-theme-init.js`
- `static/js/theme.js`

---
