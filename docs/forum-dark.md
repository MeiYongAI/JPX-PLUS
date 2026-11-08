# E-Hentai Forums Dark

This independent Stylus theme has its own version, separate from JPX-PLUS.

## 1.1.1 — 2026-11-08

- Adapt the native `CLOSED` topic button (`t_closed.gif`) to the same dark tone
  as `NEW THREAD`, at both the top and bottom of closed topics.
- Preserve the original image, 99 × 23 size, alternative text and disabled
  semantics. Posted and signature images keep their original colors.

Validation uses the real Ambience button images in an isolated browser at
320 and 1440 pixels, with early and late stylesheets. It checks rendered
brightness, dimensions, content-image exclusions and native print appearance.
The existing offline list, post, editor, homepage and status-icon suites also
pass. This does not claim validation of an updated live Stylus installation
or every alternative forum skin.

Run the focused check after installing development dependencies:

```sh
node --test tests/forum_dark_buttons.test.cjs
```

Update the existing **E-Hentai Forums Dark** style in Stylus and refresh the
forum page. Version 1.1.1 fixes the closed-topic button omitted by 1.1.0.
