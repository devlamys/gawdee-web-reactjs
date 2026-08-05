/* Developed by Grafizen International PVT. LTD. */

'use client'

import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  CreditCard,
  XCircle,
  RotateCcw
} from "lucide-react"
import Header from "@/component/Header"
import Footer from "@/component/Footer"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ApiGet } from "@/helper/axios"
import { ApiPut } from "@/helper/axios"
import toast from "react-hot-toast"

export default function OrderDetailsPage() {

  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isReturnRequested, setIsReturnRequested] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  const handleReturnRequest = () => {
    navigate(`/my-orders/order-details/return-request/${order?._id}`)
  }

  useEffect(() => {
    console.log("Order ID:", id)

    if (!id) return;

    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await ApiGet(`/order-summary/${id}`)
      const data = res?.data;
      console.log('data', data)
      setOrder(data)
      if (data?.returnRequestStatus === "requested") {
        setIsReturnRequested(true)
      }
    } catch (err) {
      console.error(err)
    }
  };

  console.log('order', order)

  const orderStatus = order?.orderStatus || order?.status || "placed"

  const normalizedStatus = orderStatus?.toLowerCase()?.replace(/\s+/g, "_")

  const isCancelled = normalizedStatus === "cancelled"
  const isReturned = normalizedStatus === "returned"
  const isDelivered = normalizedStatus === "delivered"

  const steps = [
    { key: "placed", label: "Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ]

  const statusIndexMap = {
    pending: 0,
    placed: 0,
    processing: 1,
    confirmed: 1,
    packed: 1,
    shipped: 2,
    out_for_delivery: 2,
    delivered: 3,
  }

  const currentStep = statusIndexMap[normalizedStatus] ?? 0

  const getOrderStatusBadge = () => {
    if (isCancelled) {
      return {
        text: "Cancelled",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
      }
    }

    if (isReturned) {
      return {
        text: "Returned",
        className: "bg-orange-100 text-orange-700",
        icon: RotateCcw,
      }
    }

    if (isDelivered) {
      return {
        text: "Delivered",
        className: "bg-green-100 text-[#0c776b] ",
        icon: CheckCircle,
      }
    }

    if (normalizedStatus === "shipped" || normalizedStatus === "out_for_delivery") {
      return {
        text: "Shipped",
        className: "bg-blue-100 text-blue-700",
        icon: Truck,
      }
    }

    if (normalizedStatus === "confirmed" || normalizedStatus === "processing" || normalizedStatus === "packed") {
      return {
        text: "Confirmed",
        className: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
      }
    }

    return {
      text: "Placed",
      className: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    }
  }

  const orderBadge = getOrderStatusBadge()
  const OrderBadgeIcon = orderBadge.icon

  const paymentMethodValue = String(order?.paymentMethod || "").toLowerCase();

  const isCODPayment =
    paymentMethodValue === "cod" ||
    paymentMethodValue === "cash on delivery";

  const paymentStatusValue = isCODPayment
    ? "unpaid"
    : String(order?.paymentStatus || "paid").toLowerCase();

  const paymentBadge =
    paymentStatusValue === "paid" || paymentStatusValue === "completed"
      ? {
        text: "Paid ✔",
        className: "bg-green-100 text-green-600",
      }
      : {
        text: "Unpaid",
        className: "bg-yellow-100 text-yellow-700",
      };

  const canCancelOrder = !["cancelled", "delivered", "returned", "shipped", "out_for_delivery"].includes(normalizedStatus)

  const canReturnOrder =
    normalizedStatus === "delivered" &&
    order?.returnRequestStatus !== "requested" &&
    order?.returnRequestStatus !== "approved"

  const handleCancelOrder = () => {
    if (!canCancelOrder) {
      toast.error("This order cannot be cancelled now")
      return
    }

    navigate(`/my-orders/cancel/${order?._id}`)
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto pt-[100px] md:pt-[140px] pb-[80px] px-4 md:max-h-[98vh] md:overflow-y-auto">

        <div className="bg-white rounded-xl md:rounded-2xl p-[15px] md:p-5 border shadow-sm mb-4 md:mb-6">

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base">Order Status</h2>

          </div>

          {isCancelled ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center">
                <XCircle size={16} />
              </div>

              <div>
                <p className="font-semibold text-red-700 text-sm">
                  Order Cancelled
                </p>
                <p className="text-xs text-red-500 mt-1">
                  This order has been cancelled and will not be processed further.
                </p>
              </div>
            </div>
          ) : isReturned ? (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center">
                <RotateCcw size={16} />
              </div>

              <div>
                <p className="font-semibold text-orange-700 text-sm">
                  Order Returned
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  This order has been returned successfully.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center relative">

              {steps.map((step, index) => {
                const Icon = step.icon
                const active = index <= currentStep
                const completed = index < currentStep

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">

                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-[2px]
                ${completed ? "bg-green-500" : "bg-gray-300"}`}
                      />
                    )}

                    <div
                      className={`md:w-9 md:h-9 w-[40px] h-[40px] flex items-center justify-center rounded-full z-10 transition-all
              ${active ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-500"}`}
                    >
                      <Icon size={20} />
                    </div>

                    <p
                      className={`text-[11px] mt-2 text-center font-medium
              ${active ? "text-[#0c776b] " : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>

                  </div>
                )
              })}

            </div>
          )}
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-[15px] md:p-5 border shadow-sm mb-4  md:mb-6">

          <h2 className="font-semibold mb-4 text-base flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            Delivery Address
          </h2>

          <div className="space-y-1 text-sm">
            <p className="font-medium">{order?.customerDetails?.firstName} {order?.customerDetails?.lastName}</p>
            <p className="text-gray-500">{order?.customerDetails?.phone}</p>
            <p className="text-gray-500">{order?.customerDetails?.streetAddress}</p>
          </div>

        </div>
        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-white rounded-xl space-y-3 md:rounded-2xl p-[15px] md:p-5 border shadow-sm  md:mb-6">

            <h2 className="font-semibold  text-base flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              Items
            </h2>

            {order?.orderItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex gap-3  bg-gray-50 p-2 rounded-xl border border-gray-200"
              >

                <div className="relative">
                  <img src={item.selectedColorImage} className="w-14 h-14 rounded-lg object-cover" />

                </div>

                <div className="flex-1">

                  <p className="font-medium text-sm leading-snug">
                    {item.productId?.name}
                  </p>

                  <p className="text-[11px] text-gray-800 mt-[2px]">
                    500ml • Pure A2
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-600 font-semibold text-sm">
                      ₹{item.price}
                    </span>

                    <span className="text-gray-400 text-xs line-through">
                      ₹{item.price + 200}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>

                </div>

              </motion.div>
            ))}

          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <CreditCard size={16} className="text-green-600" />
                Payment Details
              </h2>

              <span
                className={`${paymentBadge.className} text-xs px-3 py-1 rounded-full font-medium`}
              >
                {paymentBadge.text}
              </span>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 space-y-3">

              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Payment Method</span>
                <span className="font-medium text-gray-900 flex items-center gap-2">
                  💳 {order?.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Transaction ID</span>
                <span className="text-xs font-mono text-gray-700">
                  TXN94837483
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  {isCODPayment ? "Ordered On" : "Paid On"}
                </span>
                <span className="text-gray-700 text-sm">
                  {order?.createdAt ? new Date(order.createdAt).toDateString() : "-"}
                </span>
              </div>

            </div>

            <div className="border-t my-4"></div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>
                  ₹{Number(order?.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">GST</span>
                <span>
                  ₹{Number(order?.gst || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total Paid</span>
                <span className="text-[#0c776b]  text-lg">
                  ₹{Number(order?.finalAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            <div className="md:col-span-2  md:block hidden mt-[10px] bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-3 shadow-sm">

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                <div>
                  <h2 className="font-semibold   text-base text-gray-900">
                    Want to cancel this order?
                  </h2>

                </div>

                <button
                  onClick={handleCancelOrder}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full font-medium transition-all shadow-sm"
                >
                  Cancel Order
                </button>

              </div>

            </div>
          </div>

          <div className="bg-white  md:block hidden rounded-2xl p-5 border shadow-sm">

            <h2 className="font-semibold mb-4 text-base flex items-center gap-2">
              <MapPin size={16} className="text-green-600" />
              Delivery Address
            </h2>

            <div className="space-y-1 text-sm">
              <p className="font-medium">{order?.customerDetails?.firstName} {order?.customerDetails?.lastName}</p>
              <p className="text-gray-500">{order?.customerDetails?.phone}</p>
              <p className="text-gray-500">{order?.customerDetails?.streetAddress}</p>
            </div>

          </div>

          <div className="md:col-span-2  md:hidden block mt-[10px] bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-3 shadow-sm">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>
                <h2 className="font-semibold   text-base text-gray-900">
                  Want to cancel this order?
                </h2>

              </div>

              <button
                onClick={handleCancelOrder}
                className="bg-red-600 w-fit hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full font-medium transition-all shadow-sm"
              >
                Cancel Order
              </button>

            </div>

          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 shadow-sm">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>
                <h2 className="font-semibold text-base text-gray-900">
                  Want to return this product?
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Easy 7-day return & refund policy for damaged or wrong items.
                </p>
              </div>

              <button
                onClick={handleReturnRequest}
                disabled={isReturnRequested}
                className={`px-5 py-2 w-fit rounded-full text-sm
    ${isReturnRequested
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-[#0c776b]  text-white"
                  }`}
              >
                {isReturnRequested ? "Return Requested" : "Request Return"}
              </button>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  )
}