import { useEffect } from "react";

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adClient, adSlot, style, className }) => {
  useEffect(() => {
    try {
      // anyキャストで型エラー回避
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <ins className={`adsbygoogle ${className || ""}`}
         style={{ display: "block", textAlign: "center", ...style }}
         data-ad-client={adClient}
         data-ad-slot={adSlot}
         data-ad-format="auto"></ins>
  );
};

export default AdBanner;