/* Developed by Grafizen International PVT. LTD. */
"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../common/DatePicker";
import { CheckCircle, ChevronDown } from "lucide-react";

function FloatingInput({ label, type = "text" }) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:border-pink-500"
      />

      <motion.label
        animate={{
          top: focus || value ? 6 : 18,
          fontSize: focus || value ? 10 : 10,
          color: focus ? "#ec4899" : "#6b7280",
        }}
        className="absolute left-4 pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

function FloatingTextarea({ label }) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <textarea
        rows="4"
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:border-pink-500"
      />

      <motion.label
        animate={{
          top: focus || value ? 6 : 18,
          fontSize: focus || value ? 12 : 16,
          color: focus ? "#ec4899" : "#6b7280",
        }}
        className="absolute left-4 pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

function MotionDropdown({ label, options }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center"
      >
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected || label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </motion.span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
          >
            {options.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                }}
                className="px-4 py-3 hover:bg-pink-50 cursor-pointer transition"
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CustomCakeSection() {
    const [selectedDate, setSelectedDate] = useState(null);
  return (
    <section className="relative pt-32 pb-32 bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">

<div className="absolute top-0 flex z-10 w-[100%] h-[50px] rounded-b-[100px] bg-[#fff]"
>
</div>
<div className="absolute  bottom-0 flex z-10 w-[100%] h-[50px]  rounded-t-[100px] bg-[#fff]"
>
</div>
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-pink-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-rose-200 rounded-full blur-[120px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm bg-pink-100 text-pink-600 px-4 py-1 rounded-full">
              Custom Cake
            </span>

            <h2 className="text-5xl font-bold  font-Cake text-gray-900 mt-6 leading-tight">
              Design Your Dream Cake <br />
              <span className="text-pink-500">Exactly How You Imagine 🎂</span>
            </h2>

            <p className="mt-6 text-gray-600 text-lg  font-Rose leading-relaxed">
              From birthdays to weddings, our expert bakers bring your ideas to life.
              Choose flavors, themes, size, and special requirements — we’ll craft
              a cake that’s uniquely yours.
            </p>

            <ul className="mt-8 font-Rose space-y-3 text-gray-700">
              <li><CheckCircle color="#db2777" className="inline mr-2" /> Fully customizable design</li>
              <li><CheckCircle color="#db2777" className="inline mr-2" /> Premium ingredients</li>
              <li><CheckCircle color="#db2777" className="inline mr-2" /> Freshly baked to order</li>
              <li><CheckCircle color="#db2777" className="inline mr-2" /> On-time delivery</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-3xl  border  border-[#ff15e82a] shadow-xl space-y-4"
          >

            <FloatingInput label="Your Name" />
            <FloatingInput label="Phone Number" type="tel" />
           <DatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}

/>

            <MotionDropdown
              label="Select Cake Flavor"
              options={[
                "Chocolate",
                "Vanilla",
                "Red Velvet",
                "Butterscotch",
                "Strawberry",
              ]}
            />

            <MotionDropdown
              label="Select Cake Type"
              options={[
                "Birthday Cake",
                "Wedding Cake",
                "Anniversary Cake",
                "Custom Theme Cake",
              ]}
            />

            <FloatingTextarea label="Describe your custom design..." />

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full text-white  rounded-xl font-semibold"
            >

<button
  className="relative w-[100%] flex cursor-target items-center px-6 py-3 overflow-hidden font-medium transition-all bg-pink-500 rounded-md group"
>
  <span
    className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-pink-700 rounded group-hover:-mr-4 group-hover:-mt-4"
  >
    <span
      className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
    ></span>
  </span>
  <span
    className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-pink-700 rounded group-hover:-ml-4 group-hover:-mb-4"
  >
    <span
      className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
    ></span>
  </span>
  <span
    className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-pink-600 rounded-md group-hover:translate-x-0"
  ></span>
  <span
    className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white"
    >Get Started</span
  >
</button>

            </motion.button>

          </motion.div>

        </div>

      </div>

    </section>
  );
}