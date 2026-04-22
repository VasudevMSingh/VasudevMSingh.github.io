# Publishing a New Article on The Merit Order

Step-by-step reference for writing, converting, and deploying a new post.

---

## 1. Use the written draft

The user will point to the written draft and the agent should use it to create the HTML file.

**Markdown conventions used in this site:**

| Markdown element | Notes |
|---|---|
| `# H1` | Article title (used in HTML `<h1>`) |
| `## H2` | Section headings |
| ` ```python ` | Code blocks (rendered as `<pre><code>`) |
| `| Col | Col |` | Tables (rendered with `.data-table` class) |
| `[CHART - description]` | Placeholder for a Chart.js chart |
| `> *quote* - Author` | Pull quote → `<blockquote>` |

---

## 2. Choose a slug and article type

**Slug** - lowercase, hyphenated, no `V<N>` prefix:
```
parquet-duckdb-energy-analytics
```
The final HTML file name is `<slug>.html`.

**Article class** - controls header accent colour and layout:

| Class | Use for |
|---|---|
| `article-analytical` | Data / energy / tech posts |
| `article-personal` | Opinion / lifestyle / books posts |

**Category tag** - controls the coloured pill in the header:

| `category-tag-*` | Label |
|---|---|
| `category-tag-energy` | Energy Markets / Energy Analytics |
| `category-tag-tech` | Tech |
| `category-tag-sports` | Sports |
| `category-tag-books` | Books |

---

## 3. Create the HTML file

Copy `_template.html` → `<slug>.html` and fill in every placeholder:

| Placeholder | Replace with |
|---|---|
| `POST_TITLE` | Full article title |
| `POST_DESCRIPTION` | 1-2 sentence SEO description |
| `POST_SLUG` | Slug (no `.html`) |
| `POST_IMAGE` | Path relative to `images/` |
| `YYYY-MM-DD` | ISO publish date |
| `MONTH DD, YYYY` | Human-readable date |
| `CATEGORY` | e.g. `energy` |
| `CATEGORY_LABEL` | e.g. `Energy Analytics` |
| `X min read` | Estimated read time |

**Scripts to include in `<head>` for syntax highlighting:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" defer></script>
```


**Converting Markdown → HTML body content:**

1. `# Title` → already in `<h1>` from template header - **remove** from body
2. `## Section` → `<h2>Section</h2>`
3. Paragraphs → `<p>…</p>`
4. `**bold**` → `<strong>…</strong>`
5. `*italic*` → `<em>…</em>`
6. `` `inline code` `` → `<code>…</code>`
7. ` ```lang ` blocks → `<pre><code class="language-lang">…</code></pre>`
8. `> quote` → `<blockquote><p>…</p></blockquote>`
9. Tables → see table pattern below
10. `[CHART - …]` → see chart pattern below

**Note on Layout:**
- **Never use `<hr>` between sections.** The design system handles spacing via headings.


**Table pattern:**
```html
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
        <tbody>
            <tr><td>…</td><td>…</td></tr>
        </tbody>
    </table>
</div>
```

**Chart pattern (Chart.js):**
```html
<figure class="chart-figure">
    <div class="chart-container" style="position: relative; height: 400px;">
        <canvas id="myChartId"></canvas>
    </div>
    <figcaption>Figure N: Description.</figcaption>
</figure>
```
Then add a `<script>` block before `</body>` that instantiates the chart.
Don't forget to include Chart.js:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**Useful inline CSS classes (from `styles.css`):**

| Class | Effect |
|---|---|
| `highlight` | Yellow/amber text highlight |
| `data-highlight` | Monospace data emphasis |
| `article-summary` | Key-takeaways aside box |
| `references` | Footnote block at bottom |

---

## 4. Update `data/posts.json`

Add a new entry at the **top** of the `"posts"` array and in the relevant section(s).

### Post object schema

```json
{
  "id": "blog<N>",
  "slug": "<slug>.html",
  "title": "Full Article Title",
  "shortTitle": "Short Title for Navigation",
  "description": "SEO description (matches meta description in HTML).",
  "excerpt": "One-sentence teaser shown in the homepage card.",
  "date": "YYYY-MM-DD",
  "dateDisplay": "Month YYYY",
  "category": "energy | tech | sports | books",
  "categoryLabel": "Energy Markets",
  "image": "images/<filename>",
  "imageAlt": "Alt text for image",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "readTime": "X min read",
  "featured": false
}
```

Set `"featured": true` only for the most recent/flagship article - this controls the homepage hero card. 

**Important:** If you set a new post to `featured: true`, you **must** find the previous featured post and set it to `featured: false`. Only one post can be featured at a time.


### Add to sections

Under `"sections"`, add the `postId` to the appropriate category key (`ENERGY`, `TECH`, `NBA`, etc.):
```json
"ENERGY": [
  { "type": "BLOG", "postId": "blog<N>" },
  ...
]
```

### Increment the id

The id convention is `blog<N>` where N is `previous_max + 1`.
Current max: **blog11** (Parquet/DuckDB article).

### Update `lastUpdated`

```json
"lastUpdated": "YYYY-MM-DD"
```

---

## 5. Update `sitemap.xml`

Add a new `<url>` block near the top (after the homepage entry), with `priority: 0.9` for new articles:

```xml
<url>
  <loc>https://themeritorder.co/<slug>.html</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

---

## 6. Final checklist before pushing

- [ ] `<title>` tag matches article title + ` - The Merit Order`
- [ ] `<meta name="description">` filled in
- [ ] `<link rel="canonical">` points to correct URL (`https://themeritorder.co/<slug>.html`)
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`) filled in
- [ ] `<meta property="article:published_time">` set to ISO datetime
- [ ] Favicons block present (copy from template - three `<link rel="icon">` tags)
- [ ] Google Analytics tag present
- [ ] Article breadcrumb shows Home / Writing
- [ ] Category tag uses correct `category-tag-*` class
- [ ] Date in `<time datetime="YYYY-MM-DD">` matches display date
- [ ] Read time is realistic (≈ 200–250 wpm)
- [ ] Article footer has tags
- [ ] `data/posts.json` updated (new post + sections + lastUpdated)
- [ ] `sitemap.xml` updated
- [ ] No broken internal links

---

## 7. Deploy

User will deploy on his own.

---

## File map

```
VasudevMSingh.github.io/
├── _template.html            ← Start here for every new article
├── <slug>.html               ← The article page
├── data/
│   └── posts.json            ← Article index - drives homepage + nav
├── sitemap.xml               ← Update after every new article
├── styles.css                ← Shared styles (do not modify casually)
├── main.js                   ← Article nav + homepage logic
├── blogCharts.js             ← Shared chart definitions
└── images/                   ← Article hero and OG images
```
