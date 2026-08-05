/* Developed by Grafizen International PVT. LTD. */
"use client";

import React from "react";

export default function BottomOfferBar() {
  const offerText = `
    🌿 Pure A2 Gir Cow Ghee • Raw Forest Honey • Natural Wellness Products • Free Shipping on Selected Orders • Trusted Purity • Traditional Goodness • Shop Gawdee Today •
  `;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] bg-[#1f7a37] border-t border-white/10 overflow-hidden">
      <div className="relative flex whitespace-nowrap">
        <div className="animate-marquee py-2 text-white text-[13px]    font-medium uppercase tracking-wide">
          <span className="mx-6">{offerText}</span>
          <span className="mx-6">{offerText}</span>
          <span className="mx-6">{offerText}</span>
        </div>

      </div>
    </div>
  );
}