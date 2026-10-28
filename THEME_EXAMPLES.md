# Theme Customization Examples

No code changes needed! Just edit `config/branding.json` and refresh the page.

## 🎨 Pre-Built Themes

Copy and paste any of these into `config/branding.json` → `branding.colors`

### Theme 1: Modern Green (Default)
```json
"colors": {
  "primary": "#1d7874",
  "secondary": "#34a853",
  "accent": "#fbbc04",
  "dark": "#202124",
  "light": "#f8f9fa",
  "text": "#202124",
  "text_light": "#5f6368"
}
```

### Theme 2: Professional Blue
```json
"colors": {
  "primary": "#1f4788",
  "secondary": "#2196F3",
  "accent": "#FFC107",
  "dark": "#212121",
  "light": "#FAFAFA",
  "text": "#212121",
  "text_light": "#757575"
}
```

### Theme 3: Corporate Purple
```json
"colors": {
  "primary": "#6A3E8F",
  "secondary": "#9C27B0",
  "accent": "#FF6F00",
  "dark": "#1A1A1A",
  "light": "#F5F5F5",
  "text": "#1A1A1A",
  "text_light": "#666666"
}
```

### Theme 4: Tech Dark
```json
"colors": {
  "primary": "#00D9FF",
  "secondary": "#00FF88",
  "accent": "#FF006E",
  "dark": "#0A0E27",
  "light": "#1E293B",
  "text": "#F8FAFC",
  "text_light": "#CBD5E1"
}
```

### Theme 5: Warm Sunset
```json
"colors": {
  "primary": "#E8621B",
  "secondary": "#F97316",
  "accent": "#FBBF24",
  "dark": "#292524",
  "light": "#FAFAF9",
  "text": "#1C1917",
  "text_light": "#78716C"
}
```

### Theme 6: Ocean Blue
```json
"colors": {
  "primary": "#0369A1",
  "secondary": "#06B6D4",
  "accent": "#10B981",
  "dark": "#0C0A09",
  "light": "#F8FAFC",
  "text": "#0F172A",
  "text_light": "#64748B"
}
```

### Theme 7: Minimalist Black & White
```json
"colors": {
  "primary": "#000000",
  "secondary": "#333333",
  "accent": "#CCCCCC",
  "dark": "#000000",
  "light": "#FFFFFF",
  "text": "#000000",
  "text_light": "#666666"
}
```

### Theme 8: Vibrant Neon
```json
"colors": {
  "primary": "#FF00FF",
  "secondary": "#00FFFF",
  "accent": "#FFFF00",
  "dark": "#0D0221",
  "light": "#2C1B47",
  "text": "#FFFFFF",
  "text_light": "#D4A5D4"
}
```

---

## 🏢 Company-Specific Examples

### Tech Startup
```json
{
  "company": {
    "name": "TechVenture",
    "tagline": "Innovating Tomorrow, Today",
    "description": "Cutting-edge technology solutions for modern businesses.",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://via.placeholder.com/200x100?text=TechVenture",
    "colors": {
      "primary": "#6366F1",
      "secondary": "#8B5CF6",
      "accent": "#EC4899",
      "dark": "#1E1B4B",
      "light": "#F5F3FF",
      "text": "#1E1B4B",
      "text_light": "#6366F1"
    }
  }
}
```

### Consulting Firm
```json
{
  "company": {
    "name": "Strategy Partners",
    "tagline": "Excellence Through Strategic Innovation",
    "description": "Your trusted partner for business transformation and strategic growth.",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://via.placeholder.com/200x100?text=Strategy",
    "colors": {
      "primary": "#164E63",
      "secondary": "#0F766E",
      "accent": "#CA8A04",
      "dark": "#0C0A09",
      "light": "#F8FAFC",
      "text": "#0C0A09",
      "text_light": "#64748B"
    }
  }
}
```

### Creative Agency
```json
{
  "company": {
    "name": "CreativeWorks",
    "tagline": "Bringing Ideas to Life",
    "description": "Design-led creative agency specializing in brand transformation.",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://via.placeholder.com/200x100?text=Creative",
    "colors": {
      "primary": "#DC2626",
      "secondary": "#F59E0B",
      "accent": "#8B5CF6",
      "dark": "#1F2937",
      "light": "#FFFBEB",
      "text": "#111827",
      "text_light": "#6B7280"
    }
  }
}
```

