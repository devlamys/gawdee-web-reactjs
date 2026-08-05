/* Developed by Grafizen International PVT. LTD. */
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";

import productMain1 from "../../../public/imges/Products/Ghee/1-ltr-Front.png";
import thumb1 from "../../../public/imges/Products/Ghee/1-ltr-Front.png";
import honeyvec from "../../../public/imges/healthSection/honeyvector.png";
import { ApiGet } from "@/helper/axios";
import { useNavigate } from "react-router-dom";

const getProductImage = (product, fallbackImage) => {
  const image =
    product?.featuredImage?.url ||
    product?.featuredImage?.secure_url ||
    product?.featuredImage ||
    product?.images?.[0]?.url ||
    product?.images?.[0]?.secure_url ||
    product?.images?.[0] ||
    product?.image?.url ||
    product?.image?.secure_url ||
    product?.image;

  if (!image || typeof image !== "string") {
    return fallbackImage;
  }

  return image;
};

export default function HealthyProductCategories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredSection, setFeaturedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedSection = async () => {
      try {
        const res = await ApiGet(`/admin/featured`);
        console.log('res', res)
        const result = await res;

        const data = result?.data || result;

        setFeaturedSection(data);
      } catch (error) {
        console.error("Featured section fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSection();
  }, []);

  const products = useMemo(() => {
    if (!featuredSection?.products?.length) return [];

    console.log('featuredSection.products', featuredSection.products)

    return featuredSection.products.map((item, index) => {
      const product = item.productId;
      console.log('product dsgfsdgdsg', product)

      return {
        id: item._id?.$oid || item._id || index,

        productId:
          product?._id ||
          product?.$oid ||
          product,

        slug: product?.slug || product?._id || product?.$oid || product,

        title: item.tag || product?.name || "Featured Product",
        sub: item.label || product?.description || "",

        price: product?.price
          ? `RS. ${product.price}`
          : product?.variants?.[0]?.price
            ? `RS. ${product.variants[0].price}`
            : "",

        stock: "PURE & NATURAL",
        badge: index === 0 ? "BESTSELLER" : index === 1 ? "POPULAR" : "FEATURED",

        mainImage: getProductImage(product, productMain1),

        thumb: getProductImage(product, thumb1),

        accent:
          index === 0
            ? "#d7c37a"
            : index === 1
              ? "#7a8f2a"
              : "#4f7a2e",
      };
    });
  }, [featuredSection]);

  console.log("products of featured Section", products);

  useEffect(() => {
    if (!products.length) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [products.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [products.length]);

  if (loading) {
    return null;
  }

  if (!featuredSection?.visible || !products.length) {
    return null;
  }

  const activeProduct = products[activeIndex];

  return (
    <section className="relative overflow-hidden pt-[60px] lg:pt-32 pb-[70px] bg-[#071b0d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,181,72,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(215,195,122,0.12),transparent_30%)]" />

      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute -top-10 left-10 w-[260px] h-[260px] rounded-full bg-green-400/10 blur-[110px]"
      />

      <div className="w-[350px] absolute lg:opacity-100 opacity-[0.2] bottom-0 right-0">
        <img className="w-[100%]" src={honeyvec} alt="Honey Vector" />
      </div>

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-[#d7c37a]/10 blur-[130px]"
      />

      <div className="relative md127:pl-[100px]">
        <div className="flex mx-auto w-[90%] lg:w-[80%] md:flex-row   items-center flex-col gap-[20px] lg:gap-14">

          <div className="relative w-fit mx-auto lg:mx-0">
            <div className="relative w-[350px] lg:w-[380px] rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden min-h-[390px] lg:min-h-[520px] p-5 lg:p-8 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(255,255,255,0.02))]" />

              <div className="relative z-10 flex lg:mb-[28px] items-start justify-between">
                <div>
                  <p className="text-[#9dbb6c] uppercase tracking-[0.25em] text-[10px]">
                    Featured Product
                  </p>

                  <h2 className="mt-[7px] lg:mt-4 text-white text-[15px] lg:text-[30px] font-semibold leading-[1.05]">
                    Pure Wellness
                    <span className="block text-[#d7c37a]">From Nature</span>
                  </h2>
                </div>

                <div className="text-right">
                  <span className="inline-flex px-3 py-1 rounded-full text-[8px] lg:text-[11px] font-semibold bg-[#d7c37a] text-[#1b210b]">
                    {activeProduct.badge}
                  </span>
                </div>
              </div>

              <div className="relative flex-1 flex items-center justify-center">
                <motion.div
                  key={`accent-${activeProduct.id}`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute w-[0px] h-[300px] rounded-full blur-[90px]"
                  style={{ backgroundColor: `${activeProduct.accent}40` }}
                />

                <motion.div
                  key={`ring-${activeProduct.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="absolute lg:w-[280px] w-[250px] h-[250px] lg:h-[280px] rounded-full border border-white/10"
                />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeProduct.id}
                    src={activeProduct.mainImage}
                    alt={activeProduct.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = productMain1;
                    }}
                    initial={{
                      opacity: 0,
                      y: 40,
                      rotate: -4,
                      scale: 0.88,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -30,
                      rotate: 4,
                      scale: 0.92,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className="relative z-10 w-[260px] lg:w-[320px] object-contain drop-shadow-[0_35px_70px_rgba(0,0,0,0.55)]"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="relative ">
            <div className="absolute -left-4 top-[-20px] hidden md:block text-[92px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:1px_rgba(172,198,110,0.08)] leading-none select-none pointer-events-none">
              Featured
            </div>

            <div className="relative md:block hidden z-10 pt-6">
              <p className="text-[#9dbb6c] uppercase tracking-[0.35em] text-xs">
                {featuredSection.title}
              </p>

              <h3 className="mt-4 text-white md:text-[36px] leading-[1.02] font-semibold max-w-[700px]">
                Our Featured
                <span className="block text-[#d7c37a]">Natural Essentials</span>
              </h3>

              <p className="mt-3 text-[#9fb48f] max-w-[660px] text-[13px] leading-[22px]">
                {featuredSection.description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${activeProduct.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="relative z-10 lg:mt-10 md77:mt-[20px]  lg:w-full w-[90%] lg:mx-0 mx-auto md77:mx-0 rounded-[20px] border border-[#fff]/60 lg:border-white/10 bg-white/[0.05] backdrop-blur-2xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between lg:gap-5">
                  <div>
                    <h4 className="text-white  text-[20px] lg:text-[26px] font-semibold leading-none">
                      {activeProduct.title}
                    </h4>

                    <p className="text-white/70 text-[11px] lg:text-[12px] mt-1 max-w-[480px]">
                      {activeProduct.sub}
                    </p>
                  </div>

                  <div className="hidden lg:flex  items-center gap-3">
                    <span className="bg-[#d7c37a] text-[#17200b] text-[10px] font-semibold px-3 py-1 rounded-full">
                      {activeProduct.badge}
                    </span>

                    <button className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-white/80 hover:text-white transition">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 grid md:grid-cols-[1fr_auto] gap-[10px] lg:gap-6 items-end">
                  <div>
                    <p className="text-[#8fc56a] uppercase text-xs tracking-[0.2em]">
                      {activeProduct.stock}
                    </p>

                    {activeProduct.price && (
                      <div className="mt-2">
                        <p className="text-white/45 text-[10px]">
                          Featured Price
                        </p>

                        <p className="text-[#f4e48e] text-[20px] font-semibold mt-1 leading-none">
                          {activeProduct.price}
                        </p>
                        <div className="flex lg:hidden absolute right-[20px]  top-[48%] items-center gap-3">
                          <span className="bg-[#d7c37a] text-[#17200b] text-[10px] font-semibold px-3 py-1 rounded-full">
                            {activeProduct.badge}
                          </span>

                          <button className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-white/80 hover:text-white transition">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        if (!activeProduct?.slug) return;
                        navigate(`/product/${activeProduct.slug}`);
                      }}
                      className="px-4 w-fit py-2 rounded-full border border-white/10 bg-white/[0.04] text-white font-medium flex text-[14px] items-center gap-2 hover:bg-white/[0.08] transition"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 mt-10">
              <div className="flex overflow-x-auto items-center gap-4 no-scrollbar">
                {products.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveIndex(i)}
                    animate={{
                      scale: activeIndex === i ? 1 : 0.92,
                      opacity: activeIndex === i ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-[10px] lg:rounded-2xl min-w-[100px] flex-shrink-0 border px-2 py-2 ${activeIndex === i
                      ? "border-[#d7c37a]/60 bg-white/[0.07]"
                      : "border-white/10 bg-white/[0.03]"
                      }`}
                  >
                    <div
                      className="absolute inset-0 rounded-[10px]  lg:rounded-2xl backdrop-blur-[30px] opacity-80"
                      style={{
                        backgroundColor:
                          activeIndex === i ? `${item.accent}22` : "transparent",
                      }}
                    />

                    <div className="relative flex lg:flex-row flex-col items-center gap-3">
                      <img
                        src={item.thumb}
                        alt={item.title}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = thumb1;
                        }}
                        className="lg:w-[60px] w-[60px] h-[60px] lg:h-[60px] object-contain"
                      />

                      <div className="text-left sm:block">
                        <p className="text-white text-[12px] lg:text-sm font-medium leading-none">
                          {item.title}
                        </p>

                        <p className="text-white/45 text-[10px] lg:text-xs lg:mt-2">
                          {item.badge}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 h-[3px] w-full max-w-[520px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${((activeIndex + 1) / products.length) * 100}%`,
                  }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#8fb760] via-[#d7c37a] to-[#8fb760]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}