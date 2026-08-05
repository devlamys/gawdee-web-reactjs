/* Developed by Grafizen International PVT. LTD. */

"use client";
import React from "react";
import { motion } from "framer-motion";
import blackForest from "../../../public/imges/feturedCake/blackforest.jpg"
import chocolatepanCake from "../../../public/imges/feturedCake/ChocolatePancakeStack.jpg"
import ChocolateTiramisu from "../../../public/imges/feturedCake/ChocolateTiramisu.jpg"
import StrawberryDream from "../../../public/imges/feturedCake/StrawberryDream.jpg"
import NutellaLava from "../../../public/imges/feturedCake/NutellaLava.jpg"

const desserts = [
  {
    id: 1,
    name: "Blackforest Cake",
    image: blackForest,
    price: "₹499",
    desc: "Rich cocoa layers blended with fresh cream, strawberries & premium chocolate.",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Chocolate Pancake Stack",
    image: chocolatepanCake,
    price: "₹399",
    desc: "Soft fluffy pancakes topped with strawberries & dark chocolate drizzle.",
    tag: "Trending",
  },
  {
    id: 3,
    name: "Chocolate Tiramisu",
    image: ChocolateTiramisu,
    price: "₹549",
    desc: "Classic Italian dessert infused with creamy mascarpone & cocoa.",
    tag: "Premium",
  },
  {
    id: 4,
    name: "Strawberry Dream Cake",
    image: StrawberryDream,
    price: "₹459",
    desc: "Fresh strawberry layers with whipped vanilla cream & soft sponge.",
    tag: "Fresh",
  },

];

const container = {
  hidden: ,
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FeturedSection() {
  return (
    <section className="w-full pt-20 pb-[140px] bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 relative ">

      <div className=" max-w-7xl mx-auto mb-10">
        <h2 className="text-4xl md:text-5xl font-Cake font-[700] text-gray-800">
          Love at First Bite ✨
        </h2>
        <p className="text-gray-500 mt-4 font-Rose text-lg">
          Crafted with passion. Served with sweetness.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto   flex gap-3 w-fit"
      >
        {desserts.map((item) => (
          <motion.div
            key={item.id}
            variants={cardAnim}
            whileHover={{ y: -15 }}
            className="relative group w-[280px] rounded-3xl backdrop-blur-lg bg-white/70 shadow-xl border border-white/30 overflow-hidden transition-all duration-300"
          >

            <div className="relative h-[0px] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out rounded-[19px]"
              />

              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-4 py-1 rounded-full shadow-lg animate-pulse">
                {item.tag}
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between h-[190px]">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center w-[90%]   absolute bottom-4">

                <button className="px-4 cursor-target py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-md hover:scale-105 transition duration-300">
                  Order Now
                </button>

              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-pink-400/10 to-purple-400/10 pointer-events-none"></div>

          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-[-20px] z-[400] left-0 w-full h-[80px] flex bg-[#ffffff] rounded-t-[80px]"></div>
    </section>
  );
}