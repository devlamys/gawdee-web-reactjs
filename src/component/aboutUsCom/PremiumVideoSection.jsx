/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Play,
    ShoppingCart,
    ExternalLink,
    X,
} from "lucide-react";
import backImage from "../../../public/imges/productcategores/backGroundImage1.jpg"
import powder1 from "../../../public/imges/Products/webEx/powder1.png";
import powder2 from "../../../public/imges/Products/webEx/powder2.png";
import powder3 from "../../../public/imges/Products/webEx/powder3.png";
import powder4 from "../../../public/imges/Products/webEx/powder4.png";
import ghee1 from "../../../public/imges/Products/webEx/ghee1.png";
import honey1 from "../../../src/../public/imges/Products/webEx/honey.png"
import BackImage1 from "../../../public/imges/reelsection/nature_767194-516.png"
import vectors1 from "../../../public/imges/aboutus/vectors1.png"
import garssBack from "../../../public/imges/aboutus/grass9.jpg"

const reels = [
    {
        id: 1,
        title: "There’s",
        subtitle: "Village Story",
        poster: backImage,
        video: "/videos/reels/reel1.mp4",
        description:
            "A behind-the-scenes glimpse into how natural goodness is nurtured with care, tradition, and patience before it reaches your kitchen.",
        products: [
            {
                id: 101,
                title: "Khapli Atta",
                price: 2278,
                image: powder1,
                cta: "ADD TO CART",
            },
        ],
    },
    {
        id: 2,
        title: "Making Of Home-Like Desi A2 Ghee",
        poster: backImage,
        video: "/videos/reels/reel2.mp4",
        description:
            "Watch the making of our home-style A2 ghee inspired by village methods, slow preparation, and authentic nourishment.",
        products: [
            {
                id: 102,
                title: "A2 Gir Cow Ghee",
                price: 3370,
                image: powder2,
                cta: "ADD TO CART",
            },
        ],
    },
    {
        id: 3,
        title: "859+ You’ll Ask For It",
        poster: backImage,
        video: "/videos/reels/reel3.mp4",
        description:
            "A quick feature reel highlighting one of our most loved pantry essentials crafted for purity and taste.",
        products: [
            {
                id: 103,
                title: "Khapli Flour",
                price: 1745,
                image: honey1,
                cta: "ADD TO CART",
            },
        ],
    },
    {
        id: 4,
        title: "Amlaprash",
        poster: backImage,
        video: "/videos/reels/reel4.mp4",
        description:
            "A vibrant reel featuring our traditional wellness-inspired preparation made from carefully selected ingredients.",
        products: [
            {
                id: 104,
                title: "Amlaprash",
                price: 1960,
                image: ghee1,
                cta: "ADD TO CART",
            },
        ],
    },
    {
        id: 5,
        title: "Date Palm Story",
        poster: backImage,
        video: "/videos/reels/reel5.mp4",
        description:
            "Tapped from local date palm trees and crafted with care, our date palm jaggery is pure winter nostalgia. Fresh sap is slow-cooked over traditional heat to preserve its caramel-like sweetness and rich mineral depth.",
        products: [
            {
                id: 105,
                title: "Date Palm Jaggery Solid",
                price: 895,
                image: ghee1,
                cta: "ADD TO CART",
            },

        ],
    },
    {
        id: 6,
        title: "Low GI",
        poster: backImage,
        video: "/videos/reels/reel6.mp4",
        description:
            "A clean product-focused reel presenting our low GI range in a premium and informative format.",
        products: [
            {
                id: 107,
                title: "Low GI Sugar",
                price: 1686,
                image: "/imges/products/low-gi.png",
                cta: "ADD TO CART",
            },
        ],
    },
    {
        id: 7,
        title: "Customer Love",
        poster: backImage,
        video: "/videos/reels/reel7.mp4",
        description:
            "Real reactions and product love from customers who trust Gawdee for purity, nutrition, and honest ingredients.",
        products: [
            {
                id: 108,
                title: "A2 Gir Cow Ghee",
                price: 3370,
                image: "/imges/products/ghee-jar.png",
                cta: "ADD TO CART",
            },
        ],
    },
];

