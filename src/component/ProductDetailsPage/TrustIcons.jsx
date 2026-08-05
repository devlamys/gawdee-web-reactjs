/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion } from 'framer-motion'
import free from "../../../public/imges/productDetails/free-shipping.png"
import lab from "../../../public/imges/productDetails/lab.png"
import natural from "../../../public/imges/productDetails/natural.png"
import certificate from "../../../public/imges/productDetails/certicate.png"

export default function TrustIcons() {

  const icons = [
    { icon: free, label: "Free Shipping", desc: "All orders" },
    { icon: certificate, label: "A2 Certified", desc: "Pure genetics" },
    { icon: lab, label: "Lab Tested", desc: "Quality checked" },
    { icon: natural, label: "100% Natural", desc: "No additives" }
  ]

  return (
    <section className="">

      <div className="">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-wrap pt-[30px] justify-center lg:grid grid-cols-2 lg:justify-between  "
        >

          {icons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="flex  gap-[10px]  w-[130px] h-[120px] flex-col items-center  group"
            >

              <div className=' flex '>
                <div className="w-[70px] h-[70px] rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition">
                 <img
      src={item.icon}
      className="w-full p-[13px] object-contain transition-all duration-300 
      group-hover:invert group-hover:brightness-0 group-hover:contrast-200"
    />
                </div>

              </div>

              <div className="leading-tight">

                   <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
              </div>

            </motion.div>
          ))}

        </motion.div>

      </div>

    </section>
  )
}