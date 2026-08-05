/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Users, Truck, Headphones } from "lucide-react";
import mainImage from "../../../public/imges/conatcUs/conatctMainBanner.jpg";

export default function HeroSection() {
  const [showTimePopup, setShowTimePopup] = useState(false);

  const handleCallClick = (event) => {
    event.preventDefault(); 

    const now = new Date();
    const hour = now.getHours();

    if (hour >= 9 && hour < 20) {

      window.location.href = "tel:+917055107030";
    } else {

      setShowTimePopup(true);
    }
  };

  return (
    <section className="relative w-[90%] mx-auto lg:mx-0 lg:w-[100%] pt-[80px] flex items-center overflow-hidden to-white">
      <div className="max-w-8xl mx-auto justify-between md:w-[100%] flex lg:flex-row flex-col gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-[0px] top-[-70px] md:block text-[70px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Contact
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-[700] mt-4 leading-[38px] lg:leading-[50px]">
            Let’s Talk About <br />
            <span className="text-[#0c776b]">Pure A2 Gir Cow Ghee</span>
          </h1>

          <p className="text-gray-600 mt-4 lg:mt-6 max-w-3xl text-justify leading-relaxed">
            Whether you have questions about your order, delivery, wholesale
            partnership, or simply want to know more about our traditional
            bilona-crafted A2 Gir Cow Ghee, our team is always ready to assist you.
            At Gawdee, we believe in transparency, purity, and building a
            direct connection with every customer.
          </p>

          <div className="flex flex-wrap pr-[10px] gap-4 mt-6">
            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-400 border-dashed">
              <Headphones className="w-5 h-5 text-[#0c776b]" />
              <p className="text-sm text-gray-700 font-medium">
                Fast Customer Support
              </p>
            </div>

            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-400 border-dashed">
              <Truck className="w-5 h-5 text-[#0c776b]" />
              <p className="text-sm text-gray-700 font-medium">
                Order & Delivery Assistance
              </p>
            </div>

            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-400 border-dashed">
              <Users className="w-5 h-5 text-[#0c776b]" />
              <p className="text-sm text-gray-700 font-medium">
                Wholesale & Partnership Queries
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-[10px] mt-8">
            <button
              onClick={handleCallClick}
              className="flex items-center gap-2 bg-[#0c776b] text-white px-6 py-2 rounded-[10px] hover:bg-[#0a6a5a] transition"
            >
              <Phone size={18} />
              Call Us
            </button>

            <a
              href="mailto:info@gawdee.com"
              className="flex items-center gap-3 border border-gray-300 px-6 py-2 rounded-[10px] hover:bg-gray-100 transition"
            >
              <Mail size={18} />
              Email Support
            </a>
          </div>
        </motion.div>

        <motion.div className="relative flex lg:w-[520px] overflow-hidden rounded-[30px] justify-center">
          <motion.img
            src={mainImage}
            className="w-[100%] h-full"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showTimePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support Unavailable
              </h3>
              <p className="text-gray-700 text-sm">
                Our call support is available from 9:00 AM to 8:00 PM. Please try again during these hours.
              </p>
              <button
                onClick={() => setShowTimePopup(false)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}