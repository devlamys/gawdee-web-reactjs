/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion, AnimatePresence } from "framer-motion"
import Header from "@/component/Header"
import Footer from "@/component/Footer"
import { ApiPut, ApiGet } from "@/helper/axios"
import toast from "react-hot-toast"

import {
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function CancelOrderPage() {

  const { id } = useParams()
const navigate = useNavigate()
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)

useEffect(() => {
  fetchOrder()
}, [id])

const fetchOrder = async () => {
  try {
    const res = await ApiGet(`/order-summary/${id}`)
    setOrder(res?.data)
  } catch (err) {
    console.error(err)
  }
}

  const reasons = [
    "Ordered by mistake",
    "Found better price",
    "Delivery delay",
    "Changed my mind",
    "Other",
  ]

const handleSubmit = async () => {
  try {
    if (!reason) {
      toast.error("Please select a reason")
      return
    }

    setLoading(true)

    await ApiPut(`/order/cancel/${id}`, {
      reason: reason === "Other" ? note : reason,
    })

    toast.success("Order cancelled successfully")

    setSubmitted(true)

  } catch (err) {
    console.error(err)
    toast.error(err?.response?.data?.message || "Cancel failed")
  } finally {
    setLoading(false)
  }
}

console.log('order', order)

  useEffect(() => {
  if (submitted) {
    const timer = setTimeout(() => {
      navigate("/my-orders")
    }, 3000)

    return () => clearTimeout(timer)
  }
}, [submitted, navigate])

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto pt-[100px] md:pt-[140px] pb-[100px] px-4">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className=" md:text-3xl text-[20px] font-[600] md:font-bold text-gray-900 mb-[14px] md:mb-8"
        >
          Cancel Your Order
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-[20px] md:gap-8">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-white  rounded-[19px] md:rounded-3xl border border-gray-200 shadow-sm md:shadow-md p-5 md:p-6 overflow-hidden"
          >

            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200 blur-3xl opacity-30" />

            <h2 className="font-semibold text-lg mb-2 md:mb-5 flex items-center gap-2">
              <Package size={16} className="text-green-600" />
              Order Summary
            </h2>

            <div className="flex gap-4">
              <img
                src={order?.orderItems?.[0]?.selectedColorImage}
                className="md:w-[100px] w-[80px] h-[80px]  md:h-[100px] rounded-xl object-cover shadow"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {order?.orderItems?.[0]?.productId?.name || "Product"}
                </p>

                <p className="text-sm text-gray-500">
                  Qty: {order?.qty}
                </p>

                <p className="text-sm text-gray-500">
                  Placed on {order?.placedOn}
                </p>

                <p className="md:mt-2 text-green-600 font-bold text-lg">
                  ₹{order?.finalAmount}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2 md:space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-[600] flex items-center gap-1">
                  <CreditCard size={14} /> {order?.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className=" text-[12px] md:text-[15px] ">{new Date(order?.createdAt).toDateString()}</span>
              </div>

              <div className="flex justify-between text-[#0c776b]  font-semibold">
                <span>Refund Amount</span>
                <span>₹{order?.refund || 0}</span>
              </div>

            </div>

            <div className="md:mt-6 mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700">
              <p className="flex items-center gap-2 text-[#0c776b]  font-medium">
                <Clock size={14} /> Cancellation Window
              </p>

              <p className="mt-1 md:text-[15px] text-[12px] leading-[15px] md:leading-normal">
                You can cancel within 2 hours of placing the order.
                Refund will be processed within 5–7 days.
              </p>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-white  rounded-[19px] md:rounded-3xl border border-gray-200 shadow-sm md:shadow-md p-5 md:p-6 overflow-hidden"
          >

            <h2 className="font-semibold text-lg mb-3 md:mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              Why are you cancelling?
            </h2>

            <AnimatePresence mode="wait">

              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >

                  <div className="space-y-3 mb-4">

                    {reasons.map((item, i) => (
                      <motion.label
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition
                        ${reason === item
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                          }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={item}
                          className=" w-[16px] accent-red-500 h-[16px]"
                          checked={reason === item}
                          onChange={(e) => setReason(e.target.value)}
                        />

                        <span className="text-sm">{item}</span>
                      </motion.label>
                    ))}

                  </div>

                  {reason === "Other" && (
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Write your reason..."
                      rows={3}
                      className="w-full border rounded-xl text-[13px] px-4 py-3 mb-4"
                    />
                  )}

                  <button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 disabled:opacity-60"
>
  {loading ? "Cancelling..." : "Confirm Cancellation"}
</button>

                </motion.div>
              ) : (

                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <CheckCircle size={60} className="mx-auto text-green-600 mb-4" />

                  <h2 className="text-xl font-semibold text-[#0c776b] ">
                    Cancellation Requested
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Your request has been submitted successfully.
                  </p>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700">
                    It will be processed within <strong>1–2 hours</strong> and refund
                    will be initiated soon.
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </motion.div>

        </div>

      </div>

      <Footer />
    </>
  )
}