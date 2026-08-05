/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import powder1 from "../../../public/imges/Products/webEx/powder1.png";
import powder2 from "../../../public/imges/Products/webEx/powder2.png";
import powder3 from "../../../public/imges/Products/webEx/powder3.png";
import powder4 from "../../../public/imges/Products/webEx/powder4.png";
import ghee1 from "../../../public/imges/Products/webEx/ghee1.png";
import honey1 from "../../../src/../public/imges/Products/webEx/honey.png"
import backImage from "../../../public/imges/aboutus/backCombo.jpg"
import tagImage from "../../../public/imges/aboutus/tagCombo.png"
import bestBuy from "../../../public/imges/aboutus/bestbuy.png"

const combos = [
    {
        id: 1,
        title: "Pure Village Combo Pack",
        desc: "A curated set of traditional essentials crafted with purity and care.",
        price: 2999,
        oldPrice: 3999,
        image: honey1,
        features: [
            "100% Natural Ingredients",
            "No Chemicals",
            "Farm Fresh Quality",
        ],
    },
    {
        id: 2,
        title: "Healthy Living Combo",
        desc: "Daily nutrition combo to boost your healthy lifestyle naturally.",
        price: 2499,
        oldPrice: 3299,
        image: ghee1,
        features: [
            "Rich in Nutrients",
            "Immunity Booster",
            "Pure & Authentic",
        ],
    },
    {
        id: 3,
        title: "Premium Gawdee Combo",
        desc: "Experience luxury wellness with our premium natural selection.",
        price: 3499,
        oldPrice: 4499,
        image: honey1,
        features: [
            "Premium Quality",
            "Traditional Process",
            "Best Seller Pack",
        ],
    },
];

export default function ComboSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % combos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const item = combos[index];

    return (
        <>

            <section className="relative !mx-auto py-[40px] pr-[20px] mb-[80px] pl-[10px] max-w-[1200px] w-fit overflow-hidden bg-gradient-to-r from-[#0c776b]  to-green-600 text-white rounded-[30px]">

                <div className=" absolute top-0 left-0">
                    <img src={backImage} className=" w-[100%] object-contain" />
                </div>

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-white/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-yellow-200/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 80 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6  pl-[30px] py-[10px] rounded-[20px]  backdrop-blur-[10px] bg-black/0"
                        >
                                     <div className=" absolute flex z-8 top-[-40px] ">
                    <img src={bestBuy} className="  w-[200px] object-contain" />
                </div>

                            <span className="inline-block px-4  relative bottom-[-10px] py-1 bg-white/10 border border-white/20 rounded-full text-sm backdrop-blur">
                                Gawdee Combo
                            </span>

                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                {item.title}
                            </h2>

                            <p className="text-white/80 text-[15px] max-w-md leading-relaxed">
                                {item.desc} Crafted using traditional methods and sourced directly from nature, this combo ensures purity in every bite.
                            </p>

                            <div className="space-y-2 text-sm">
                                {item.features.map((f, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                    >
                                        ✔ {f}
                                    </motion.p>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 pt-4">

                                <div>
                                    <p className="text-sm line-through text-white/50">
                                        ₹ {item.oldPrice}
                                    </p>
                                    <p className="text-3xl font-bold">
                                        ₹ {item.price}
                                    </p>
                                </div>

                                <button className="px-6 py-3 bg-white text-[#0c776b]  font-semibold rounded-full hover:scale-105 transition shadow-lg">
                                    Buy Combo
                                </button>

                            </div>

                        </motion.div>
                    </AnimatePresence>

                    <div className="relative flex justify-center">

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={item.image}
                                src={item.image}
                                alt={item.title}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                transition={{ duration: 0.6 }}
                                className=" top-[-210px] right-[85px] absolute w-[220px] border-white  md:w-[190px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                            />
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={item.image}
                                src={item.image}
                                alt={item.title}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                transition={{ duration: 0.6 }}
                                className=" top-[-103px] left-[10px] absolute w-[150px] border-white  md:w-[150px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                            />
                        </AnimatePresence>

                    </div>

                </div>

                <div className="flex justify-center absolute mt-10 gap-3">
                    {combos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-3 h-3 rounded-full transition ${i === index ? "bg-white scale-125" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>

            </section>

        </>
    );
}