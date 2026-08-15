/* Developed by Grafizen International PVT. LTD. */

"use client";
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Github, MapPin, Phone, Mail } from "lucide-react";
import logo1 from "../../public/imges/Logo-green-text.png"
import { FaYoutube } from "react-icons/fa";
import footerBg from "../../public/imges/footer/freepik__talk__4005.png"
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const productLinks = [
    { name: "Gir Cow A2 Ghee", path: "/products/ghee" },
    { name: "Raw Wild Forest Honey", path: "/products/honey" },
    { name: "Taral Drop", path: "/products/drops" },
    { name: "MixMe", path: "/products/mix-me" },
    { name: "Burra Sugar", path: "/products/sugar" },
  ];

  const navigate = useNavigate()

  return (
    <footer className="relative  lg:pt-[70px] pb-[80px] md:pb-[150px] overflow-hidden">

      <motion.div
        initial={{ y: 400, opacity: 0 }}
        whileInView={{ y: 340, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: false }}
        className="capitalize z-[100]  font-Poppins absolute   left-0 w-full text-center text-[180px]  font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.6)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
      >
        GAWDEE
      </motion.div>

      <motion.div
        initial={{ y: 400, opacity: 0 }}
        whileInView={{ y: 630, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: false }}
        className="capitalize z-[0]  font-Poppins absolute   left-0 w-full text-center text-[80px]  font-semibold uppercase text-transparent  lg:hidden [-webkit-text-stroke:2px_rgba(255,255,255,0.6)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
      >
        GAWDEE
      </motion.div>

      <img className="w-[100%] absolute  object-top  bottom-[-0px]" src={footerBg} alt="Footer Background" />

      <motion.div

        className="relative max-w-7xl  flex  flex-col mx-auto bg-white rounded-3xl shadow-xl border lg:w-full w-[90%] border-gray-200 lg:px-12 px-[30px] pt-[30px] z-[100] lg:pt-14 pb-[20px]"
      >
        <div className="flex lg:gap-16 xl:gap-20 lg:justify-between flex-wrap lg:flex-nowrap gap-10">

          <div className="space-y-3 lg:space-y-5 max-w-[300px]">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <img
                src={logo1}
                alt=" Logo"
                className=" object-contain  w-[130px] lg:w-[180px]"
              />
            </motion.div>

            <p className="text-gray-500 font-Rose text-[12px] lg:text-sm lg:leading-[20px]">
              Gawdee brings you naturally crafted foods inspired by
              traditional wisdom. From A2 Gir Cow Ghee to wholesome
              superfoods, every product is made with purity, care,
              and a commitment to healthy living.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://www.instagram.com/gawdee_organic/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#E1306C" }}
                className="!cursor-pointer text-gray-600 transition-colors"
              >
                <Instagram size={18} />
              </motion.a>

              <motion.a
                href="https://www.facebook.com/GawdeeOrganic/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#1877F2" }}
                className="cursor-pointer text-gray-600 transition-colors"
              >
                <Facebook size={18} />
              </motion.a>

              <motion.a
                href="https://www.youtube.com/@GawdeeOrganic"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#FF0000" }}
                className="!cursor-pointer  text-gray-600 transition-colors"
              >
                <FaYoutube size={18} />
              </motion.a>
            </div>
          </div>

          <div className="hidden lg:block">
            <h3 className="font-semibold font-Cake text-gray-800 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {productLinks.map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer font-Rose hover:text-[#0c776b] transition"
                >
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="font-semibold font-Cake text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/all-products" },
                { name: "About Us", path: "/about-us" },
                { name: "Contact", path: "/contact-us" },
                { name: "Blogs", path: "/blogs" },
                { name: "Exhibitions", path: "/exhibitions" },
                { name: "My Orders", path: "/my-orders" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer font-Rose hover:text-[#0c776b] transition"
                >
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block max-w-[280px]">
            <h3 className="font-semibold font-Cake text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-500 font-Rose mb-5">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-[2px] flex-shrink-0 text-[#0c776b]" />
                <span>812, B Wing, Om Decora 9 Square

                  , Nana mauva road, St 9,

                  beside Marwadi, Rajkot,

                  Rajkot, Gujarat 360005</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-[#0c776b]" />
                <a href="tel:+917055207030" className="hover:text-[#0c776b] transition-colors">
                  +91 70552 07030
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-[#0c776b]" />
                <a href="mailto:info@gawdee.com" className="hover:text-[#0c776b] transition-colors">
                  info@gawdee.com
                </a>
              </li>
            </ul>

            <div>
              <div className="flex items-center overflow-hidden rounded-md border border-[#0c776b] transition-all focus-within:border-[#0c776b]">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 text-sm outline-none font-Rose text-gray-700 bg-white"
                />
                <button className="bg-[#0c776b] text-white px-4 rounded-l-[px] py-2 hover:bg-[#0a6056]  transition-colors font-Rose text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden md77:flex grid justify-between mt-[30px] grid-cols-2">

          <div>
            <h3 className="font-semibold font-Cake text-gray-800 text-[15px] mb-2 lg:mb-4">Products</h3>
            <ul className="lg:space-y-2 text-sm text-gray-500">
              {productLinks.map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer font-Rose hover:text-[#0c776b] transition"
                >
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="w-fit min-w-[100px]">
            <h3 className="font-semibold font-Cake text-gray-800 text-[15px] mb-2 lg:mb-4">Resources</h3>
            <ul className="lg:space-y-2 text-sm text-gray-500">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/all-products" },
                { name: "About Us", path: "/about-us" },
                { name: "Contact", path: "/contact-us" },
                { name: "Blogs", path: "/blogs" },
                { name: "Exhibitions", path: "/exhibitions" },
                { name: "My Orders", path: "/my-orders" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer font-Rose hover:text-[#0c776b] transition"
                >
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="lg:hidden flex justify-between mt-[10px] grid-cols-3">

            <div className="lg:hidden block">
              <h3 className="font-semibold font-Cake text-gray-800 text-[15px] mb-2 lg:mb-4">
                Company
              </h3>

              <ul className="lg:space-y-2 text-sm text-gray-500">
                {[

                  { name: "Privacy Policy", path: "/privacy-policy" },
                  { name: "Terms of Service", path: "/terms-and-condition" },
                  { name: "Cookies Policy", path: "/cookie-policy" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 6 }}
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer flex-shrink-0 font-Rose hover:text-[#0c776b] transition"
                  >
                    {item.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-[30px] w-full">
          <h3 className="font-semibold font-Cake text-gray-800 text-[15px] mb-3">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-gray-500 font-Rose mb-4">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-[2px] flex-shrink-0 text-[#0c776b]" />
              <span>812, B Wing, Om Decora 9 Square

                , Nana mauva road, St 9,

                beside Marwadi, Rajkot,

                Rajkot, Gujarat 360005</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="flex-shrink-0 text-[#0c776b]" />
              <a href="tel:+917055207030" className="hover:text-[#0c776b] transition-colors">
                +91 70552 07030
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="flex-shrink-0 text-[#0c776b]" />
              <a href="mailto:info@gawdee.com" className="hover:text-[#0c776b] transition-colors">
                info@gawdee.com
              </a>
            </li>
          </ul>

          <div className="flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-[#0c776b] transition-all">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 text-sm outline-none font-Rose text-gray-700 bg-white"
            />
            <button className="bg-[#0c776b] text-white px-4 py-2 hover:bg-[#0a6056] transition-colors font-Rose text-sm">
              Send
            </button>
          </div>
        </div>

        <div className="border-t text-[13px] border-gray-200 mt-6 lg:mt-12 pt-[15px] lg:pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className=" text-[12px] lg:text-[13px] md11:max-w-[500px] md118:max-w-[800px] order-2 lg:order-1 lg:text-left text-center">
            © {new Date().getFullYear()} All Rights Reserved by{" "}
            <b className="font-Cake font-[600] leading-none text-[#0c776b]">Gawdee</b>{" "}
          </p>

          <div className="md11:flex gap-6 hidden order-1 lg:mb-[0px] mb-[20px] lg:order-2 text-[13px] mt-4 md:mt-0">
            <motion.span
              whileHover={{ color: "#00ad08" }}
              className="cursor-pointer"
              onClick={() => navigate("/privacy-policy")}
            >
              Privacy Policy
            </motion.span>
            <motion.span
              whileHover={{ color: "#00ad08" }}
              className="cursor-pointer"
              onClick={() => navigate("/terms-and-condition")}
            >
              Terms of Service
            </motion.span>
            <motion.span
              whileHover={{ color: "#00ad08" }}
              className="cursor-pointer"
              onClick={() => navigate("/cookie-policy")}
            >
              Cookies
            </motion.span>
          </div>
        </div>

      </motion.div>
    </footer>
  );
}