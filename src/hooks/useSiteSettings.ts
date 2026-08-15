"use client";

import { useEffect, useState } from "react";

export type PublicSiteSettings = {
  supportPhone: string;
  freeShippingThreshold: number;
  promoText: string;
  instagramUrl: string;
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<Partial<PublicSiteSettings>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        // keep defaults; settings are not critical for rendering
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