### SaaS Company
```json
{
  "company": {
    "name": "CloudSync",
    "tagline": "Synchronize. Succeed. Scale.",
    "description": "Enterprise-grade cloud solutions for modern teams.",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://via.placeholder.com/200x100?text=CloudSync",
    "colors": {
      "primary": "#0EA5E9",
      "secondary": "#06B6D4",
      "accent": "#10B981",
      "dark": "#0F172A",
      "light": "#F0F9FF",
      "text": "#0F172A",
      "text_light": "#475569"
    }
  }
}
```

### Fintech Startup
```json
{
  "company": {
    "name": "FinFlow",
    "tagline": "Finance Simplified",
    "description": "Next-generation financial services platform.",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://via.placeholder.com/200x100?text=FinFlow",
    "colors": {
      "primary": "#059669",
      "secondary": "#10B981",
      "accent": "#F59E0B",
      "dark": "#065F46",
      "light": "#ECFDF5",
      "text": "#065F46",
      "text_light": "#047857"
    }
  }
}
```

---

## 🎯 Color Picking Tips

### Primary Color
- **Tip**: Should be distinctive and recognizable
- **Usage**: Main buttons, headings, important elements
- Examples: #1d7874 (teal), #1f4788 (blue), #6A3E8F (purple)

### Secondary Color
- **Tip**: Should complement primary (typically adjacent or analogous)
- **Usage**: Accents, hover states, secondary buttons
- Examples: #34a853 (green), #2196F3 (light blue)

### Accent Color
- **Tip**: Should contrast with primary (opposite on color wheel)
- **Usage**: Highlights, call-to-action, special emphasis
- Examples: #fbbc04 (yellow), #FF006E (pink)

### Dark/Light/Text Colors
- **Tip**: Ensure sufficient contrast (WCAG AA compliance)
- **Tool**: Use https://webaim.org/resources/contrastchecker/

---

## 🔧 How Themes Work

All colors use **CSS variables** defined in `frontend/styles.css`:

```css
:root {
    --color-primary: #1d7874;
    --color-secondary: #34a853;
    /* ... etc ... */
}
```

When you update `config/branding.json`, the JavaScript automatically applies these:

```javascript
// In frontend/script.js
document.documentElement.style.setProperty('--color-primary', colors.primary);
document.documentElement.style.setProperty('--color-secondary', colors.secondary);
// ... etc ...
```

**This means**: No page reload needed! Just update JSON and see changes instantly (after browser refresh).

---

## 🎨 Creating Your Own Color Palette

### Option 1: Online Tools
- [Coolors.co](https://coolors.co/) - Random palette generator
- [Color Hunt](https://colorhunt.co/) - Curated palettes
- [Monochromatic](https://www.sessions.edu/color-calculator-tool/) - Harmonious colors
- [Adobe Color](https://color.adobe.com/create) - Professional tool

### Option 2: From Logo
- Extract dominant colors from your logo image
- Use browser DevTools to get hex codes
- Test contrast with foreground/background

### Option 3: Brand Guidelines
- If your company has brand guidelines, use those colors
- Ensures consistency across all platforms

---

## 📱 Dark Mode (Advanced)

The CSS already supports dark mode! Update in `frontend/styles.css`:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-dark: #f8f9fa;      /* Light text in dark mode */
        --color-light: #202124;     /* Dark background in dark mode */
        /* ... other adjustments ... */
    }
}
```

Users with dark mode preference will see inverted colors automatically.

---

## 🎓 Quick Reference

| Element | CSS Variable | Location in Config |
|---------|-------------|-------------------|
| Primary buttons, headings | `--color-primary` | `branding.colors.primary` |
| Secondary buttons, accents | `--color-secondary` | `branding.colors.secondary` |
| Highlights, emphasis | `--color-accent` | `branding.colors.accent` |
| Text color | `--color-text` | `branding.colors.text` |
| Secondary text | `--color-text-light` | `branding.colors.text_light` |
| Page background | `--color-light` | `branding.colors.light` |
| Footer background | `--color-dark` | `branding.colors.dark` |

---

**Pro Tip**: Make a copy of `config/branding.json` before experimenting with colors:
```bash
cp config/branding.json config/branding.backup.json
```

Then you can always revert if needed!
