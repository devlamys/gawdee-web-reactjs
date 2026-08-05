/* Developed by Grafizen International PVT. LTD. */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import naturel from "../../../public/imges/whyChooseUs/natural.png"
import family from "../../../public/imges/whyChooseUs/family.png"
import chemicalFree from "../../../public/imges/whyChooseUs/chemical-free.png"
import farm from "../../../public/imges/whyChooseUs/farm.png"
import premiumQuality from "../../../public/imges/whyChooseUs/premium-quality.png"
import Process from "../../../public/imges/whyChooseUs/process.png"
import traditinal from "../../../public/imges/whyChooseUs/traditional.png"

const features = [
    {
        icon: naturel,
        title: "100% Natural",
        desc: "Our products are sourced directly from nature without unnecessary processing.",
    },
    {
        icon: premiumQuality,
        title: "Premium Quality",
        desc: "Strict quality standards ensure purity and authenticity in every product.",
    },
    {
        icon: traditinal,
        title: "Traditional Wisdom",
        desc: "Inspired by ancient wellness practices that support healthy living.",
    },
    {
        icon: family,
        title: "Trusted By Families",
        desc: "Loved by customers who value natural nutrition and purity.",
    },
    {
        icon: farm,
        title: "Farm Fresh Sourcing",
        desc: "Ingredients are carefully sourced from trusted farms ensuring freshness and authenticity.",
    },
    {
        icon: chemicalFree,
        title: "Chemical Free",
        desc: "We avoid harmful additives and focus on maintaining natural nutritional value.",
    },
    {
        icon: Process,
        title: "Authentic Preparation",
        desc: "Products follow traditional preparation methods to preserve natural goodness.",
    },
        {
        icon: Process,
        title: "Authentic Preparation",
        desc: "Products follow traditional preparation methods to preserve natural goodness.",
    },
];

export default function WhyChooseUsSection() {
    return (
        <section className="pb-14  pt-[100px] lg:pt-32 overflow-hidden">

            <div className="max-w-[1400px] mx-auto  md:w-[90%]  px-2 lg:px-6">

                <div className="lg:mb-8 mb-[10px] relative mx-auto w-fit">
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 0.7 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute lg:left-[40px] top-[-40px] lg:top-[-70px] lg:w-full w-fit  left-0 right-0 mx-auto md:block text-[52px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                    >
                        WHY ?
                    </motion.div>
                    <h2 className=" text-[25px]  lg:text-left text-center lg:text-[48px] lg:leading-normal leading-[40px] font-semibold text-[#1d2b1f]">
                        Why Choose <span className="text-[#8c7440]">Gawdee</span>
                    </h2>

                    <p className="mt-1 text-[#6b776b]  lg:text-[15px] text-[12px] max-w-[300px] mx-auto lg:max-w-full  text-center lg:max-w-[600px]">
                    Bringing together purity, tradition, and nutrition to support
                        a healthier lifestyle.
                    </p>
                </div>
                <div className=" flex lg:flex-row flex-col ">

                    <div className="   w-fit lg:gap-y-[30px]   gap-[20px]  md77:gap-x-[10px] md11:gap-x-[60px] lg:mx-0 mx-auto grid grid-cols-2 md77:grid-cols-4 lg:grid-cols-2">

                        {features.map((item, index) => (

                            <motion.div
                                key={index}

                                viewport={{ once: true }} 
                                className="flex gap-[30px] relative  items-start"
                            >

                                <div className=" lg:block hidden text-[34px] lg:text-[45px] z-5 h-[50px] w-[55px] top-[20px]  flex border-r-[#fff]  rounded-l-[10px]  h-fit lg:left-[-45px] right-0  top-[-20px] absolute font-bold text-[#0c776b]/60  leading-none">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="flex-1 border z-2  bg-white px-[15px] relative pt-[15px] lg:py-[10px] lg:pr-[10px] lg:pl-[20px] rounded-[10px] min-h-[100px]">

                                    <div className="flex lg:flex-row flex-col  items-center gap-[10px] lg:gap-2 lg:mb-1">
                                        <img src={item.icon} className=" w-[40px] lg:w-[36px]" />
                                        <h3 className=" text-[12px] lg:text-left text-center lg:text-[26px] font-semibold text-[#1d2b1f]">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <p className="text-[#6b776b]  lg:block hidden leading-[20px] text-[14px] max-w-[650px]">
                                        {item.desc}
                                    </p>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                </div>
            </div>

        </section>
    );
}