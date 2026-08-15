/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  MapPin,
  CreditCard,
  RotateCcw
} from "lucide-react"
import Header from "@/component/Header"
import Footer from "@/component/Footer"

export default function ReturnDetailsPage() {

  const order = {
    orderId: "#GAW5678",
    returnStatus: "under-process",
    createdAt: new Date(),
    paymentMethod: "Online Payment",
    refundAmount: 999,

    returnDetails: {
      reason: "Damaged Product",
      requestedAt: new Date(),
      pickupDate: "Tomorrow",
      refundMode: "Original Payment Method",
    },

    items: [
      {
        name: "Raw Forest Honey",
        price: 499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924"
      }
    ],

    delivery: {
      name: "Gawdee User",
      phone: "7055207030",
      address: "Rajkot, Gujarat"
    }
  }

  const steps = [
    { label: "Requested", icon: Package },
    { label: "Pickup Scheduled", icon: Truck },
    { label: "Approved", icon: CheckCircle },
    { label: "Refunded", icon: CreditCard }
  ]

  const currentStep = 1

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto pt-[140px] pb-[80px] px-4">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Return Details
        </motion.h1>

        <div className="bg-white rounded-2xl p-5 border shadow-sm mb-6">

          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-base">Return Status</h2>

            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <Clock size={12} />
              Under Process
            </span>
          </div>

          <div className="flex justify-between items-center relative">

            {steps.map((step, index) => {
              const Icon = step.icon
              const active = index <= currentStep

              return (
                <div key={index} className="flex flex-col items-center flex-1 relative">

                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-[2px]
                      ${index < currentStep ? "bg-yellow-500" : "bg-gray-300"}`}
                    />
                  )}

                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full z-10
                    ${active ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    <Icon size={14} />
                  </div>

                  <p className="text-[11px] mt-2 text-center">
                    {step.label}
                  </p>

                </div>
              )
            })}
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <h2 className="font-semibold mb-4 text-base flex items-center gap-2">
              <RotateCcw size={16} className="text-yellow-600" />
              Returning Product
            </h2>

            {order.items.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex gap-3 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
              >

                <img src={item.image} className="w-14 h-14 rounded-lg object-cover" />

                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>

                  <p className="text-yellow-600 text-xs mt-1">
                    Return Reason: {order.returnDetails.reason}
                  </p>
                </div>

                <p className="text-green-600 font-semibold text-sm">
                  ₹{item.price}
                </p>

              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <h2 className="font-semibold mb-4 text-base">
              Return Information
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Requested On</span>
                <span>{new Date(order.returnDetails.requestedAt).toDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Pickup</span>
                <span>{order.returnDetails.pickupDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Refund Mode</span>
                <span>{order.returnDetails.refundMode}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Refund Amount</span>
                <span className="text-[#0c776b] ">
                  ₹{order.refundAmount}
                </span>
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <h2 className="font-semibold mb-4 text-base flex items-center gap-2">
              <MapPin size={16} className="text-green-600" />
              Pickup Address
            </h2>

            <p className="text-sm">{order.delivery.name}</p>
            <p className="text-sm text-gray-500">{order.delivery.phone}</p>
            <p className="text-sm text-gray-500">{order.delivery.address}</p>

          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-2xl p-5 shadow-sm">

            <h2 className="font-semibold text-base mb-2">
              Need Help?
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              Your return is under process. For any issues, contact support.
            </p>

            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm">
              Contact Support
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  )
}