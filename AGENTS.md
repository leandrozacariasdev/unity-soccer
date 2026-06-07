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
