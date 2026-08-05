/* Developed by Grafizen International PVT. LTD. */
"use client";

import React from "react";
import { motion } from "framer-motion";
import banner1 from "../../../public/imges/banner/banner1.jpg";

export default function OfferBanner() {
  return (
    <section className="relative my-[60px] cursor-pointer cursor-target w-[1100px] mx-auto overflow-hidden rounded-[30px]">

      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "-100%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="absolute inset-0 bg-pink-600 z-20"
      />

      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "100%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="absolute inset-0 bg-pink-700 z-10"
      />

      <motion.img
        src={banner1}
        alt="Offer Banner"
        initial={{ scale: 1.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true, amount: 0.5 }}
        className="w-full rounded-[30px]"
      />
    </section>
  );
}