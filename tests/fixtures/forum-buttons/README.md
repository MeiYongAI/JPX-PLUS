# Native forum topic buttons

Captured from the rendered Ambience skin on 2026-11-08:

- `https://forums.e-hentai.org/style_images/ambience/t_closed.gif`
- `https://forums.e-hentai.org/style_images/ambience/t_new.gif`

Both are native 99 × 23 pixel assets. The closed-topic control is a bare image in
the right-aligned `.nopad` cell, beside the linked new-topic image, at the top
and bottom of a closed topic. The test recreates this structure with synthetic
content and intercepts all network requests. No account data is included.

These source assets are retained only as regression fixtures; the distributed
UserCSS continues to use the forum's images. Pixel luminance checks are
visibility regressions, not a complete accessibility certification.
