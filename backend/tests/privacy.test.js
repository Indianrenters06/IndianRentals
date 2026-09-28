const {test} = require('node:test');
const assert = require('node:assert/strict');
const {randomUUID,createHash} = require('node:crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Consent = require('../models/CookieConsent');
const PageView = require('../models/SitePageView');
const User = require('../models/User');
const {errorHandler} = require('../middleware/errorMiddleware');

test('records have retention indexes and no personal identity fields',()=>{
  assert.ok(Consent.schema.indexes().some(([keys,options])=>keys.expiresAt===1 && options.expireAfterSeconds===0));
  assert.ok(PageView.schema.indexes().some(([keys,options])=>keys.expiresAt===1 && options.expireAfterSeconds===0));
  for(const field of ['ip','userAgent','email','phone','userId','url','referrer','receiptId','receiptHash'])assert.equal(PageView.schema.path(field),undefined);
});

test('HTTP consent gates persistent analytics; reports require permission; outages never report success',async t=>{
  process.env.JWT_SECRET='privacy-test-only-not-production';
  let databaseReady=1;
  Object.defineProperty(mongoose.connection,'readyState',{configurable:true,get:()=>databaseReady});
  t.after(()=>{delete mongoose.connection.readyState;});
  const receipts=new Map(); const events=[];
  t.mock.method(Consent,'findOneAndUpdate',async(filter,update)=>{
    const values=update.$set;
    const previous=receipts.get(values.receiptHash);
    if(previous && (+previous.decidedAt > +values.decidedAt || (+previous.decidedAt === +values.decidedAt && !previous.analytics && values.analytics)))throw Object.assign(new Error('stale'),{code:11000});
    const doc=new Consent(values);await doc.validate();receipts.set(values.receiptHash,doc.toObject());return doc;
  });
  t.mock.method(Consent,'exists',async filter=>{
    const item=receipts.get(filter.receiptHash);
    return item?.analytics && item.expiresAt>filter.expiresAt.$gt ? {_id:item._id} : null;
  });
  t.mock.method(PageView,'create',async values=>{
    if(events.some(event=>event.eventId===values.eventId))throw Object.assign(new Error('duplicate'),{code:11000,keyPattern:{eventId:1}});
    const doc=new PageView(values);await doc.validate();events.push(doc.toObject());return doc;
  });
  t.mock.method(PageView,'aggregate',async()=>[{total:[{count:events.length}],pages:[{_id:'home',count:events.length}],devices:[],daily:[]}]);
  t.mock.method(Consent,'aggregate',async()=>[{_id:false,count:1}]);
  t.mock.method(User,'findById',id=>({select:async()=>({role:'staff',adminPermissions:[id==='reports'?'reports':'products']})}));
  const app=express();app.use(express.json(),cookieParser());app.use('/api/privacy',require('../routes/privacyRoutes'));app.use(errorHandler);
  const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base=`http://127.0.0.1:${server.address().port}/api/privacy`;
  const post=(route,body)=>fetch(`${base}/${route}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const choice={receiptId:randomUUID(),version:2,essential:true,analytics:true,updatedAt:Date.now()};
  const event={receiptId:choice.receiptId,eventId:randomUUID(),page:'home',device:'desktop'};
  assert.equal((await post('page-view',event)).status,403);assert.equal(events.length,0);
  for(const invalid of [{version:1},{receiptId:'bad'},{analytics:'true'},{updatedAt:Date.now()+120000},{updatedAt:Date.now()-181*86400000},{essential:false}])assert.equal((await post('consent',{...choice,...invalid})).status,400);
  assert.equal((await post('consent',{...choice,email:'not-stored@example.com'})).status,200);
  const stored=receipts.get(createHash('sha256').update(choice.receiptId).digest('hex'));
  assert.equal(stored.email,undefined); assert.equal(stored.receiptId,undefined);assert.equal(stored.expiresAt-stored.decidedAt,180*86400000);
  assert.equal((await post('page-view',{...event,url:'private',email:'not-stored@example.com'})).status,201);
  assert.equal((await post('page-view',event)).status,201);assert.equal(events.length,1);
  assert.equal(events[0].email,undefined);assert.equal(events[0].receiptId,undefined);assert.equal(events[0].expiresAt-events[0].createdAt,90*86400000);
  for(const invalid of [{page:'/profile/orders'},{device:'full user agent'},{eventId:'bad'}])assert.equal((await post('page-view',{...event,...invalid})).status,400);
  const withdrawn={...choice,analytics:false,updatedAt:choice.updatedAt+1};
  assert.equal((await post('consent',withdrawn)).status,200);
  assert.equal((await post('consent',choice)).status,409);
  assert.equal((await post('consent',{...withdrawn,analytics:true})).status,409);
  assert.equal((await post('page-view',{...event,eventId:randomUUID()})).status,403);
  assert.equal((await fetch(`${base}/report`)).status,401);
  const auth=id=>({Authorization:`Bearer ${jwt.sign({id},process.env.JWT_SECRET)}`});
  assert.equal((await fetch(`${base}/report`,{headers:auth('products')})).status,403);
  const report=await fetch(`${base}/report`,{headers:auth('reports')});assert.equal(report.status,200);assert.equal(report.headers.get('cache-control'),'no-store');assert.equal((await report.json()).pageViews,1);
  assert.equal((await fetch(`${base}/report?days=9999`,{headers:auth('reports')})).status,400);
  databaseReady=0;
  const offline=await post('consent',withdrawn);assert.equal(offline.status,503);assert.equal((await offline.json()).saved,undefined);
  assert.equal((await post('page-view',event)).status,503);
});
