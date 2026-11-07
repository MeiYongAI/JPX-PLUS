'use strict';
// Disposable browser profiles and offline fixture data only. No installed userscripts.
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const run=(name,args=[],env={})=>execFileSync(process.execPath,[path.join(__dirname,name+'.cjs'),...args],{stdio:'inherit',env:{...process.env,...env}});
for(const language of ['en','zh-CN']) {
  run('desktop',[],{JPX_SCREENSHOT_LANGUAGE:language});
  run('records',[],{JPX_DOC_LANGUAGE:language});
  run('mobile',['--language='+language]);
  for(const theme of ['light','dark'])run('panels',[...(language==='en'?['--en']:[]),...(theme==='dark'?['--dark']:[])]);
}
run('manager');
// Keep existing shared URLs in sync with the renamed Configs scene.
const images=path.resolve(__dirname,'../../docs/images');
for(const device of ['desktop','mobile'])for(const suffix of ['','-en','-dark','-dark-en'])
  fs.copyFileSync(path.join(images,`${device}-configs${suffix}.png`),path.join(images,`${device}-backpack${suffix}.png`));
for(const device of ['desktop','mobile'])fs.copyFileSync(path.join(images,`${device}-configs-en.png`),path.join(images,`forum-${device}-en.png`));
