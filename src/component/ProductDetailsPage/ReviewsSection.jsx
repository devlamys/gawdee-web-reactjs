/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, X } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Riya Patel",
    role: "Rajkot",
    image: "https://img.freepik.com/free-photo/beautiful-woman-purple-sweater-skirt_1303-17487.jpg?uid=R155200463&ga=GA1.1.1034849637.1766206864&semt=ais_rp_progressive&w=740&q=80",
    rating: 5,
    product: "A2 Gir Cow Ghee",
    short:
      "The aroma, texture, and purity instantly felt different. It genuinely tastes traditional and rich.",
    full:
      "I have tried many ghee brands before, but Gawdee feels far more authentic. The aroma is rich, the texture is smooth, and it reminds me of traditional homemade ghee. I now use it daily for cooking and even with rotis. The quality feels premium and trustworthy.",
  },
  {
    id: 2,
    name: "Nehal Shah",
    role: "Ahmedabad",
    image: "https://img.freepik.com/premium-photo/beautiful-tan-skin-young-girl-posing-camera-dark-background_5095-762.jpg?uid=R155200463&ga=GA1.1.1034849637.1766206864&semt=ais_rp_progressive&w=740&q=80",
    rating: 5,
    product: "Raw Forest Honey",
    short:
      "Pure, natural, and not overly processed. You can actually feel the difference in quality.",
    full:
      "What I loved most about Gawdee honey is that it doesn’t feel overly processed or artificially sweet. It tastes natural, clean, and rich. I use it in warm water every morning and also with desserts. The packaging and overall experience feel very premium.",
  },
  {
    id: 3,
    name: "Meera Joshi",
    role: "Vadodara",
    image: "https://img.freepik.com/premium-photo/indian-woman-blue-blazer-sits-cafe-with-her-hands-her-lap_589208-11.jpg?uid=R155200463&ga=GA1.1.1034849637.1766206864&semt=ais_rp_progressive&w=740&q=80",
    rating: 5,
    product: "Moringa Powder",
    short:
      "Very fresh and clean quality. It blends well and feels like a genuinely thoughtful wellness product.",
    full:
      "I ordered the moringa powder out of curiosity, and I was honestly impressed by the freshness and quality. It blends nicely into smoothies and warm water, and I appreciate that the brand focuses on purity rather than flashy marketing. It feels like a product made with care.",
  },

  {
    id: 4,
    name: "Dhruv Mehta",
    role: "Surat",
    image: "https://img.freepik.com/premium-photo/profile-image-indian-university-student_1161356-77662.jpg?uid=R155200463&ga=GA1.1.1034849637.1766206864&semt=ais_rp_progressive&w=740&q=80",
    rating: 5,
    product: "Date Palm Jaggery",
    short:
      "The taste is deep, natural, and nostalgic. It instantly reminded me of village-style sweetness.",
    full:
      "Gawdee’s date palm jaggery has a depth of taste that is hard to find. It has that nostalgic, caramel-like natural sweetness that reminds me of traditional foods from childhood. I appreciate the authenticity and the premium presentation of the product.",
  },
  {
    id: 5,
    name: "Pooja Desai",
    role: "Mumbai",
    image: "https://img.freepik.com/premium-photo/beautiful-latin-indian-caucasian-fashion-photography-girl-plain-black-tshirt-mockup-isolated_1163492-10772.jpg?uid=R155200463&ga=GA1.1.1034849637.1766206864&semt=ais_rp_progressive&w=740&q=80",
    rating: 5,
    product: "Khapli Flour",
    short:
      "Loved the quality and texture. Feels nourishing and premium at the same time.",
    full:
      "I have been exploring healthier flour options and Gawdee’s khapli flour genuinely stood out. The texture, taste, and freshness feel premium, and it works beautifully in everyday cooking. The brand’s overall promise of natural goodness comes through clearly in the product.",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-[#d4b35f] text-[#d4b35f]" />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const sliderData = [...testimonials, ...testimonials];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <>
      <section className="relative pb-[90px] pt-[40px] lg:pt-20 overflow-hidden ">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#9fc56b]/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d5bf7a]/15 blur-3xl rounded-full" />

        <div className=" mx-auto px-6">
          <div className="text-center max-w-[760px] mx-auto mb-[20px] lg:mb-14">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: false, margin: "-100px" }}
              className="absolute left-[0px] right-0 top-[20px] lg:top-[10px]  md:block text-[42px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
            >
              Testimonials
            </motion.div>
            <h2 className="mt-4 text-[23px] md:text-[50px] leading-[1.05] font-semibold text-[#1d2b1f]">
              Loved By Families Who
              <span className="block text-[#8c7440]">Choose Purity Daily</span>
            </h2>
            <p className="lg:mt-5 mt-2 text-[#667266] text-[12px] lg:text-[15px] lg:leading-7">
              Real words from customers who trust Gawdee for natural goodness,
              authentic taste, and thoughtful quality.
            </p>
          </div>

          <div className="relative">

            <div className="overflow-hidden ">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: 30,
                  repeat: Infinity,
                }}
                className="flex gap-6 w-max pb-[30px]"
              >
                <AnimatePresence mode="popLayout">
                  {sliderData.map((item, index) => (
                    <motion.button
                      key={`${item.id}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 0, }}
                      animate={{ opacity: 1, y: 0, }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      onClick={() => setSelected(item)}
                     className="text-left  min-w-[120px] w-[300px] lg:w-[400px] relative rounded-[20px] lg:rounded-[28px] bg-white/80 backdrop-blur-xl border border-[#e9e2d4] p-4 lg:p-5  shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                <div className="absolute right-6 top-3 w-10 h-10 rounded-full bg-[#eef4df] flex lg:hidden items-center justify-center text-[#7d9850]">
                                     <Quote size={17} />
                                   </div>
                                    <div className="absolute   hidden right-6 top-6 w-12 h-12 rounded-full bg-[#eef4df] lg:flex items-center justify-center text-[#7d9850]">
                                     <Quote size={20} />
                                   </div>

                            <div className="flex items-center gap-4 pr-14">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="lg:w-[62px] lg:h-[62px] w-[45px] h-[45px] rounded-full object-cover border-2 border-[#e6eadf]"
                        />
                        <div>
                          <h3 className=" text-[14px] lg:text-[20px] font-semibold text-[#1d2b1f]">
                            {item.name}
                          </h3>
                          <p className="text-[#7d8476]  text-[12px] lg:text-sm lg:mt-1">{item.role}</p>

                          <div className=" items-center  lg:text-[15px] text-[12px] gap-[10px] flex">
                            <div className="">
                              <Stars count={item.rating} />
                            </div>

                            <div className=" flex-shrink-0 inline-flex px-3 py-1 rounded-full bg-[#f3efe3] text-[#6b5c34] text-[8px] lg:text-xs font-semibold">
                              {item.product}
                            </div>
                          </div>
                        </div>
                      </div>

                                        <p className="lg:mt-5 mt-3 text-[#5d675e] lg:leading-7 text-[13px] lg:text-[15px]">
                        “{item.short}”
                      </p>

                                          <div className="lg:mt-6 mt-2 flex items-center justify-between">
                        <span className="text-[#214726] font-semibold text-sm">
                          Read Full Story
                        </span>
                        <span className="w-8 h-8 rounded-full bg-[#214726] text-white flex items-center justify-center">
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-5"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[920px] rounded-[30px] overflow-hidden bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] grid md:grid-cols-[320px_minmax(0,1fr)]"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-[#eef1ea] text-[#253326] flex items-center justify-center"
              >
                <X size={18} />
              </button>

              <div className="relative bg-gradient-to-br from-[#f1efe5] to-[#edf4e4] lg:p-8 p-5 flex flex-col items-center justify-center">
                <div className="absolute top-8 left-8 text-[#d0d8c4]">
                  <Quote size={42} />
                </div>
                <img
                  src={selected.image}
                  alt={selected.name}
                  className=" w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] rounded-full object-cover border-3 lg:border-4 border-white shadow-xl"
                />

                <h3 className="lg:mt-6 mt-1 text-[20px] lg:text-[28px] font-semibold text-[#1d2b1f] text-center">
                  {selected.name}
                </h3>
                <p className=" mt-0 lg:mt-2 text-[#7b8377] text-center">{selected.role}</p>

                <div className="  lg:mt-5">
                  <Stars count={selected.rating} />
                </div>

                <div className=" mt-2 lg:mt-5 inline-flex px-4 py-2 rounded-full bg-white text-[#6b5c34] text-sm font-semibold shadow-sm">
                  {selected.product}
                </div>
              </div>

              <div className="p-5 md:p-10">
                <p className="text-[#8a966c] uppercase tracking-[0.25em] text-[11px] lg:text-xs font-semibold">
                  Customer Experience
                </p>

                <h4 className="lg:mt-4 mt-1  text-[24px] lg:text-[30px] leading-[1.12] font-semibold text-[#1d2b1f]">
                  Why They Trust Gawdee
                </h4>

                <p className=" mt-2 lg:mt-6 text-[#5b665d] lg:leading-8 text-[14px] lg:text-[16px]">
                  {selected.full}
                </p>

                <div className=" mt-3 lg:mt-8 lg:pt-6 border-t border-[#ece7dc] flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-[#f5f1e7] text-[#6d5d36] text-sm font-medium">
                    Natural Goodness
                  </span>
                  <span className="px-4 py-2 rounded-full bg-[#eef4e3] text-[#4f6a32] text-sm font-medium">
                    Trusted Quality
                  </span>
                  <span className="px-4 py-2 rounded-full bg-[#f3efe7] text-[#735f37] text-sm font-medium">
                    Authentic Taste
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}