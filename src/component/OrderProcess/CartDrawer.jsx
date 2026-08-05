/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Tag,
  BadgePercent,
  Copy,
  CheckCircle,
} from "lucide-react";

import { ApiGet, ApiPost } from "@/helper/axios";

import emptyCart from "../../../public/imges/no-order.png";
import sale from "../../../public/imges/productDetails/newIdea/promotion.png";

import {
  saveGuestCart,
  updateGuestCartQty,
  removeItemFromGuestCart,
} from "@/utils/cartStorage";

const removeCartItemApi = async (payload) => {
  const res = await ApiPost("/cart/remove-item", payload);
  return res?.data?.data || res?.data;
};

const updateCartItemQtyApi = async (payload) => {
  const res = await ApiPost("/cart/update-item-qty", payload);
  return res?.data?.data || res?.data;
};

const getCouponsApi = async () => {
  const res = await ApiGet(`/admin/coupon`);
  return res?.coupon || res?.data?.data || res?.coupons || res?.data || [];
};

const applyCouponApi = async (couponCode, cartItems = []) => {
  const firstItem = cartItems?.[0];

  const productId =
    firstItem?.productId?._id ||
    firstItem?.productId ||
    "";

  const categoryId =
    firstItem?.categoryId?._id ||
    firstItem?.categoryId ||
    firstItem?.productId?.categoryId?._id ||
    firstItem?.productId?.categoryId ||
    "";

  const res = await ApiPost(`/apply`, {
    couponCode: couponCode?.toUpperCase(),
    productId,
    categoryId,
  });

  return res?.data?.data || res?.data || res;
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartData,
  onProceedToCheckout,
}) {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const isGuestCart =
    cartData?._id === "guest-cart" || cartData?.id === "guest-cart";

  useEffect(() => {
    if (!cartData) {
      setCart([]);
      setAppliedCoupon(null);
      setCoupon("");
      setCouponError("");
      return;
    }

    const finalItems = Array.isArray(cartData)
      ? cartData
      : cartData?.items || [];

    const normalizedItems = finalItems.map((item) => {
      const sellingPrice = Number(
        item?.price ||
        item?.salePrice ||
        item?.productId?.salePrice ||
        0
      );

      const originalPrice = Number(
        item?.originalPrice ||
        item?.mrp ||
        item?.productId?.originalPrice ||
        item?.productId?.mrp ||
        item?.productId?.maxPrice ||
        item?.productId?.price ||
        sellingPrice
      );

      return {
        ...item,
        price: sellingPrice,
        mrp: originalPrice,
        originalPrice,
        discountAmount: Math.max(originalPrice - sellingPrice, 0),
      };
    });

    setCart(normalizedItems);
    setAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
  }, [cartData]);

  useEffect(() => {
    if (isOpen) {
      fetchCoupons();
    }
  }, [isOpen]);

  const fetchCoupons = async () => {
    try {
      setCouponLoading(true);

      const data = await getCouponsApi();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeCoupons = Array.isArray(data)
        ? data.filter((item) => {
          if (!item?.couponCode) return false;

          const startDate = item?.startDate ? new Date(item.startDate) : null;
          const endDate = item?.endDate ? new Date(item.endDate) : null;

          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (endDate) endDate.setHours(23, 59, 59, 999);

          const isStarted = !startDate || startDate <= today;
          const isNotExpired = !endDate || endDate >= today;

          return (
            item?.isActive !== false &&
            item?.showOnWebsite === true &&
            isStarted &&
            isNotExpired
          );
        })
        : [];

      setCoupons(activeCoupons);
    } catch (error) {
      console.error("Coupon fetch error:", error);
      setCoupons([]);
    } finally {
      setCouponLoading(false);
    }
  };

  const getItemQty = (item) => {
    return Number(item?.quantity || item?.qty || 1);
  };

  const getItemImage = (item) => {
    return (
      item?.image ||
      item?.selectedColorImage ||
      item?.productImage ||
      item?.productId?.images?.[0] ||
      item?.productId?.productImages?.[0] ||
      ""
    );
  };

  const getItemName = (item) => {
    return item?.name || item?.productName || item?.productId?.name || "Product";
  };

  const getItemPrice = (item) => {
    return Number(
      item?.price ||
      item?.salePrice ||
      item?.productId?.salePrice ||
      item?.productId?.price ||
      0
    );
  };

  const getItemMrp = (item) => {
    return Number(
      item?.originalPrice ||
      item?.mrp ||
      item?.productId?.originalPrice ||
      item?.productId?.mrp ||
      item?.productId?.maxPrice ||
      item?.productId?.price ||
      item?.price ||
      0
    );
  };

  const updateQty = async (item, type) => {
    try {
      const currentQty = getItemQty(item);

      const newQty =
        type === "inc" ? currentQty + 1 : Math.max(currentQty - 1, 1);

      if (isGuestCart) {
        const guestCart = updateGuestCartQty(item, newQty);
        setCart(guestCart?.items || []);
        return;
      }

      const payload = {
        cartId: cartData?._id,
        cartItemId: item?.cartItemId,
        productId: item?.productId,
        selectedColor: item?.selectedColor || item?.variant || "",
        quantity: newQty,
      };

      if (!payload.cartId) {
        alert("Cart ID missing");
        return;
      }

      if (!payload.cartItemId && !payload.productId) {
        alert("Cart item ID or product ID missing");
        return;
      }

      await updateCartItemQtyApi(payload);

      setCart((prev) =>
        prev.map((cartItem) => {
          const isSameItem = payload.cartItemId
            ? cartItem.cartItemId === payload.cartItemId
            : cartItem.productId === payload.productId &&
            String(cartItem.selectedColor || cartItem.variant || "").toLowerCase() ===
            String(payload.selectedColor || "").toLowerCase();

          return isSameItem
            ? {
              ...cartItem,
              quantity: newQty,
              qty: newQty,
            }
            : cartItem;
        })
      );
    } catch (err) {
      console.error("Update cart qty error:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Quantity not updated");
    }
  };

  const removeItem = async (item) => {
    try {
      if (isGuestCart) {
        const guestCart = removeItemFromGuestCart(item);
        setCart(guestCart?.items || []);
        return;
      }

      const payload = {
        cartId: cartData?._id,
        cartItemId: item?.cartItemId,
        productId: item?.productId,
        selectedColor: item?.selectedColor || item?.variant || "",
      };

      if (!payload.cartId) {
        alert("Cart ID missing");
        return;
      }

      if (!payload.cartItemId && !payload.productId) {
        alert("Cart item ID or product ID missing");
        return;
      }

      await removeCartItemApi(payload);

      setCart((prev) =>
        prev.filter((cartItem) => {
          if (payload.cartItemId) {
            return cartItem.cartItemId !== payload.cartItemId;
          }

          return !(
            cartItem.productId === payload.productId &&
            String(cartItem.selectedColor || cartItem.variant || "").toLowerCase() ===
            String(payload.selectedColor || "").toLowerCase()
          );
        })
      );
    } catch (err) {
      console.error("Remove cart error:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Item not removed");
    }
  };

  const originalSubtotal = cart.reduce((acc, item) => {
    return acc + getItemMrp(item) * getItemQty(item);
  }, 0);

  const subtotal = cart.reduce((acc, item) => {
    return acc + getItemPrice(item) * getItemQty(item);
  }, 0);

  const productDiscount = Math.max(originalSubtotal - subtotal, 0);

  const calculateCouponDiscount = (selectedCoupon) => {
    if (!selectedCoupon) return 0;

    const amount = Number(selectedCoupon.amount || 0);

    if (selectedCoupon.amountType === "percentage") {
      return Math.round((subtotal * amount) / 100);
    }

    return amount;
  };

  const couponDiscount = calculateCouponDiscount(appliedCoupon);

  const discount = productDiscount + couponDiscount;

  const total = Math.max(originalSubtotal - discount, 0);

  const handleApplyCoupon = async (selectedCouponCode = coupon) => {
    try {
      setCouponError("");

      const finalCouponCode = selectedCouponCode?.trim()?.toUpperCase();

      if (!finalCouponCode) {
        setCouponError("Please enter coupon code");
        return;
      }

      const visibleMatchedCoupon = coupons.find(
        (item) =>
          item?.couponCode?.toLowerCase() === finalCouponCode.toLowerCase()
      );

      if (visibleMatchedCoupon) {
        setCoupon(visibleMatchedCoupon.couponCode);
        setAppliedCoupon(visibleMatchedCoupon);
        return;
      }

      const manualCouponRes = await applyCouponApi(finalCouponCode);

      const manualCoupon =
        manualCouponRes?.coupon ||
        manualCouponRes?.data?.coupon ||
        manualCouponRes?.data ||
        manualCouponRes;

      if (!manualCoupon || !manualCoupon?.couponCode) {
        setAppliedCoupon(null);
        setCouponError("Invalid coupon code");
        return;
      }

      setCoupon(manualCoupon.couponCode);
      setAppliedCoupon(manualCoupon);
    } catch (error) {
      console.error("Apply coupon error:", error);

      setAppliedCoupon(null);
      setCouponError(
        error?.response?.data?.message ||
        error?.message ||
        "Invalid coupon code"
      );
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const checkoutData = {
      cart: cartData,
      cartId: cartData?._id || cartData?.id || null,
      isGuestCart,

      items: cart.map((item) => ({
        ...item,
        price: getItemPrice(item),
        mrp: getItemMrp(item),
        originalPrice: getItemMrp(item),
      })),

      originalSubtotal,

      subtotal,

      productDiscount,
      couponDiscount,

      discount,

      total,

      coupon: appliedCoupon
        ? {
          id: appliedCoupon._id || appliedCoupon.id,
          name: appliedCoupon.name,
          couponCode: appliedCoupon.couponCode,
          amountType: appliedCoupon.amountType,
          amount: appliedCoupon.amount,
        }
        : null,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    if (checkoutData.cartId) {
      localStorage.setItem("cartId", checkoutData.cartId);
    }

    if (onProceedToCheckout) {
      onProceedToCheckout(checkoutData);
      return;
    }

    onClose?.();
    window.location.href = "/checkout";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40001]"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed right-0 top-0 bottom-0 my-auto h-[85vh] md:h-full w-[360px] bg-white rounded-l-[20px] z-[40003] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center px-5 py-3 md:py-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>

              <button
                type="button"
                className="w-[24px] h-[24px] flex rounded-[30px] justify-center items-center bg-gray-200"
                onClick={onClose}
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-10">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    src={emptyCart}
                    alt="Empty Cart"
                    className="w-[70px] object-contain mb-1"
                  />

                  <h3 className="text-[14px] font-[600] text-gray-800">
                    Your Cart is Empty
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      onClose?.();
                      window.location.href = "/all-products";
                    }}
                    className="mt-2 px-3 text-[10px] py-1 rounded-full bg-gradient-to-r from-[#0c776b] to-[#05655a] text-white font-medium shadow-lg hover:scale-[1.03] transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const itemQty = getItemQty(item);
                  const itemPrice = getItemPrice(item);
                  const itemMrp = getItemMrp(item);
                  const itemImage = getItemImage(item);
                  const itemName = getItemName(item);

                  return (
                    <motion.div
                      key={item.cartItemId || item.productId || index}
                      layout
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-3 bg-white relative rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        className="text-gray-400 top-2 right-2 absolute hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 pr-5">
                            {itemName}
                          </h3>

                          <p className="text-[11px] text-gray-400 mt-[2px]">
                            {item?.selectedColor || item?.variant || "Variant"}
                          </p>

                          <div className="flex w-full justify-between">
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#0c776b] font-semibold text-sm">
                                ₹{itemPrice}
                              </span>

                              {itemMrp > itemPrice && (
                                <span className="text-gray-400 text-xs line-through">
                                  ₹{itemMrp}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shadow-sm bg-gray-100 border rounded-full px-1 py-1">
                              <button
                                type="button"
                                onClick={() => updateQty(item, "dec")}
                                className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:scale-105"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="text-xs font-medium w-4 text-center">
                                {itemQty}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateQty(item, "inc")}
                                className="w-6 h-6 bg-[#0c776b] text-white rounded-full shadow flex items-center justify-center hover:scale-105"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-[10px] md:py-4 border-t flex flex-col gap-[8px] bg-white">
              <motion.div>
                <h3 className="text-md items-center flex gap-[5px] font-[600] text-gray-900 mb-1 md:mb-2">
                  Available Coupons
                  <BadgePercent size={20} className="text-green-600" />
                </h3>

                {couponLoading && (
                  <p className="text-xs text-gray-500">Loading coupons...</p>
                )}

                {!couponLoading && coupons.length === 0 && (
                  <p className="text-xs text-gray-500">No coupons available</p>
                )}

                {!couponLoading && coupons.length > 0 && (
                  <div className="flex gap-[14px] overflow-x-auto pb-2">
                    {coupons.map((item, index) => {
                      const isApplied =
                        appliedCoupon?.couponCode === item.couponCode;

                      const discountText =
                        item.amountType === "percentage"
                          ? `${item.amount}% OFF`
                          : `Save ₹${item.amount}`;

                      return (
                        <div
                          key={item._id || item.id || index}
                          onClick={() => handleApplyCoupon(item.couponCode)}
                          className={`relative flex-shrink-0 flex items-center w-[280px] justify-between text-white rounded-xl px-5 py-3 shadow-lg cursor-pointer transition-all ${isApplied
                            ? "bg-gradient-to-r from-green-900 to-emerald-600 ring-2 ring-green-300"
                            : index % 2 === 0
                              ? "bg-gradient-to-r from-green-800 to-emerald-500"
                              : "bg-gradient-to-r from-yellow-800 to-yellow-500"
                            }`}
                        >
                          <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                            <span className="glaze"></span>
                          </span>

                          <div className="pr-[60px]">
                            <p className="text-[10px] md:text-xs uppercase tracking-wide opacity-80">
                              {item.name || "Special Offer"}
                            </p>

                            <h3 className="text-[12px] md:text-[14px] font-[600] mt-[2px] md:mt-[5px]">
                              {discountText} on this order
                            </h3>

                            <p className="text-xs opacity-80 -mt-[3px]">
                              Tap to apply coupon
                            </p>

                            <div className="flex items-center w-fit mt-2 border-white text-[13px] border border-dashed gap-2 text-white px-3 py-1 rounded-md font-semibold">
                              <span>{item.couponCode}</span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(item.couponCode);
                                  setCoupon(item.couponCode);
                                }}
                                className="hover:scale-110 transition"
                              >
                                <Copy size={16} />
                              </button>
                            </div>

                            {isApplied && (
                              <p className="text-[11px] mt-2 font-medium">
                                Applied Successfully
                              </p>
                            )}
                          </div>

                          <div className="absolute right-4">
                            <img
                              src={sale}
                              alt="Sale"
                              className="object-contain w-[55px]"
                            />
                          </div>

                          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <div className="w-full bg-green-50 border border-green-200 rounded-[8px] p-3">
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Tag size={14} /> Apply Coupon
                </p>

                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    placeholder="Enter coupon code"
                    className="w-[80%] md:flex-1 lg:w-full border rounded-lg px-3 py-[7px] text-sm uppercase"
                  />

                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="bg-[#0c776b] text-white px-3 rounded-lg text-sm"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-red-500 text-xs mt-2">{couponError}</p>
                )}

                {appliedCoupon && couponDiscount > 0 && (
                  <p className="text-[#0c776b] text-xs mt-2">
                    🎉 {appliedCoupon.couponCode} applied. You saved ₹{couponDiscount}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[2px]">
                <div className="flex justify-between text-sm">
                  <span>Original Price</span>
                  <span>₹{originalSubtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Selling Price</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm text-[#0c776b]">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-1">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full mt-1 py-2 mb-[10px] rounded-[10px] font-semibold shadow-md ${cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0c776b] to-[#05655a] text-white"
                  }`}
              >
                Proceed to Checkout
              </button>
            </div>

            <AnimatePresence>
              {toastVisible && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-4 right-4 z-[5000] bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Cart Added Successfully</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}