function ProductStripCard({ products, compact = false }) {

    const visible = products.slice(0, 2);

    return (
        <div
            className={`bg-white/80 backdrop-blur-md border border-[#e7e7e7] shadow-[0_12px_28px_rgba(0,0,0,0.12)] rounded-2xl ${compact ? "p-3" : "p-4"
                }`}
        >
            <div className="flex flex-col gap-3">

                {visible.map((product, idx) => (
                    <div
                        key={product.id}
                        className={`flex items-center gap-3 ${idx !== visible.length - 1 ? "pb-3 border-b border-[#ececec]" : ""
                            }`}
                    >

                        <div className="w-[56px] h-[56px] rounded-full bg-[#f6f6f6] flex items-center justify-center border border-[#e6e6e6]">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-[38px] h-[38px] object-contain"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[#2a2a2a] leading-snug line-clamp-2">
                                {product.title}
                            </p>

                            <p className="text-[15px] font-semibold text-[#1e4b2c] mt-[2px]">
                                ₹ {product.price}
                            </p>
                        </div>

                        <button className="w-9 h-9 rounded-full bg-[#f0f0f0] hover:bg-[#e3e3e3] flex items-center justify-center transition">
                            <ExternalLink size={14} />
                        </button>

                    </div>
                ))}

                {visible.length === 1 ? (
                    <div className="grid grid-cols-[1fr_48px] gap-2 pt-1">
                        <button
                            className={`h-8 rounded-md text-white text-[13px] font-semibold transition ${visible[0].soldOut
                                ? "bg-gray-400"
                                : "bg-[#1f4c2c] hover:bg-[#16381f]"
                                }`}
                        >
                            {visible[0].soldOut ? "SOLD OUT" : visible[0].cta || "ADD TO CART"}
                        </button>

                        <button className="h-8 rounded-md text-[#1f4c2c]   flex items-center border border-[#16381f] justify-center hover:bg-[#16381f] hover:text-[#ffffff] transition">
                            <ShoppingCart size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {visible.map((product) => (
                            <button
                                key={product.id}
                                className={`h-10 rounded-xl text-white text-[12px] font-semibold transition ${product.soldOut
                                    ? "bg-gray-400"
                                    : "bg-[#1f4c2c] hover:bg-[#16381f]"
                                    }`}
                            >
                                {product.soldOut ? "SOLD OUT" : product.cta || "ADD TO CART"}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

function ReelCard({ item, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="relative shrink-0 w-[200px] md:w-[230px]"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
        >
            <div
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative h-[380px] rounded-[20px] overflow-hidden cursor-pointer group"
            >

                <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-b from-green-400/60 via-transparent to-yellow-300/60 opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-black">

                    {hovered ? (
                        <video
                            src={item.video}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={item.poster}
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition duration-500"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

                    <div className="absolute top-4 left-4 right-4">
                        <p className="text-white text-[13px] font-semibold uppercase tracking-wide leading-tight">
                            {item.title}
                        </p>
                    </div>

                    {!hovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition">
                                <Play size={20} fill="white" />
                            </div>
                        </div>
                    )}

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={hovered ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute bottom-4 left-4 right-4"
                    >
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg">

                            <img
                                src={item.products[0]?.image}
                                className="w-9 h-9 object-contain"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium truncate">
                                    {item.products[0]?.title}
                                </p>
                                <p className="text-[13px] font-semibold text-[#0c776b] ">
                                    ₹ {item.products[0]?.price}
                                </p>
                            </div>

                            <button className="bg-[#0c776b]  text-white text-[11px] px-3 py-1 rounded-full hover:bg-green-800 transition">
                                ADD
                            </button>

                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
}

export default function PremiumVideoSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    const activeItem = useMemo(
        () => (activeIndex !== null ? reels[activeIndex] : null),
        [activeIndex]
    );

    const openModal = (index) => setActiveIndex(index);
    const closeModal = () => setActiveIndex(null);

    const prevSlide = () => {
        if (activeIndex === null) return;
        setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + reels.length) % reels.length));
    };

    const nextSlide = () => {
        if (activeIndex === null) return;
        setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % reels.length));
    };

    const leftPreview =
        activeIndex !== null ? reels[(activeIndex - 1 + reels.length) % reels.length] : null;
    const rightPreview =
        activeIndex !== null ? reels[(activeIndex + 1) % reels.length] : null;

    return (
        <>
            <section className="relative py-24 overflow-hidden ">

                <motion.div

                    className="absolute top-[50px]  opacity-[0.4]  hidden md:block"
                >
                    <img src={garssBack} className="w-full  h-[650px]" />
                </motion.div>

                <div className="relative max-w-[1800px] mx-auto px-4 md:px-8">

                    <div className=" mb-7 lg:mb-12 relative text-center">

                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 0.5 }}
                            transition={{ duration: 0.9 }}
                            className="absolute left-0 right-0 top-[-70px]  md:block text-[110px] lg:text-[140px] font-semibold uppercase text-transparent 
        [-webkit-text-stroke:2px_rgba(90,110,40,0.2)] leading-none pointer-events-none 
        [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                        >
                            WHY
                        </motion.div>

                        <h2 className="text-[36px] md:text-[48px] font-[700] text-[#4f5d1f] leading-tight">
                            From Nature to Your Plate
                        </h2>

                        <p className="text-[#6b6f63] mt-3 text-[15px]">
                            Watch purity in motion — real stories, real food
                        </p>

                    </div>

                    <div className="flex gap-6 overflow-x-auto py-[10px] no-scrollbar pb-16 px-2">
                        {reels.map((item, index) => (
                            <ReelCard
                                key={item.id}
                                item={item}
                                onClick={() => openModal(index)}
                            />
                        ))}
                    </div>

                </div>
            </section>
            <AnimatePresence>
                {activeItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/80"
                    >

                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center"
                        >
                            <X size={22} />
                        </button>

                        <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory">

                            {reels.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="min-h-screen w-full flex items-center justify-center snap-start"
                                >

                                    <div className="relative w-[360px] h-[640px] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                                        <video
                                            src={item.video}
                                            poster={item.poster}
                                            className="w-full h-full object-cover"
                                            autoPlay={activeIndex === index}
                                            loop
                                            muted
                                            playsInline
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                                        <div className="absolute bottom-24 left-4 right-4 text-white">
                                            <h3 className="text-lg font-semibold">{item.title}</h3>
                                            <p className="text-sm opacity-80 line-clamp-2">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="absolute left-3 right-3 bottom-3">
                                            <ProductStripCard products={item.products} />
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}