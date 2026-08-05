/* Developed by Grafizen International PVT. LTD. */
import React, { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  minHeight = 300,
  rootMargin = "350px",
}) {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: shouldRender ? "auto" : minHeight,
      }}
    >
      {shouldRender ? children : null}
    </div>
  );
}