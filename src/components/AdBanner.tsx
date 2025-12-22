import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);
  const [hasAdContent, setHasAdContent] = useState(false);

  useEffect(() => {
    // Only load ad once per component instance
    if (isAdLoaded.current) return;
    
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Check if ad actually has content (not just an empty placeholder)
  useEffect(() => {
    const checkAdContent = () => {
      if (adRef.current) {
        const adElement = adRef.current;
        // Check if the ad has meaningful height (indicating an ad was loaded)
        const height = adElement.offsetHeight;
        // AdSense typically renders ads with height > 0 when filled
        // Also check for iframe children which indicate a filled ad
        const hasIframe = adElement.querySelector('iframe') !== null;
        const hasContent = height > 0 && (hasIframe || height > 50);
        setHasAdContent(hasContent);
      }
    };

    // Check multiple times as ads load asynchronously
    const timeouts = [
      setTimeout(checkAdContent, 500),
      setTimeout(checkAdContent, 1500),
      setTimeout(checkAdContent, 3000),
      setTimeout(checkAdContent, 5000),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`ad-container ${className} ${!hasAdContent ? 'hidden' : ''}`}
      style={{ minHeight: hasAdContent ? 'auto' : 0 }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9003903171576897"
        data-ad-slot="5987437150"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
