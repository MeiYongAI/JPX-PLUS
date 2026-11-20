// Release tool only, not installed on end-user systems. Keys stay outside the repo.
// node scripts/sign-extensions.cjs <private-key-directory>
'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname,'..'), base = path.join(root,'extensions');
if (!process.argv[2]) throw Error('Specify a private signing-key directory outside the repository');
const keys = fs.realpathSync(process.argv[2]);
if (!path.relative(root,keys).startsWith('..' + path.sep) && !path.isAbsolute(path.relative(root,keys))) throw Error('Keep keys outside the repository');
const output = path.join(root,'docs/extensions'); fs.mkdirSync(output,{recursive:true});
const feed = 'https://meiyongai.github.io/JPX-PLUS/extensions/';
function varint(n) { const bytes=[]; while(n>=128) { bytes.push((n%128)|128); n=Math.floor(n/128); } return Buffer.from([...bytes,n]); }
function field(no,bytes) { return Buffer.concat([varint(no*8+2),varint(bytes.length),bytes]); }
const apps=[];
for(const slug of ['hv-utils','hv-zh-cn']) {
  const {version,update_url} = JSON.parse(fs.readFileSync(path.join(base,slug,'manifest.json')));
  if(update_url !== feed+'updates.xml') throw Error('Unexpected manifest update URL');
  const key=fs.readFileSync(path.join(keys,slug+'.pem'));
  const pub=crypto.createPublicKey(key).export({type:'spki',format:'der'});
  const id=crypto.createHash('sha256').update(pub).digest().subarray(0,16);
  const appid=id.toString('hex').replace(/./g,c=>String.fromCharCode(97+parseInt(c,16)));
  const zip=fs.readFileSync(path.join(base,`${slug}-${version}.zip`));
  const signed=field(1,id), size=Buffer.alloc(4); size.writeUInt32LE(signed.length);
  const message=Buffer.concat([Buffer.from('CRX3 SignedData\0'),size,signed,zip]);
  const sig=crypto.sign('RSA-SHA256',message,key);
  if(!crypto.verify('RSA-SHA256',message,crypto.createPublicKey(key),sig)) throw Error('Invalid signature');
  const header=Buffer.concat([field(2,Buffer.concat([field(1,pub),field(2,sig)])),field(10000,signed)]);
  const prefix=Buffer.alloc(12);prefix.write('Cr24');prefix.writeUInt32LE(3,4);prefix.writeUInt32LE(header.length,8);
  const name=`${slug}-${version}.crx`;fs.writeFileSync(path.join(output,name),Buffer.concat([prefix,header,zip]));
  apps.push(`  <app appid="${appid}"><updatecheck codebase="${feed+name}" version="${version}"/></app>`);
  console.log(slug,appid,version);
}
fs.writeFileSync(path.join(output,'updates.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<gupdate xmlns="http://www.google.com/update2/response" protocol="2.0">\n${apps.join('\n')}\n</gupdate>\n`);
