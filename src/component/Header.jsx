/* Developed by Grafizen International PVT. LTD. */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Heart,
  ShoppingBag,
  Search,
  Grid3X3,
  Phone,
  ChevronDown,
  ShoppingCart,
  LogIn,
  Grid3x3,
  User2,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logoMain from "../../public/imges/Logo-green-text.png"; 

import viewAll from "../../public/imges/header/viewAll.png"
import desiGhee from "../../public/imges/header/ghee.png"
import honey from "../../public/imges/header/honey.png"
import sugar from "../../public/imges/header/sugar.png"
import aboutUs from "../../public/imges/header/aboutUs.png"
import contactUs from "../../public/imges/header/conatctUs.png"
import trackOrder from "../../public/imges/header/trackOrder.png"
import allProduct from "../../public/imges/header/allproduct.png"
import mixMe from "../../public/imges/header/jar.png"
import drops from "../../public/imges/header/drop.png"
import powder from "../../public/imges/header/powder.png"

import { LoginModal } from "./LoginModal";
import SearchOverlay from "./common/SearchOverlay";
import CartDrawer from "./OrderProcess/CartDrawer";
import LogoutModal from "./LogoutModal";
import { ApiGet, ApiPost } from "@/helper/axios";
import {
  getGuestCart,
  clearGuestCart,
} from "@/utils/cartStorage";

const getCartApi = async (userId) => {
  const res = await ApiGet(`/cart/${userId}`);

  console.log("Cart API response:", res);

  const data = res?.data?.data || res?.data || res;

  if (!data) {
    throw new Error("Cart not found");
  }

  return data;
};

const addToCartApi = async (payload) => {
  const res = await ApiPost("/cart", payload);
  return res?.data?.data || res?.data;
};

const normalizeCartItems = (items = []) => {
  return items.map((item) => ({
    cartItemId:
      item.cartItemId ||
      item._id ||
      `${item.productId}-${item.selectedColor || "default"}`,

    productId: item.productId?._id || item.productId,

    name:
      item.name ||
      item.productName ||
      item.productId?.name ||
      item.productId?.title ||
      "Product",

    selectedColor: item.selectedColor || item.variant || null,
    variant: item.variant || item.selectedColor || null,

    image:
      item.image ||
      item.selectedColorImage ||
      item.productId?.images?.[0] ||
      item.productId?.productImages?.[0] ||
      "",

    price: Number(
      item.price ||
      item.salePrice ||
      item.productId?.salePrice ||
      item.productId?.price ||
      0
    ),

    mrp: Number(
      item.mrp ||
      item.originalPrice ||
      item.productId?.price ||
      item.price ||
      0
    ),

    quantity: Number(item.quantity || item.qty || 1),
    qty: Number(item.qty || item.quantity || 1),

    slug: item.slug || item.productId?.slug || "",
  }));
};

