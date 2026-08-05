/* Developed by Grafizen International PVT. LTD. */

"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/component/common/ui/CardContainer";
import { motion } from "framer-motion";
import backImage from "../../../public/imges/productcategores/backGroundImage1.jpg"
import powder1 from "../../../public/imges/Products/webEx/powder1.png";
import powder2 from "../../../public/imges/Products/webEx/powder2.png";
import powder3 from "../../../public/imges/Products/webEx/powder3.png";
import powder4 from "../../../public/imges/Products/webEx/powder4.png";
import ghee1 from "../../../public/imges/Products/webEx/ghee1.png";
import honey1 from "../../../src/../public/imges/Products/webEx/honey.png"
import bestSellerTag from "../../../public/imges/productDetails/newIdea/best-sellerstag.png"
import newest from "../../../public/imges/productDetails/newIdea/newest.png"
import trending from "../../../public/imges/productDetails/newIdea/trending-topic.png"
import { ApiGet } from "@/helper/axios";
import { ApiPost } from "@/helper/axios";
import { useNavigate } from "react-router-dom";
import { getMediaUrl, getProductThumb } from "@/utils/media";
import OptimizedImage from "@/component/common/OptimizedImage";
import CartDrawer from "../OrderProcess/CartDrawer";
import {
  addItemToGuestCart,
  getGuestCart,
  clearGuestCart,
} from "@/utils/cartStorage";
import { ArrowRight, BadgePercent, Heart, CheckCircle } from "lucide-react";
import { LoginModal } from "../LoginModal";

const getDisplayWeight = (item) => {
  return (
    item?.displayWeight ||
    item?.sku?.match(/\d+\s*(ml|ltr|liter|litre|l|kg|g|gm)/i)?.[0] ||
    (item?.weight && item?.weightUnit
      ? `${item.weight} ${item.weightUnit}`
      : "") ||
    (item?.variants?.[0]?.weight && item?.variants?.[0]?.weightUnit
      ? `${item.variants[0].weight} ${item.variants[0].weightUnit}`
      : "")
  );
};

const getImageUrl = (image, size = "thumb") => getMediaUrl(image, size);

const formatCartForDrawer = (items = [], cartId = "guest-cart") => {
  const formattedItems = items.map((item) => {
    const productData = item.productId || item;

    const sellingPrice = Number(
      item.sellingPrice ||
      item.salePrice ||
      item.price ||
      productData?.salePrice ||
      productData?.sellingPrice ||
      0
    );

    const originalPrice = Number(
      item.originalPrice ||
      item.mrp ||
      productData?.price ||
      productData?.originalPrice ||
      sellingPrice ||
      0
    );

    return {
      cartItemId:
        item.cartItemId ||
        item._id ||
        `${productData?._id || item.productId}-${item.selectedColor || "default"}`,

      productId: productData?._id || item.productId,

      name:
        item.name ||
        item.title ||
        productData?.name ||
        productData?.title ||
        "Product",

      selectedColor: item.selectedColor || item.variant || null,
      variant: item.variant || item.selectedColor || null,

      image:
        item.image ||
        item.selectedColorImage ||
        getImageUrl(productData?.images?.[0]) ||
        getImageUrl(productData?.featuredImage) ||
        getImageUrl(productData?.image) ||
        "",

      price: sellingPrice,
      sellingPrice: sellingPrice,
      salePrice: sellingPrice,

      mrp: originalPrice,
      originalPrice: originalPrice,

      quantity: Number(item.quantity || item.qty || 1),
      qty: Number(item.qty || item.quantity || 1),

      slug: item.slug || productData?.slug || "",
    };
  });

  const subtotal = formattedItems.reduce(
    (sum, item) =>
      sum +
      Number(item.sellingPrice || item.price || 0) *
      Number(item.quantity || item.qty || 1),
    0
  );

  return {
    _id: cartId,
    items: formattedItems,
    subtotal,
    total: subtotal,
  };
};

