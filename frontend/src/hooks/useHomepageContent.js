'use client';

import { useEffect, useState } from 'react';
import { API } from '@/services/apiConfig';
import { createHomepageContentLoader } from '@/lib/homepageContent.mjs';
import { cmsUrl, fetchCmsPage } from '@/lib/cmsPreview';

const loader = createHomepageContentLoader({
  api:API,
  fetcher: (_url, options) => fetchCmsPage('homepage', { ...options, signal: undefined }),
  storage:()=>window.sessionStorage,
  onFallback:(error,hasCache)=>console.warn(`Homepage content unavailable; using ${hasCache ? 'last saved content' : 'local fallback content'}.`,error.message),
});

export default function useHomepageContent() {
  const [state,setState] = useState({content:null,loading:true});
  useEffect(()=>{
    let active=true;
    const load=()=>{
      const params = new URLSearchParams(window.location.search);
      const preview = params.get('cmsPreviewPage') === 'homepage' && params.has('cmsPreview');
      const request = preview
        ? fetchCmsPage('homepage', { cache: 'no-store' }).then(response => response.ok ? response.json() : null)
        : loader.load();
      request.then(content=>{if(active)setState({content,loading:false});})
        .catch(()=>{if(active)setState({content:null,loading:false});});
    };
    load();
    window.addEventListener('online',load);
    return ()=>{active=false;window.removeEventListener('online',load);};
  },[]);
  return state;
}
