/* Developed by Grafizen International PVT. LTD. */
'use client'

import { ShieldCheck, Zap, Leaf, X } from "lucide-react"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, PlayIcon } from "lucide-react";
import cover from "../../../public/imges/aboutus/cover.jpeg"

export default function BenefitsSection({ product }) {

  const benefits = [
    {
      title: "A2 Protein Verified",
      desc: "Easier digestion and better nutrient absorption.",
      icon: ShieldCheck
    },
    {
      title: "Boosts Energy",
      desc: "Rich in natural antioxidants and healthy fats.",
      icon: Zap
    },
    {
      title: "100% Natural",
      desc: "Made without additives or preservatives.",
      icon: Leaf
    }
  ]

  const specialVideos =
    product?.specialSections?.[0]?.videos
      ?.map((item) => ({
        id: item.id || item._id,
        title: item.title || "",
        video:
          typeof item.video === "string"
            ? item.video
            : item.video?.url || item.url || "",
      }))
      ?.filter((item) => item.video) || [];

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image?.url || image?.image || "";
  };

  const [activeVideo, setActiveVideo] = useState(null);
  return (

    <section className=" pt-[80px]  md77:pt-[40px] md11:pt-32 pb-[50px] bg-gradient-to-b from-white to-green-50">

      <div className="w-fit mx-auto px-3 md:px-0">

        <div className=" flex lg:flex-row flex-col    relative gap-5 items-end">

          <motion.div

            className=" md11:px-3 md77: md11:flex-col  w-full justify-between"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: false, margin: "-100px" }}
              className="absolute lg:left-[0px] left-4 lg:right-0 top-[-30px] lg:top-[-70px]  md:block text-[42px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
            >
              Why ?
            </motion.div>
            <div  className="md77:max-w-[300px] md11:max-w-[500px]">

              <h2 className="text-[26px]  font-bold lg:leading-normal leading-[30px] text-gray-900  mb-[10px] lg:mb-6">

                {product?.whySection?.title}
              </h2>

              <p className="text-gray-600 text-[12px]  md77:text-[13px] md11:text-lg  mb-[16px] lg:mb-10 max-w-lg">

                {product?.whySection?.subtitle}
              </p>
            </div>
            <div className=" space-y-3 lg:space-y-6">

              {benefits.map((item, i) => {

                const Icon = item.icon

                return (

                  <div key={i} className="flex items-start gap-4">

                    <div className="lg:w-12 lg:h-12 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Icon size={22} className="text-green-600" />
                    </div>

                    <div>
                      <h4 className="font-semibold lg:text-[15px] text-[13px] text-gray-900">
                        {item.title}
                      </h4>

                      <p className=" text-[10px] lg:text-sm text-gray-500">
                        {item.desc}
                      </p>
                    </div>

                  </div>

                )

              })}

            </div>

          </motion.div>

          <div className=" flex flex-col md77:flex-row md11:flex-row  gap-[10px] md11:gap-[20px] ">
            <motion.div

              className="relative md11:w-[350px] md77:w-[330px] mx-auto lg:mx-0  px-[10px] lg:px-0 rounded-lg  md11:h-[350px]"
            >

              <img
                src={
                  typeof product?.whySection?.image === "string"
                    ? product?.whySection?.image
                    : product?.whySection?.image?.url
                }
                className="rounded-2xl  border shadow-xl w-full h-full object-cover"
              />

            </motion.div>
            <div className=" hidden md:flex gap-5">
              {specialVideos.length > 0 && (
                <div className="hidden md:flex gap-5">
                  {specialVideos.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      className="relative min-w-[160px] h-[350px] rounded-2xl overflow-hidden cursor-pointer w-[180px] shadow-lg bg-black"
                      onClick={() => setActiveVideo(item.video)}
                    >
                      <video
                        src={item.video}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-black/50 p-3 rounded-full">
                          <PlayIcon className="text-white" size={24} />
                        </div>
                      </div>

                      {item.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white text-[12px] font-medium line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {activeVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center"
                onClick={() => setActiveVideo(null)}
              >

                <motion.div

                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="w-[90%] relative md:w-[350px]  h-[600px]"
                  onClick={(e) => e.stopPropagation()}
                >

                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute -top-5 -right-4 bg-white text-black p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                  <video
                    src={activeVideo}
                    controls
                    autoPlay
                    className="w-full rounded-xl"
                  />

                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>

  )
}