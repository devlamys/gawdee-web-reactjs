/* Developed by Albiruni Technologies */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../../public/imges/independence-day-offer-banner-v1.png";

export default function IndependencePromoBanner() {
  const navigate = useNavigate();

  return (
    <div className="w-[94%] md:w-[90%] 2xl:w-[1400px] mx-auto mt-8 md:mt-14 mb-8">
      {/* Section Heading & Subtitle */}
      <div className="lg:mb-8 mx-auto relative mb-6">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 0.7 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-80px" }}
          className="absolute w-fit mx-auto left-0 right-0 top-[-25px] lg:top-[-65px] block text-[38px] lg:text-[120px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.22)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
        >
          Special Offer
        </motion.div>

        <h2 className="text-[26px] md:text-4xl lg:text-5xl text-center font-[600] text-gray-900 tracking-tight">
          Healthy Combos, Greater Savings
        </h2>

        <p className="lg:mt-3 mt-1.5 justify-center text-center w-fit mx-auto text-gray-600 text-[12px] md:text-base lg:text-lg max-w-[700px] px-2 font-medium">
          Celebrate freedom with pure wellness — Enjoy Flat 10% OFF on all natural organic products with code <span className="font-bold text-[#0c776b]">FREEDOM10</span>.
        </p>
      </div>

      {/* Banner Graphic Image */}
      <div
        onClick={() => navigate("/all-products")}
        className="relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl shadow-lg border border-orange-100/60 transition-all duration-300 hover:shadow-2xl"
      >
        <img
          src={bannerImg}
          alt="Independence Day Offer - Flat 10% OFF | Code FREEDOM10"
          className="w-full h-auto object-cover block rounded-2xl md:rounded-3xl transition-transform duration-500 group-hover:scale-[1.008]"
        />
      </div>
    </div>
  );
}
