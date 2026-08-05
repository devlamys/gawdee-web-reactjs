/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ApiGet } from "@/helper/axios";

const faqs = [
  {
    question: "Are Gawdee products completely natural?",
    answer:
      "Yes. Gawdee products are made from carefully sourced natural ingredients with minimal processing to preserve purity and nutrition.",
  },
  {
    question: "How is Gawdee A2 Gir Cow Ghee prepared?",
    answer:
      "Our ghee is produced using the traditional Bilona method which enhances aroma, taste, and nutritional value.",
  },
  {
    question: "Do Gawdee products contain preservatives?",
    answer:
      "No. We avoid artificial preservatives and focus on natural ingredients.",
  },
  {
    question: "How should I store these products?",
    answer:
      "Store them in a cool and dry place away from direct sunlight.",
  },
  {
    question: "Are these products suitable for daily use?",
    answer:
      "Yes. Our products are designed to support a healthy lifestyle.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const fetchFaqs = async () => {
    try {
      const res = await ApiGet("/admin/faq");
      console.log('res', res)

      const data =
        res?.data?.faqs ||
        res?.faqs ||
        [];

      const mapped = data.map((item) => ({
        question: item.question,
        answer: item.answer,
      }));

      setFaqs(mapped);

    } catch (err) {
      console.error("FAQ Error:", err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <section className="lg:py-20  pt-[50px] pb-[60px] relative overflow-hidden">

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/20 blur-3xl rounded-full" />

      <div className="max-w-[1300px] mx-auto px-6 grid lg:grid-cols-2  gap-[20px] lg:gap-20 items-start">

        <div className=" relative">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-[0px] top-[-30px] lg:top-[-70px]  md:block text-[42px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Faq's
          </motion.div>
          <h2 className=" text-[24px] lg:text-[48px] font-semibold leading-[25px] lg:leading-tight text-[#1d2b1f]">
            Got Questions?
            <span className="block text-[#8c7440]">
              We've Got Answers
            </span>
          </h2>

          <p className=" mt-[5px] lg:mt-6 text-[12px] lg:text-[15px] text-[#6b776b] max-w-[480px] lg:leading-7">
            At Gawdee we believe in purity and transparency.
            Here are answers to common questions about our natural
            ingredients and product preparation.
          </p>

          <div className="lg:mt-10  mt-[15px] flex  gap-[20px]">

            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-lg border border-[#e9e5d8] rounded-xl p-2 lg:p-4">
              <span className="text-xl">🌿</span>
              <p className="font-medium text-[12px] lg:text-[15px] text-[#1d2b1f]">
                100% Natural Ingredients
              </p>
            </div>

 <div className="flex items-center gap-4 bg-white/60 backdrop-blur-lg border border-[#e9e5d8] rounded-xl p-2 lg:p-4">
              <span className="text-xl">✨</span>
                 <p className="font-medium text-[12px] lg:text-[15px] text-[#1d2b1f]">
                Traditional Preparation
              </p>
            </div>

          </div>

        </div>

        <div className="space-y-4">

          {(faqs.length ? faqs : []).map((faq, i) => {

            const isOpen = active === i;

            return (
              <motion.div
                key={i}
                layout
                className="group bg-white/80 backdrop-blur-lg border border-[#e9e5d8] rounded-xl overflow-hidden hover:shadow-lg transition"
              >

                <button
                  onClick={() => setActive(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-[15px] text-left"
                >

                  <div className="flex items-center gap-4">

                    <span className="text-[#8c7440] font-semibold">
                      0{i + 1}
                    </span>

                    <h3 className=" text-[14px] lg:text-lg font-medium text-[#1d2b1f]">
                      {faq.question}
                    </h3>

                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-[#7f9d4d]"
                  >
                    <Plus size={20} />
                  </motion.div>

                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6  text-[12px] lg:text-[15px] text-[#6b776b] leading-[20px] lg:leading-7">
                    {faq.answer}
                  </p>
                </motion.div>

              </motion.div>
            );

          })}

        </div>

      </div>
    </section>
  );
}