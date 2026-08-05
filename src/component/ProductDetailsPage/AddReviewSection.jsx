/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, Send, AlertCircle, X, Check, ChevronDown } from "lucide-react";
import { ApiPost } from "@/helper/axios";

export default function ProductReviewSection({ productId, productName }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Most Popular");

  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    product: productName || "",
    review: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.review.trim()) {
      setError("Please enter your name and review.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const payload = {
        customerName: form.name.trim(),
        productId: productId || null,
        productName: productName || form.product.trim(),
        rating,
        review: form.review.trim(),
      };

      const res = await ApiPost("/admin/customer-review/create", payload);
      console.log("Review Submit Response:", res);

      setSubmitted(true);
      setForm({
        name: "",
        product: productName || "",
        review: "",
      });
      setRating(5);

      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
      }, 2500);
    } catch (err) {
      console.error("Review submit error:", err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const StaticStars = ({ count, size = 16 }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < count
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-500 fill-gray-500"
          }
        />
      ))}
    </div>
  );

  return (
    <section className="w-full bg-[#053832] text-white font-sans py-12 px-6 lg:px-16">
      <div className="max-w-[1200px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-600 pb-10">
          <div>
            <p className="font-serif text-[22px] text-gray-200 mb-2">
              Read more from our buyers
            </p>
            <h2 className="text-[40px] md:text-[50px] font-semibold leading-tight">
              Product Reviews
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-between gap-4 px-6 py-3 rounded-full border border-gray-400 hover:bg-white hover:text-[#1e2933] transition-all duration-300 text-sm tracking-wide group uppercase"
          >
            Write a product review
            <span className="w-6 h-6 rounded-full bg-white group-hover:bg-[#1e2933] flex items-center justify-center transition-colors">
              <span className="block w-2 h-2 rounded-full bg-[#1e2933] group-hover:bg-white"></span>
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-12 pt-8 pb-10 border-b border-gray-600">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-4">
              <span className="text-[64px] font-light leading-none">5.0</span>
              <StaticStars count={5} size={20} />
            </div>
            <p className="text-sm font-semibold mt-1">1 Review</p>
          </div>

          <div className="flex-1 w-full max-w-[400px] flex flex-col gap-3 text-sm font-medium">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center gap-4">
                <span className="w-12">{star} Stars</span>
                <div className="flex-1 h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: index === 0 ? "100%" : "0%" }} 
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Sort By</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white text-gray-900 text-sm py-2 pl-4 pr-10 rounded shadow-sm outline-none cursor-pointer"
                >
                  <option value="Most Popular">Most Popular</option>
                  <option value="Newest">Newest</option>
                  <option value="Highest Rated">Highest Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="min-w-[200px]">
              <StaticStars count={5} size={18} />
              <div className="flex items-center gap-2 mt-4 mb-2">
                <span className="text-lg font-semibold">Kat</span>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <CheckCircle2 size={14} className="text-white" />
                  Verified Reviewer
                </div>
              </div>
              <span className="text-sm text-gray-400">11/09/2025</span>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">Superb clothes airer</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[900px]">
                This is a superb piece of equipment, especially if you need to regularly use an airer - really clever design, easy to assemble and pack away, super lightweight yet 100% sturdy and looks great too. Can't recommend highly enough if you're looking to upgrade or just want to go straight to the best airer at the best price, including on shipping. Seamless purchase and customer service offered by Luca Living too. 100% satisfied with this product and purchasing experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-900"
            >

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="relative p-6 lg:p-8">

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Review Submitted!
                      </h3>
                      <p className="text-gray-500 mt-2 text-sm text-center px-6">
                        Thank you for taking the time to share your feedback with us.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center mb-6 pt-2">
                  <h2 className="text-[24px] font-bold text-gray-900">
                    Add Your Review
                  </h2>
                  <p className="text-gray-500 text-[14px] mt-1">
                    Share your experience with our product
                  </p>
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 ml-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        disabled={submitLoading}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 text-[14px] rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none disabled:opacity-60 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 ml-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={form.product}
                        disabled={!!productName || submitLoading}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                        className="w-full px-4 py-2.5 text-[14px] rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none disabled:opacity-60 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 pb-2">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Rating</label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-max">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          type="button"
                          key={star}
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.15 }}
                          onClick={() => !submitLoading && setRating(star)}
                          className="cursor-pointer p-1"
                        >
                          <Star
                            size={24}
                            className={`transition-colors duration-200 ${
                              star <= rating
                                ? "text-[#d9e600] fill-[#d9e600]"
                                : "text-gray-300 fill-gray-200"
                            }`}
                          />
                        </motion.button>
                      ))}
                      <span className="ml-3 text-sm font-semibold text-gray-600 border-l border-gray-300 pl-4">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Your Review</label>
                    <textarea
                      placeholder="What did you like or dislike?"
                      rows={4}
                      value={form.review}
                      disabled={submitLoading}
                      onChange={(e) => setForm({ ...form, review: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-[14px] border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none resize-none disabled:opacity-60 transition-all"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitLoading}
                    whileHover={{ scale: submitLoading ? 1 : 1.01 }}
                    whileTap={{ scale: submitLoading ? 1 : 0.98 }}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#08776a] hover:bg-black text-white font-semibold shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitLoading ? "Submitting..." : "Submit Review"}
                    {!submitLoading && <Send size={18} />}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}