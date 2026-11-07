'use strict';
// Neutral surroundings for offline illustrations; product styles stay untouched.
const light = '#edebdf';
const dark = '#171b22';
const css = `
html[data-jpx-theme=dark],html[data-jpx-theme=dark] body{background:${dark};color:#d9dce1}
html[data-jpx-theme=dark] #finish-battle{background:#292f38;color:#d9dce1;border:1px solid #505966}
`;
module.exports = { light, dark, install: page => page.addStyleTag({content:css}) };
