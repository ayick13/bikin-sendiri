// app/components/TurnstileWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

// Muat skrip Turnstile hanya sekali
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
let scriptLoaded = false;

const TurnstileWidget = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptLoaded || !ref.current) return;

    const script = document.createElement('script');
    script.src = `${TURNSTILE_SCRIPT_URL}?render=explicit`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.turnstile && ref.current) {
        window.turnstile.render(ref.current, {
          sitekey: process.env.TURNSTILE_SITE_KEY!,
          theme: 'auto',
        });
        scriptLoaded = true;
      }
    };

    document.body.appendChild(script);
    
    return () => {
      // Bersihkan widget saat komponen di-unmount
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={ref} />;
};

export default TurnstileWidget;

// Augment the Window interface for turnstile if needed
export {};