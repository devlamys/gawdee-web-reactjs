/* Developed by Grafizen International PVT. LTD. */
import React, { Suspense, lazy } from "react";

import Header from "../../component/Header";
import HeroSection from "../../component/home/HeroSection";
import CategoriesSection from "@/component/home/CategoriesSection";
import GawdeeKPISection from "@/component/home/GawdeeKPISection";
import LazySection from "@/component/common/LazySection";

const HealthyProductCategories = lazy(() =>
  import("@/component/home/HealthyProductCategories")
);

const RecomandedProduct = lazy(() =>
  import("@/component/home/RecomandedProduct")
);

const ReelsCommerceSection = lazy(() =>
  import("@/component/home/ReelsCommerceSection")
);

const NewProducts = lazy(() =>
  import("@/component/home/NewProducts")
);

const AboutUsSection = lazy(() =>
  import("@/component/home/AboutUsSection")
);

const WhyChooseUsSection = lazy(() =>
  import("@/component/home/WhyChooseUsSection")
);

const QualitySection = lazy(() =>
  import("@/component/home/QualitySection")
);

const FAQSection = lazy(() =>
  import("@/component/home/FAQSection")
);

const TestimonialSection = lazy(() =>
  import("@/component/home/TestimonialsSection")
);

const BlogsSection = lazy(() =>
  import("@/component/home/BlogsSection")
);

const Footer = lazy(() =>
  import("@/component/Footer")
);

const SectionFallback = ({ height = 400 }) => (
  <div style={{ minHeight: height }} />
);

export default function Home() {
  return (
    <div
      className="relative w-full min-h-screen bg-white overflow-x-hidden"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Header />

      <main className="relative w-full">
        <HeroSection />
        <CategoriesSection />
        <GawdeeKPISection />

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <HealthyProductCategories />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={600} />}>
          <LazySection minHeight={600}>
            <RecomandedProduct />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <ReelsCommerceSection />
        </Suspense>

        <Suspense fallback={<SectionFallback height={600} />}>
          <LazySection minHeight={600}>
            <NewProducts />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <AboutUsSection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <WhyChooseUsSection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <QualitySection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={400} />}>
          <LazySection minHeight={400}>
            <FAQSection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <TestimonialSection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={500} />}>
          <LazySection minHeight={500}>
            <BlogsSection />
          </LazySection>
        </Suspense>

        <Suspense fallback={<SectionFallback height={400} />}>
          <LazySection minHeight={400}>
            <Footer />
          </LazySection>
        </Suspense>
      </main>
    </div>
  );
}