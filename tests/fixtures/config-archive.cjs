'use strict';
// Synthetic data only. Padding equalizes byte size, not object/condition count.
function configArchive({complex=true,active=true,count=40,size=992*1024,world='Isekai',bindings=0}={}){
 const mode='1H_Mage_Tower',entries=[];
 for(let i=0;i<count;i++){
  const supports=Array.from({length:complex?44:170},(_,j)=>({type:'stop',customMessage:'Saved '+i+' rule '+j,disabled:true,
   conditions:complex?Array.from({length:5},(_,k)=>({key:'pHP',comparison:'less',value:[0,(k+1)/10]})):[]}));
  entries.push({id:'profile-'+i,revision:1,createdAt:'2026-11-08T00:00:00.000Z',updatedAt:'2026-11-08T00:00:00.000Z',
   envelope:{schemaVersion:1,kind:'battle-mode',title:'Profile '+i,world,mode,config:{battleVersion:20251216,[mode]:{supports,attacks:[{type:'normalAttack'}]}}}});
 }
 const state={schemaVersion:1,entries,applied:{},migrations:[]};
 if(active){const entry=entries[0];state.active={[world]:entry.id};state.applied[world]={[entry.id]:{id:entry.id,revision:1,mode,scopes:[mode],config:entry.envelope.config}};}
 if(bindings)state.bindings=Array.from({length:bindings},(_,i)=>({world,personaId:String(i+1),setId:'1',id:entries[i%count].id,trustedRevision:1}));
 entries.at(-1).envelope.description='';
 const padding=Math.max(0,size-JSON.stringify(state).length);entries.at(-1).envelope.description='x'.repeat(padding);
 const raw=JSON.stringify(state),native=active?JSON.stringify(entries[0].envelope.config):null;
 return{raw,native,mode,storage:{jpx_configLibrary_v1:raw,...(native?{['jpx_cfgBattle'+(world==='Isekai'?'_isekai':'')]:native}:{})},padding};
}
module.exports={configArchive};
