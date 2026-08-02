# オリジナルテーマ 設計仕様

Hucore/Bulma ベースのテーマを、保守しやすいオリジナルの CSS 基盤とミニマル/エディトリアルなビジュアルデザインに置き換える。

## 目的

1. **Phase B（先行）:** Bulma/Hucore 依存を除去し、プレーン CSS + カスタムプロパティに置き換える。
2. **Phase A（後続）:** 新しい基盤の上にミニマル/エディトリアルなビジュアルデザインを適用する。

## 現状

- **SSG:** [rakuda](https://github.com/onigra/rakuda)（Hugo から移行済み）
- **テンプレート:** `layouts/` 配下の ERB 10 ファイル
- **CSS:** `static/css/style.css`（約 100KB、Bulma + Hucore）
- **外部依存:** Font Awesome 4.7、highlight.js、MathJax
- **ページ:** トップ（記事一覧 + ページネーション）、記事詳細、About、アーカイブ、RSS

## 決定事項

| 項目 | 決定内容 |
|------|----------|
| CSS 方針 | プレーン CSS + CSS カスタムプロパティ（フレームワーク不使用） |
| Phase B の見た目 | 最低限 — 読める・使える状態。仕上げは Phase A に委ねる |
| Phase A の方向性 | ミニマル / エディトリアル — タイポグラフィ重視、余白多め |
| 維持 | highlight.js、Font Awesome、シェアボタン |
| 削除 | MathJax、Bulma/Hucore CSS、フッターの "Powered by Hucore theme" |
| 移行戦略 | デザイントークン先行の一括リライト（アプローチ 1） |

## Phase B: 技術基盤の刷新

### CSS 構成

```
static/css/
  tokens.css       # CSS カスタムプロパティ（色・フォント・余白）
  reset.css        # 最小限のリセット
  base.css         # body、リンク、タイポグラフィ
  layout.css       # ヘッダー、ナビ、メイン、フッター
  components.css   # 記事一覧、ページネーション、シェア、コードブロック
  style.css        # @import で上記を結合
```

目標サイズ: 合計約 5KB（現状約 100KB から削減）。

### テンプレートのクラス置換

| 現在（Bulma/Hucore） | 新クラス（セマンティック） |
|----------------------|---------------------------|
| `.section .container` | `.site-main`, `.content-wrap` |
| `.nav .nav-left` / `.nav-right` | `.site-header`, `.site-nav`, `.site-nav__social` |
| `.title` | `.post-title` |
| `.subtitle` | `.post-meta` |
| `.content` | `.post-body` |
| `.level-item` | `.nav-link`, `.social-link` |

Phase B で `layouts/` 配下の全 ERB テンプレートを更新する。

### 削除するもの

- `layouts/_partials/header.erb` と `footer.erb` から MathJax スクリプト
- `static/css/style.css` の Bulma/Hucore CSS 全体
- フッターテキスト: "Powered by Hucore theme"（"Powered by rakuda" は残す）

### 維持する動作

- highlight.js によるシンタックスハイライト（CDN、github テーマ）
- Font Awesome 4.7 ソーシャルアイコン
- シェア partial（`layouts/_partials/sharing.erb`）
- ページネーション、RSS フィード

### Phase B 完了条件

- [ ] テンプレートに Bulma/Hucore のクラス名が残っていない
- [ ] CSS がトークンベースのモジュールに分割されている（約 5KB）
- [ ] MathJax が削除されている
- [ ] 既存の GitHub Actions ワークフローでビルド・デプロイできる
- [ ] 全ページが正しく表示される: トップ、記事詳細、About、アーカイブ
- [ ] モバイル対応レイアウトが動作する
- [ ] コードブロックのシンタックスハイライトが動作する
- [ ] 見た目は機能的だが未完成でよい（プレースホルダーのトークン値で可）

## Phase A: ミニマル / エディトリアル デザイン

### デザインコンセプト

「読むこと」に集中できるブログ。装飾よりタイポグラフィと余白で情報を整理する。2013 年からの技術記事アーカイブとして、長文でも読みやすい体裁を目指す。

### カラートークン

| トークン | 値 | 用途 |
|---------|-----|------|
| `--color-bg` | `#fafafa` | ページ背景 |
| `--color-surface` | `#ffffff` | ヘッダー / サーフェス |
| `--color-text` | `#1a1a1a` | 本文 |
| `--color-text-muted` | `#6b7280` | 日付・メタ情報 |
| `--color-accent` | `#2563eb` | リンク・アクセント |
| `--color-accent-hover` | `#1d4ed8` | リンク hover |
| `--color-border` | `#e5e7eb` | 区切り線 |
| `--color-code-bg` | `#f3f4f6` | インラインコード背景 |

配色: ほぼ白の背景、ほぼ黒のテキスト、控えめな青のアクセント 1 色のみ。

### タイポグラフィ

| 要素 | 設定 |
|------|------|
| 本文フォント | `"游ゴシック", YuGothic, "Hiragino Sans", sans-serif` |
| コードフォント | `"Source Code Pro", "SF Mono", monospace` |
| 本文サイズ | `17px`、行間 `1.8` |
| 記事タイトル | `28px`、weight `600` |
| 一覧タイトル | `22px`、weight `600` |
| メタ情報 | `14px`、`--color-text-muted` |

### レイアウト

- コンテンツ最大幅: `680px`、中央寄せ
- ページ余白: 上下 `48px`、左右 `24px`（モバイル: `16px`）
- 記事間隔: エントリ間 `64px`
- ヘッダー: 1 行、影なし、固定なし
- 記事一覧: タイトル + 日付 + 概要のみ（カード装飾なし）

```
┌─────────────────────────────────────────┐
│  onigra.github.io    About  Archives  🐙 🐦 📡 │
├─────────────────────────────────────────┤
│         ┌─────────────────┐           │
│         │   記事タイトル      │           │  max-width: 680px
│         │   日付             │           │  中央寄せ
│         │   本文テキスト...   │           │
│         └─────────────────┘           │
├─────────────────────────────────────────┤
│         © 2017 | Onigra | rakuda        │
└─────────────────────────────────────────┘
```

### コンポーネント詳細

**ヘッダー / ナビ**
- サイト名（左）+ メニューリンク + ソーシャルアイコン（右）
- 下線のみ（`--color-border`）
- モバイル: 折り返し表示（Phase A ではハンバーガーメニューは作らない）

**記事一覧（post-excerpt）**
- タイトル（リンク）→ 日付 → 概要 → "Read more"
- 区切り: `border-bottom` のみ

**記事詳細**
- タイトル → 日付/著者 → 本文 → シェアボタン
- 見出し h2/h3: 上余白 `48px`、下余白 `16px`
- コードブロック: 角丸 `6px`、padding `16px`

**ページネーション**
- 中央寄せの "← Prev / Next →" テキストリンク

**フッター**
- 中央寄せ、小さめテキスト
- "Powered by rakuda" のみ

### レスポンシブ

| ブレークポイント | 挙動 |
|----------------|------|
| `< 768px` | コンテンツ全幅、左右 padding `16px`、ヘッダー折り返し |
| `≥ 768px` | max-width `680px`、中央寄せ |

ダークモードは Phase A の対象外。将来は `--color-*` トークンの追加で対応可能。

### Phase A のスコープ外

- ダークモード
- ハンバーガーメニュー
- アニメーション / トランジション
- Font Awesome の代替（SVG アイコン化）
- highlight.js の代替
- カテゴリ / タグページのデザイン（テンプレートがなければ対象外）
- 検索機能

## Phase A 完了条件

- [ ] 色・余白・タイポグラフィのトークンがエディトリアルな値に設定されている
- [ ] レイアウトが仕様通り（680px コンテンツ、余白、ヘッダー/フッター）
- [ ] 記事一覧・記事詳細の見た目が仕上がっている
- [ ] モバイルレイアウトを確認済み
- [ ] Hucore/Bulma の視覚的な名残がない

## 変更対象ファイル

### Phase B

- `layouts/_partials/header.erb` — MathJax 削除、クラス更新
- `layouts/_partials/footer.erb` — MathJax 削除、copyright 更新、クラス更新
- `layouts/_partials/nav.erb` — セマンティックなクラス名
- `layouts/_partials/post_excerpt.erb` — セマンティックなクラス名
- `layouts/_partials/pager.erb` — セマンティックなクラス名
- `layouts/_partials/sharing.erb` — セマンティックなクラス名
- `layouts/single.erb` — セマンティックなクラス名
- `layouts/list.erb` — セマンティックなクラス名
- `layouts/section.erb` — セマンティックなクラス名
- `static/css/` — モノリシックな `style.css` をモジュール構成に置き換え
- `site.yml` — copyright 更新（Hucore 表記を削除）

### Phase A

- `static/css/tokens.css` — 最終的な色・タイポグラフィ・余白の値を設定
- `static/css/base.css`、`layout.css`、`components.css` — エディトリアルな仕上げを適用

## テスト

1. ローカルで `rkd build --source . --destination public` を実行
2. 各ページを確認: `/`、`/post/`、`/about/`、サンプル記事 URL
3. モバイル viewport（`< 768px`）を確認
4. コードブロックのハイライトが動作することを確認
5. ソーシャルアイコンとシェアボタンが表示されることを確認
6. RSS フィードが生成されることを確認
