/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Header from "@/component/Header";
import { ReactLenis } from "lenis/react";
import { ApiGet, ApiPost } from "@/helper/axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {

  const [cartItems, setCartItems] = useState([]);
const [userId, setUserId] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsed = JSON.parse(user);
    setUserId(parsed?._id);
  }
}, []);

useEffect(() => {
  if (!userId) return;

  const fetchCart = async () => {
    try {
      const res = await ApiGet(`/cart/${userId}`);

      setCartItems(res.data?.items || []);
      console.log('cartItems', res.data)

    } catch (error) {
      console.error(error);
      setCartItems([]);
    }
  };

  fetchCart();
}, [userId]);

const updateQuantity = async (productId, type) => {
  try {
    const response = await ApiPost("/cart/update-quantity", {
      userId,
      productId,
      action: type === "inc" ? "increase" : "decrease",
    });

    setCartItems(response.data?.data?.items || []);

  } catch (error) {
    console.error(error);
  }
};

const removeItem = async (productId) => {
  try {
    const response = await ApiPost("/admin/cart/remove", {
      userId,
      productId,
    });

    setCartItems(response.data?.data?.items || []);

  } catch (error) {
    console.error(error);
  }
};
const subtotal = useMemo(() => {
  return cartItems.reduce(
    (acc, item) =>
      acc + item.productId?.price * item.quantity,
    0
  );
}, [cartItems]);

const handleCheckout = () => {
  if (cartItems.length === 0) return;

  navigate("/checkout");
};

  return (
   <div
      className="relative w-full min-h-screen bg-white overflow-x-hidden"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Header />

      <div className="max-w-7xl md:w-[80%] mx-auto pt-[150px] pb-[100px] px-4">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-Cake font-[600] text-center mb-16"
        >
          Your Sweet Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={70} className="text-pink-400 mx-auto mb-6" />
            <h2 className="text-2xl font-Rose font-semibold">
              Your cart is empty
            </h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence>
                {cartItems.map((item) => (
  <motion.div
    key={item.productId?._id}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -60 }}
    className="bg-white rounded-3xl shadow-lg border border-pink-100 p-4 flex gap-6"
  >
    <div className="w-[140px] h-[140px] bg-pink-50 rounded-2xl flex items-center justify-center">
      <img
        src={item.productId?.image}
        alt={item.productId?.name}
        className="w-full h-full object-contain p-4"
      />
    </div>

    <div className="flex-1 flex flex-col justify-between">

      <div>
        <h3 className="text-xl font-semibold">
          {item.productId?.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {item.productId?.size}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">

        <div className="flex items-center gap-3 border-pink-500/30 border bg-pink-50 px-3 py-1 rounded-[10px]">
          <button onClick={() => updateQuantity(item.productId?._id, "dec")}>
            <Minus size={16} />
          </button>

          <span className="font-semibold w-6 text-center">
            {item.quantity}
          </span>

          <button onClick={() => updateQuantity(item.productId?._id, "inc")}>
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-pink-600">
            ₹ {(item.productId?.price * item.quantity).toFixed(2)}
          </span>

          <button
            onClick={() => removeItem(item.productId?._id)}
            className="text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>

      </div>
    </div>
  </motion.div>
))}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 h-fit sticky top-[160px]">
              <h2 className="text-xl font-semibold mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="space-y-4 text-sm">
  {cartItems.map((item) => (
    <div
      key={item.productId?._id}
      className="flex justify-between"
    >
      <span>
        {item.productId?.name} × {item.quantity}
      </span>
      <span>
        ₹ {(item.productId?.price * item.quantity).toFixed(2)}
      </span>
    </div>
  ))}
</div>
              </div>

              <div className="border-t mt-8 pt-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <button
  onClick={handleCheckout}
  className="w-full mt-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"
>
  Proceed to Checkout
</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}