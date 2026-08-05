/* Developed by Grafizen International PVT. LTD. */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown } from "lucide-react";

import logo from "../../public/imges/Logo-green-text.png";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { ApiGet, ApiPost } from "@/helper/axios";

const GawdeeForm = () => {
  const [form, setForm] = useState({
    name: "",
    number: "",
    type: "",
    categoryId: "",
    note: "",
    productId: "",
    amount: "",
  });

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ApiGet("/admin/inquiry-categories");

        const data =
          res?.data ||
          res?.data?.categories ||
          res?.categories ||
          [];

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ApiGet("/admin/products");
        console.log('res', res)

        const data =
          res?.data?.data ||
          res?.product?.products ||
          res?.data ||
          res?.products ||
          [];

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Product fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  const selectedCategory = categories.find((cat) => cat._id === form.categoryId);

  const isB2C =
    selectedCategory?.name?.toLowerCase().trim() === "b2c";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.number || !form.categoryId) {
      alert("Please fill all fields");
      return;
    }

    if (form.number.length !== 10) {
      alert("Please enter valid 10 digit mobile number");
      return;
    }

    if (isB2C && (!form.productId || !form.amount)) {
      alert("Please select product and enter amount");
      return;
    }

    const finalData = {
      name: form.name,
      number: `+91${form.number}`,
      type: isB2C ? "B2C" : "B2B",
      categoryId: form.categoryId,
      note: form.note,
      ...(isB2C && {
        productId: form.productId,
        amount: Number(form.amount),
      }),
    };

    try {
      await ApiPost("/admin/inquiries", finalData);

      setSuccess(true);

      setForm({
        name: "",
        number: "",
        type: "",
        categoryId: "",
        note: "",
        productId: "",
        amount: "",
      });

      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error("Inquiry submit error:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to submit inquiry. Please try again."
      );
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-[#f3fbf4] px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-md rounded-[30px] border border-[#d6ead8] bg-white p-6 shadow-[0_24px_70px_rgba(31,103,48,0.14)]"
        >

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="mx-auto  py-2 flex items-center justify-center rounded-full  "
          >
            <img
              src={logo}
              alt="Gawdee Logo"
              className="w-[160px] object-contain"
            />
          </motion.div>

          <div className="mb-7 text-center">
            <h2 className="text-2xl font-[600] text-[#145c2a]">
              Gawdee Inquiry Form
            </h2>
            <p className=" text-sm text-[#5b7a62]">
              Please submit your basic details
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className=" block text-sm font-semibold text-[#245c34]">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] px-4 py-3 text-[#174b27] outline-none transition placeholder:text-[#8cab92] focus:border-[#2f9e44] focus:ring-4 focus:ring-[#2f9e44]/15"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#245c34]">
                Mobile Number
              </label>

              <div className="flex w-full items-center rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] transition focus-within:border-[#2f9e44] focus-within:ring-4 focus-within:ring-[#2f9e44]/15">
                <span className="select-none border-r border-[#cfe7d2] px-4 py-3 font-semibold text-[#174b27]">
                  +91
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.number}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, number: onlyNumbers.slice(0, 10) });
                  }}
                  placeholder="Enter 10 digit number"
                  className="w-full rounded-r-2xl bg-transparent px-4 py-3 text-[#174b27] outline-none placeholder:text-[#8cab92]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-[#245c34]">
                Category
              </label>

              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex w-full items-center justify-between rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] px-4 py-3 text-left text-[#174b27] outline-none transition focus:border-[#2f9e44] focus:ring-4 focus:ring-[#2f9e44]/15"
              >
                <span className={form.categoryId ? "font-medium" : "text-[#8cab92]"}>
                  {categories.find((cat) => cat._id === form.categoryId)?.name ||
                    "Select category"}
                </span>

                <motion.span
                  animate={{ rotate: categoryOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 8, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="absolute z-20 max-h-[220px] w-full overflow-y-auto rounded-2xl border border-[#cfe7d2] bg-white shadow-xl"
                  >
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-sm font-semibold text-[#8cab92]">
                        No categories found
                      </div>
                    ) : (
                      categories.map((item) => (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() => {
                            const selectedName = item?.name?.toLowerCase().trim();

                            setForm({
                              ...form,
                              categoryId: item._id,
                              note: selectedName === "b2c" ? "" : form.note,
                              productId: "",
                              amount: "",
                            });

                            setCategoryOpen(false);
                            setProductOpen(false);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#174b27] transition hover:bg-[#e8f7ea]"
                        >
                          {item.name}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {form.categoryId && !isB2C && (
              <div>
                <label className="block text-sm font-semibold text-[#245c34]">
                  Note
                </label>

                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Enter your note"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] px-4 py-3 text-[#174b27] outline-none transition placeholder:text-[#8cab92] focus:border-[#2f9e44] focus:ring-4 focus:ring-[#2f9e44]/15"
                />
              </div>
            )}

            {form.categoryId && isB2C && (
              <>
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#245c34]">
                    Product
                  </label>

                  <button
                    type="button"
                    onClick={() => setProductOpen(!productOpen)}
                    className="flex w-full items-center justify-between rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] px-4 py-3 text-left text-[#174b27] outline-none transition focus:border-[#2f9e44] focus:ring-4 focus:ring-[#2f9e44]/15"
                  >
                    <span className={form.productId ? "font-medium" : "text-[#8cab92]"}>
                      {products.find((product) => product._id === form.productId)?.name ||
                        "Select product"}
                    </span>

                    <motion.span
                      animate={{ rotate: productOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {productOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                        className="absolute z-20 max-h-[220px] w-full overflow-y-auto rounded-2xl border border-[#cfe7d2] bg-white shadow-xl"
                      >
                        {products.length === 0 ? (
                          <div className="px-4 py-3 text-sm font-semibold text-[#8cab92]">
                            No products found
                          </div>
                        ) : (
                          products.map((item) => (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, productId: item._id });
                                setProductOpen(false);
                              }}
                              className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#174b27] transition hover:bg-[#e8f7ea]"
                            >
                              {item.name}
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#245c34]">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-2xl border border-[#cfe7d2] bg-[#f8fff9] px-4 py-3 text-[#174b27] outline-none transition placeholder:text-[#8cab92] focus:border-[#2f9e44] focus:ring-4 focus:ring-[#2f9e44]/15"
                  />
                </div>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              type="submit"
              className="mt-3 w-full rounded-2xl bg-[#1f8f3a] py-3.5 font-bold text-white shadow-[0_14px_32px_rgba(31,143,58,0.32)] transition hover:bg-[#167a2f]"
            >
              Submit
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.75, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="w-full max-w-sm rounded-[28px] bg-white p-7 text-center shadow-2xl"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7ea] text-[#1f8f3a]">
                  <CheckCircle size={38} />
                </div>

                <h3 className="text-2xl font-bold text-[#145c2a]">
                  Submitted Successfully
                </h3>

                <p className="mt-2 text-sm text-[#5b7a62]">
                  Thank you. Your details have been received.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </>
  );
};

export default GawdeeForm;