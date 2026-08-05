/* Developed by Grafizen International PVT. LTD. */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ApiGet } from "../../helper/axios";

import hero1 from "../../../public/imges/heroSection/herosection1.jpg";
import hero2 from "../../../public/imges/heroSection/herosection2.jpg";
import hero3 from "../../../public/imges/heroSection/herosection3.jpg";
import hero4 from "../../../public/imges/heroSection/herosection4.jpg";
import hero5 from "../../../public/imges/heroSection/herosection5.jpg";
import hero6 from "../../../public/imges/heroSection/herosection6.jpg";
import hero7 from "../../../public/imges/heroSection/herosection7.jpg";

import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackHeroSlides = [
  { mainBanner: hero1, mobileBanner: hero1, url: "/product/gawdee-gir-cow-a2-ghee-1-ltr" },
  { mainBanner: hero2, mobileBanner: hero2, url: "/product/gawdee-raw-wild-forest-honey-650-g" },
  { mainBanner: hero3, mobileBanner: hero3, url: "/product/gawdee-taral-drop-30-ml" },
  { mainBanner: hero4, mobileBanner: hero4, url: "/product/gawdee-moringa-powder-300-g" },
  { mainBanner: hero5, mobileBanner: hero5, url: "/product/gawdee-mixme-choco-500-g" },
  { mainBanner: hero6, mobileBanner: hero6, url: "/product/gawdee-white-sugar-1kg" },
  { mainBanner: hero7, mobileBanner: hero7, url: "/product/gawdee-bura-sugar-1-kg" },
];

const HERO_API = "/admin/hero-section";

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 1, scale: 1 }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 1, scale: 1 }),
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [heroSlides, setHeroSlides] = useState(fallbackHeroSlides);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const getHeroBanners = async () => {
    try {
      setLoading(true);
      const res = await ApiGet(HERO_API);
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const apiSlides = list
          .filter((item) => item.mainBanner && item.mobileBanner)
          .map((item) => ({
            mainBanner: item.mainBanner,
            mobileBanner: item.mobileBanner,
            url: item.url || "",
          }));
        if (apiSlides.length > 0) {
          setHeroSlides(apiSlides);
          setCurrentSlide(0);
        }
      }
    } catch (error) {
      console.log("Hero section API error:", error);
      setHeroSlides(fallbackHeroSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHeroBanners();
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const slider = setInterval(nextSlide, 5000);
    return () => clearInterval(slider);
  }, [nextSlide, heroSlides.length]);

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handleBannerClick = () => {
    const redirectUrl = heroSlides[currentSlide]?.url;
    if (!redirectUrl) return;
    if (redirectUrl.startsWith("http")) window.open(redirectUrl, "_blank");
    else navigate(redirectUrl);
  };

  return (
    <section className="relative mb-[10px] mt-[80px] md77:mt-[70px] h-[170px] md57:h-[260px] w-full cursor-pointer overflow-hidden bg-white font-Poppins md:mb-[40px] md11:mt-[98px] md77:h-[350px] md83:h-[420px]  md11:h-[490px] md118:h-[510px] md127:h-[530px]  md140:h-[600px] md150:h-[700px]  2xl:mt-[97px]">

      <div onClick={handleBannerClick} className="absolute inset-0 h-full w-full overflow-hidden bg-white">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute inset-0 h-full w-full will-change-transform"
          >
            <img
              src={heroSlides[currentSlide]?.mobileBanner}
              alt={`Hero Mobile Banner ${currentSlide + 1}`}
              draggable={false}
              className="block h-full w-full cursor-pointer select-none object-cover md:hidden"
            />
            <img
              src={heroSlides[currentSlide]?.mainBanner}
              alt={`Hero Banner ${currentSlide + 1}`}
              draggable={false}
              className="hidden h-full w-full cursor-pointer select-none object-cover md:block md11:oject-cover md127:object-cover md:object-contain 2xl:object-bottom 2xl:object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/10 px-3 py-2 backdrop-blur-md md:bottom-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-7 bg-white shadow-md" : "w-2 bg-white/60 hover:bg-white/90"}`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}