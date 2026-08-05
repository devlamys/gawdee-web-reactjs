/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BadgePercent
} from "lucide-react";

import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { ApiGet, ApiPut, ApiPost, ApiDelete } from "@/helper/axios";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "@/component/LoginModal";
import newest from "../../../public/imges/productDetails/newIdea/wishlist.png";

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

const getSavedUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const formatProfile = (user = {}, fallback = {}) => {
  return {
    name: user?.name || user?.fullName || fallback.name || "",
    email: user?.email || fallback.email || "",
    phone: user?.phone || user?.mobile || fallback.phone || "",
    address: user?.address || user?.streetAddress || fallback.address || "",
    city: user?.city || fallback.city || "",
    state: user?.state || fallback.state || "",
    gender: user?.gender || fallback.gender || "",
    birthday: user?.birthday || user?.dob || fallback.birthday || "",
    memberSince: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
      : fallback.memberSince || "",
  };
};

const saveUserProfileLocal = (userId, profile, extraUser = {}) => {
  const savedUser = getSavedUser();

  const finalUser = {
    ...(savedUser || {}),
    ...(extraUser || {}),
    ...profile,
    _id: userId,
    id: userId,
    userId,
  };

  localStorage.setItem("user", JSON.stringify(finalUser));
  localStorage.setItem("userId", userId);

  return finalUser;
};

const getProductImage = (product) => {
  if (!product) return "";

  const image =
    product?.images?.[0]?.thumb ||
    product?.images?.[0]?.thumbnail ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    product?.featuredImage?.url ||
    product?.featuredImage ||
    product?.image?.url ||
    product?.image ||
    product?.image1 ||
    "";

  return typeof image === "string" ? image : "";
};

