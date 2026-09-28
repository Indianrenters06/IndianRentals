const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const CMS = require('../models/CMS');
const User = require('../models/User');
const Enquiry = require('../models/ContactEnquiry');
const defaults = require('../config/contact-defaults.json');
const { normalizeContent, validateEnquiry } = require('../utils/contactValidation');
const { errorHandler } = require('../middleware/errorMiddleware');
const { updatePage, getPage } = require('../controllers/cmsController');
const content=()=>normalizeContent({});
const enquiry=()=>({submissionId:randomUUID(),intent:'rental',fullName:'QA Contact',phone:'+91 9999999999',email:'qa@example.com',city:'delhi',equipment:defaults.equipment[0],message:'Test enquiry',consent:true});
function invoke(handler, req) { return new Promise((resolve,reject)=>{const res={statusCode:200,status(code){this.statusCode=code;return this;},json(body){resolve({status:this.statusCode,body});}};handler(req,res,error=>reject(Object.assign(error,{status:res.statusCode})));}); }
test('contact defaults are identical in storefront and backend',()=>assert.deepEqual(require('../../frontend/src/config/contact-defaults.json'),defaults));
test('CMS persists complete contact content independently of the legacy banner',async t=>{
    let stored={pageName:'contact',bannerImage:'/legacy.png',contactTitle:'Original heading'};
    t.mock.method(CMS,'findOne',async()=>{const doc=new CMS(stored);doc.save=async()=>{await doc.validate();stored=doc.toObject();return doc;};return doc;});
    const changed={...content(),heroShowText:false,heroBackground:'#123abc',title:'Updated heading',phone:'+91-9999819719'};
    changed.branches[0].phone='011-40735568';
    await invoke(updatePage,{params:{page:'contact'},body:{contactContent:changed}});
    const result=(await invoke(getPage,{params:{page:'contact'}})).body;
    assert.deepEqual(result.contactContent,changed);assert.equal(result.bannerImage,'/legacy.png');assert.equal(result.contactTitle,'Original heading');
});
test('invalid content and unsafe links are rejected before CMS write',async t=>{
    let writes=0;t.mock.method(CMS,'findOne',async()=>{writes++;});
    for(const change of [{heroBackground:'red'},{heroShowText:'false'},{heroImage:'javascript:alert(1)'},{helpLinks:[{label:'Bad',href:'//evil.example'}]},{branches:[]},{equipment:[]},{email:'bad'}])await assert.rejects(invoke(updatePage,{params:{page:'contact'},body:{contactContent:{...content(),...change}}}),e=>e.status===400);
    assert.equal(writes,0);
});
test('rental and support fields are validated independently; forged fields are discarded',()=>{
    const rental=validateEnquiry({...enquiry(),order:'Hidden stale order',status:'resolved',cityName:'Forged'},content());assert.equal(rental.order,undefined);assert.equal(rental.status,undefined);assert.equal(rental.cityName,'Delhi');
    const support=validateEnquiry({...enquiry(),intent:'support',order:'IR-123'},content());assert.equal(support.equipment,undefined);assert.equal(support.order,'IR-123');
    for(const change of [{consent:false},{phone:'123456789'},{email:'bad'},{city:'missing'},{fullName:'  '},{equipment:'Not offered'},{intent:'support',message:''},{message:'x'.repeat(2001)},{intent:'spam'},{submissionId:''}])assert.throws(()=>validateEnquiry({...enquiry(),...change},content()),e=>e.statusCode===400);
});
test('HTTP submissions persist, retry safely, and inbox requires an authorized CMS user',async t=>{
    process.env.JWT_SECRET='contact-tests-only-not-a-production-secret';
    const records=[];
    t.mock.method(CMS,'findOne',()=>({lean:async()=>({contactContent:content()})}));
    t.mock.method(Enquiry,'create',async values=>{
        if(records.some(r=>r.submissionId===values.submissionId))throw Object.assign(new Error('duplicate'),{code:11000,keyPattern:{submissionId:1}});
        const doc=new Enquiry(values);await doc.validate();records.push(doc.toObject());return doc;
    });
    t.mock.method(Enquiry,'find',()=>({select(){return this;},sort(){return this;},skip(){return this;},limit(){return this;},lean:async()=>records}));
    t.mock.method(Enquiry,'countDocuments',async()=>records.length);
    t.mock.method(Enquiry,'findByIdAndUpdate',(id,update)=>({select:async()=>{const item=records.find(r=>String(r._id)===id);if(item)Object.assign(item,update.$set);return item;}}));
    t.mock.method(User,'findById',id=>({select:async()=>id==='cms'?{role:'staff',adminPermissions:['cms']}:{role:'staff',adminPermissions:['products']}}));
    const app=express();app.use(express.json(),cookieParser());app.use('/api/contact',require('../routes/contactRoutes'));app.use(errorHandler);
    const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
    const base=`http://127.0.0.1:${server.address().port}/api/contact/enquiries`;
    const post=body=>fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const rental=enquiry();assert.equal((await post(rental)).status,201);assert.equal((await post(rental)).status,201);assert.equal(records.length,1);
    assert.equal((await post({...enquiry(),intent:'support',order:'IR-123'})).status,201);assert.equal(records[1].equipment,undefined);
    assert.equal((await post({...enquiry(),consent:false})).status,400);assert.equal(records.length,2);
    assert.equal((await fetch(base)).status,401);
    const auth=id=>({Authorization:`Bearer ${jwt.sign({id},process.env.JWT_SECRET)}`});
    assert.equal((await fetch(base,{headers:auth('other')})).status,403);
    const inbox=await fetch(base,{headers:auth('cms')});assert.equal(inbox.status,200);assert.equal(inbox.headers.get('cache-control'),'no-store');assert.equal((await inbox.json()).total,2);
    const patch=(id,status)=>fetch(`${base}/${id}`,{method:'PATCH',headers:{...auth('cms'),'Content-Type':'application/json'},body:JSON.stringify({status})});
    assert.equal((await patch(records[0]._id,'in_progress')).status,200);assert.equal(records[0].status,'in_progress');
    assert.equal((await patch(records[0]._id,'bogus')).status,400);
    assert.equal((await patch('000000000000000000000000','resolved')).status,404);
    t.mock.method(Enquiry,'create',async()=>{throw new Error('Storage offline');});
    const failed=await post(enquiry());assert.equal(failed.status,500);assert.equal((await failed.json()).received,undefined);
});
