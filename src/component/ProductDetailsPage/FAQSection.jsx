/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X } from "lucide-react"
import cover from "../../../public/imges/aboutus/cover.jpeg"

import { Play, PlayIcon } from "lucide-react";

export default function FAQSection({ product }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [open, setOpen] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)

  const images = [
    "https://gawdee.com/upload/variant-images/1771827085187-83j33bvv-Gawdee-Ghee-1lt.png",
    "https://gawdee.com/upload/variant-images/1771826576423-te1jvzd3-1_ltr_Front.jpg.jpeg",
    "https://gawdee.com/upload/variant-images/1771827333726-fcaratsa-1-Litter-Box_03.png"
  ]

  const faqs =
    product?.faqSection?.faqs?.length > 0
      ? product.faqSection.faqs
      : product?.faqs?.length > 0
        ? product.faqs
        : []

  const faqSubtitle =
    product?.faqSection?.subtitle ||
    "Everything you need to know about this product."

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  if (!faqs.length) return null;

  const reels =
    product?.faqSection?.videos
      ?.map((item, index) => ({
        id: item.id || item._id || index,
        title: item.title || "",
        video:
          typeof item.video === "string"
            ? item.video
            : item.video?.url || item.url || "",
      }))
      ?.filter((item) => item.video) || [];

  return (

    <section className=" pt-[80px] lg:pt-32 pb-24 ">

      <div className="max-w-7xl w-[90%] lg:w-[80%] mx-auto ">
        <div className=" mx-auto  relative w-fit text-center">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-[0px] right-0  top-[-40px] lg:top-[-80px]  md:block text-[52px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            FAQ's
          </motion.div>

          <h2 className=" text-[24px] lg:text-4xl font-bold text-gray-900 lg:mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600  text-[13px] lg:text-[15px] mb-[18px] lg:mb-10">

            {faqSubtitle}
          </p>
        </div>

        <div className=" flex  lg:flex-row flex-col gap-[30px] items-start">

          <div className="lg:space-y-4 space-y-3 w-[100%] lg:w-[60%]">

            {faqs.map((faq, i) => {

              const isOpen = open === i

              return (

                <motion.div
                  key={faq?._id || faq?.id || i}
                  className="bg-white rounded-[10px] lg:rounded-xl border shadow-sm overflow-hidden"
                >

                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center p-[11px] lg:p-[13px] text-left"
                  >

                    <h3 className="font-[500] lg:text-[15px] text-[14px] text-gray-900">
                      {faq?.question || faq?.q || `FAQ ${i + 1}`}
                    </h3>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: .3 }}
                      className="text-green-600"
                    >
                      <ChevronDown size={24} />
                    </motion.div>

                  </button>

                  <AnimatePresence>

                    {isOpen && (

                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: .35 }}
                        className="overflow-hidden"
                      >

                        <div className=" px-3 lg:px-6 pb-6 text-gray-600  text-[11px] lg:text-sm leading-relaxed">
                          {faq?.answer || faq?.a || ""}
                        </div>

                      </motion.div>

                    )}

                  </AnimatePresence>

                </motion.div>

              )

            })}

          </div>

          {reels.length > 0 && (
            <div className="flex gap-[20px] md:mx-0 mx-auto">
              {reels.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative border min-w-[130px] lg:min-w-[180px] h-[340px] w-[170px] lg:w-[200px] rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-black"
                  onClick={() => setActiveVideo(item.video)}
                >
                  <video
                    src={item.video}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
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