export default function NewProducts() {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [openCart, setOpenCart] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [cartData, setCartData] = useState(() => {
    if (typeof window === "undefined") {
      return {
        _id: "guest-cart",
        items: [],
        subtotal: 0,
        total: 0,
      };
    }

    return formatCartForDrawer(getGuestCart(), "guest-cart");
  });
  const userId = localStorage.getItem("userId");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);

  const isUserLoggedIn = () => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const latestUserId = localStorage.getItem("userId");

    return Boolean(loginStatus && latestUserId);
  };

  const getProductId = (item) => {
    return String(
      item?._id ||
      item?.productId?._id ||
      item?.productId ||
      item?.id ||
      ""
    );
  };

  const getWishlistApi = async (userId) => {
    const res = await ApiGet(`/wishlist/${userId}`);
    return res?.data?.data || res?.data || res;
  };

  const addWishlistApi = async (payload) => {
    const res = await ApiPost("/wishlist/add", payload);
    return res?.data?.data || res?.data;
  };

  const removeWishlistApi = async (payload) => {
    const res = await ApiPost("/wishlist/remove", payload);
    return res?.data?.data || res?.data;
  };

  const extractWishlistProductIds = (wishlistData) => {
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
        return (
          item?.productId?._id ||
          item?.product?._id ||
          item?.productId ||
          item?.product ||
          item?._id ||
          item?.id
        );
      })
      .filter(Boolean)
      .map(String);
  };

  const fetchWishlist = async (latestUserId = null) => {
    try {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = latestUserId || localStorage.getItem("userId");

      if (!loginStatus || !userId) {
        setWishlistIds([]);
        return [];
      }

      const wishlistData = await getWishlistApi(userId);
      const ids = extractWishlistProductIds(wishlistData);

      setWishlistIds(ids);
      return ids;
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      setWishlistIds([]);
      return [];
    }
  };

  const toggleWishlistProduct = async (
    item,
    latestUserId = null,
    currentWishlistIds = wishlistIds
  ) => {
    const productId = getProductId(item);
    const userId = latestUserId || localStorage.getItem("userId");

    if (!productId || !userId) return;

    const alreadyWishlisted = currentWishlistIds.includes(productId);

    try {
      setWishlistLoadingId(productId);

      setWishlistIds((prev) => {
        if (alreadyWishlisted) {
          return prev.filter((id) => id !== productId);
        }

        return [...new Set([...prev, productId])];
      });

      if (alreadyWishlisted) {
        await removeWishlistApi({
          userId,
          productId,
        });

        showCartMessage("Product removed from wishlist");
      } else {
        await addWishlistApi({
          userId,
          productId,
        });

        showCartMessage("Product added to wishlist");
      }

      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Wishlist update error:", err);

      setWishlistIds((prev) => {
        if (alreadyWishlisted) {
          return [...new Set([...prev, productId])];
        }

        return prev.filter((id) => id !== productId);
      });

      showCartMessage("Failed to update wishlist");
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const handleWishlistClick = async (e, item) => {
    e.stopPropagation();

    if (!isUserLoggedIn()) {
      setPendingWishlistProduct(item);
      setOpenLoginModal(true);
      return;
    }

    await toggleWishlistProduct(item);
  };

  useEffect(() => {
    const syncGuestCart = () => {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      if (loginStatus && userId) {
        fetchCart();
        return;
      }

      const guestCart = formatCartForDrawer(getGuestCart(), "guest-cart");
      setCartData(guestCart);
    };

    syncGuestCart();

    window.addEventListener("guest-cart-updated", syncGuestCart);
    window.addEventListener("cart-updated", syncGuestCart);
    window.addEventListener("storage", syncGuestCart);

    return () => {
      window.removeEventListener("guest-cart-updated", syncGuestCart);
      window.removeEventListener("cart-updated", syncGuestCart);
      window.removeEventListener("storage", syncGuestCart);
    };
  }, []);

  useEffect(() => {
    const syncWishlist = () => {
      fetchWishlist();
    };

    syncWishlist();

    window.addEventListener("wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const addToCartApi = async (payload) => {
    const res = await ApiPost("/cart", payload);
    return res?.data?.data || res?.data;
  };

  const getCartApi = async (userId) => {
    const res = await ApiGet(`/cart/${userId}`);
    return res?.data?.data || res?.data || res;
  };

  const fetchCart = async () => {
    try {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      if (!loginStatus || !userId) {
        const guestCart = formatCartForDrawer(getGuestCart(), "guest-cart");
        setCartData(guestCart);
        return guestCart;
      }

      const res = await getCartApi(userId);

      const formattedCart = formatCartForDrawer(
        res?.items || [],
        res?._id || null
      );

      setCartData(formattedCart);

      return formattedCart;
    } catch (err) {
      console.error("Fetch cart error:", err);

      const emptyCart = {
        _id: null,
        items: [],
        subtotal: 0,
        total: 0,
      };

      setCartData(emptyCart);

      return emptyCart;
    }
  };

  const showCartMessage = (message = "Item added successfully in cart") => {
    setToastMessage(message);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage("");
    }, 2500);
  };

  const handleAddToCart = async (item) => {
    const productId = item._id;

    try {

      setLoadingProductId(productId);

      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");

      const cartItem = {
        productId: item._id,
        name: item.title || item.name,
        quantity: 1,
        qty: 1,
        price: Number(item.price || 0),
        sellingPrice: Number(item.price || 0),
        originalPrice: Number(item.originalPrice || item.price || 0),
        image: getImageUrl(item.image1 || item.image2),
        slug: item.slug || "",
      };

      if (!loginStatus) {
        const guestCart = addItemToGuestCart(cartItem);

        const formatted = formatCartForDrawer(
          guestCart?.items || [],
          "guest-cart"
        );

        setCartData(formatted);

        setOpenCart(true);

        window.dispatchEvent(
          new CustomEvent("guest-cart-updated", {
            detail: { items: guestCart?.items || [] },
          })
        );

        showCartMessage("Item added successfully in cart");

        return;
      }

      setCartData((prev) => {
        const items = prev?.items || [];

        const updated = [...items, cartItem];

        return formatCartForDrawer(updated, prev._id || "user-cart");
      });

      setOpenCart(true);

      window.dispatchEvent(new Event("cart-updated"));

      addToCartApi({
        userId,
        items: [cartItem],
      });

      showCartMessage("Item added successfully in cart");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const fetchNewProducts = async () => {
    try {
      const res = await ApiGet("/admin/products");

      const data =
        res?.data?.data ||
        res?.product?.products ||
        [];

      const mapped = data.map((item) => {
        const originalPrice = Number(item?.originalPrice || item?.price || 0);
        const salePrice = Number(item?.salePrice || item?.price || 0);

        const discount =
          originalPrice > 0 && salePrice > 0 && salePrice < originalPrice
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : 0;

        const displayWeight =
          item?.displayWeight ||
          item?.sku?.match(/\d+\s*(ml|ltr|liter|litre|l|kg|g|gm)/i)?.[0] ||
          (item?.weight && item?.weightUnit
            ? `${item.weight} ${item.weightUnit}`
            : "") ||
          (item?.variants?.[0]?.weight && item?.variants?.[0]?.weightUnit
            ? `${item.variants[0].weight} ${item.variants[0].weightUnit}`
            : "");

        return {
          _id: item?._id,
          slug: item?.slug,
          title: item.name,

          price: salePrice || originalPrice,
          originalPrice: originalPrice,

          rating: item.rating || 4.5,
          reviews: item.reviews || item.reviewCount || 100,

          badge: discount > 20 ? "HOT DEAL" : "NEW",
          tagImage: newest,

          discount: discount,

          displayWeight,

          image1: getProductThumb(item),
          image2: "",
        };
      });

      setProducts(mapped);

    } catch (err) {
      console.error("New Products Error:", err);
    }
  };

  useEffect(() => {
    fetchNewProducts();
  }, []);

  console.log('products', products)
  const productList = products.length ? products : [];
  const visibleProducts = productList.slice(0, 6);
  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 320;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  const handleViewmore = () => {
    navigate("/all-products");
  }

  const mergeGuestCartWithUserCart = async (latestUserId) => {
    try {
      if (!latestUserId) return null;

      const guestItems = getGuestCart();

      if (!guestItems || guestItems.length === 0) {
        const userCartRes = await getCartApi(latestUserId);

        const formattedCart = formatCartForDrawer(
          userCartRes?.items || [],
          userCartRes?._id || null
        );

        setCartData(formattedCart);

        return formattedCart;
      }

      await addToCartApi({
        userId: latestUserId,
        items: guestItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity || item.qty || 1,
          selectedColor: item.selectedColor || item.variant || null,
          selectedColorImage: item.selectedColorImage || item.image || "",

          price: item.price || item.sellingPrice || item.salePrice || 0,
          sellingPrice: item.sellingPrice || item.price || item.salePrice || 0,
          salePrice: item.salePrice || item.sellingPrice || item.price || 0,

          mrp: item.mrp || item.originalPrice || item.price || 0,
          originalPrice: item.originalPrice || item.mrp || item.price || 0,

          name: item.name || item.title || "Product",
          image: item.image || item.selectedColorImage || "",
          slug: item.slug || "",
        })),
      });

      clearGuestCart();

      const userCartRes = await getCartApi(latestUserId);

      const formattedCart = formatCartForDrawer(
        userCartRes?.items || [],
        userCartRes?._id || null
      );

      setCartData(formattedCart);

      return formattedCart;
    } catch (error) {
      console.error("Merge guest cart error:", error);
      return null;
    }
  };

  const handleProceedToCheckout = async (checkoutDataFromDrawer) => {
    try {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      const latestUserId = localStorage.getItem("userId");

      if (!loginStatus || !latestUserId) {
        setPendingCheckoutData(checkoutDataFromDrawer);
        setOpenCart(false);

        setTimeout(() => {
          setOpenLoginModal(true);
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

      setOpenCart(false);
      navigate("/checkout");
    } catch (error) {
      console.error("Proceed checkout error:", error);
      alert("Failed to proceed checkout");
    }
  };

  return (
    <section className=" pt-[13px] lg:pt-22 pb-[70px] relative">
      <div className=" md:w-[90%] 2xl:w-[90%]  mx-auto relative">

        <div className="lg:mb-8 w-fit mx-auto relative">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute w-fit  mx-auto left-0  right-0   top-[-30px]  lg:top-[-70px]  md:block text-[42px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Newest
          </motion.div>

          <h2 className=" text-[28px] lg:text-5xl text-center font-[600] text-gray-900">
            New Products
          </h2>

          <p className="lg:mt-3 text-gray-600 text-[12px] px-[10px] lg:px-0 lg:text-lg text-center max-w-[650px]">
            Discover the latest additions from Gawdee — thoughtfully crafted products
            inspired by purity, wellness, and natural living.
          </p>
        </div>

        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute cursor-target left-0 top-[65%] z-20 -translate-y-1/2 border bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute cursor-target right-0 top-[65%] z-20 -translate-y-1/2 bg-white border shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className=" grid grid-cols-2 md57:grid-cols-3 md:flex md:overflow-x-auto  md:pl-[0px] px-3 gap-[10px] md:gap-4 pt-[20px] scroll-smooth no-scrollbar"
        >

          {showLeft && (
            <div className="absolute left-0 bottom-0 h-[500px] md:w-20 w-[30px] bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          )}

          {showRight && (
            <div className="absolute right-0 bottom-0 h-[500px] md:w-20 w-[30px] bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          )}

          {visibleProducts.map((item, index) => {
            const discount = Math.round(
              ((item.originalPrice - item.price) / item.originalPrice) * 100
            );

            const productId = getProductId(item);
            const productWishlisted = wishlistIds.includes(productId);
            const productWishlistLoading = wishlistLoadingId === productId;

            return (
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => item.slug && navigate(`/product/${item.slug}`)}
                className="md:w-[275px] bg-white flex-shrink-0  rounded-[10px] md:rounded-[15px] border border-gray-200 shadow-sm  group"
              >

                <div className="relative bg-[#f6f6f6] md:rounded-t-[15px] rounded-t-[9px] overflow-hidden border-b md:h-[266px] flex items-center justify-center">

                  <div className="absolute left-[-3px] shadow-lg z-10 flex gap-1 items-center top-2 md:top-3 border-l font-[500] border-[#0c776b] bg-[#0c776b] text-white text-[8px] md:text-[11px] px-2 py-[4px] md:py-[6px] rounded-r-full">
                    <img src={item.tagImage} className="w-[15px]" />
                    {item.badge}
                  </div>

                  <div className="absolute right-2 md:right-3 top-2 md:top-3 z-10 bg-[#e8f5e9] text-[#0c776b] text-[8px] px-2 md:px-3 py-[4px] md:py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
                    🌿 {item.discount}% OFF
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleWishlistClick(e, item)}
                    disabled={productWishlistLoading}
                    className={`absolute right-4 top-11 z-20 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${productWishlisted
                      ? "bg-[#0c776b] text-white"
                      : "bg-white/90 text-[#0c776b] hover:bg-[#f2b18f] hover:text-white"
                      } ${productWishlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <Heart
                      size={19}
                      fill={productWishlisted ? "currentColor" : "none"}
                    />
                  </button>

                  <OptimizedImage
                    src={item.image1}
                    alt={item.title || "Product"}
                    className="w-[273px] h-[180px] md:h-[266px]"
                    imgClassName="object-contain"
                  />

                </div>

                <div className=" p-2 md:p-3">

                  <h3 className=" text-[13px] md:text-[15px] font-medium min-h-[40px] text-gray-800 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex font-[500] items-center gap-1 md:gap-2 md:mt-2 text-[10px] md:text-[12px] text-gray-600">
                    ⭐ {item.rating}
                    <span className=" ">({item.reviews} reviews)</span>
                  </div>

                  <div className="flex  justify-between items-center gap-3 mt-2">

                    <div className="flex items-end gap-1 md:gap-3 ">
                      <span className=" text-[15px] md:text-lg font-semibold text-black">
                        ₹{item.price}
                      </span>

                      <span className="text-gray-400 line-through md:text-sm text-[11px]">
                        ₹{item.originalPrice}
                      </span>
                    </div>
                    {item.displayWeight && (
                      <div className=" w-fit rounded-full h-fit  border border-[#0c776b]/20 bg-[#e8f5e9] px-2 md:px-3 py-[2px] md:py-[5px] text-[10px] md:text-[11px] font-semibold text-[#0c776b]">
                        {item.displayWeight}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2 rounded-md bg-[#edf7e7] border border-[#1d6f4d] px-1.5 md:px-3 py-2 border-dashed text-[8px] md:text-[10px] text-[#214d3b] font-medium">
                    <BadgePercent size={14} />  Best Price ₹{item.price} with Coupon
                  </div>

                  <button
                    disabled={loadingProductId === item._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="mt-3 w-full bg-[#0c776b] hover:bg-[#06554c] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
                  >
                    {loadingProductId === item._id ? (
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
            );

          })}
        </div>

        <div className=" md:pl-[80px]  mx-auto  mt-[30px]  w-fit  " onClick={handleViewmore}>

          <button
            class="cursor-pointer w-fit bg-gradient-to-b from-[#0c776b] to-[#077468] shadow-[0px_4px_32px_0_rgba(34,197,94,0.5)] px-6 py-2 rounded-xl border-[1px] border-slate-500 text-white font-medium group"

          >
            <div class="relative overflow-hidden">
              <p
                class=" flex items-center gap-[6px] duration-[1.125s] "
              >
                View More

                <ArrowRight size={20} />    </p>

            </div>
          </button>
        </div>
      </div>
      <CartDrawer
        isOpen={openCart}
        onClose={async () => {
          setOpenCart(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const userId = localStorage.getItem("userId");

          if (loginStatus && userId) {
            await fetchCart();
            return;
          }

          const guestCart = formatCartForDrawer(getGuestCart(), "guest-cart");
          setCartData(guestCart);
        }}
        cartData={cartData}
        onProceedToCheckout={handleProceedToCheckout}
      />
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => {
          setOpenLoginModal(false);
          setPendingWishlistProduct(null);
        }}
        onSuccess={async () => {
          const latestUserId = localStorage.getItem("userId");

          setOpenLoginModal(false);

          if (!latestUserId) {
            setPendingWishlistProduct(null);
            return;
          }

          const mergedCart = await mergeGuestCartWithUserCart(latestUserId);

          const latestWishlistIds = await fetchWishlist(latestUserId);

          if (pendingWishlistProduct) {
            await toggleWishlistProduct(
              pendingWishlistProduct,
              latestUserId,
              latestWishlistIds
            );

            setPendingWishlistProduct(null);
          }

          if (pendingCheckoutData) {
            const subtotal = mergedCart?.items?.reduce(
              (sum, item) =>
                sum +
                Number(item.sellingPrice || item.price || 0) *
                Number(item.quantity || item.qty || 1),
              0
            );

            const finalCheckoutData = {
              ...pendingCheckoutData,
              cartId: mergedCart?._id || pendingCheckoutData.cartId,
              cart: {
                _id: mergedCart?._id || pendingCheckoutData.cartId,
                items: mergedCart?.items || pendingCheckoutData.items,
              },
              items: mergedCart?.items || pendingCheckoutData.items,
              subtotal: subtotal || pendingCheckoutData.subtotal,
              total: Math.max(
                Number(subtotal || pendingCheckoutData.subtotal || 0) -
                Number(pendingCheckoutData.discount || 0),
                0
              ),
            };

            localStorage.setItem(
              "checkoutData",
              JSON.stringify(finalCheckoutData)
            );

            if (finalCheckoutData.cartId) {
              localStorage.setItem("cartId", finalCheckoutData.cartId);
            }

            setPendingCheckoutData(null);
            setOpenCart(false);
            navigate("/checkout");
            return;
          }

          await fetchCart();
        }}
      />
      {toastVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed top-5 right-5 z-[50000] flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-white shadow-2xl"
        >
          <CheckCircle size={20} className="flex-shrink-0" />

          <span className="text-sm font-semibold">
            {toastMessage || "Item added successfully in cart"}
          </span>
        </motion.div>
      )}
    </section>
  );
}