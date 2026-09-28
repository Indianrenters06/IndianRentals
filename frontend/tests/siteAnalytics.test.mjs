import test from 'node:test';
import assert from 'node:assert/strict';
import { createConsent, CONSENT_LIFETIME } from '../src/lib/consent.mjs';
import { createSiteAnalytics, pageCategory, deviceCategory } from '../src/lib/siteAnalytics.mjs';

function fixture(fetcher) {
  const calls = [];
  const tracker = createSiteAnalytics({api:'https://api.example',fetcher:fetcher || (async (url,options)=>{calls.push({url,body:JSON.parse(options.body),options});return {ok:true};})});
  return {tracker,calls};
}
test('no requests before choice; rejection records only the necessary preference',async()=>{
  const {tracker,calls} = fixture();
  await tracker.pageView('/',1200); assert.equal(calls.length,0);
  await tracker.setChoice(createConsent(false));
  await tracker.pageView('/',1200);
  assert.equal(calls.length,1); assert.ok(calls[0].url.endsWith('/consent'));
});
test('accepted views require successful receipt persistence; page and device only',async()=>{
  const {tracker,calls} = fixture();
  await tracker.setChoice(createConsent(true));
  assert.equal(await tracker.pageView('/products/private-product-id?email=secret@example.com',390),true);
  assert.equal(calls.length,2);
  const event = calls[1];
  assert.equal(event.body.page,'product'); assert.equal(event.body.device,'mobile');
  assert.deepEqual(Object.keys(event.body).sort(),['device','eventId','page','receiptId']);
  assert.equal(JSON.stringify(calls).includes('secret@example.com'),false);
  assert.equal(event.options.credentials,'omit'); assert.equal(event.options.referrerPolicy,'no-referrer');
  assert.equal(await tracker.pageView('/products/private-product-id?email=secret@example.com',390),false);
  await tracker.pageView('/contact',900); await tracker.pageView('/',1264);
  assert.equal(calls.length,4);
});
test('private routes and arbitrary paths are never collected',()=>{
  for (const path of ['/profile/orders','/order-confirmation?order=123','/cart','/checkout','/login','/register','/verification','/something@example.com','/contact-demo'])assert.equal(pageCategory(path),null);
  assert.equal(pageCategory('/category/dslr/camera'),'category');
  assert.equal(pageCategory('/locations/delhi'),'locations');
  assert.deepEqual([deviceCategory(390),deviceCategory(768),deviceCategory(1264)],['mobile','tablet','desktop']);
});
test('failed or expired consent cannot authorize optional collection; next visit can retry',async()=>{
  let failed = true;
  const calls = [];
  const {tracker} = fixture(async(url)=>{calls.push(url);return {ok:!failed};});
  await tracker.setChoice(createConsent(true));
  assert.equal(await tracker.pageView('/',900),false);
  assert.ok(calls.every(url=>url.endsWith('/consent')));
  failed=false; assert.equal(await tracker.pageView('/',900),true);
  await tracker.setChoice(createConsent(true,Date.now()-CONSENT_LIFETIME));
  const count=calls.length;
  assert.equal(await tracker.pageView('/',900),false); assert.equal(calls.length,count);
});
test('withdrawal while receipt request is pending prevents the queued view',async()=>{
  let release;
  const calls=[];
  const {tracker} = fixture(async(url,options)=>{
    calls.push({url,body:JSON.parse(options.body)});
    if(calls.length===1)await new Promise(resolve=>{release=resolve;});
    return {ok:true};
  });
  const accepted=createConsent(true);
  const sync=tracker.setChoice(accepted);
  await Promise.resolve();
  const view=tracker.pageView('/',900);
  const revoked=tracker.setChoice(createConsent(false,accepted.updatedAt+1,accepted.receiptId));
  release(); await Promise.all([sync,view,revoked]);
  assert.ok(calls.every(call=>call.url.endsWith('/consent')));
  assert.equal(calls.at(-1).body.analytics,false);
});
test('an uncertain page-view response retries with the same event ID',async()=>{
  const events=[];
  const {tracker}=fixture(async(url,options)=>{
    if(url.endsWith('/page-view')) {
      events.push(JSON.parse(options.body));
      if(events.length===1)throw new Error('Response lost');
    }
    return {ok:true};
  });
  await tracker.setChoice(createConsent(true));
  assert.equal(await tracker.pageView('/',900),false);
  assert.equal(await tracker.pageView('/',900),true);
  assert.equal(events[0].eventId,events[1].eventId);
});
test('withdrawal aborts an optional request in flight and stops further views',async()=>{
  let aborted=false;
  const {tracker}=fixture(async(url,options)=>{
    if(url.endsWith('/page-view'))return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>{aborted=true;reject(new Error('aborted'));}));
    return {ok:true};
  });
  const choice=createConsent(true); await tracker.setChoice(choice);
  const view=tracker.pageView('/',900); await Promise.resolve(); await Promise.resolve();
  await tracker.setChoice(createConsent(false,Date.now()+1,choice.receiptId));
  assert.equal(await view,false); assert.equal(aborted,true);
  assert.equal(await tracker.pageView('/contact',900),false);
});
