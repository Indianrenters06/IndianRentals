import test from 'node:test';
import assert from 'node:assert/strict';
import {createHomepageContentLoader,heroSlidesFor,DEFAULT_HERO_SLIDES} from '../src/lib/homepageContent.mjs';

const settings = {api:'https://cms.example',retryDelay:0};
const response = data => ({ok:true,json:async()=>data});
test('a first-visit CMS outage retains a usable hero and feature section after retry',async()=>{
  let attempts=0; let fallback;
  const loader=createHomepageContentLoader({...settings,fetcher:async()=>{attempts++;throw new TypeError('Failed to fetch');},onFallback:(error,cached)=>{fallback={message:error.message,cached};}});
  const content=await loader.load();
  assert.equal(attempts,2); assert.equal(content.featureSectionEnabled,true);
  assert.deepEqual(heroSlidesFor(content),DEFAULT_HERO_SLIDES);
  assert.deepEqual(fallback,{message:'Failed to fetch',cached:false});
});
test('transient failure retries successfully and simultaneous consumers share the request',async()=>{
  let attempts=0;
  const content={heroSlides:[{image:'/configured.jpg'}],featureSectionTitle:'Configured title'};
  const loader=createHomepageContentLoader({...settings,fetcher:async()=>{attempts++;return attempts===1?{ok:false,status:503}:response(content);}});
  const [hero,feature]=await Promise.all([loader.load(),loader.load()]);
  assert.deepEqual(hero,content);assert.equal(feature,hero);assert.equal(attempts,2);
});
test('later failures preserve saved content, including admin disable settings',async()=>{
  let offline=false;
  const storageData=new Map();
  const storage=()=>({getItem:key=>storageData.get(key),setItem:(key,value)=>storageData.set(key,value)});
  const data={heroEnabled:false,featureSectionEnabled:false,heroSlides:[{image:'/configured.jpg'}]};
  const fetcher=async()=>{if(offline)throw new Error('offline');return response(data);};
  const loader=createHomepageContentLoader({...settings,storage,fetcher});
  assert.deepEqual(await loader.load(),data);
  offline=true;
  assert.deepEqual(await loader.load(),data);
  // A fresh page load can recover the saved configuration from session storage.
  const reloaded=createHomepageContentLoader({...settings,storage,fetcher});
  const saved=await reloaded.load();
  assert.equal(saved.featureSectionEnabled,false);assert.deepEqual(heroSlidesFor(saved),[]);
});
test('malformed payloads, blocked storage, and stale cache fall back without throwing',async()=>{
  const blocked=createHomepageContentLoader({...settings,storage:()=>{throw new Error('storage blocked');},fetcher:async()=>response({error:'not CMS data'})});
  assert.ok(heroSlidesFor(await blocked.load()).length>0);
  const stale=createHomepageContentLoader({...settings,now:()=>200000000,storage:()=>({getItem:()=>JSON.stringify({savedAt:1,content:{heroEnabled:false}})}),fetcher:async()=>response([])});
  assert.ok(heroSlidesFor(await stale.load()).length>0);
});
test('hero supports legacy CMS banners and rejects empty slides without removing the section',()=>{
  const legacy={heroImage:'/legacy.jpg',heroSlides:[{image:''}],heroTitle:'Existing title'};
  assert.equal(heroSlidesFor(legacy)[0].image,'/legacy.jpg');
  for(const value of [undefined,{heroSlides:[]},{heroSlides:'invalid'},{heroSlides:[null,{image:'  '}]}])assert.deepEqual(heroSlidesFor(value),DEFAULT_HERO_SLIDES);
  assert.deepEqual(heroSlidesFor({heroEnabled:false}),[]);
});
test('each network attempt has a timeout signal',async()=>{
  let aborted=0;
  const loader=createHomepageContentLoader({...settings,timeout:10,fetcher:(_url,{signal})=>new Promise((resolve,reject)=>{
    // Keep this test's simulated connection alive while the timeout fires.
    const timer=setTimeout(()=>resolve(response({heroEnabled:true})),500);
    signal.addEventListener('abort',()=>{aborted++;clearTimeout(timer);reject(signal.reason);});
  })});
  assert.ok(heroSlidesFor(await loader.load()).length>0);assert.equal(aborted,2);
});
