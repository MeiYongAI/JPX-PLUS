# Offline image controls

The PNGs in `assets.json` are previously captured public HentaiVerse UI assets.
The four `/y/character/inc[ _d].png` and `dec[ _d].png` controls include original
20×16 images, with missing states downloaded from their public paths on 2026-11-08.
They exercise native image colors, alpha, skill artwork and slot geometry in
`tests/hv_dark_controls.test.cjs`. Requests are fulfilled locally.

Uncaptured image paths use empty SVG placeholders for selector/geometry checks;
Chinese visual previews use the actual translation script's generated images.
The filled tier PNG is a contrast backdrop, not evidence of an unlock state.
Ability states in the fixture follow the classes and data attributes assigned by
HVUT 4.2.42; the fixture does not run real account or ability-allocation actions.
