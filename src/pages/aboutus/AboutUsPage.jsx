/* Developed by Grafizen International PVT. LTD. */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ShieldCheck, Heart } from "lucide-react";
import main1 from "../../../public/imges/pageAbout/main4.jpg"
import Header from "@/component/Header";
import { ReactLenis } from "lenis/react";
import { Milk, PackageCheck, ShoppingCart, X } from "lucide-react";
import cowcare from "../../../public/imges/aboutus/gauShala.jpg"
import traditnal from "../../../public/imges/pageAbout/TraditionalBilonaProcess.jpg"
import selfPack from "../../../public/imges/pageAbout/SafePackaging.jpg"
import Footer from "@/component/Footer";
import Masonry from "../../../src/component/reactBits/Masonry";
import WhyChooseUsSection from "@/component/home/WhyChooseUsSection";
import TestimonialSection from "@/component/home/TestimonialsSection";
import PremiumVideoSection from "@/component/aboutUsCom/PremiumVideoSection";
import ComboSection from "@/component/aboutUsCom/ComboSection";
import mainAbout from "../../../public/imges/abouts/mainBanner.jpg"
import pack1 from "../../../public/imges/Process-images/pack1.jpg"
import pack2 from "../../../public/imges/Process-images/bilona.jpg"
import ex1 from "../../../public/imges/GPBS-2024expo/image11.jpg"

import ex2 from "../../../public/imges/GPBS-2024expo/image12.jpg"
import ex3 from "../../../public/imges/GPBS-2024expo/image13.jpg"
import ex4 from "../../../public/imges/GPBS-2024expo/image14.jpg"
import ex5 from "../../../public/imges/GPBS-2024expo/image15.jpg"
import { useState, useEffect } from "react";
import { ApiGet } from "@/helper/axios";

