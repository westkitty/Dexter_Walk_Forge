import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./timeforge.html',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('./timeforge-core.js',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('./timeforge-ui.js',import.meta.url),'utf8'),app=fs.readFileSync(new URL('./timeforge-app.js',import.meta.url),'utf8');
assert.match(html,/<!doctype html>/i);
assert.match(html,/src="timeforge-core\.js"/);
assert.match(html,/src="timeforge-ui\.js"/);
assert.match(html,/src="timeforge-app\.js"/);
assert.ok(!/<script[^>]+src=["']https?:/i.test(html),'Timeforge must not depend on remote scripts');
assert.ok(!/<link[^>]+href=["']https?:/i.test(html),'Timeforge must not depend on remote stylesheets');
assert.match(html,/prefers-reduced-motion/);
assert.match(html,/aria-live="polite"/);
assert.match(html,/Source Lens/);
assert.match(html,/Semantic branch diff/);
assert.match(html,/Project Memory/);
assert.match(html,/Forge Recipes/);
new vm.Script(ui,{filename:'timeforge-ui.js'});new vm.Script(app,{filename:'timeforge-app.js'});
const context={console,crypto:globalThis.crypto,Date,Math,JSON,Set,Map,globalThis:null};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(core,context,{filename:'timeforge-core.js'});
const C=context.TimeforgeCore;
assert.ok(C,'Core exports missing');

const imported=C.demoImport();
const state=C.createState(imported);
const main=C.branch(state);
assert.equal(main.name,'main');
assert.equal(main.session.ideas.length,3);
assert.ok(main.session.ideas.every(x=>['direct','inferred','unlinked'].includes(x.provenance)));
assert.ok(main.session.ideas.filter(x=>x.provenance==='direct').length>=3,'Demo provenance should resolve directly');

const baseCount=main.session.ideas.length;
C.addIdea(state,main.id,'Add an exportable decision graph.');
assert.equal(main.session.ideas.length,baseCount+1);
assert.equal(main.events.length,1);
assert.equal(main.checkpoints.length,2);
const added=main.session.ideas.at(-1);
assert.equal(added.provenance,'direct');
assert.equal(C.lineage(main,added).raw.length,1);

const old=C.checkpointFor(main,0);
assert.equal(old.ideas.length,baseCount,'Historical checkpoint must remain immutable');
const branch=C.forkBranch(state,{fromBranchId:main.id,checkpointIndex:0,name:'smaller-local'});
assert.equal(branch.session.ideas.length,baseCount);
assert.equal(branch.parentId,main.id);
assert.equal(state.activeBranchId,branch.id);

C.addIdea(state,branch.id,'Voice is optional everywhere.');
C.addRecord(state,branch.id,'constraints','No cloud dependency.');
const first=branch.session.ideas[0];
C.patchIdea(state,branch.id,first.id,{priority:1,locked:false,status:'feature'});
let diff=C.listDiff(branch.session,main.session);
assert.ok(diff.some(d=>d.kind==='added'&&d.entity==='idea'));
assert.ok(diff.some(d=>d.entity==='constraints'));
assert.ok(diff.some(d=>d.kind==='changed'&&d.id===first.id));

const chosen=diff.filter(d=>d.kind==='added'&&d.entity==='constraints').map(d=>d.key);
C.mergeSelected(state,branch.id,main.id,chosen);
assert.ok(main.session.constraints.some(x=>x.text==='No cloud dependency.'));
assert.ok(!main.session.ideas.some(x=>x.text==='Voice is optional everywhere.'),'Selective merge must not leak unselected changes');
assert.equal(main.events.at(-1).type,'merge');

const mem=C.projectMemory(state);
assert.ok(mem.walks>=1);
assert.ok(Array.isArray(mem.themes));
for(const type of ['build','agent','issues','mvp','qa','handoff']){
  const out=C.recipe(state,main.id,type);
  assert.ok(out.includes(main.session.title),`Recipe ${type} missing project title`);
  assert.ok(out.length>80,`Recipe ${type} too shallow`);
}
const dwf=C.exportDwf(state);
assert.equal(dwf.v,3);
assert.ok(dwf.current);
assert.ok(!('sourceRawIds' in dwf.current.ideas[0]),'DWF export must strip Timeforge-only idea metadata');

const malformed=C.normalizeImport({schema:3,title:'Malformed',ideas:null,raw:null,constraints:null,decisions:null,questions:null});
assert.equal(malformed.kind,'dwf');
assert.equal(malformed.session.ideas.length,0);

console.log('PASS timeforge-verify');
console.log(JSON.stringify({branches:state.branches.length,mainEvents:main.events.length,branchEvents:branch.events.length,diffCount:C.listDiff(branch.session,main.session).length,readiness:C.readiness(main.session)}));
