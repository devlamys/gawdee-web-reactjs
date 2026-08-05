/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { ApiGet } from "@/helper/axios";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Package,
  Heart,
  Gift,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Truck,
  FileText,
  User,
  CalendarDays,
  Save,
  Edit,
} from "lucide-react";

const statusUI = {
  pending: {
    label: "Placed",
    color: "bg-[#FFF7E5] text-[#B97900] border-[#FFE0A3]",
    icon: Clock,
  },
  confirmed: {
    label: "Packed",
    color: "bg-[#EEF7FF] text-[#2563EB] border-[#BFDBFE]",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-[#EEF7FF] text-[#2563EB] border-[#BFDBFE]",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-[#E9F8EE] text-[#1F7A3D] border-[#BFE8CA]",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-[#FFF0F0] text-[#D63B3B] border-[#FFCACA]",
    icon: X,
  },
};

export default function AllOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await ApiGet(`/order-list/${userId}`);
        const data =
          res?.data?.data ||
          res?.data?.orders ||
          res?.orders ||
          res?.data ||
          [];

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 pt-[120px] pb-[80px]">
        <h1 className="text-[22px] font-semibold text-[#1d2b1f] mb-6">
          All Orders
        </h1>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-10">
            <Package size={40} className="mx-auto mb-3 text-gray-400" />
            <p>No Orders Found</p>
          </div>
        ) : (
    <div className="space-y-4">
  {sortedOrders.map((order, index) => (
    <OrderCard
      key={order._id || index}
      order={order}
      index={index}
      navigate={navigate}
      onInvoiceClick={(order) =>
        navigate(`/my-orders/invoice/${order._id}`, {
          state: { order },
        })
      }
    />
  ))}
</div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function OrderCard({ order, index, navigate, onInvoiceClick }) {
  const orderStatus = String(order.orderStatus || order.status || "Pending").toLowerCase();
  const status = statusUI[orderStatus] || statusUI.pending;
  const StatusIcon = status.icon;

  const product = order.orderItems?.[0];
  const productImage =
    product?.selectedColorImage || product?.productId?.image || product?.image;

  const productName =
    product?.productId?.name || product?.name || "Gawdee Product";

  const amount = Number(
    order.priceDetails?.finalAmount || order.totalPrice || order.grandTotal || 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden border border-[#E5E7EB] rounded-[14px] bg-[#FCFCFA] hover:bg-white transition"
    >
      <div
        className={`absolute left-0 top-0 h-full w-[4px] ${orderStatus === "delivered"
          ? "bg-[#0c776b]"
          : orderStatus === "cancelled"
            ? "bg-red-500"
            : "bg-[#C9A96B]"
          }`}
      />

      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-[80px] h-[80px] rounded-[12px] border border-[#E5E7EB] bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full text-[10px] object-contain "
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap absolute  top-3 md:left-0 right-4 md:right-0 mx-auto w-fit items-center gap-2 mb-2">
            <span
              className={`inline-flex  items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${status.color}`}
            >
              <StatusIcon size={13} />
              {status.label}
            </span>

            <span className="text-[11px] text-[#8B9688]">
              {new Date(order.createdAt).toDateString()}
            </span>
          </div>

          <h3 className="font-semibold text-[#1d2b1f] text-[16px] truncate">
            {productName}
          </h3>

          <p className="text-[11px] text-[#6b776b] ">
            Order #{order._id?.slice(-6) || order.id} • {product?.variant || "500GM"} • Qty{" "}
            {product?.quantity || 1}
          </p>

          <OrderMiniProgress status={orderStatus} />

          {orderStatus === "cancelled" && (
            <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-[10px]">
              Reason: {order.cancelDetails?.reason || "Order cancelled"} • Refund: ₹
              {order.cancelDetails?.refundAmount || amount}
            </div>
          )}
        </div>

        <div className="md:text-right md:block flex w-[100%] md:w-fit justify-between">
          <p className="text-[20px] font-semibold text-[#0c776b]">
            ₹{amount.toLocaleString("en-IN")}
          </p>

          <div className="md:mt-3 flex md:justify-end gap-2">
            <button
              onClick={() => navigate(`/my-orders/order-details/${order._id}`)}
              className="h-[30px] px-4 rounded-[9px] bg-[#0c776b] text-white text-[12px] font-semibold"
            >
              Track
            </button>

            <button
              onClick={() => onInvoiceClick(order)}
              className="h-[30px] px-4 rounded-[9px] border border-[#D9E2D8] text-[#0c776b] bg-white text-[12px] font-[500] flex items-center gap-1"
            >
              <FileText size={14} />
              Invoice
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OrderMiniProgress({ status }) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  const steps = [
    {
      key: "pending",
      label: "Placed",
    },
    {
      key: "confirmed",
      label: "Packed",
    },
    {
      key: "shipped",
      label: "Shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];

  const statusStepMap = {
    pending: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 0,
  };

  const currentIndex = statusStepMap[normalizedStatus] ?? 0;
  const isCancelled = normalizedStatus === "cancelled";

  return (
    <div className="mt-4 hidden sm:block">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          const lineActive = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-2.5 h-2.5 rounded-full ${isCancelled && index === 0
                  ? "bg-red-500"
                  : active
                    ? "bg-[#0c776b]"
                    : "bg-[#DADFD8]"
                  }`}
              />

              {index !== steps.length - 1 && (
                <div
                  className={`h-[2px] flex-1 ${isCancelled && index === 0
                    ? "bg-red-300"
                    : lineActive
                      ? "bg-[#0c776b]"
                      : "bg-[#DADFD8]"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 mt-1">
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          const current = index === currentIndex;

          return (
            <p
              key={step.key}
              className={`text-[10px] ${isCancelled && index === 0
                ? "text-red-600 font-semibold"
                : current
                  ? "text-[#0c776b] font-semibold"
                  : active
                    ? "text-[#0c776b]"
                    : "text-[#8B9688]"
                }`}
            >
              {isCancelled && index === 0 ? "Cancelled" : step.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}