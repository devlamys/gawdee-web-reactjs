/* Developed by Grafizen International PVT. LTD. */
"use client";
import React from "react";
import { motion } from "framer-motion";
import heroCake from "../../../public/imges/feturedCake/blackforest.jpg";
import cake1 from "../../../public/imges/feturedCake/ChocolatePancakeStack.jpg";
import cake2 from "../../../public/imges/feturedCake/ChocolateTiramisu.jpg";
import cake3 from "../../../public/imges/feturedCake/StrawberryDream.jpg";

export default function PremiumChocolateSection() {
  return (
    <section className="relative bg-[#3a1f14] overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[120px] bg-[#f3d39b] rounded-b-[80px]"></div>

      <div className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#f3d39b] leading-tight">
              Cakes That <br /> Celebrate Life
            </h2>

            <p className="text-gray-300 mt-6 leading-relaxed">
              Fresh ingredients, handcrafted perfection & luxurious flavors.
              Every cake is baked with love and detailed artistry.
            </p>

            <div className="flex gap-4 mt-8">
              {[cake1, cake2, cake3].map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  className="w-20 h-20 rounded-xl object-cover border border-[#f3d39b]"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src={heroCake.src}
              className="rounded-3xl shadow-2xl"
              alt="Hero Cake"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}