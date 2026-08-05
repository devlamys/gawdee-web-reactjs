/* Developed by Grafizen International PVT. LTD. */

"use client";

import { ApiPost } from "@/helper/axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function CakeDetailModal({
  cake,
  isOpen,
  onClose,
  userId,
  isLoggedIn,
  openLoginDrawer,
}) {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!cake) return null;

const handleAddToCart = async () => {
  if (!isLoggedIn) {
    openLoginDrawer();
    return;
  }

  try {
    setLoading(true);

    const payload = {
  userId: userId,
  itemType: "Product",
  productId: cake._id,
  quantity: 1,
  price: cake.price
};

    const response = await ApiPost("/admin/cart/add", payload);

    if (response?.data?.success) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

ca

  return (
    <>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-[4000] bg-white shadow-xl border border-pink-200 rounded-xl px-5 py-3 flex items-center gap-3"
          >
            <CheckCircle className="text-pink-500" size={20} />
            <span className="font-Rose text-sm font-semibold text-gray-700">
              Added to Cart
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" onClick={onClose} />

            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-white rounded-[20px] max-w-4xl w-full shadow-2xl overflow-hidden"
            >

              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full border bg-white shadow-md flex items-center justify-center"
              >
                <X size={18} />
              </motion.button>

              <div className="grid md:grid-cols-2">

                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-10 flex items-center justify-center"
                >
                  <motion.img
                    src={cake.image}
                    alt={cake.name}
                    className="w-full max-h-[380px] object-contain drop-shadow-2xl"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-Cake font-bold text-gray-800 mb-3">
                      {cake.name}
                    </h2>

                    <p className="text-gray-500 font-Rose mb-6 text-sm leading-relaxed">
                      {cake.description ||
                        "Handcrafted with premium ingredients and baked to perfection."}
                    </p>

                    <div className="space-y-2 font-Rose text-sm">
                      <p>
                        <span className="font-semibold">Size:</span>{" "}
                        {cake.size}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {cake.categoryName}
                      </p>
                    </div>

                    <p className="text-2xl font-Rose font-bold text-pink-600 mt-6">
                      ₹ {cake.price}
                    </p>
                  </div>

                 <motion.button
  disabled={loading}
  whileHover={!loading ? {
    scale: 1.05,
    boxShadow: "0px 10px 25px rgba(236,72,153,0.4)",
  } : {}}
  whileTap={!loading ? { scale: 0.95 } : {}}
  onClick={handleAddToCart}
  className={`mt-8 font-Rose flex items-center justify-center gap-3 px-8 py-2 rounded-xl text-white font-semibold transition-all
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"
  }`}
>
  {loading ? (
    <span className="animate-pulse">Adding...</span>
  ) : (
    <>
      <ShoppingCart size={18} />
      Add to Cart
    </>
  )}
</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}