export default function MyProfilePage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeTab, setActiveTab] = useState("orders");
  const [loadingProductId, setLoadingProductId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistActionId, setWishlistActionId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    gender: "",
    birthday: "",
    memberSince: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const parsedUser = getSavedUser();

    const finalUserId =
      storedUserId ||
      parsedUser?._id ||
      parsedUser?.id ||
      parsedUser?.userId ||
      null;

    setUserId(finalUserId);

    if (parsedUser) {
      const localProfile = formatProfile(parsedUser, profile);
      setProfile(localProfile);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfileLoading(false);
      return;
    }

    const fetchProfileDetails = async () => {
      try {
        setProfileLoading(true);

        const savedUser = getSavedUser();

        if (savedUser) {
          setProfile((prev) => formatProfile(savedUser, prev));
        }

        const res = await ApiGet(`/user/profile/${userId}`);

        const user =
          res?.data?.data ||
          res?.data?.user ||
          res?.user ||
          res?.data ||
          null;

        if (!user) return;

        const localProfile = savedUser ? formatProfile(savedUser) : {};
        const updatedProfile = formatProfile(user, localProfile);

        setProfile(updatedProfile);

        saveUserProfileLocal(userId, updatedProfile, user);
      } catch (error) {
        console.error("Profile Fetch Error:", error);

        const savedUser = getSavedUser();
        if (savedUser) {
          setProfile((prev) => formatProfile(savedUser, prev));
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileDetails();
  }, [userId]);

  useEffect(() => {
    if (!authChecked) return;

    if (!isLoggedIn || !userId) {
      setLoading(false);
      setOrders([]);
      return;
    }

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
      } catch (error) {
        console.error("Order Fetch Error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authChecked, isLoggedIn, userId]);

  const displayOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    });

    return sorted.slice(0, 4);
  }, [orders]);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedUserId = localStorage.getItem("userId");
    const userData = localStorage.getItem("user");

    let parsedUser = null;

    if (userData) {
      try {
        parsedUser = JSON.parse(userData);
      } catch {
        parsedUser = null;
      }
    }

    const finalUserId =
      storedUserId ||
      parsedUser?._id ||
      parsedUser?.id ||
      parsedUser?.userId ||
      null;

    if (!loginStatus || !finalUserId) {
      setIsLoggedIn(false);
      setUserId(null);
      setOrders([]);
      setLoading(false);
      setProfileLoading(false);
      setAuthChecked(true);
      setIsLoginOpen(true);
      return;
    }

    setIsLoggedIn(true);
    setUserId(finalUserId);

    if (parsedUser) {
      setProfile((prev) => ({
        ...prev,
        name: parsedUser?.name || parsedUser?.fullName || prev.name,
        email: parsedUser?.email || prev.email,
        phone: parsedUser?.phone || parsedUser?.mobile || prev.phone,
        address:
          parsedUser?.address ||
          parsedUser?.streetAddress ||
          prev.address,
        city: parsedUser?.city || prev.city,
        state: parsedUser?.state || prev.state,
        gender: parsedUser?.gender || prev.gender,
        birthday: parsedUser?.birthday || parsedUser?.dob || prev.birthday,
        memberSince: parsedUser?.createdAt
          ? new Date(parsedUser.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })
          : prev.memberSince,
      }));
    }

    setAuthChecked(true);
  }, []);

  const stats = useMemo(() => {
    return {
      totalOrders: displayOrders.length,
      completed: displayOrders.filter((item) => item.status === "completed").length,
      pending: displayOrders.filter((item) => item.status === "pending").length,
      rewards: 340,
    };
  }, [displayOrders]);

  const latestAddress =
    profile.address ||
    displayOrders?.[0]?.customerDetails?.streetAddress ||
    displayOrders?.[0]?.deliveryDetails?.streetAddress ||
    displayOrders?.[0]?.customerDetails?.address ||
    displayOrders?.[0]?.deliveryDetails?.address ||
    "-";

  const handleSaveProfile = async () => {
    try {
      if (!userId) {
        alert("User not found. Please login again.");
        return;
      }

      setProfileSaving(true);

      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        gender: profile.gender,
        birthday: profile.birthday,
      };

      const instantProfile = {
        ...profile,
        ...payload,
      };

      setProfile(instantProfile);
      saveUserProfileLocal(userId, instantProfile);

      const res = await ApiPut(`/auth/user/${userId}`, payload);

      const updatedUser =
        res?.data?.data ||
        res?.data?.user ||
        res?.user ||
        res?.data ||
        payload;

      const finalProfile = formatProfile(updatedUser, instantProfile);

      setProfile(finalProfile);
      saveUserProfileLocal(userId, finalProfile, updatedUser);

      setEditOpen(false);
    } catch (error) {
      console.error("Profile Update Error:", error);
      saveUserProfileLocal(userId, profile);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Profile saved locally, but backend update failed."
      );

      setEditOpen(false);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();

    setIsLoggedIn(false);
    setUserId(null);
    setOrders([]);
    setIsLoginOpen(true);

    navigate("/my-orders", { replace: true });
  };

  const handleOpenInvoice = (order) => {
    if (!order?._id) return;
    navigate(`/my-orders/invoice/${order._id}`, {
      state: {
        order,
      },
    });
  };

  const formatWishlistItems = (wishlistData) => {
    const list =
      wishlistData?.items ||
      wishlistData?.products ||
      wishlistData?.wishlist ||
      wishlistData?.data?.items ||
      wishlistData?.data?.products ||
      wishlistData?.data ||
      [];

    if (!Array.isArray(list)) return [];

    return list
      .map((item) => {
        const product = item?.productId || item?.product || item;

        const sellingPrice = Number(
          product?.salePrice ||
          product?.sellingPrice ||
          product?.price ||
          item?.salePrice ||
          item?.sellingPrice ||
          item?.price ||
          0
        );

        const originalPrice = Number(
          product?.originalPrice ||
          product?.mrp ||
          product?.price ||
          item?.originalPrice ||
          item?.mrp ||
          sellingPrice ||
          0
        );

        const discount =
          originalPrice > sellingPrice
            ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
            : 0;

        return {
          _id: product?._id || item?._id,
          productId: product?._id || item?.productId,
          slug: product?.slug || item?.slug || "",
          title: product?.name || product?.title || item?.name || item?.title || "Product",
          image1: getProductImage(product),
          badge: "Wishlist",
          discount,
          rating: product?.rating || item?.rating || 4.5,
          reviews: product?.reviews || product?.reviewCount || item?.reviews || 100,
          price: sellingPrice,
          originalPrice,
          displayWeight:
            product?.displayWeight ||
            product?.sku?.match(/\d+\s*(ml|ltr|liter|litre|l|kg|g|gm)/i)?.[0] ||
            (product?.weight && product?.weightUnit
              ? `${product.weight} ${product.weightUnit}`
              : ""),
        };
      })
      .filter((item) => item.productId || item._id);
  };

  const fetchWishlist = async (latestUserId = null) => {
    try {
      const finalUserId = latestUserId || userId || localStorage.getItem("userId");

      if (!finalUserId) {
        setWishlistProducts([]);
        return;
      }

      setWishlistLoading(true);

      const res = await ApiGet(`/wishlist/${finalUserId}`);

      const formattedWishlist = formatWishlistItems(res);

      setWishlistProducts(formattedWishlist);
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      setWishlistProducts([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveWishlist = async (e, item) => {
    e.stopPropagation();

    const finalUserId = userId || localStorage.getItem("userId");
    const productId = item?.productId || item?._id;

    if (!finalUserId || !productId) return;

    try {
      setWishlistActionId(productId);

      setWishlistProducts((prev) =>
        prev.filter((product) => String(product.productId || product._id) !== String(productId))
      );

      await ApiPut("/deleteWishlistProduct", {
        userId: finalUserId,
        deleteProductId: productId,
      });

      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Remove wishlist error:", error);
      await fetchWishlist(finalUserId);
    } finally {
      setWishlistActionId(null);
    }
  };

  useEffect(() => {
    if (!authChecked || !isLoggedIn || !userId) return;

    fetchWishlist(userId);

    const syncWishlist = () => {
      fetchWishlist(userId);
    };

    window.addEventListener("wishlist-updated", syncWishlist);

    return () => {
      window.removeEventListener("wishlist-updated", syncWishlist);
    };
  }, [authChecked, isLoggedIn, userId]);

  const handleAddToCart = async (item) => {
    const finalUserId = userId || localStorage.getItem("userId");
    const productId = item?.productId || item?._id;

    if (!finalUserId || !productId) return;

    try {
      setLoadingProductId(productId);

      await ApiPost("/cart", {
        userId: finalUserId,
        items: [
          {
            productId,
            quantity: 1,
            price: item.price || 0,
            sellingPrice: item.price || 0,
            salePrice: item.price || 0,
            mrp: item.originalPrice || item.price || 0,
            originalPrice: item.originalPrice || item.price || 0,
            name: item.title || "Product",
            image: item.image1 || "",
            slug: item.slug || "",
          },
        ],
      });

      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Add wishlist product to cart error:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#0c776b] font-semibold">Checking login...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen bg-white">
        <Header />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-[120px] text-center">
          <h2 className="text-[24px] font-semibold text-[#1d2b1f]">
            Please login to view your orders
          </h2>

          <p className="text-[#6b776b] text-sm mt-2">
            Login first to access your profile, orders, invoice and tracking details.
          </p>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="mt-5 h-[42px] px-6 rounded-[10px] bg-[#0c776b] text-white text-sm font-semibold"
          >
            Login / Signup
          </button>
        </div>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => {
            setIsLoginOpen(false);

            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const storedUserId = localStorage.getItem("userId");
            const userData = localStorage.getItem("user");

            let parsedUser = null;

            if (userData) {
              try {
                parsedUser = JSON.parse(userData);
              } catch {
                parsedUser = null;
              }
            }

            const finalUserId =
              storedUserId ||
              parsedUser?._id ||
              parsedUser?.id ||
              parsedUser?.userId ||
              null;

            if (loginStatus && finalUserId) {
              setIsLoggedIn(true);
              setUserId(finalUserId);
              setAuthChecked(true);
            }
          }}
        />

        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      <main className="max-w-[1320px] mx-auto px-4 pt-[120px] md:pt-[120px] pb-[90px]">

        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden border border-[#E5E7EB] bg-white rounded-[14px] p-3 "
        >
          <div className="absolute right-0 top-0 w-[260px] h-[260px] bg-[#EAF4EC] rounded-full blur-3xl translate-x-20 -translate-y-20" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-[48px] h-[48px] rounded-[10px] bg-[#0b776b] text-white flex items-center justify-center text-[30px] font-semibold">
                {profile.name?.charAt(0) || "G"}
              </div>

              <div>
                <h1 className="text-[28px] md:text-[23px] font-semibold text-[#1d2b1f] leading-tight">
                  {profile.name}
                </h1>
                <p className="text-[#6b776b] text-[11px] ">
                  Premium Wellness Member 🌿
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              disabled={profileLoading}
              className="h-[40px] px-5 rounded-[10px] bg-[#0c776b] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#24492f] transition disabled:opacity-60"
            >
              <Edit size={16} />
              {profileLoading ? "Loading..." : "Edit Profile"}
            </button>
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-7 mt-4">
          <div className="space-y-4">

            <section className="bg-white rounded-[18px]">

              <div className="flex items-center gap-6 mb-4 border-b border-[#E5E7EB]">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-2 text-[16px] md:text-[17px] font-[500] transition-all border-b-2 ${activeTab === "orders"
                    ? "border-[#0c776b] text-[#1d2b1f]"
                    : "border-transparent text-[#6b776b] hover:text-[#1d2b1f]"
                    }`}
                >
                  Recent Orders
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`pb-2 text-[16px] md:text-[17px] font-[500] transition-all border-b-2 ${activeTab === "wishlist"
                    ? "border-[#0c776b] text-[#1d2b1f]"
                    : "border-transparent text-[#6b776b] hover:text-[#1d2b1f]"
                    }`}
                >
                  My Wishlist
                </button>
              </div>

              {activeTab === "orders" ? (
                <>
                  <p className="text-[12px] text-[#6b776b] mb-4">
                    Track your latest Gawdee purchases.
                  </p>

                  {loading ? (
                    <div className="py-10 text-center text-[#6b776b]">
                      Loading orders...
                    </div>
                  ) : displayOrders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-dashed border-[#DDE5DC] bg-[#FCFCFA] rounded-[16px] py-12 px-4 text-center"
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF4EC] text-[#0c776b] flex items-center justify-center mb-4">
                        <Package size={26} />
                      </div>

                      <h3 className="text-[18px] font-semibold text-[#1d2b1f]">
                        No Orders Found
                      </h3>

                      <p className="text-sm text-[#6b776b] mt-1">
                        You haven’t placed any Gawdee orders yet.
                      </p>

                      <button
                        onClick={() => navigate("/all-products")}
                        className="mt-5 h-[40px] px-5 rounded-[10px] bg-[#0c776b] text-white text-sm font-semibold"
                      >
                        Start Shopping
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {displayOrders.map((order, index) => (
                        <OrderCard
                          key={order._id || index}
                          order={order}
                          index={index}
                          navigate={navigate}
                          onInvoiceClick={handleOpenInvoice}
                        />
                      ))}

                      {orders.length > 4 && (
                        <div className="text-center mt-4">
                          <button
                            onClick={() => navigate("/all-orders")}
                            className="
                              h-[42px] px-6 rounded-[10px] 
                              bg-[#0c776b] text-white 
                              text-sm font-semibold 
                              hover:bg-[#095e55] transition
                            "
                          >
                            View All Orders
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                  {wishlistProducts.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => item.slug && navigate(`/product/${item.slug}`)}
                      className="md:w-[275px] bg-white flex-shrink-0 cursor-pointer rounded-[10px] md:rounded-[15px] border border-gray-200 shadow-sm group"
                    >

                      <div className="relative bg-[#f6f6f6] md:rounded-t-[15px] rounded-t-[9px] overflow-hidden border-b md:h-[266px] flex items-center justify-center">
                        <div className="absolute left-[-3px] shadow-lg z-[6] flex gap-1 items-center top-2 md:top-3 border-l font-[500] border-[#0c776b] bg-[#0c776b] text-white text-[8px] md:text-[11px] px-2 py-[4px] md:py-[6px] rounded-r-full shadow-md">
                          <img src={item.tagImage || newest} className="w-[15px]" alt="tag" /> {item.badge || "New"}
                        </div>

                        <div className="absolute right-2 md:right-3 top-2 md:top-3 z-[6] flex items-center gap-2">
                          <div className="bg-[#e8f5e9] text-[#0c776b] text-[8px] px-2 md:px-3 py-[4px] md:py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
                            🌿 {item.discount}% OFF
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleRemoveWishlist(e, item)}
                          disabled={wishlistActionId === (item.productId || item._id)}
                          className={`absolute right-2 md:right-3 top-10 md:top-12 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full shadow-sm transition ${wishlistActionId === (item.productId || item._id)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#0c776b] text-white hover:scale-105"
                            }`}
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>

                        <img
                          src={item.image1}
                          alt={item.title || "Product"}
                          className="w-[273px] h-[180px] md:h-[266px] object-contain"
                        />
                      </div>

                      <div className="p-2 md:p-3">

                        <h3 className="text-[13px] md:text-[15px] font-medium min-h-[40px] text-gray-800 leading-snug">
                          {item.title}
                        </h3>

                        <div className="flex font-[500] items-center gap-1 md:gap-2 md:mt-2 text-[10px] md:text-[12px] text-gray-600">
                          ⭐ {item.rating}
                          <span className="">({item.reviews} reviews)</span>
                        </div>

                        <div className="flex justify-between items-center gap-3 mt-2">
                          <div className="flex items-end gap-1 md:gap-3">
                            <span className="text-[15px] md:text-lg font-semibold text-black">
                              ₹{item.price}
                            </span>
                            <span className="text-gray-400 line-through md:text-sm text-[11px]">
                              ₹{item.originalPrice}
                            </span>
                          </div>
                          {item.displayWeight && (
                            <div className="w-fit rounded-full h-fit border border-[#0c776b]/20 bg-[#e8f5e9] px-2 md:px-3 py-[2px] md:py-[5px] text-[10px] md:text-[11px] font-semibold text-[#0c776b]">
                              {item.displayWeight}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-2 rounded-md bg-[#edf7e7] border border-[#1d6f4d] px-1.5 md:px-3 py-2 border-dashed text-[8px] md:text-[10px] text-[#214d3b] font-medium">
                          <BadgePercent size={14} /> Best Price ₹{item.price} with Coupon
                        </div>

                        <button
                          disabled={loadingProductId === (item.productId || item._id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="mt-3 w-full bg-[#0c776b] hover:bg-[#06554c] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          {loadingProductId === (item.productId || item._id) ? (
                            <>
                              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                              Adding...
                            </>
                          ) : (
                            <>
                              Add <i className="fa-solid fa-cart-shopping"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[130px] h-fit">
            <ProfileDetailsCard profile={profile} latestAddress={latestAddress} />

            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#F8F6F1] text-[#0c776b] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1d2b1f]">
                    Account Security
                  </h3>
                  <p className="text-xs text-[#6b776b]">
                    Your profile is protected.
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-5 w-full h-[42px] rounded-[10px] border border-red-100 text-red-600 bg-red-50 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      </main>

      <EditProfileDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        setProfile={setProfile}
        onSave={handleSaveProfile}
        saving={profileSaving}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const storedUserId = localStorage.getItem("userId");

          if (loginStatus && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
          }
        }}
      />

      <Footer />
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="min-w-[95px] rounded-[8px] border border-[#E5E7EB] bg-white/80 px-2 py-2 text-center">
      <p className="text-[20px] font-semibold text-[#1d2b1f]">{value}</p>
      <p className="text-[10px] font-[10px] uppercase tracking-[0.12em] text-[#6b776b]">
        {label}
      </p>
    </div>
  );
}

function ProfileDetailsCard({ profile, latestAddress }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5">
      <h2 className="text-[18px] font-semibold text-[#1d2b1f]">
        Profile Details
      </h2>
      <div className="mt-1 divide-y divide-[#EEF0EA]">
        <DetailRow icon={Mail} label="Email" value={profile.email} />
        <DetailRow icon={Phone} label="Phone" value={profile.phone} />
        <DetailRow icon={MapPin} label="Address" value={latestAddress} />
        <DetailRow icon={CalendarDays} label="Member Since" value={profile.memberSince} />
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-9 h-9 rounded-[9px] bg-[#EAF4EC] text-[#0c776b] flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-[12px] uppercase tracking-[0.12em] text-[#8B9688]">
          {label}
        </p>
        <p className="text-sm font-medium text-[#1d2b1f] mt-1 break-words">
          {value || "-"}
        </p>
      </div>
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
    { key: "pending", label: "Placed" },
    { key: "confirmed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
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

function EditProfileDrawer({ open, onClose, profile, setProfile, onSave, saving }) {
  const update = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[3000]"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 my-auto md:top-0 h-[600px] w-[340px] rounded-l-[20px] sm:w-[430px] bg-white z-[3100] shadow-2xl p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8c7440] font-semibold">
                  Account
                </p>
                <h2 className="text-[24px] font-semibold text-[#1d2b1f]">
                  Edit Profile
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-[9px] bg-[#F4F4F0] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <EditInput
                label="Full Name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
              />

              <EditInput
                label="Email"
                placeholder="Enter your email address"
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
              />

              <EditInput
                label="Phone Number"
                placeholder="Enter your 10 digit phone number"
                value={profile.phone}
                maxLength={10}
                inputMode="numeric"
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  update("phone", onlyNumbers.slice(0, 10));
                }}
              />

              <EditInput
                label="Address"
                placeholder="Enter your street address"
                value={profile.address}
                onChange={(e) => update("address", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <EditInput
                  label="City"
                  placeholder="Enter your city"
                  value={profile.city}
                  onChange={(e) => update("city", e.target.value)}
                />

                <EditInput
                  label="State"
                  placeholder="Enter your state"
                  value={profile.state}
                  onChange={(e) => update("state", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EditInput
                  label="Gender"
                  placeholder="Enter your gender"
                  value={profile.gender}
                  onChange={(e) => update("gender", e.target.value)}
                />

                <EditInput
                  label="Birthday"
                  placeholder="Select your birthday"
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => update("birthday", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onSave}
              disabled={saving}
              className="mt-7 w-full h-[46px] rounded-[10px] bg-[#0c776b] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EditInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full h-[44px] rounded-[9px] border border-[#DDE5DC] px-3 text-sm outline-none focus:border-[#0c776b] bg-[#FCFCFA]"
      />
    </div>
  );
}