/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion } from 'framer-motion'
import {
  Receipt,
  User,
  MapPin,
  Phone,
  CreditCard,
  CalendarDays,
  PackageCheck,
} from 'lucide-react'

export default function CheckoutReceiptCard({
  checkoutData,
  selectedAddress,
  selectedPayment,
  selectedDelivery,
  subtotal,
  discount,
  coupon,
  shipping,
  tax,
  total,
  onSave,
  loading = false, 
}) {
  if (!checkoutData) return null;

  const receipt = {
    orderNo: `GAW-${Date.now()}`,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    customerName: selectedAddress?.name,
    phone: selectedAddress?.phone,
    address: selectedAddress?.address,
    pincode: selectedAddress?.pincode || selectedAddress?.pinCode || selectedAddress?.zipCode,

    paymentMethod: selectedPayment?.name,
    deliveryType: selectedDelivery?.name,

    items: checkoutData?.items?.reduce(
      (acc, i) => acc + (i.quantity || i.qty || 1),
      0
    ),

    subtotal,
    discount,
    coupon,
    delivery: shipping,
    tax,
    total,
  };

  const items =
    (checkoutData?.items && checkoutData.items.length > 0
      ? checkoutData.items
      : checkoutData?.cart) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-green-200 bg-white shadow-[0_10px_35px_rgba(34,197,94,0.10)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-green-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md">
              <Receipt size={18} />
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">
                Order Receipt
              </h3>
              <p className="text-[11px] text-slate-500">
                Payment summary & customer details
              </p>
            </div>
          </div>

          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-[#0c776b] border border-green-200"
          >
            Confirmed
          </motion.span>
        </div>

        <div className="mt-3 space-y-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-3 border border-green-100">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-slate-500">Receipt No</span>
            <span className="font-semibold text-slate-800">{receipt.orderNo}</span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-slate-500 flex items-center gap-1">
              <CalendarDays size={13} className="flex-shrink-0" />
              Date
            </span>
            <span className="font-medium text-slate-800">{receipt.date}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-700">
            Customer Details
          </h4>

          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
              <User size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-[11px] text-slate-500">Name</p>
                <p className="text-[12px] font-medium text-slate-800">
                  {receipt.customerName || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
              <Phone size={15} className="mt-0.5 text-green-600" />
              <div>
                <p className="text-[11px] text-slate-500">Phone</p>
                <p className="text-[12px] font-medium text-slate-800">
                  {receipt.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
              <MapPin size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-[11px] text-slate-500">Address</p>

                <p className="text-[12px] leading-relaxed text-slate-700">
                  {receipt.address || "-"}
                </p>

                <p className="mt-1 text-[12px] font-medium text-slate-800">
                  Pincode: {receipt.pincode || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <CreditCard size={13} />
              Payment
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-800">
              {receipt.paymentMethod || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <PackageCheck size={13} />
              Delivery
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-800">
              {receipt.deliveryType || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-green-100 bg-white p-3">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-700">
            Bill Summary
          </h4>

          <div className="mb-3 space-y-2">
            {items.length === 0 ? (
              <p className="text-red-500 text-sm">No items available</p>
            ) : (
              items.map((item, i) => {
                const name = item?.name || "Product";
                const qty = Number(item?.qty || item?.quantity || 1);
                const mrp = Number(item?.mrp || item?.price || 0);
                const salePrice = Number(item?.price || item?.salePrice || 0);
                const image = item?.image;

                const discountAmount = Math.max(mrp - salePrice, 0);
                const discountPercent =
                  mrp > 0 && discountAmount > 0
                    ? Math.round((discountAmount / mrp) * 100)
                    : 0;

                return (
                  <div
                    key={item?.id || item?._id || i}
                    className="flex items-center justify-between text-[12px] border-b pb-2"
                  >
                    <div className="flex items-center gap-2">
                      {image && (
                        <img
                          src={image}
                          alt={name}
                          className="w-10 h-10 rounded object-cover border"
                        />
                      )}

                      <div>
                        <p className="font-medium text-slate-800">
                          {name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Qty: {qty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {mrp > salePrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          ₹{Number(mrp * qty).toLocaleString("en-IN")}
                        </p>
                      )}

                      <p className="font-medium text-slate-800">
                        ₹{Number(salePrice * qty).toLocaleString("en-IN")}
                      </p>

                      {discountPercent > 0 && (
                        <p className="text-[10px] font-semibold text-green-600">
                          {discountPercent}% OFF
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-800">
                ₹{Number(receipt.subtotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-red-500">Discount</span>
              <span className="font-medium text-red-500">
                -₹{Number(receipt.discount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Delivery</span>
              <span className="font-medium text-slate-800">
                ₹{Number(receipt.delivery || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {Number(receipt.giftPackaging || 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Gift Packaging</span>
                <span className="font-medium text-slate-800">
                  ₹{Number(receipt.giftPackaging || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Tax 5%</span>
              <span className="font-medium text-slate-800">
                ₹{Number(receipt.tax || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="my-2 border-t border-dashed border-slate-200" />

            <div className="flex justify-between">
              <span className="text-[13px] font-semibold text-slate-900">
                Total Amount
              </span>
              <span className="text-[18px] font-bold text-green-600">
                ₹{Number(receipt.total || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              disabled={loading}
              onClick={onSave}
              className={`w-full py-2 font-[600] rounded-lg sm:rounded-xl transition-all text-base sm:text-lg flex items-center justify-center gap-2 ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5"
        >
          <p className="text-[11px] leading-relaxed text-[#0c776b]">
            This receipt is generated for your current checkout details. Please
            verify address, payment method, and applied discounts before placing
            the order.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}