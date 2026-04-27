# MMO SVG Icon Pack

## Color Variants

| File | Color | Use Case |
|------|-------|----------|
| `mmo-default.svg` | `#814AC8` (rgb 129,74,200) | Primary brand color |
| `mmo-dark.svg` | `#6D28D9` | Dark theme, subtle |
| `mmo-light.svg` | `#A78BFA` | Light/hover states |
| `mmo-muted.svg` | `#814AC8` @ 45% opacity | Watermark, disabled |
| `mmo-white.svg` | `#F0EEF5` | On dark backgrounds |
| `mmo-gradient.svg` | `#8B5CF6` → `#6D28D9` | Premium/hero sections |
| `mmo-neon.svg` | `#A855F7` + glow filter | Hacker/cyberpunk style |
| `mmo-outline.svg` | `#814AC8` stroke only | Minimal/line art |
| `mmo-currentcolor.svg` | `currentColor` | CSS-controlled (inline) |

## Size Variants

| File | Size | Use Case |
|------|------|----------|
| `mmo-16.svg` | 16×16 | Favicon, tiny icons |
| `mmo-32.svg` | 32×32 | Nav icons, badges |
| `mmo-48.svg` | 48×48 | Cards, buttons |
| `mmo-default.svg` | 93×51 | Full size |

## Usage in HTML

```html
<!-- Inline (theme-aware) -->
<img src="svg-icons/mmo-currentcolor.svg" style="color:#814AC8" />

<!-- Fixed color -->
<img src="svg-icons/mmo-default.svg" width="24" height="24" />
```
