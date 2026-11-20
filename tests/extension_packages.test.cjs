const {test} = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
// Decode the published CRX3 rather than trusting the packer's in-memory signature.
function fields(bytes) {
  let i=0; const out={};
  function uint(){let n=0,k=1,b; do {assert.ok(i<bytes.length && k<2**40); b=bytes[i++]; n+=(b&127)*k;k*=128;} while(b&128);return n;}
  while(i<bytes.length){const tag=uint();assert.equal(tag%8,2);const len=uint();assert.ok(i+len<=bytes.length);out[tag>>3]=bytes.subarray(i,i+len);i+=len;}
  return out;
}
for(const [slug,id] of Object.entries({'hv-utils':'fakllkpacebljdkappedbefcooiimdop','hv-zh-cn':'peajhkaihfabnchjkhnppmhofachdjog'})) test(`published signature and update identity: ${slug}`,()=>{
  const {version,update_url}=JSON.parse(fs.readFileSync(path.join(root,'extensions',slug,'manifest.json')));
  const file=`${slug}-${version}.crx`;
  const feed=fs.readFileSync(path.join(root,'docs/extensions/updates.xml'),'utf8');
  assert.ok(feed.includes(`<app appid="${id}"><updatecheck codebase="${new URL(file,update_url)}" version="${version}"`));
  const crx=fs.readFileSync(path.join(root,'docs/extensions',file)); assert.equal(crx.toString('ascii',0,4),'Cr24');assert.equal(crx.readUInt32LE(4),3);
  const end=12+crx.readUInt32LE(8), header=fields(crx.subarray(12,end)), proof=fields(header[2]), signed=header[10000], zip=crx.subarray(end);
  const hash=crypto.createHash('sha256').update(proof[1]).digest().subarray(0,16);
  assert.deepEqual(fields(signed)[1], hash);assert.equal(hash.toString('hex').replace(/./g,c=>String.fromCharCode(97+parseInt(c,16))), id);
  const size=Buffer.alloc(4);size.writeUInt32LE(signed.length);
  assert.ok(crypto.verify('RSA-SHA256', Buffer.concat([Buffer.from('CRX3 SignedData\0'),size,signed,zip]), {key:proof[1],type:'spki',format:'der'},proof[2]));
  assert.deepEqual(zip,fs.readFileSync(path.join(root,'extensions',`${slug}-${version}.zip`)));
});
