/* Developed by Grafizen International PVT. LTD. */
"use client";
import React from "react";

import aboutCake from "../../../public/imges/Products/webEx/aboutUs.png";
import Ghee from "../../../public/imges/abouts/ghee.png"
import honey from "../../../public/imges/abouts/honey.png"
import Wellness from "../../../public/imges/abouts/wellness.png"
import MainBanner from "../../../public/imges/abouts/mainBanner.jpg"
import BackImage1 from "../../../public/imges/abouts/BackTree.png"
import BackImage2 from "../../../public/imges/abouts/Cow.png"
import { FaYoutube } from "react-icons/fa";

import { X } from "lucide-react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreativeAboutSection() {

  const [activeCard, setActiveCard] = useState(null);
  return (
    <section className="relative px- md77:px-0 md83:px-10 lg:pb-20 pb-[10px] lg:w-full w-[90%] mx-auto pt-[20px] lg:pt-[100px] lg:overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-20 left-20 w-32 h-32 bg-[#0c776b]/30 rounded-full blur-3xl"
      />

      <div className=" w-[800px] absolute hidden lg:flex bottom-0 right-0 z-10">
        <img src={BackImage1} />
      </div>

      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-[#0c776b]/30 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div

          className="lg:mb-10  mb-7 relative"
        >

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute w-fit md:w-full left-0 right-0 lg:mx-0 mx-auto lg:-left-5 top-[-30px] lg:top-[-70px]  md:block text-[42px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            About
          </motion.div>
          <h2 className=" text-[24px]  text-center lg:text-left leading-[27px] lg:leading-normal lg:text-5xl font-[600] text-gray-900">
            Rooted In Purity, Inspired By Nature
          </h2>
          <p className=" mt-2 lg:mt-6 md:text-left text-center  text-[12px] lg:text-lg text-gray-600 max">
            At Gawdee, we bring you a wholesome journey from earth to plate with
            pure A2 Gir Cow Ghee, natural honey, grain foods, and wellness
            products made with care, authenticity, and village-inspired goodness.
          </p>
        </motion.div>

        <div className=" flex md77:w-full w-fit    mx-auto lg:mx-0  lg:grid justify-between  lg:grid-cols-2  gap-[34px] md77:gap-[20px] md11:gap-20 items-center">
          <motion.div

            className="relative md77:w-full w-[220px]"
          >
            <div className="absolute lg:-top-6  -top-3  p-[2.3px] lg:p-[4px] lg:-left-6    -left-3 w-full h-full rounded-3xl bg-gradient-to-br from-[#0c776b] to-[#05655a]">
              <div className="w-[100%] h-[100%] rounded-[20px] bg-white"></div>
            </div>

            <motion.img
              whileHover={{ scale: 1.05 }}
              src={MainBanner}
              className="relative rounded-2xl lg:rounded-3xl shadow-2xl object-cover md11:w-[600px] h-[220px] md11:h-[500px] md77:h-[300px] md77:w-[500px]"
              alt="About Gawdee"
            />
            <motion.div
              className="absolute lg:block hidden -bottom-6 left-10 bg-white shadow-xl px-6 py-4 rounded-2xl"
            >
              <h4 className="text-2xl font-bold text-[#0c776b]">100% Pure</h4>
              <p className="text-sm text-gray-600">Natural & Authentic Goodness</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-3 lg:space-y-10"
          >
            {[
              {
                icon: Ghee,
                title: "Pure A2 Gir Cow Ghee",
                desc: "Crafted from Gir cow milk with a focus on purity, traditional nourishment, and rich village-style aroma.",
              },
              {
                icon: honey,
                title: "Natural Honey & Grain Foods",
                desc: "From raw forest honey to wholesome grain foods, every product is chosen to support a healthier daily lifestyle.",
              },
              {
                icon: Wellness,
                title: "Nature-Led Wellness Philosophy",
                desc: "Our philosophy is rooted in balanced feed, natural surroundings, and mindful sourcing that keeps wellness close to nature.",
              },
            ].map((item, i) => (
              <React.Fragment key={i}>

                <motion.div
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setActiveCard(i)}
                  className="backdrop-blur-lg bg-white/70 lg:border md77:p-3 gap-3 rounded-2xl shadow-lg w-fit md77:flex lg:gap-6 items-start transition cursor-pointer"
                >

                  <div className="w-[60px] h-[60px]  md77:w-[45px] md77:h-[45px]  md11:w-[60px] md11:h-[60px]  bg-gradient-to-br p-[13px] flex-shrink-0 from-[#0c776b] to-[#05655a] rounded-xl flex items-center justify-center text-white shadow-md">

                    <img
                      src={item.icon}
                      className="w-full h-full object-contain"
                      alt={item.title}
                    />
                  </div>

                  <div className="hidden md77:block">

                    <h4 className=" text-[14px] md11:text-xl font-semibold text-gray-900">
                      {item.title}
                    </h4>

                    <p className="text-gray-600 text-[13px] md77:text-[12px] md11:text-[15px] md77:leading-[13px] md11:leading-5 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {activeCard === i && (
                    <>

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 80,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 50,
                          scale: 0.92,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="fixed  left-0 right-0 mx-auto top-[28%] z-[1000] w-[90%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 lg:hidden"
                      >

                        <div className="relative overflow-hidden rounded-[15px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

                          <div className="absolute right-[-50px] top-[-50px] h-[140px] w-[140px] rounded-full bg-green-100 blur-3xl" />

                          <button
                            onClick={() => setActiveCard(null)}
                            className="absolute right-4 top-4 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gray-100"
                          >
                            <X
                              size={16}
                              className="text-gray-700"
                            />
                          </button>

                          <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#0c776b] to-[#05655a] shadow-[0_15px_40px_rgba(34,197,94,0.25)]">

                            <img
                              src={item.icon}
                              className="h-[32px] w-[32px] object-contain"
                              alt={item.title}
                            />
                          </div>

                          <div className="relative mt-2">

                            <h3 className="text-[24px] leading-[1.2] font-[700] tracking-[-1px] text-gray-900">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-[14px] leading-[] text-gray-600">
                              {item.desc}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center gap-2 rounded-[16px] bg-green-50 px-4 py-2">

                            <div className="h-[8px] w-[8px] rounded-full bg-[#0c776b] animate-pulse" />

                            <span className="text-[13px] font-medium text-[#0c776b]">
                              Pure • Natural • Traditional
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}