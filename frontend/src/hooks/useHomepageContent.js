'use client';

import { useEffect, useState } from 'react';
import { API } from '@/services/apiConfig';
import { createHomepageContentLoader } from '@/lib/homepageContent.mjs';

const loader = createHomepageContentLoader({
  api:API,
  storage:()=>window.sessionStorage,
  onFallback:(error,hasCache)=>console.warn(`Homepage content unavailable; using ${hasCache ? 'last saved content' : 'local fallback content'}.`,error.message),
});

export default function useHomepageContent() {
  const [state,setState] = useState({content:null,loading:true});
  useEffect(()=>{
    let active=true;
    const load=()=>loader.load().then(content=>{if(active)setState({content,loading:false});});
    load();
    window.addEventListener('online',load);
    return ()=>{active=false;window.removeEventListener('online',load);};
  },[]);
  return state;
}
