/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProductInfo() {
  const [selectedSize, setSelectedSize] = useState('500ml')
  const [quantity, setQuantity] = useState(1)

  const sizes = ['250ml', '500ml', '1L']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          A2 Gir Cow Ghee
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mt-2"
        >
          Traditional Bilona method ghee made from A2 Gir cow milk
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="text-2xl">★★★★★</div>
        <span className="text-yellow-500 font-semibold">4.8</span>
        <span className="text-gray-500">| 240 Reviews</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-4xl font-bold text-green-600"
      >
        ₹1,250
        <span className="text-lg text-gray-500 ml-2 line-through">₹1,499</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <label className="block text-lg font-semibold text-gray-900">Select Size</label>
        <div className="flex gap-3">
          {sizes.map((size) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedSize === size
                  ? 'bg-[#0c776b] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <label className="block text-lg font-semibold text-gray-900">Quantity</label>
        <div className="flex items-center gap-4 w-fit bg-gray-100 rounded-lg p-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
          >
            −
          </motion.button>
          <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
          >
            +
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4 pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-[#0c776b] text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#05655a] transition-colors"
        >
          Add to Cart
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-yellow-500 text-gray-900 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-600 transition-colors"
        >
          Buy Now
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2"
      >
        <p className="font-semibold text-gray-900">🚚 Free Delivery by Tomorrow</p>
        <p className="text-sm text-gray-600">Order within the next 6 hours</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="grid grid-cols-2 gap-3 text-sm"
      >
        <div className="flex gap-2 items-start">
          <span>✓</span>
          <span className="text-gray-700">100% Authentic</span>
        </div>
        <div className="flex gap-2 items-start">
          <span>✓</span>
          <span className="text-gray-700">Lab Tested</span>
        </div>
        <div className="flex gap-2 items-start">
          <span>✓</span>
          <span className="text-gray-700">A2 Certified</span>
        </div>
        <div className="flex gap-2 items-start">
          <span>✓</span>
          <span className="text-gray-700">100% Natural</span>
        </div>
      </motion.div>
    </motion.div>
  )
}