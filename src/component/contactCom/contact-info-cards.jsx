/* Developed by Grafizen International PVT. LTD. */
"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import call from "../../../public/imges/conatcUs/telephone.png"
import email from "../../../public/imges/conatcUs/email.png"
import location from "../../../public/imges/conatcUs/location.png"
import time from "../../../public/imges/conatcUs/time.png"

const contactInfo = [
  {
    icon: location,
    title: "Our Office",
    content: [
      " 812, B Wing, Om Decora 9 Square",
      ", Nana mauva road, St 9, ",
      "beside Marwadi, Rajkot,",
      " Rajkot, Gujarat 360005 ",
    ],
  },

  {
    icon: email,
    title: "Email Support",
    content: ["info@gawdee.com"],
    link: "mailto:info@gawdee.com",
  },
  {
    icon: call,
    title: "Call Us",
    content: [
      "+91 70551 07030 ,",
      " +91 70552 07030, ",
      "+91 70553 07030",
    ],
    link: "tel:+917055107030",

  },
  {
    icon: time,
    title: "Support Timing",
    content: ["All Days: 9 AM - 8 PM"],
  },
];

export function ContactInfoCards() {
  return (
    <section className=" pb-[50px] lg:pb-24 pt-[140px] ">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="text-center relative mb-10  lg:mb-16"
        >

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-[0px] right-0 top-[-80px]  md:block text-[92px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Information
          </motion.div>

          <h2 className="text-4xl font-bold mt-4">
            We’d Love To Hear From You
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Whether you have a question about our products, orders,
            delivery, or partnerships — our team is always ready
            to assist you.
          </p>

        </motion.div>

        <div className="mx-auto w-fit grid-cols-2 gap-3  grid md11:flex md77:gap-5 md11::gap-4">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;

            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative md77:flex-1 md77:min-w-[250px] h-full lg:min-w-[280px]"
              >

                <div className="bg-white border rounded-xl p-2 md77:p-4  h-full md77:min-h-[160px] border-gray-300 shadow-md transition-all duration-300 hover:shadow-sm flex flex-col">

                  <div className="flex items-center gap-3 mb-2">
                    {Icon && (
                      <div className="md77:w-10 w-8 h-8 md77:h-10 rounded-full flex items-center justify-center shrink-0">
                        <img className="md77:w-8 md77:h-8 h-7 w-7 object-contain" src={Icon} alt="" />
                      </div>
                    )}
                    <h3 className=" text-[14px] md77:text-lg font-medium text-gray-900">{info.title}</h3>
                  </div>

                  <div className="leading-[20px] text-[12px] md77:text-[13px] text-gray-700">
                    {Array.isArray(info.content)
                      ? info.content.map((line, idx) => <p key={idx}>{line}</p>)
                      : info.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}