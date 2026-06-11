# Unity Soccer — Agent Rules

## Logo Positioning Rule (CRITICAL)

The `rotate.gif` (spinning ball) must always be positioned **inside the empty circle** of `logo-spin.jpeg` (the "U" logo). These proportions and offsets are final and must never be changed without explicit user approval.

### Assets
- `images/logo-spin.jpeg` — Unity Soccer "U" logo (black, with empty white circle)
- `images/rotate.gif` — Spinning soccer ball animation (59×59px fixed)

### Final Positioning Spec

```javascript
var ballSize = 59; // FIXED — never scale this image
ball.style.width = ballSize + 'px';
ball.style.height = ballSize + 'px';
ball.style.left = ((logoW - ballSize) / 2 - 5) + 'px';  // center - 5px left
ball.style.top = ((logoH * 0.30) - (ballSize / 2) + 8) + 'px';  // circle center + 8px down
```

### What this means
- The ball is **centered horizontally** in the "U" circle, then shifted **5px to the left**
- The ball is centered vertically at **30% of the logo height**, then shifted **8px down**
- The ball size is always **59px × 59px** regardless of screen size
- Position is recalculated on window resize via `positionLogoBall()`

### Never do
- Change `ballSize` to a percentage of logo width
- Remove the `-5` left offset or `+8` top offset
- Use different positioning logic without testing on both desktop and mobile

### Always do
  - Call `positionLogoBall()` on init and on window resize
  - Ensure `logo-spin.jpeg` and `rotate.gif` are both loaded before calculating position

## Responsive Design Rule (CRITICAL)

When modifying components that have different styles for mobile and desktop, **always use CSS media queries** to separate the styles. Never use inline styles or Tailwind classes that apply both to mobile and desktop simultaneously.

### Hero Background Example

The `hero-bg-mobile` and `hero-overlay-mobile` classes in `app/globals.css` demonstrate proper separation:

```css
.hero-bg-mobile {
  background-position: right -400px top -200px;
  background-size: auto 140%;
}
.hero-overlay-mobile {
  background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%);
}

@media (max-width: 767px) {
  .hero-bg-mobile {
    background-position: right -750px top -250px;
    background-size: auto 180%;
  }
  .hero-overlay-mobile {
    background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
  }
}
```

### Never do
- Use inline styles for responsive values (e.g., `style={{ backgroundPosition: '...' }}`)
- Use Tailwind classes without proper mobile/desktop prefixes (e.g., `pb-5` without `md:pb-0`)
- Modify desktop styles without verifying mobile still works, and vice versa

### Always do
- Test changes on both mobile and desktop viewports
- Use `@media (max-width: 767px)` for mobile overrides and desktop defaults
- Use CSS classes in `globals.css` for complex responsive styles that can't be done with Tailwind
- When using `<style>` tags in components, be aware of hydration mismatches — prefer CSS classes in global stylesheet
