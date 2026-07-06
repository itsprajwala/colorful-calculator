# Colorful Calculator

This adds a lightweight, responsive calculator with colorful buttons and an animated background of mathematical symbols (implemented with an HTML5 canvas).

Files added
- index.html — calculator UI and canvas background.
- styles.css — styling for the panel and colorful buttons.
- script.js — calculator logic, keyboard support, and canvas animation.

Notes and customization
- Change the symbol set in script.js (SYMBOLS array).
- Adjust animation intensity using the selector (low / medium / high).
- Colors live in :root of styles.css and can be changed to alternate palettes.

Accessibility
- Buttons are native <button> elements and focusable via keyboard.
- The canvas is aria-hidden since it is decorative; the calculator has ARIA labels and an aria-live display.

Next steps
- If you want, I can open a Pull Request from branch `add-colorful-calculator` into your default branch and include screenshots and a brief PR description.