export default function AboutUsPage() {

    const journey = [
        {
            icon: Leaf,
            title: "Ethical Cow Care",
            desc: "Our Gir cows are raised in a natural environment with nutritious feed and loving care.",
            image: cowcare,
        },
        {
            icon: Milk,
            title: "Traditional Bilona Process",
            desc: "Curd is churned into butter and slowly heated to produce nutrient-rich A2 ghee.",
            image: pack2,
        },
        {
            icon: PackageCheck,
            title: "Safe Packaging",
            desc: "Every jar is packed in hygienic conditions to preserve purity and natural aroma.",
            image: pack1,
        },
    ];

    const [aboutData, setAboutData] = useState(null);
    const [activeGallerySection, setActiveGallerySection] = useState(0);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

    const fetchAboutUsData = async () => {
        try {
            const res = await ApiGet("/admin/about-us");

            const aboutUsData =
                res?.AboutUs ||
                res?.data?.AboutUs ||
                res?.data?.data ||
                res?.data ||
                [];

            const aboutItem = Array.isArray(aboutUsData)
                ? aboutUsData[0]
                : aboutUsData;

            setAboutData(aboutItem || null);
        } catch (error) {
            console.error("About Us Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchAboutUsData();
    }, []);

    const gallerySection = aboutData?.gallerySection || {};

    const gallerySections =
        gallerySection?.sections && gallerySection.sections.length > 0
            ? gallerySection.sections
            : gallerySection?.images?.length > 0
                ? [
                    {
                        sectionTitle: "Gallery",
                        images: gallerySection.images,
                    },
                ]
                : [];

    const activeSection = gallerySections?.[activeGallerySection] || {};
    const activeImages = activeSection?.images || [];

    return (
        <>
            <div
                className="relative w-full min-h-screen bg-white overflow-x-hidden"
                style={{
                    WebkitOverflowScrolling: "touch",
                }}
            >

                <Header />
                <section className="pb-28  pt-[210px] lg:pt-[180px] bg-gradient-to-b from-green-50 to-white overflow-hidden">

                    <div className="max-w-7xl mx-auto px-6">

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                            <div className="relative">

                                <motion.div
                                    initial={{ y: 80, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 0.7 }}
                                    transition={{ duration: 0.9 }}
                                    viewport={{ once: true }}
                                    className="absolute left-[0px] right-0 top-[-60px]  md:block text-[92px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                                >
                                    About
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className=" text-[34px] lg:text-5xl font-bold mt-4 leading-[44px] lg:leading-[48px]"
                                >
                                    Your Gateway To A
                                    <span className="text-[#0c776b]"> Harmonious Life</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-gray-600 mt-2 lg:mt-6 leading-relaxed"
                                >
                                    We were born and raised in a small village with a deep
                                    connection to nature. Seeing how pesticides and chemicals
                                    harm crops and livestock inspired us to build pesticide-free
                                    farms and work closely with farmers to nurture healthy cows
                                    and natural food.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex flex-wrap gap-6 mt-8"
                                >

                                    <div className="flex items-center gap-3">
                                        <Leaf className="text-green-600 w-5 h-5" />
                                        <span className="text-sm text-gray-700">
                                            100% Natural Farming
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-green-600 w-5 h-5" />
                                        <span className="text-sm text-gray-700">
                                            Lab Tested Quality
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Heart className="text-green-600 w-5 h-5" />
                                        <span className="text-sm text-gray-700">
                                            Healthy Gir Cow Milk
                                        </span>
                                    </div>

                                </motion.div>

                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >

                                <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-200/40 rounded-full blur-3xl"></div>

                                <img
                                    src={mainAbout}
                                    className="relative rounded-2xl w-fit shadow-xl w-full lg:h-[420px] object-contain"
                                />

                            </motion.div>

                        </div>

                    </div>

                </section>

                <section className=" pt-[40px] lg:pt-[70px] pb-[80px] bg-gradient-to-b from-white to-green-50">

                    <div className="max-w-7xl mx-auto px-6">

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="text-center relative mb-10 lg:mb-16"
                        >

                            <motion.div
                                initial={{ y: 80, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 0.7 }}
                                transition={{ duration: 0.9 }}
                                viewport={{ once: true }}
                                className="absolute left-[0px] right-0 top-[-80px]  md:block text-[92px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                            >
                                Process
                            </motion.div>

                            <h2 className="text-4xl font-bold mt-4">
                                Farm To Kitchen Journey
                            </h2>

                            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
                                Every jar of Gawdee A2 Gir Cow Ghee follows a careful journey
                                from farm to your kitchen ensuring purity and authenticity.
                            </p>
                        </motion.div>

                        <div className="grid md77:grid-cols-3 md11:grid-cols-3  max-w-6xl mx-auto gap-4 md77:gap-5 md11:gap-10">

                            {journey.map((item, index) => {

                                const Icon = item.icon;

                                return (

                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2, duration: 0.7 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -12 }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 group"
                                    >

                                        <div className="relative">

                                            <img
                                                src={item.image}
                                                className="w-full h-[200px] md77:h-[170px] md11:h-[200px] object-cover"
                                            />

                                            <div className="absolute bottom-[-20px] left-6 w-12 h-12 bg-[#0c776b] rounded-full flex items-center justify-center shadow-lg">

                                                <Icon className="text-white w-5 h-5" />

                                            </div>

                                        </div>

                                        <div className=" p-4  md77:p-4 md11:p-5 pt-5">

                                            <h3 className="font-semibold text-lg md11:mb-2">
                                                {item.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm  md77:text-[12px] md11:text-[14px] md11:leading-relaxed">
                                                {item.desc}
                                            </p>

                                        </div>

                                    </motion.div>

                                );

                            })}

                        </div>

                    </div>

                </section>
                {(gallerySection?.visible ?? true) && gallerySections.length > 0 && (
                    <section className="relative pt-24 lg:pt-32 pb-24 bg-white overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/40 to-white pointer-events-none"></div>

                        <div className="max-w-7xl relative mx-auto px-6">

                            <motion.div

                                className="text-center mb-10 relative"
                            >
                                <motion.div

                                    className="absolute left-0 right-0 top-[-80px] text-[82px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                                >
                                    Gallery
                                </motion.div>

                                <h2 className="relative text-3xl lg:text-4xl font-bold mt-4 text-[#000]">
                                    {gallerySection?.title || "Moments From Our Farm"}
                                </h2>

                                <p className="relative text-gray-600 mt-4 max-w-xl mx-auto">
                                    {gallerySection?.description ||
                                        "From nurturing Gir cows to the traditional Bilona process, every step reflects purity and care."}
                                </p>
                            </motion.div>

                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                                {gallerySections.map((section, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveGallerySection(index)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${activeGallerySection === index
                                            ? "bg-[#0c776b] text-white border-[#0c776b] shadow-md"
                                            : "bg-white text-gray-700 border-[#0c776b] hover:bg-[#edfdfb] hover:text-[#0c776b]"
                                            }`}
                                    >
                                        {section?.sectionTitle || `Section ${index + 1}`}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">

                            </AnimatePresence>

                            {activeImages.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeGallerySection}
                                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6"
                                    >
                                        {activeImages.map((image, index) => (
                                            <motion.div
                                                key={`${activeGallerySection}-${index}`}
                                                onClick={() => setSelectedGalleryImage(image)}
                                                className={`group relative overflow-hidden rounded-[14px] md:rounded-[20px] lg:rounded-[24px] bg-white shadow-md border border-green-100 cursor-pointer ${index === 0 || index === 3
                                                    ? "lg:col-span-2"
                                                    : "lg:col-span-1"
                                                    }`}
                                            >
                                                <div className="relative h-[150px] sm:h-[180px] md:h-[240px] lg:h-[360px] overflow-hidden">
                                                    <motion.img
                                                        src={image}
                                                        alt={activeSection?.sectionTitle || "Gallery Image"}
                                                        className="w-full h-full object-cover"
                                                        whileHover={{ scale: 1.12 }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                                                    <div className="absolute left-3 bottom-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                                        <span className="inline-flex px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-green-800 text-xs md:text-sm font-semibold">
                                                            {activeSection?.sectionTitle || "Gallery"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="text-center py-16 border border-dashed border-green-200 rounded-[24px] bg-green-50/40">
                                    <p className="text-gray-500">
                                        No images available in this section.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <AnimatePresence>
                    {selectedGalleryImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedGalleryImage(null)}
                            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
                        >
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.85, opacity: 0, y: 30 }}
                                transition={{ duration: 0.25 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-5xl"
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedGalleryImage(null)}
                                    className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition"
                                >
                                    <X size={22} />
                                </button>

                                <div className="bg-white rounded-[20px] overflow-hidden shadow-2xl">
                                    <img
                                        src={selectedGalleryImage}
                                        alt="Gallery Preview"
                                        className="w-full max-h-[80vh] object-contain bg-black"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <WhyChooseUsSection />

                <section className="py-[20px] mt-[50px]  mb-[50px] rounded-[30px]  max-w-7xl  mx-auto 2x:w-[70%] w-[90%] lg:w-[1000px]  bg-gradient-to-r from-[#0c776b]  to-green-600 text-white">

                    <div className="max-w-7xl mx-auto px-6 text-center">

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl font-bold"
                        >
                            Experience The Purity Of
                            <span className="block">A2 Gir Cow Ghee</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-3 text-green-100 max-w-xl mx-auto"
                        >
                            Crafted with the traditional Bilona method, our A2 Gir Cow Ghee
                            brings authentic flavor and nutrition directly from farm to your kitchen.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 flex justify-center gap-4 flex-wrap"
                        >

                            <button className="bg-white text-[#0c776b]  px-8 py-2 rounded-full font-semibold hover:scale-105 transition">
                                Shop A2 Ghee
                            </button>

                            <button className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-[#0c776b]  transition">
                                Explore Products
                            </button>

                        </motion.div>

                    </div>

                </section>
                <TestimonialSection />
                <div className=" md11:mt-[-80px]">
                    <Footer />
                </div>

            </div>
        </>
    );
}