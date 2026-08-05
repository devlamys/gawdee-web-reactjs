/* Developed by Grafizen International PVT. LTD. */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from "lenis/react";
import sale from "../../../public/imges/productDetails/newIdea/promotion.png"
import {
  MapPin,
  Phone,
  Home,
  Truck,
  Lock,
  Check,
  Plus,
  X,
  Star,
  Leaf,
  ShieldCheck,
  Zap,
  Box,
  CpuIcon,
  BadgePercent,
  Copy,
} from 'lucide-react';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { ApiPost, ApiGet } from '@/helper/axios';
import CheckoutReceiptCard from '@/component/OrderProcess/CheckOutReicptCard';

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderLoadingText, setOrderLoadingText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [showOrderSuccessPopup, setShowOrderSuccessPopup] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  const paymentMethods = [
    {
      id: "COD",
      name: "Cash on Delivery",
      icon: "💵",
      description: "Pay when you receive your order",
    },
    {
      id: "RAZORPAY",
      name: "Online Payment",
      icon: "💳",
      description: "UPI, Card, Net Banking, Wallet",
    },
  ];

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "Rajkot",
    state: "Gujarat",
    country: "India",
    type: "Home",
  });

  useEffect(() => {
    const storedCheckoutData = localStorage.getItem("checkoutData");

    if (!storedCheckoutData) {
      console.log("No checkout data found");
      return;
    }

    try {
      const parsed = JSON.parse(storedCheckoutData);

      const formattedItems = (parsed?.items || []).map((item) => ({
        cartItemId: item?.cartItemId || item?._id,
        productId: item?.productId || item?.id || item?._id,

        name: item?.name || "Product",

        selectedColor:
          item?.selectedColor ||
          item?.variant ||
          item?.size ||
          "Variant",

        variant:
          item?.variant ||
          item?.selectedColor ||
          item?.size ||
          "Variant",

        image: item?.image || item?.selectedColorImage || "",

        price: Number(item?.price || 0),
        mrp: Number(item?.mrp || item?.price || 0),

        quantity: Number(item?.quantity || item?.qty || 1),
        qty: Number(item?.quantity || item?.qty || 1),
      }));

      const mrpSubtotal = formattedItems.reduce((sum, item) => {
        return sum + Number(item.mrp || item.price || 0) * Number(item.quantity || 1);
      }, 0);

      const saleSubtotal = formattedItems.reduce((sum, item) => {
        return sum + Number(item.price || item.salePrice || 0) * Number(item.quantity || 1);
      }, 0);

      const productDiscount = Math.max(mrpSubtotal - saleSubtotal, 0);

      setCheckoutData({
        ...parsed,
        items: formattedItems,

        subtotal: mrpSubtotal,

        saleSubtotal,

        discount: productDiscount,

        total: saleSubtotal,
      });

      console.log("CHECKOUT DATA LOADED:", {
        ...parsed,
        items: formattedItems,
        subtotal,
      });
    } catch (error) {
      console.error("Invalid checkout data:", error);
      localStorage.removeItem("checkoutData");
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const getAddressStorageKey = (id) => `addresses_${id}`;

  const fetchUserAddresses = async (id) => {
    try {
      if (!id) return;

      setAddressLoading(true);

      const localAddresses = localStorage.getItem(getAddressStorageKey(id));

      if (localAddresses) {
        const parsedAddresses = JSON.parse(localAddresses);
        setAddresses(parsedAddresses);

        if (parsedAddresses.length > 0) {
          setSelectedAddress(0);
        }
      }
    } catch (error) {
      console.error("Fetch user addresses error:", error);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserAddresses(userId);
    }
  }, [userId]);

  useEffect(() => {
    const stored = localStorage.getItem("addresses");

    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  const checkoutSteps = [
    { id: 1, name: 'Cart', completed: true },
    { id: 2, name: 'Address', completed: true },
    { id: 3, name: 'Delivery', completed: true },
    { id: 4, name: 'Payment', current: true },
    { id: 5, name: 'Review', completed: false },
  ];

  const handleAddNewAddress = () => {
    try {
      if (!userId) {
        alert("Please login first");
        return;
      }

      if (
        !newAddress.name ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.pincode
      ) {
        alert("Please fill all address details");
        return;
      }

      if (newAddress.pincode.length !== 6) {
        alert("Please enter valid 6 digit pincode");
        return;
      }

      const addressToAdd = {
        id: Date.now(),
        userId,
        name: newAddress.name,
        phone: newAddress.phone,
        address: newAddress.address,
        pincode: newAddress.pincode,
        city: newAddress.city || "Rajkot",
        state: newAddress.state || "Gujarat",
        country: newAddress.country || "India",
        type: newAddress.type || "Home",
      };

      const updated = [...addresses, addressToAdd];

      setAddresses(updated);

      localStorage.setItem(
        getAddressStorageKey(userId),
        JSON.stringify(updated)
      );

      setSelectedAddress(updated.length - 1);

      setNewAddress({
        name: "",
        phone: "",
        address: "",
        pincode: "",
        city: "Rajkot",
        state: "Gujarat",
        country: "India",
        type: "Home",
      });

      setShowAddressModal(false);

      alert("Address added successfully");
    } catch (error) {
      console.error("Add address error:", error);
      alert("Failed to add address");
    }
  };

  const fetchDeliveryOptions = async () => {
    try {
      setDeliveryLoading(true);

      const res = await ApiGet('/admin/delivery-options');

      const data =
        res?.deliveryOptions ||
        res?.data?.deliveryOptions ||
        res?.data ||
        [];

      const formattedOptions = data.map((item) => ({
        id: item?._id,
        _id: item?._id,
        name: item?.name || '',
        days: item?.estimatedDays || '',
        price: Number(item?.price || 0),
        description: item?.description || 'Freshly packed and carefully delivered',
        eligible: item?.available ?? true,
      }));

      setDeliveryOptions(formattedOptions);

      if (formattedOptions.length > 0) {
        setSelectedDelivery(0);
      }
    } catch (error) {
      console.error('Fetch delivery options error:', error);
    } finally {
      setDeliveryLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOptions();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const TAX_RATE = 0.05;

  const getTaxBreakupFromInclusivePrice = (inclusivePrice) => {
    const priceWithTax = Number(inclusivePrice || 0);

    if (!priceWithTax) {
      return {
        taxableAmount: 0,
        taxAmount: 0,
      };
    }

    const taxableAmount = priceWithTax / (1 + TAX_RATE);
    const taxAmount = priceWithTax - taxableAmount;

    return {
      taxableAmount,
      taxAmount,
    };
  };

  const cartItems = checkoutData?.items || [];

  const subtotal = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity || item.qty || 1);
    const mrp = Number(item.mrp || item.price || 0);

    return sum + mrp * qty;
  }, 0);

  const saleSubtotal = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity || item.qty || 1);
    const salePriceWithTax = Number(item.price || item.salePrice || 0);

    return sum + salePriceWithTax * qty;
  }, 0);

  const taxableProductAmountBeforeCoupon = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity || item.qty || 1);
    const salePriceWithTax = Number(item.price || item.salePrice || 0);
    const { taxableAmount } = getTaxBreakupFromInclusivePrice(salePriceWithTax);

    return sum + taxableAmount * qty;
  }, 0);

  const includedTax = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity || item.qty || 1);
    const salePriceWithTax = Number(item.price || item.salePrice || 0);
    const { taxAmount } = getTaxBreakupFromInclusivePrice(salePriceWithTax);

    return sum + taxAmount * qty;
  }, 0);

  const productDiscount = Math.max(subtotal - saleSubtotal, 0);

  const couponDiscount = Number(checkoutData?.couponDiscount || 0);

  const discount = productDiscount;

  const selectedDeliveryOption = deliveryOptions[selectedDelivery];

  const shippingCost = selectedDeliveryOption
    ? Number(selectedDeliveryOption.price || 0)
    : 0;

  const giftPackagingCharge = giftPackaging ? 99 : 0;

  const taxableProductAmount = Math.max(
    taxableProductAmountBeforeCoupon,
    0
  );

  const tax = Math.round(includedTax);

  const total =
    Math.max(saleSubtotal - couponDiscount, 0) +
    shippingCost +
    giftPackagingCharge;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const getOrderMongoIdFromResponse = (response) => {
    return (
      response?.data?._id ||
      response?.data?.data?._id ||
      response?.data?.order?._id ||
      response?.data?.orderSummary?._id ||
      response?._id ||
      response?.order?._id ||
      response?.orderSummary?._id ||
      null
    );
  };

  const createIcarryShipmentAfterOrder = async (orderResponse) => {
    try {
      const orderMongoId = getOrderMongoIdFromResponse(orderResponse);

      if (!orderMongoId) {
        console.warn("iCarry shipment skipped: Order MongoDB ID not found", orderResponse);
        return null;
      }

      const shipmentRes = await ApiPost(
        `/shipping/icarry/create/${orderMongoId}`,

      );

      console.log("iCarry Shipment Response:", shipmentRes);
      return shipmentRes;
    } catch (error) {
      console.error(
        "iCarry shipment creation failed:",
        error?.response?.data || error?.message
      );

      return null;
    }
  };

  const showSuccessAndRedirect = (orderResponse) => {
    const orderId =
      orderResponse?.data?.orderId ||
      orderResponse?.data?.order?._id ||
      orderResponse?.data?.orderSummary?._id ||
      orderResponse?.order?._id ||
      orderResponse?.orderSummary?._id ||
      orderResponse?._id ||
      "";

    setCreatedOrderId(orderId);
    setShowOrderSuccessPopup(true);
    setLoading(false);
    setOrderLoadingText("");

    setTimeout(() => {
      window.location.href = "/my-orders";
    }, 1800);
  };

  const handlePlaceOrder = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setOrderLoadingText("Creating your order...");

      if (!checkoutData) {
        alert("Cart data missing");
        return;
      }

      if (addresses.length === 0) {
        alert("Please add address");
        return;
      }

      const selectedAddr = addresses[selectedAddress];

      if (!selectedAddr) {
        alert("Please select delivery address");
        return;
      }

      const nameParts = selectedAddr.name?.trim().split(" ") || [];

      const customerDetails = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: selectedAddr.phone || "",
        email: selectedAddr.email || "test@gmail.com",
        country: selectedAddr.country || "India",
        streetAddress: selectedAddr.address || "",
        state: selectedAddr.state || "Gujarat",
        pinCode: selectedAddr.pincode || "",
      };

      const orderItems = checkoutData.items.map((item) => {
        const quantity = Number(item.quantity || item.qty || 1);
        const mrp = Number(item.mrp || item.price || 0);
        const salePrice = Number(item.price || item.salePrice || 0);

        const { taxableAmount, taxAmount } =
          getTaxBreakupFromInclusivePrice(salePrice);

        const actualPrice = Math.round(taxableAmount);
        const itemTax = Math.round(taxAmount);

        const itemDiscount = Math.max(mrp - salePrice, 0);

        const discountPercent =
          mrp > 0 && itemDiscount > 0
            ? Math.round((itemDiscount / mrp) * 100)
            : 0;

        return {
          productId: item.productId || item.id || item._id,
          cartItemId: item.cartItemId,
          name: item.name,
          selectedColor: item.selectedColor || item.variant || "",
          variant: item.variant || item.selectedColor || "",
          quantity,

          price: salePrice,
          salePrice,
          sellingPrice: salePrice,
          priceWithTax: salePrice,

          basePrice: actualPrice,
          taxablePrice: actualPrice,
          actualPrice,
          taxableAmount: actualPrice,

          mrp,

          itemDiscount,
          discountPercent,

          tax: itemTax * quantity,
          gst: itemTax * quantity,
          taxRate: 5,
          taxIncluded: true,

          mrpTotal: mrp * quantity,

          taxableTotal: actualPrice * quantity,

          saleTotal: salePrice * quantity,
          total: salePrice * quantity,
          itemTotal: salePrice * quantity,

          discountTotal: itemDiscount * quantity,

          image: item.image || "",
          selectedColorImage: item.image || "",
        };
      });

      const shippingAddress = {
        street: selectedAddr.address,
        city: selectedAddr.city || "Rajkot",
        state: selectedAddr.state || "Gujarat",
        zipCode: selectedAddr.pincode || "",
        pinCode: selectedAddr.pincode || "",
        country: selectedAddr.country || "India",
      };

      const paymentMethod = selectedPayment === "COD" ? "COD" : "razorpay";

      const payload = {
        userId,
        customerDetails,
        shippingAddress,
        paymentMethod,
        orderItems,

        totalPrice: saleSubtotal,
        finalAmount: total,

        deliveryDetails: {
          methodId: selectedDeliveryOption?._id || selectedDeliveryOption?.id || "",
          name: selectedDeliveryOption?.name || "",
          price: Number(selectedDeliveryOption?.price || 0),
          estimatedDays: selectedDeliveryOption?.days || "",
        },

        priceDetails: {

          originalSubtotal: subtotal,

          subtotal: Math.round(taxableProductAmount),

          taxableSubtotal: Math.round(taxableProductAmount),

          saleSubtotal,

          discount,

          couponDiscount,
          shippingCost,
          giftPackaging: giftPackagingCharge,

          tax,
          gst: tax,
          taxRate: 5,
          taxIncluded: true,

          finalAmount: total,

          productDiscount,
          totalSavings: discount + couponDiscount,
        },
        giftPackaging: {
          selected: giftPackaging,
          price: giftPackagingCharge,
        },

        coupon: checkoutData?.coupon || null,
      };

      console.log("FINAL PAYLOAD:", payload);

      if (paymentMethod === "COD") {
        const codRes = await ApiPost("/create-order", payload);

        console.log("COD ORDER RESPONSE:", codRes);

        if (codRes?.success || codRes?.data?.success || codRes?.data || codRes?.status === 200) {
          setOrderLoadingText("Order placed successfully...");

          createIcarryShipmentAfterOrder(codRes);

          localStorage.removeItem("checkoutData");

          showSuccessAndRedirect(codRes);
          return;
        }

        alert(codRes?.message || codRes?.data?.message || "Order failed");
        return;
      }

      setOrderLoadingText("Opening secure payment...");

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Failed to load Razorpay checkout");
        return;
      }

      const razorRes = await ApiPost("/create-razorpay-order", {
        amount: Number(total),
      });

      console.log("RAZORPAY ORDER RESPONSE:", razorRes);

      const razorpayKey =
        razorRes?.key ||
        razorRes?.data?.order?.key;

      const razorpayOrder =
        razorRes?.order ||
        razorRes?.data?.order?.order;

      if (!razorpayKey || !razorpayOrder?.id) {
        console.error("Invalid Razorpay response:", razorRes);
        alert("Failed to create Razorpay order");
        return;
      }

      setLoading(false);
      setOrderLoadingText("");

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Gawdee",
        description: "Secure Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            setLoading(true);
            setOrderLoadingText("Verifying payment and placing order...");

            const verifyPayload = {
              ...payload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            console.log("VERIFY PAYLOAD:", verifyPayload);

            const verifyRes = await ApiPost("/create-order", verifyPayload);

            console.log("VERIFY RESPONSE:", verifyRes);

            if (
              verifyRes?.success ||
              verifyRes?.data?.success ||
              verifyRes?.status === 200
            ) {
              setOrderLoadingText("Order placed successfully...");

              createIcarryShipmentAfterOrder(verifyRes);

              localStorage.removeItem("checkoutData");
              showSuccessAndRedirect(verifyRes);

              return;
            }

            alert(
              verifyRes?.message ||
              verifyRes?.data?.message ||
              "Payment verification failed"
            );
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              error?.response?.data?.message ||
              error?.message ||
              "Payment verification failed"
            );
          } finally {
            setLoading(false);
            setOrderLoadingText("");
          }
        },

        prefill: {
          name: selectedAddr.name || "",
          email: customerDetails.email || "",
          contact: selectedAddr.phone || "",
        },

        theme: {
          color: "#16a34a",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setOrderLoadingText("");
            console.log("Razorpay popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setLoading(false);
        setOrderLoadingText("");
        console.error("RAZORPAY PAYMENT FAILED:", response);
        alert(response?.error?.description || "Payment failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Order Error:", error);
      alert(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      if (selectedPayment === "COD") {
        setLoading(false);
        setOrderLoadingText("");
      }
    }
  };

  console.log('cartItems', cartItems)

  return (

    <>
      <div
        className="relative w-full min-h-screen bg-white overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >

        <Header />
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-[90%] max-w-[360px] rounded-2xl bg-white p-6 text-center shadow-2xl"
              >
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

                <h3 className="text-[18px] font-semibold text-gray-900">
                  Please wait
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {orderLoadingText || "Processing your order..."}
                </p>

                <p className="mt-3 text-[12px] text-gray-400">
                  Do not refresh or press back.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showOrderSuccessPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/45 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 25 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
                className="w-full max-w-[380px] overflow-hidden rounded-[24px] bg-white shadow-2xl"
              >
                <div className="relative bg-gradient-to-br from-green-700 to-emerald-500 px-6 py-7 text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-green-600 shadow-lg"
                  >
                    <Check size={34} strokeWidth={3} />
                  </motion.div>

                  <h2 className="mt-4 text-[22px] font-semibold">
                    Order Created Successfully!
                  </h2>

                  <p className="mt-1 text-sm text-white/85">
                    Thank you for shopping with Gawdee.
                  </p>
                </div>

                <div className="px-6 py-5 text-center">
                  {createdOrderId && (
                    <div className="mb-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {createdOrderId}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    Redirecting you to My Orders...
                  </p>

                  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                      className="h-full rounded-full bg-green-600"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-min-h-screen bg-gradient-to-br pt-[140px] "
        >

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              <div className="lg:col-span-2 space-y-4 ">

                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl  shadow-sm transition-shadow p-4 border "
                >
                  <div className=' lg:flex w-[100%] justify-between lg:mb-3'>
                    <div className="flex items-center gap-3 ">
                      <MapPin size={24} className="text-green-600" />
                      <h2 className="text-[16px] font-[600] text-gray-900">Delivery Address</h2>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddressModal(true)}
                      className=" w-fit lg:mt-0 mt-5  text-[14px] py-2 px-3 bg-green-100 text-[#0c776b]  font-[500] rounded-md hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add New Address
                    </motion.button>

                  </div>

                  <div className="gap-[14px] flex flex-wrap mb-3">
                    {addressLoading ? (
                      <div className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
                        Loading saved address...
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                        No delivery address found. Please add your delivery address.
                      </div>
                    ) : (
                      addresses.map((addr, idx) => (
                        <motion.div
                          key={addr.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedAddress(idx)}
                          className={`p-4 rounded-xl sm:rounded-2xl border-1 cursor-pointer transition-all ${selectedAddress === idx
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-green-300'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${selectedAddress === idx
                                ? 'border-green-600 bg-green-600'
                                : 'border-gray-300'
                                }`}
                            >
                              {selectedAddress === idx && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-gray-900">{addr.name}</p>
                                <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded-lg">
                                  {addr.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                                <Phone size={14} /> {addr.phone}
                              </p>
                              <p className="text-sm text-gray-700">{addr.address}</p>
                              <p className="text-sm text-gray-700">{addr.pincode}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-col  justify-end sm:flex-row gap-3">

                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl  shadow-sm transition-shadow p-4 border "

                >
                  <div className="flex items-center gap-3 mb-3">
                    <Truck size={24} className="text-green-600" />
                    <h2 className="text-[16px]  font-[600] text-gray-900">Delivery Options</h2>
                  </div>

                  <div className=" lg:flex  grid grid-cols-1 gap-[10px] mb-3">
                    <div className=" lg:flex  grid grid-cols-1 gap-[10px] mb-3">
                      <div className=" lg:flex  grid grid-cols-1 gap-[10px] mb-3">
                        {deliveryLoading ? (
                          <div className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
                            Loading delivery options...
                          </div>
                        ) : deliveryOptions.length === 0 ? (
                          <div className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
                            No delivery option available
                          </div>
                        ) : (
                          deliveryOptions.map((option, idx) => (
                            <motion.div
                              key={option.id}
                              whileHover={option.eligible ? { scale: 1.02 } : {}}
                              onClick={() => option.eligible && setSelectedDelivery(idx)}
                              className={`p-2 rounded-xl sm:rounded-2xl min-w-[240px] border cursor-pointer transition-all ${!option.eligible
                                ? 'opacity-60 cursor-not-allowed'
                                : selectedDelivery === idx
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-300'
                                }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-[10px]">
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${selectedDelivery === idx && option.eligible
                                          ? 'border-green-600 bg-green-600'
                                          : 'border-gray-300'
                                          }`}
                                      >
                                        {selectedDelivery === idx && option.eligible && (
                                          <Check size={14} className="text-white" />
                                        )}
                                      </div>

                                      <h3 className="font-semibold text-[14px] pt-[3px] text-gray-900">
                                        {option.name}
                                      </h3>
                                    </div>

                                    <span className="text-lg font-[600] text-green-600">
                                      ₹{Number(option.price || 0)}
                                    </span>
                                  </div>

                                  <p className="text-sm text-gray-600 ml-7">
                                    {option.days}
                                  </p>

                                  {!option.eligible && (
                                    <p className="text-xs text-red-600 mt-2">
                                      Not available for your location
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                      ✓ Freshly packed and carefully delivered to ensure optimal freshness and quality.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl  shadow-sm transition-shadow p-4 border "
                >     <div className="flex items-center gap-3 mb-3">
                    <Box size={24} className="text-green-600" />
                    <h2 className="text-[16px]  font-[600] text-gray-900">Product Review</h2>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.cartItemId || item.productId || index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl sm:rounded-2xl p-5 border hover:border-green-200 shadow-md transition-all"
                      >
                        <div className="flex gap-4">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 sm:w-24 sm:h-24 rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-600 mb-3">
                              Selected Variant:{" "}
                              <span className="font-semibold text-gray-900">
                                {item.selectedColor || item.variant || "Variant"}
                              </span>
                            </p>

                            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                              <span className="text-gray-600">
                                Qty:{" "}
                                <span className="font-semibold text-gray-900">
                                  {item.quantity || item.qty || 1}
                                </span>
                              </span>

                              <span className="text-gray-600">
                                Pack:{" "}
                                <span className="font-semibold text-gray-900">
                                  {item.selectedColor || item.variant || "Variant"}
                                </span>
                              </span>

                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                Variant Price
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            {(() => {
                              const qty = Number(item.quantity || item.qty || 1);
                              const mrp = Number(item.mrp || item.price || 0);
                              const salePrice = Number(item.price || item.salePrice || 0);
                              const { taxableAmount, taxAmount } =
                                getTaxBreakupFromInclusivePrice(salePrice);

                              const actualPrice = Math.round(taxableAmount);
                              const itemTax = Math.round(taxAmount);

                              const discountAmount = Math.max(mrp - salePrice, 0);
                              const discountPercent =
                                mrp > 0 && discountAmount > 0
                                  ? Math.round((discountAmount / mrp) * 100)
                                  : 0;

                              return (
                                <>
                                  {mrp > salePrice && (
                                    <p className="text-gray-500 text-xs line-through">
                                      ₹{mrp.toLocaleString("en-IN")}
                                    </p>
                                  )}

                                  <p className="text-[11px] text-gray-500">
                                    Base: ₹{actualPrice.toLocaleString("en-IN")} + Tax 5%: ₹{itemTax.toLocaleString("en-IN")}
                                  </p>

                                  {discountPercent > 0 && (
                                    <p className="text-[11px] font-semibold text-green-600">
                                      {discountPercent}% OFF
                                    </p>
                                  )}

                                  <p className="text-[11px] text-gray-500">
                                    Total: ₹{Number(salePrice * qty).toLocaleString("en-IN")}
                                  </p>

                                  {discountAmount > 0 && (
                                    <p className="text-[11px] text-red-500">
                                      You save ₹{Number(discountAmount * qty).toLocaleString("en-IN")}
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl  shadow-sm transition-shadow p-4 border "
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Lock size={24} className="text-green-600" />
                    <h2 className="text-[16px]  font-[600] text-gray-900">Payment Method</h2>
                  </div>

                  <div className=" grid lg:grid-cols-2 gap-[15px] mb-6">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedPayment === method.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id
                              ? "border-green-600 bg-green-600"
                              : "border-gray-300"
                              }`}
                          >
                            {selectedPayment === method.id && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {method.icon} {method.name}
                            </h3>
                            <p className="text-[12px] text-gray-600">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-900">
                      Your payment is secure and encrypted with SSL technology.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl  shadow-sm transition-shadow p-4 border "
                >
                  <h2 className="text-[16px]  font-[600] text-gray-900">Special Instructions</h2>

                  <textarea
                    placeholder="Add delivery note, gift note, or special request..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
                    rows={3}
                  />

                  <div className="space-y-3 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftPackaging}
                        onChange={(e) => setGiftPackaging(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 accent-[#0c776b]  text-green-600"
                      />
                      <span className="text-gray-700 font-medium">🎁 Gift Packaging (+₹99)</span>
                    </label>
                    {giftPackaging && (
                      <p className="text-sm text-green-700 font-medium ml-8">
                        Gift packaging added: ₹99
                      </p>
                    )}

                  </div>
                </motion.div>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <CheckoutReceiptCard
                  checkoutData={checkoutData}
                  selectedAddress={addresses[selectedAddress]}
                  selectedPayment={paymentMethods.find(
                    (method) => method.id === selectedPayment
                  )}
                  selectedDelivery={deliveryOptions[selectedDelivery]}
                  subtotal={subtotal}
                  discount={discount}
                  coupon={couponDiscount}
                  shipping={shippingCost}
                  giftPackaging={giftPackagingCharge}
                  tax={tax}
                  total={total}
                  onSave={handlePlaceOrder}
                  loading={loading}
                />

              </div>
            </div>
          </div>

          <AnimatePresence>
            {showAddressModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm p-2 sm:p-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 45, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 35, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative w-full max-w-[520px] max-h-[92vh] overflow-hidden rounded-t-[18px] sm:rounded-[22px] border border-green-100 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.22)]"
                >
                  <div className="absolute -top-16 -right-16 h-36 w-36 sm:h-44 sm:w-44 rounded-full bg-green-200/50 blur-3xl" />

                  <div className="relative z-10 flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-green-700">
                        Delivery Address
                      </p>
                      <h2 className="text-[18px] sm:text-[24px] font-semibold text-gray-950 leading-tight">
                        Add New Address
                      </h2>

                      <p className="text-[10px] sm:text-[12px] text-gray-500 mt-0.5">
                        Save address for faster checkout.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setShowAddressModal(false)}
                      className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  <div className="relative z-10 max-h-[calc(92vh-132px)] overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                    <div className="grid gap-3 sm:gap-4">

                      <div className="relative">
                        <label className="absolute -top-2 left-3 z-10 bg-white px-2 text-[10px] sm:text-[11px] font-semibold text-gray-500">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, name: e.target.value })
                          }
                          placeholder="Enter full name"
                          className="h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-[#FCFCFA] px-3 sm:px-4 text-[12px] sm:text-sm outline-none transition focus:border-green-600 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 z-10 bg-white px-2 text-[10px] sm:text-[11px] font-semibold text-gray-500">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          placeholder="+91 XXXXX XXXXX"
                          className="h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-[#FCFCFA] px-3 sm:px-4 text-[12px] sm:text-sm outline-none transition focus:border-green-600 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 z-10 bg-white px-2 text-[10px] sm:text-[11px] font-semibold text-gray-500">
                          Complete Address
                        </label>
                        <textarea
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, address: e.target.value })
                          }
                          placeholder="House no, street, area, landmark"
                          rows={3}
                          className="w-full resize-none rounded-lg sm:rounded-xl border border-gray-200 bg-[#FCFCFA] px-3 sm:px-4 py-3 text-[12px] sm:text-sm outline-none transition focus:border-green-600 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 z-10 bg-white px-2 text-[10px] sm:text-[11px] font-semibold text-gray-500">
                          Pincode
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                            })
                          }
                          placeholder="Enter pincode"
                          className="h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-[#FCFCFA] px-3 sm:px-4 text-[12px] sm:text-sm outline-none transition focus:border-green-600 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="relative">
                        <label className="block px-1 text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-2">
                          Address Type
                        </label>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          {["Home", "Work", "Other"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewAddress({ ...newAddress, type })}
                              className={`h-9 sm:h-11 rounded-lg sm:rounded-xl border text-[12px] sm:text-sm font-semibold transition ${newAddress.type === type
                                ? "border-green-600 bg-green-50 text-green-700 shadow-[0_8px_25px_rgba(34,197,94,0.14)]"
                                : "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50/40"
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg sm:rounded-xl border border-green-100 bg-green-50 px-3 sm:px-4 py-2 sm:py-3">
                        <p className="text-[10px] sm:text-[12px] leading-relaxed text-green-800">
                          Your address will be used only for delivery updates and order fulfilment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-2 sm:gap-3 border-t border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setShowAddressModal(false)}
                      className="h-10 sm:h-12 flex-1 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-[12px] sm:text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleAddNewAddress}
                      className="h-10 sm:h-12 flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-700 to-emerald-500 text-[12px] sm:text-sm font-semibold text-white shadow-[0_12px_28px_rgba(34,197,94,0.28)] hover:opacity-95"
                    >
                      Add Address
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Footer />
      </div>
    </>
  );
}