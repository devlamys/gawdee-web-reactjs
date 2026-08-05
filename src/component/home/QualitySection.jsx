/* Developed by Grafizen International PVT. LTD. */
"use client";
import { motion } from "framer-motion";
import image1 from "../../../public/imges/QualitySection/first1.jpeg"
import image2 from "../../../public/imges/QualitySection/first2.jpg"
import image3 from "../../../public/imges/QualitySection/first3.avif"
import image4 from "../../../public/imges/QualitySection/first4.avif"
import treeSlide from "../../../public/imges/QualitySection/tree1-vectors.jpg"
import treeSlide1 from "../../../public/imges/QualitySection/tree1-vectors.png"
import honey from "../../../public/imges/QualitySection/hone.png"

import quality1 from "../../../public/imges/QualitySection/quality1.jpg"
import quality2 from "../../../public/imges/QualitySection/quality2.jpg"
import quality3 from "../../../public/imges/QualitySection/quality3.jpg"
import quality4 from "../../../public/imges/QualitySection/quality4.jpg"

const qualityFeatures = [
    {
        title: "Traditional Preparation Methods",
        desc: "We follow time-honoured preparation techniques inspired by traditional wisdom to preserve authentic taste, aroma, and nutrition.",
        img: quality1,
    },
    {
        title: "Carefully Sourced Natural Ingredients",
        desc: "Every ingredient used in Gawdee products is sourced responsibly from trusted farms and natural environments.",
        img: quality2,
    },
    {
        title: "Multiple Quality Checks",
        desc: "Each batch goes through detailed quality checks to ensure purity, consistency, and safety.",
        img: quality3,
    },
    {
        title: "Transparency You Can Trust",
        desc: "From sourcing to packaging, every step follows strict standards so you always know what goes into your food.",
        img: quality4,
    },
];
export default function QualitySection() {
    return (
        <section className=" pb-[70px] lg:pb-24 pt-[50px] lg:pt-32  relative overflow-hidden">

            <div className="max-w-[1400px] mx-auto px-3 lg:px-3">

                <div className="text-center  relative mb-2 lg:mb-16">
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 0.7 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute left-[0px] right-0 top-[-30px] lg:top-[-70px]  md:block text-[42px] z-6 lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                    >
                        Quality
                    </motion.div>
                    <h2 className=" text-[24px] z-5 leading-[30px] lg:leading-normal   lg:text-[42px] font-semibold text-[#000000]">
                        The <span className=" text-[#8c7440] ">Gawdee</span> Standard Of Purity
                    </h2>

                </div>
                <div className="absolute  right-[-160px]bottom-[40px] rotate-[-20deg] ">
                    <img src={treeSlide1} alt="" className="  w-[300px] lg:w-[500px] object contain " />
                </div>

                <div className="absolute  left-[-60px]  md118:opacity-1  opacity-5  top-[150px] lg:top-[-70px]  ">
                    <img src={honey} alt="" className="  w-[300px] lg:w-[500px] opacity-30 lg:opacity-100 object contain " />
                </div>

                <div className="  flex  overflow-x-auto overflow-y-hidden md118:grid  md118:grid-cols-4 gap-[14px] lg:gap-5">

                    {qualityFeatures.map((item, index) => (
                        <motion.div
                            key={index}

                            viewport={{ once: true }}
                            className="bg-[#f6ecd7]  w-[250px] lg:w-[330px] flex flex-shrink-0 min-h-[300px] lg:min-h-[400px] relative  justify-center  items-center rounded-[18px] overflow-hidden shadow-md hover:shadow-xl transition"
                        >

                            <div className="flex top-0  absolute w-[100%] h-[100%] justify-center items-end ">

                                <img
                                    src={item.img}
                                    className=" w-[100%] h-[100%] object-contains"
                                />
                            </div>

                        </motion.div>
                    ))}

                </div>

            </div>

        </section>
    );
}