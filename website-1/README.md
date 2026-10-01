# Breeze landing page — website-1

A standalone landing page concept for Breeze Heating & Cooling. Open `index.html` to review it locally.

## Files

- `index.html` — page content and service request form
- `style.css` — layout, colors, responsive styles, and hover behavior
- `script.js` — mobile menu, service selection, and email draft
- `assets/` — Breeze logo and optimized photos from `breeze-web`

## Button hover direction

Buttons stay completely still on hover. Their background color changes slightly, and only the arrow grows. The arrow uses `transform: scale()` so it does not change the button's size or shift the label.

## Form note

The SMS checkbox is optional and unchecked by default. Its selection is included in the prepared email draft. This concept does not send requests automatically or store SMS consent; a production form will need a backend for both.
