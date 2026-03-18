# site-palace

Static photography portfolio site — "The Palace is not Safe." A gallery of fire extinguisher photos from museums worldwide. Pure HTML/CSS/JS, zero dependencies, hosted on GitHub Pages.

## Dev Server

```bash
python3 -m http.server 8080
```

Or use the Claude Code launch config: `preview_start dev` (port 8080).

## Project Structure

```
index.html          Main gallery page (two-panel layout with state toggle)
info.html           About/information page
css/style.css       All styling (~260 lines, no preprocessor)
js/main.js          All JS logic (~150 lines, IIFE pattern)
data/images.json    Image metadata array (venue, exhibition, date)
images/             WebP gallery photos (001.webp, 002.webp, ...)
fonts/              Ranua Heavy (WOFF2 + TTF fallback)
```

## Conventions

- **JavaScript**: ES5, `'use strict'`, IIFE wrapping, `var` declarations, no arrow functions
- **CSS**: Single file, no framework. Layout uses two state classes on `<body>`: `.state-a` and `.state-b` to toggle which panel shows text vs photo
- **Images**: WebP only. Protected against right-click/drag via CSS + JS
- **Typography**: Ranua Heavy for all display text; monospace (`Courier New`) on info page. Title font size is dynamically fitted via binary search in `fitText()`
- **No external requests**: All assets self-hosted (fonts, images). GDPR compliant by design

## Adding Images

Use the `/add-image` skill: `/add-image path/to/photo.jpg`

It handles everything automatically — converts to WebP, resizes, auto-numbers, and prompts for venue/exhibition/date metadata. Dates are normalized to `"Month Day, Year"` format. Requires Python/Pillow.

## Deployment

GitHub Pages — no build step. Push to `main` and it deploys. The `.nojekyll` file disables Jekyll processing.