const buildCartObject = (items = [], cartId = "guest-cart") => {
  const formattedItems = normalizeCartItems(items);

  const subtotal = formattedItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
    0
  );

  return {
    _id: cartId,
    items: formattedItems,
    subtotal,
    total: subtotal,
  };
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [localCartItems, setLocalCartItems] = useState(() =>
    getGuestCart()
  );

  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartData, setCartData] = useState(() => {
    if (typeof window === "undefined") {
      return {
        _id: "guest-cart",
        items: [],
        subtotal: 0,
        total: 0,
      };
    }

    return buildCartObject(getGuestCart(), "guest-cart");
  });

  const [cartLoading, setCartLoading] = useState(false);
  const [cartCount, setCartCount] = useState(() => {
    if (typeof window === "undefined") return 0;

    const loginStatus = localStorage.getItem("isLoggedIn") === "true";

    if (loginStatus) return 0;

    return getGuestCart().reduce(
      (total, item) => total + Number(item.quantity || item.qty || 1),
      0
    );
  });
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [pendingCartOpen, setPendingCartOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [mobileSearch, setMobileSearch] = useState("");

  const staticNavItems = [
    { name: "About", path: "/about-us" },
    { name: "Contact", path: "/contact-us" },
    { name: "Track Orders", path: "/my-orders" },
  ];

  const updateCartCountInstant = (items = []) => {
    setCartCount(
      items.reduce(
        (total, item) => total + Number(item.quantity || item.qty || 1),
        0
      )
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncCart = async (event) => {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      setIsLoggedIn(loginStatus);

      if (loginStatus && userId) {
        await mergeGuestCartToUserCart(userId);

        const finalCart = await fetchCart();

        setCartData(finalCart);
        updateCartCountInstant(finalCart?.items || []);

        return;
      }

      const eventItems =
        event?.type === "guest-cart-updated" && Array.isArray(event?.detail?.items)
          ? event.detail.items
          : null;

      const guestCart = eventItems
        ? buildCartObject(eventItems, "guest-cart")
        : formatGuestCart();

      setCartData(guestCart);

      updateCartCountInstant(guestCart.items);
    };

    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener("guest-cart-updated", syncCart);
    window.addEventListener("cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("guest-cart-updated", syncCart);
      window.removeEventListener("cart-updated", syncCart);
    };
  }, []);

  const isActive = location.pathname === "/all-products"

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        setLoadingCategories(true);

        const res = await ApiGet("/admin/categories");

        const categoryItems = (res?.category || [])
          .filter((item) => getCategoryImage(item.name))
          .map((item) => ({
            ...item,
            type: "category",
          }));

        const staticItems = staticNavItems.map((item) => ({
          ...item,
          type: "static",
        }));

        setCategories(categoryItems);

        setMenuItems([
          ...categoryItems,
          ...staticItems,
        ]);

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingCategories(false);

      }
    };

    fetchCategories();

  }, []);

  const getCategoryImage = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("ghee")) return desiGhee;
    if (lower.includes("honey")) return honey;
    if (lower.includes("mix me")) return mixMe;
    if (lower.includes("drops")) return drops;
    if (lower.includes("sugar")) return sugar;

    return null; 
  };

  const navItems = [

    { name: "About", path: "/about-us" },
    { name: "Contact", path: "/contact-us" },
    { name: "Track Orders", path: "/my-orders" },
  ]

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")           
      .replace(/[^\w\s-]/g, "")       
      .replace(/\s+/g, "-")           
      .replace(/--+/g, "-");          
  };
  const navItemsMobile = [

    { name: "About", path: "/about-us", img: aboutUs, },
    { name: "Contact", path: "/contact-us", img: contactUs },
    { name: "Track Orders", path: "/my-orders", img: trackOrder },
    { name: "View All products ", path: "/all-products", img: allProduct },

  ]

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") return image;

    return image?.url || image?.image || image?.path || image?.src || "";
  };

  const formatCartResponse = (res) => {
    const formattedItems = normalizeCartItems(res?.items || []);

    const subtotal = formattedItems.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
      0
    );

    return {
      _id: res?._id || null,
      items: formattedItems,
      subtotal,
      total: Number(res?.total || subtotal),
    };
  };

  const getCartItemsCount = (items = []) => {
    return items.reduce(
      (total, item) => total + Number(item.quantity || item.qty || 1),
      0
    );
  };

  const formatGuestCart = () => {
    return buildCartObject(getGuestCart(), "guest-cart");
  };

  const mergeGuestCartToUserCart = async (userId) => {
    try {
      if (!userId) return false;

      const guestCart = formatGuestCart();

      if (!guestCart.items || guestCart.items.length === 0) {
        return false;
      }

      const payload = {
        userId,
        items: guestCart.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity || item.qty || 1),
          selectedColor: item.selectedColor || null,
          selectedColorImage: item.image || item.selectedColorImage || "",
        })),
      };

      await addToCartApi(payload);

      clearGuestCart();

      return true;
    } catch (error) {
      console.error("Merge guest cart error:", error);
      return false;
    }
  };

  const fetchCart = async () => {
    try {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      if (!loginStatus || !userId) {
        const guestCart = formatGuestCart();

        setCartData(guestCart);
        setCartCount(getCartItemsCount(guestCart.items));

        return guestCart;
      }

      setCartLoading(true);

      const res = await getCartApi(userId);
      const formattedCart = formatCartResponse(res);

      setCartData(formattedCart);
      setCartCount(getCartItemsCount(formattedCart.items));

      return formattedCart;
    } catch (error) {
      console.error("Fetch cart error:", error);

      const emptyCart = {
        _id: null,
        items: [],
        subtotal: 0,
        total: 0,
      };

      setCartData(emptyCart);
      setCartCount(0);

      return emptyCart;
    } finally {
      setCartLoading(false);
    }
  };

  const isUserLoggedInNow = () => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");

    return Boolean(loginStatus && userId);
  };

  const handleProceedToCheckout = async (checkoutDataFromDrawer) => {
    try {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      if (!loginStatus || !userId) {
        setPendingCheckoutData(checkoutDataFromDrawer);
        setCartOpen(false);

        setTimeout(() => {
          setIsLoginOpen(true);
        }, 150);

        return;
      }

      localStorage.setItem(
        "checkoutData",
        JSON.stringify(checkoutDataFromDrawer)
      );

      if (checkoutDataFromDrawer?.cartId) {
        localStorage.setItem("cartId", checkoutDataFromDrawer.cartId);
      }

      setPendingCheckoutData(null);
      setCartOpen(false);
      navigate("/checkout");
    } catch (error) {
      console.error("Proceed checkout error:", error);
      alert("Failed to proceed checkout");
    }
  };

  const handleCartClick = async () => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");

    setCartOpen(true);

    if (loginStatus && userId) {

      await mergeGuestCartToUserCart(userId);

      await fetchCart();
      return;
    }

    const guestCart = formatGuestCart();

    setCartData(guestCart);
    setCartCount(getCartItemsCount(guestCart.items));
  };

  const iconLinks = [
    {
      name: isLoggedIn ? "My Orders" : "My Account",
      icon: User,
      path: isLoggedIn ? "/my-orders" : "",
      action: () => {
        if (isLoggedIn) {
          navigate("/my-orders");
        } else {
          setIsLoginOpen(true);
        }
      },
    },
    {
      name: "Cart",
      icon: ShoppingBag,
      path: "",
      action: handleCartClick,
    },
    {
      name: isLoggedIn ? "Logout" : "Sign In",
      icon: LogIn,
      path: "",
      action: () => {
        if (isLoggedIn) {
          setLogoutOpen(true);
        } else {
          setIsLoginOpen(true);
        }
      },
    },
  ];

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (cartOpen) {
      const scrollbarWidth =
        window.innerWidth -
        document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [cartOpen]);

  const handleSearchSubmit = () => {
    console.log("function triggered")
    if (!search.trim()) return;

    navigate(`/search?q=${encodeURIComponent(search)}`)
    setSearchOpen(false)
  };

  const handleTrackOrderClick = () => {
    if (isLoggedIn) {
      navigate("/my-orders");
    } else {
      setIsLoginOpen(true);
    }
  };

  const placeholderTexts = [
    "Search for Ghee",
    "Search for Honey",
    "Search for Mix Me",
    "Search for Taral Drop",
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = placeholderTexts[textIndex];

    const typingSpeed = isDeleting ? 45 : 90;
    const pauseTime = 1200;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        setPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex]);

  const CartBadge = () => {
    if (!cartCount || cartCount <= 0) return null;

    return (
      <span className="absolute -top-[7px] -right-[7px] z-[50] min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#0c776b] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-md border border-white">
        {cartCount > 99 ? "99+" : cartCount}
      </span>
    );
  };

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-[1000] ">

        <div className="w-full md11:hidden block   bg-white overflow-hidden">

          <div className="relative h-[53px] bg-[#f7f7f7] flex items-center justify-between px-3">

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex w-[100px] ">

              {mobileOpen ? <X className="text-[#0c776b]" size={28} /> : <Menu
                size={32}
                strokeWidth={1}
                className="text-[#0c776b]"

              />}
            </button>

            <div className=" ">

              <img
                src={logoMain}
                alt="logo"
                onClick={() => navigate("/")}
                className="w-[90px]  object-contain cursor-pointer drop-shadow-[0_0_18px_rgba(255,255,255,0.22)]"
              />
            </div>

            <div className="flex w-[100px] items-center  justify-end gap-[15px]">

              <button
                onClick={() => setSearchOpen(true)}
                className=" w-fit">
                <Search
                  size={20}
                  strokeWidth={1.8}
                  className="text-[#0c776b]"
                />
              </button>

              <button
                type="button"
                onClick={handleCartClick}
                className="relative overflow-visible flex items-center justify-center"
              >
                <ShoppingCart
                  size={20}
                  strokeWidth={1.8}
                  className="text-[#0c776b]"
                />

                <CartBadge />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/my-profile");
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
                className="relative overflow-visible flex items-center justify-center"
              >
                <User size={20} strokeWidth={1.8} className="text-[#0c776b]" />
              </button>
            </div>
          </div>

          <div className="h-[30px] bg-[#0c776b] flex items-center justify-center px-4">

            <p className="text-yellow-300 text-[13px] font-[600] tracking-[1px]">
              Get extra 2% off on all prepaid orders
            </p>
          </div>

        </div>

        <motion.div
          animate={{
            paddingTop: scrolled ? 0 : 0,
            paddingBottom: scrolled ? 0 : 0,
            backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
            backgroundColor: "#fff"
          }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden md:block hidden bg-white border-white/10"

        >

          <div className="relative text-[13px] z-10">

            <div className="w-[94%] md:w-[92%] 2xl:w-[1400px] mx-auto hidden  lg:flex  justify-between items-center gap-6 py-1">

              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex justify-start"
              >
                <div className="flex items-center border border-[#0c776b] w-full max-w-[360px] rounded-[8px] overflow-hidden bg-white shadow-sm">

                  <input
                    type="text"
                    value={search}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchSubmit()
                    }}
                    placeholder={placeholder}
                    className=" w-[240px]  placeholder-black px-2 py-2 text-[12px] outline-none text-[#333]"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className=" hidden md:flex justify-center"
              >
                <img
                  src={logoMain}
                  alt="logo"
                  onClick={() => navigate("/")}
                  className="w-[135px]  object-contain cursor-pointer drop-shadow-[0_0_18px_rgba(255,255,255,0.22)]"
                />
              </motion.div>
              <div className="hidden md:flex items-end justify-center gap-4 w-fit text-white/90 text-[13px]">
                {[
                  ...(isLoggedIn
                    ? [
                      {
                        name: "My Orders",
                        icon: User,
                        action: () => navigate("/my-orders"),
                      },
                    ]
                    : []),
                  {
                    name: "Cart",
                    icon: ShoppingBag,
                    action: handleCartClick,
                  },
                  {
                    name: isLoggedIn ? "Logout" : "Sign In",
                    icon: isLoggedIn ? LogIn : User,
                    action: () => {
                      if (isLoggedIn) {
                        setLogoutOpen(true);
                      } else {
                        setIsLoginOpen(true);
                      }
                    },
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={item.action}
                      title={item.name}
                      className="
          group relative flex h-[38px] w-[38px] items-center justify-center
          rounded-full border bg-white/25 cursor-pointer backdrop-blur-md
          text-[#0b776b] border-[#0b776b]
          shadow-[0_8px_22px_rgba(0,0,0,0.08)]
          transition-all duration-300 hover:bg-white hover:text-[#6f8f35]
          hover:border-[#9DBB5A]/40 hover:shadow-[0_10px_26px_rgba(157,187,90,0.25)]
          active:scale-[0.94]
        "
                    >
                      <Icon size={17} className="cursor-pointer flex-shrink-0" />
                      {item.name === "Cart" && <CartBadge />}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="hidden lg:block border-t bg-[#0c776b] border-[#0c776b] /20">
              <div className="w-[94%] md:w-[92%] 2xl:w-[1400px] mx-auto flex items-center justify-between py-[7px]">
                <Link
                  to="/all-products"
                  className={`flex items-center  !cursor-pointer gap-3 hover:text transition ${isActive
                    ? "text-yellow-300 hover:text-yellow-400 font-"
                    : "text-white hover:text-yellow-400"
                    }`}
                >
                  <img src={allProduct} className="   w-[25px]" />
                  <span className="uppercase text-[15px]">
                    All Products
                  </span>
                </Link>
                <nav className="flex items-center gap-10">
                  {loadingCategories ? (

                    <div className="flex items-center gap-8">

                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-[20px] w-[90px] overflow-hidden relative rounded-full bg-white/10 animate-pulse"
                        >

                          <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                            <span className="glaze"></span>
                          </span>
                        </div>
                      ))}

                    </div>

                  ) : (

                    menuItems.map((item, i) => {

                      if (item.type === "category") {

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              const slug = item.slug || createSlug(item.name);

                              navigate(`/products/${slug}`, {
                                state: { categoryId: item._id },
                              });
                            }}
                            className={`text-[14px] transition items-center flex gap-[7px] hover:text-[#9dbb5a] ${location.pathname === `/products/${item.slug || createSlug(item.name)}`
                              ? "text-yellow-300 font-[400] "
                              : "text-white/90"
                              }`}
                          >
                            <img
                              src={getCategoryImage(item.name)}
                              className="w-[26px] object-contain"
                            />

                            {item.name}
                          </button>
                        );
                      }

                    })

                  )}

                </nav>

                <button className="text-white text-[15px] font-medium uppercase hover:opacity-80 transition">

                </button>
              </div>
            </div>

          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="fixed top-[80px] left-0 w-full h-[80vh] z-[100000] overflow-y-auto lg:hidden  bg-[#0c776b] border-t border-white/10"
            >
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.05,
                    },
                  },
                }}
                className="w-[92%] mx-auto py-3 flex flex-col gap-5"
              >

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="flex items-center justify-between mb-3">

                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((item, i) => {
                      const slug = item.slug || createSlug(item.name);
                      const img = getCategoryImage(item.name);

                      const isSelected =
                        location.pathname === `/products/${slug}`;

                      return (
                        <motion.button
                          key={i}
                          variants={{
                            hidden: { opacity: 0, scale: 0.92 },
                            show: { opacity: 1, scale: 1 },
                          }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            navigate(`/products/${slug}`, {
                              state: { categoryId: item._id },
                            });
                            setMobileOpen(false);
                          }}
                          className={`relative overflow-hidden rounded-[20px] border p-3 text-left transition-all duration-300 ${isSelected
                            ? "bg-gradient-to-r from-[#f7fa52]/25 to-[#f7fa52]/15 border-[#a7cb5d]/50 shadow-[0_10px_30px_rgba(167,203,93,0.18)]"
                            : "border-white/10 bg-white/[0.06]"
                            }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />

                          <div className="relative flex items-center gap-3">
                            <div
                              className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center backdrop-blur ${isSelected ? "bg-[#a7cb5d]/20" : "bg-white/10"
                                }`}
                            >
                              <img
                                src={img}
                                alt={item.name}
                                className="w-[30px] h-[30px] object-contain"
                              />
                            </div>

                            <div>
                              <p
                                className={`text-[13px] font-medium ${isSelected ? "text-yellow-300" : "text-white"
                                  }`}
                              >
                                {item.name}
                              </p>
                              <p className="text-[11px] text-white/85">
                                Explore now
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="rounded-[22px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-2"
                >
                  {navItemsMobile.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-[16px] px-4 py-3 text-left transition ${location.pathname === item.path
                        ? "bg-[#a7cb5d]/15 text-[#b7d86a]"
                        : "text-white/90 hover:bg-white/[0.06]"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-[24px] h-[24px] object-contain"
                          />
                        ) : (
                          <span className="w-[24px] h-[24px] rounded-full bg-white/10" />
                        )}
                        <span className="text-[14px]">{item.name}</span>
                      </span>

                      <ChevronDown size={14} className="-rotate-90 opacity-60" />
                    </button>
                  ))}
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="pb-1"
                >
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        navigate("/my-orders");
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-full bg-gradient-to-tr from-[#f7fa52] to-yellow-600 text-white py-3.5 font-medium shadow-[0_10px_30px_rgba(122,161,66,0.35)]"
                    >
                      My Orders
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-full bg-gradient-to-tl from-[#f7fa52] to-yellow-600 text-white py-3.5 font-[600] shadow-[0_10px_30px_rgba(122,161,66,0.35)]"
                    >
                      Sign In / Register
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={async () => {
          setIsLoginOpen(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const userId = localStorage.getItem("userId");

          setIsLoggedIn(loginStatus);

          if (loginStatus && userId) {

            await mergeGuestCartToUserCart(userId);

            const finalCart = await fetchCart();

            setCartData(finalCart);
            setCartCount(getCartItemsCount(finalCart?.items || []));

            if (pendingCartOpen) {
              setPendingCartOpen(false);
              setCartOpen(true);
            }

            return;
          }

          const guestCart = formatGuestCart();

          setCartData(guestCart);
          setCartCount(getCartItemsCount(guestCart.items));
        }}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={async () => {
          setCartOpen(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const userId = localStorage.getItem("userId");

          if (loginStatus && userId) {
            await fetchCart();
            return;
          }

          const guestCart = formatGuestCart();

          setCartData(guestCart);
          setCartCount(getCartItemsCount(guestCart.items));
        }}
        cartData={cartData}
        loading={cartLoading}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearch("");
        }}
        search={search}
        setSearch={setSearch}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={async () => {
          setIsLoginOpen(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const userId = localStorage.getItem("userId");

          setIsLoggedIn(loginStatus);

          if (loginStatus && userId) {
            await mergeGuestCartToUserCart(userId);

            const finalCart = await fetchCart();

            setCartData(finalCart);
            setCartCount(getCartItemsCount(finalCart?.items || []));

            if (pendingCartOpen) {
              setPendingCartOpen(false);
              setCartOpen(true);
            }

            if (pendingCheckoutData) {
              const finalCheckoutData = {
                ...pendingCheckoutData,
                cartId: finalCart?._id || pendingCheckoutData.cartId,
                cart: {
                  _id: finalCart?._id || pendingCheckoutData.cartId,
                  items: finalCart?.items || pendingCheckoutData.items,
                },
                items: finalCart?.items || pendingCheckoutData.items,
              };

              localStorage.setItem(
                "checkoutData",
                JSON.stringify(finalCheckoutData)
              );

              if (finalCheckoutData.cartId) {
                localStorage.setItem("cartId", finalCheckoutData.cartId);
              }

              setPendingCheckoutData(null);
              setCartOpen(false);
              navigate("/checkout");
            }

            return;
          }

          setPendingCheckoutData(null);

          const guestCart = formatGuestCart();

          setCartData(guestCart);
          setCartCount(getCartItemsCount(guestCart.items));
        }}
      />
    </>
  );
}