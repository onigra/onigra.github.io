# Original Theme Design Spec

Replace the Hucore/Bulma-based theme with an original, maintainable CSS foundation and a minimal/editorial visual design.

## Goals

1. **Phase B (first):** Remove Bulma/Hucore dependency; replace with plain CSS and custom properties.
2. **Phase A (second):** Apply a minimal/editorial visual design on top of the new foundation.

## Current State

- **SSG:** [rakuda](https://github.com/onigra/rakuda) (migrated from Hugo)
- **Templates:** 10 ERB files under `layouts/`
- **CSS:** `static/css/style.css` (~100KB, Bulma + Hucore)
- **External deps:** Font Awesome 4.7, highlight.js, MathJax
- **Pages:** home (post list + pagination), single post, about, archives, RSS

## Decisions

| Topic | Decision |
|-------|----------|
| CSS approach | Plain CSS + CSS custom properties (no framework) |
| Phase B appearance | Minimum viable — readable and functional; polish deferred to Phase A |
| Phase A aesthetic | Minimal / editorial — typography-first, generous whitespace |
| Keep | highlight.js, Font Awesome, sharing buttons |
| Remove | MathJax, Bulma/Hucore CSS, "Powered by Hucore theme" footer text |
| Migration strategy | Big-bang rewrite with design tokens defined upfront (Approach 1) |

## Phase B: Technical Foundation

### CSS Architecture

```
static/css/
  tokens.css       # CSS custom properties (colors, fonts, spacing)
  reset.css        # Minimal reset
  base.css         # body, links, typography
  layout.css       # header, nav, main, footer
  components.css   # post-excerpt, pager, sharing, code blocks
  style.css        # @import aggregator
```

Target size: ~5KB total (down from ~100KB).

### Template Class Migration

| Current (Bulma/Hucore) | New (semantic) |
|------------------------|----------------|
| `.section .container` | `.site-main`, `.content-wrap` |
| `.nav .nav-left` / `.nav-right` | `.site-header`, `.site-nav`, `.site-nav__social` |
| `.title` | `.post-title` |
| `.subtitle` | `.post-meta` |
| `.content` | `.post-body` |
| `.level-item` | `.nav-link`, `.social-link` |

All ERB templates under `layouts/` will be updated in Phase B.

### Removals

- MathJax scripts from `layouts/_partials/header.erb` and `footer.erb`
- Entire Bulma/Hucore CSS in `static/css/style.css`
- Footer text: "Powered by Hucore theme" (keep "Powered by rakuda")

### Preserved Behavior

- highlight.js syntax highlighting (CDN, github theme)
- Font Awesome 4.7 social icons
- Sharing partial (`layouts/_partials/sharing.erb`)
- Pagination, RSS feed

### Phase B Completion Criteria

- [ ] No Bulma/Hucore class names remain in templates
- [ ] CSS is split into token-based modules (~5KB)
- [ ] MathJax removed
- [ ] Site builds and deploys via existing GitHub Actions workflow
- [ ] All pages render correctly: home, single post, about, archives
- [ ] Mobile-responsive layout works
- [ ] Syntax highlighting works on code blocks
- [ ] Visual appearance is functional but unpolished (placeholder token values acceptable)

## Phase A: Minimal / Editorial Design

### Design Concept

A reading-focused blog. Typography and whitespace carry the design; decoration is minimal. Optimized for long-form technical articles spanning 2013–present.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#fafafa` | Page background |
| `--color-surface` | `#ffffff` | Header / surface areas |
| `--color-text` | `#1a1a1a` | Body text |
| `--color-text-muted` | `#6b7280` | Dates, meta info |
| `--color-accent` | `#2563eb` | Links, accents |
| `--color-accent-hover` | `#1d4ed8` | Link hover |
| `--color-border` | `#e5e7eb` | Dividers |
| `--color-code-bg` | `#f3f4f6` | Inline code background |

Palette: near-white background, near-black text, single restrained blue accent.

### Typography

| Element | Setting |
|---------|---------|
| Body font | `"游ゴシック", YuGothic, "Hiragino Sans", sans-serif` |
| Code font | `"Source Code Pro", "SF Mono", monospace` |
| Body size | `17px`, line-height `1.8` |
| Article title | `28px`, weight `600` |
| List title | `22px`, weight `600` |
| Meta info | `14px`, `--color-text-muted` |

### Layout

- Content max-width: `680px`, centered
- Page padding: `48px` vertical, `24px` horizontal (mobile: `16px`)
- Article spacing: `64px` between entries
- Header: single row, no shadow, not sticky
- Post list: title + date + summary only — no card decoration

```
┌─────────────────────────────────────────┐
│  onigra.github.io    About  Archives  🐙 🐦 📡 │
├─────────────────────────────────────────┤
│         ┌─────────────────┐           │
│         │   Post title       │           │  max-width: 680px
│         │   Date             │           │  centered
│         │   Body text...     │           │
│         └─────────────────┘           │
├─────────────────────────────────────────┤
│         © 2017 | Onigra | rakuda        │
└─────────────────────────────────────────┘
```

### Component Details

**Header / Nav**
- Site name (left) + menu links + social icons (right)
- Bottom border only (`--color-border`)
- Mobile: wrap layout (no hamburger menu in Phase A)

**Post list (post-excerpt)**
- Title (link) → date → summary → "Read more"
- Separator: `border-bottom` only

**Single post**
- Title → date/author → body → share buttons
- Headings h2/h3: top margin `48px`, bottom margin `16px`
- Code blocks: border-radius `6px`, padding `16px`

**Pagination**
- Centered "← Prev / Next →" text links

**Footer**
- Centered, small text
- "Powered by rakuda" only

### Responsive

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Full-width content, `16px` horizontal padding, header wraps |
| `≥ 768px` | `680px` max-width, centered |

Dark mode is out of scope for Phase A. Future support possible by adding alternate `--color-*` token sets.

### Out of Scope (Phase A)

- Dark mode
- Hamburger menu
- Animations / transitions
- Font Awesome replacement (SVG icons)
- highlight.js replacement
- Category / tag page design (if no template exists)
- Search functionality

## Phase A Completion Criteria

- [ ] All color/spacing/typography tokens set to editorial values
- [ ] Layout matches spec (680px content, spacing, header/footer)
- [ ] Post list and single post visually polished
- [ ] Mobile layout verified
- [ ] No visual remnants of Hucore/Bulma

## Files to Change

### Phase B

- `layouts/_partials/header.erb` — remove MathJax, update classes
- `layouts/_partials/footer.erb` — remove MathJax, update copyright, update classes
- `layouts/_partials/nav.erb` — semantic class names
- `layouts/_partials/post_excerpt.erb` — semantic class names
- `layouts/_partials/pager.erb` — semantic class names
- `layouts/_partials/sharing.erb` — semantic class names
- `layouts/single.erb` — semantic class names
- `layouts/list.erb` — semantic class names
- `layouts/section.erb` — semantic class names
- `static/css/` — replace monolithic `style.css` with modular files
- `site.yml` — update copyright (remove Hucore reference)

### Phase A

- `static/css/tokens.css` — set final color/typography/spacing values
- `static/css/base.css`, `layout.css`, `components.css` — apply editorial polish

## Testing

1. Run `rkd build --source . --destination public` locally
2. Verify pages: `/`, `/post/`, `/about/`, a sample post URL
3. Check mobile viewport (`< 768px`)
4. Confirm code blocks highlight correctly
5. Confirm social icons and share buttons render
6. Confirm RSS feed still generates
