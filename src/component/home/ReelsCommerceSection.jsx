/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ShoppingCart,
  ExternalLink,
  X,
} from "lucide-react";

import backImage from "../../../public/imges/productcategores/backGroundImage1.jpg";
import powder1 from "../../../public/imges/Products/webEx/powder1.png";
import powder2 from "../../../public/imges/Products/webEx/powder2.png";
import ghee1 from "../../../public/imges/Products/webEx/ghee1.png";
import honey1 from "../../../src/../public/imges/Products/webEx/honey.png";
import BackImage1 from "../../../public/imges/reelsection/nature_767194-516.png";
import { ApiGet, ApiPost } from "../../helper/axios";
import {
  addItemToGuestCart,
  getGuestCart,
  saveGuestCart,
} from "@/utils/cartStorage";
import CartDrawer from "../OrderProcess/CartDrawer";
import { useNavigate } from "react-router-dom";

import reel1 from "../../../public/imges/reelsection/ismakhan-reel.mp4"
import reel2 from "../../../public/imges/reelsection/reel2.mp4"
import reel3 from "../../../public/imges/reelsection/reel3.mp4"

const fallbackReels = [
  {
    id: 1,
    title: "Village Story",
    video: reel1,
    description:
      "A behind-the-scenes glimpse into how natural goodness is nurtured with care, tradition, and patience before it reaches your kitchen.",
    products: [
      {
        id: 101,
        title: "Khapli Atta",
        price: 2278,
        image: powder1,
        cta: "ADD TO CART",
      },
    ],
  },
  {
    id: 2,
    title: "Making Of Home-Like Desi A2 Ghee",
    video: reel2,
    description:
      "Watch the making of our home-style A2 ghee inspired by village methods.",
    products: [
      {
        id: 102,
        title: "A2 Gir Cow Ghee",
        price: 3370,
        image: powder2,
        cta: "ADD TO CART",
      },
    ],
  },
  {
    id: 3,
    title: "Khapli Flour",
    video: reel3,
    description:
      "A quick feature reel highlighting one of our most loved pantry essentials.",
    products: [
      {
        id: 103,
        title: "Khapli Flour",
        price: 1745,
        image: honey1,
        cta: "ADD TO CART",
      },
    ],
  },
  {
    id: 4,
    title: "Amlaprash",
    video: reel1,
    description:
      "A vibrant reel featuring our traditional wellness-inspired preparation.",
    products: [
      {
        id: 104,
        title: "Amlaprash",
        price: 1960,
        image: ghee1,
        cta: "ADD TO CART",
      },
    ],
  },
  {
    id: 5,
    title: "Date Palm Story",
    video: reel2,
    description:
      "Tapped from local date palm trees and crafted with care, our date palm jaggery is pure winter nostalgia.",
    products: [
      {
        id: 105,
        title: "Date Palm Jaggery Solid",
        price: 895,
        image: ghee1,
        cta: "ADD TO CART",
      },
    ],
  },
];

const VIDEO_SECTION_API = "/admin/video-section";

const getCartApi = async (userId) => {
  const res = await ApiGet(`/cart/${userId}`);
  return res?.data?.data || res?.data || res;
};

const addToCartApi = async (payload) => {
  const res = await ApiPost("/cart", payload);
  return res?.data?.data || res?.data || res;
};

function ProductStripCard({
  products,
  compact = false,
  onAddToCart,
  addedProductId,
  onProductTitleClick,
  getProductCartCount,
  onCartIconClick,
}) {
  const visible = products.slice(0, 2);
  const mainProduct = visible[0];

  const currentProductCartCount = mainProduct
    ? getProductCartCount?.(mainProduct.id) || 0
    : 0;

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-[#e7e7e7] shadow-[0_12px_28px_rgba(0,0,0,0.14)] rounded-xl ${compact ? "p-2" : "p-2"
        }`}
    >
      <div className="flex flex-col gap-3">
        {visible.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] rounded-full bg-[#f6f6f6] flex items-center justify-center border">
              <img
                src={product.featuredImage || product.image}
                alt={product.title}
                className="w-[38px] h-[38px] object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  onProductTitleClick?.(product);
                }}
                className="text-[10px] font-medium text-[#2a2a2a] leading-snug line-clamp-2 cursor-pointer hover:text-[#0c776b] transition"
              >
                {product.title}
              </p>

              <p className="text-[15px] font-semibold text-[#1e4b2c] mt-[2px]">
                ₹ {Number(product.price || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                if (product.link) {
                  window.location.href = product.link;
                }
              }}
              className="w-9 h-9 rounded-full bg-[#f0f0f0] hover:bg-[#e3e3e3] flex items-center justify-center transition"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        ))}

        <div className="grid grid-cols-[1fr_48px] gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(mainProduct);
            }}
            className="h-7 rounded-md bg-[#0c776b] text-white text-[11px] font-[500] hover:bg-[#16381f] transition"
          >
            {addedProductId === mainProduct?.id ? "ADDED" : "ADD TO CART"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCartIconClick?.();
            }}
            className="relative h-7 rounded-md text-[#1f4c2c] flex items-center border border-[#16381f] justify-center hover:bg-[#16381f] hover:text-white transition"
          >
            <ShoppingCart size={16} />

            {currentProductCartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#0c776b] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {currentProductCartCount > 99 ? "99+" : currentProductCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReelCard({
  item,
  index,
  activePreviewIndex,
  onClick,
  onAddToCart,
  addedProductId,
  onProductTitleClick,
  getProductCartCount,
  onCartIconClick,
}) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const shouldPlay = hovered || activePreviewIndex === index;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [shouldPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    const timer = setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, 5000);

    return () => clearTimeout(timer);
  }, [shouldPlay]);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.06 : 1 }}
      transition={{ duration: 0.28 }}
      className="relative shrink-0 w-[220px] md:w-[200px]"
    >
      <div
        onClick={onClick}
        className="relative rounded-2xl overflow-hidden h-[360px] md:h-[360px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] cursor-pointer group bg-black"
      >
        <video
          ref={videoRef}
          src={item.video}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover bg-black"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

        {!shouldPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-sm border border-white/70 flex items-center justify-center text-white shadow-lg">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-2 right-2 -bottom-6">
        <ProductStripCard
          products={item.products}
          compact
          onAddToCart={onAddToCart}
          addedProductId={addedProductId}
          onProductTitleClick={onProductTitleClick}
          getProductCartCount={getProductCartCount}
          onCartIconClick={onCartIconClick}
        />
      </div>
    </motion.div>
  );
}

export default function ReelsCommerceSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);
  const [openCart, setOpenCart] = useState(false);
  const [cartData, setCartData] = useState({
    _id: "guest-cart",
    items: [],
  });
  const [addedProductId, setAddedProductId] = useState(null);

  const [reelsData, setReelsData] = useState(fallbackReels);
  const [sectionTitle, setSectionTitle] = useState(
    "From Nature to Your Plate — See How Good Food Is Made"
  );
  const [sectionVisible, setSectionVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);

  const modalVideoRef = useRef(null);

  const getCartItemsArray = (cartValue) => {
    if (Array.isArray(cartValue)) return cartValue;

    if (Array.isArray(cartValue?.items)) return cartValue.items;

    if (Array.isArray(cartValue?.data?.items)) return cartValue.data.items;

    return [];
  };

  useEffect(() => {
    const syncCart = () => {
      const loginStatus =
        localStorage.getItem("isLoggedIn") === "true";

      if (loginStatus) {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        getCartApi(userId).then((backendCart) => {
          const formatted = formatBackendCartForDrawer(backendCart);

          setCartData({
            _id: "user-cart",
            items: [...formatted.items],
            subtotal: formatted.subtotal,
            total: formatted.total,
          });
        });

        return;
      }

      const guestCart = getGuestCart();
      const formatted = formatGuestCartForDrawer(guestCart);

      setCartData({
        _id: "guest-cart",
        items: [...formatted.items],
        subtotal: formatted.subtotal,
        total: formatted.total,
      });
    };

    syncCart();

    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("guest-cart-updated", syncCart);

    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("guest-cart-updated", syncCart);
    };
  }, []);

  const formatGuestCartForDrawer = (cartValue = []) => {
    const rawItems = getCartItemsArray(cartValue);

    const items = rawItems.map((item) => {
      const qty = Number(item.quantity || item.qty || 1);
      const price = Number(item.price || item.salePrice || item.sellingPrice || 0);
      const originalPrice = Number(
        item.originalPrice || item.mrp || item.maxPrice || item.price || 0
      );

      const image =
        item.image ||
        item.selectedColorImage ||
        item.productImage ||
        item.productId?.images?.[0] ||
        "";

      return {
        _id: item._id || item.cartItemId || item.productId,
        cartItemId: item.cartItemId || item._id || item.productId,

        productId: item.productId?._id || item.productId,
        name:
          item.name ||
          item.title ||
          item.productName ||
          item.productId?.name ||
          item.productId?.title ||
          "",

        quantity: qty,
        qty,

        selectedColor: item.selectedColor || null,
        variant: item.variant || item.selectedColor || null,

        image,
        selectedColorImage: image,

        price,
        salePrice: price,

        mrp: originalPrice,
        originalPrice,

        discountAmount: Math.max(originalPrice - price, 0),

        slug: item.slug || item.productId?.slug || "",
      };
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    const originalSubtotal = items.reduce((sum, item) => {
      return (
        sum +
        Number(item.originalPrice || item.mrp || item.price || 0) *
        Number(item.quantity || 1)
      );
    }, 0);

    return {
      _id: "guest-cart",
      items,
      subtotal,
      originalSubtotal,
      discount: Math.max(originalSubtotal - subtotal, 0),
      total: subtotal,
    };
  };

  useEffect(() => {
    fetchCurrentCartForDrawer();
  }, []);

  const getProductCartCount = (productId) => {
    if (!productId) return 0;

    const items = cartData?.items || [];

    return items.reduce((total, item) => {
      const id =
        item.productId?._id ||
        item.productId ||
        item.id;

      if (String(id) !== String(productId)) return total;

      return total + Number(item.quantity || item.qty || 1);
    }, 0);
  };

  const getVideoSection = async () => {
    try {
      setLoading(true);

      const res = await ApiGet(VIDEO_SECTION_API);

      const data = res?.data?.data || res?.data || res;

      if (data) {
        setSectionTitle(
          data.title || "From Nature to Your Plate — See How Good Food Is Made"
        );

        setSectionVisible(data.visible ?? true);

        if (Array.isArray(data.videos) && data.videos.length > 0) {
          const mappedVideos = data.videos
            .filter((item) => item.video)
            .map((item, index) => {
              const product = item.productId;

              return {
                id: item._id || index + 1,
                title: item.heading || product?.name || "Product Video",
                video: item.video,
                cover: item.cover || "",
                description: item.description || "",
                link: item.link || "",
                products: product
                  ? [
                    {
                      id: product._id,
                      title: product.name,
                      price: product.salePrice || product.price,
                      mrp: product.price,
                      image: product.featuredImage || product.images?.[0] || item.cover || "",
                      featuredImage: product.featuredImage || "",
                      images: product.images || [],
                      cta: "ADD TO CART",
                      slug: product.slug,
                      link: item.link || `/product/${product.slug}`,
                    }
                  ]
                  : [],
              };
            });

          setReelsData(mappedVideos);
        }
      }
    } catch (error) {
      console.log("Video section API error:", error);
      setReelsData(fallbackReels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideoSection();
  }, []);

  const activeItem = useMemo(
    () => (activeIndex !== null ? reelsData[activeIndex] : null),
    [activeIndex, reelsData]
  );

  const activeProduct = activeItem?.products?.[0];

  const activeProductImages =
    activeProduct?.images?.length > 0
      ? activeProduct.images
      : activeProduct?.image
        ? [activeProduct.image]
        : [];

  const currentProductImage =
    activeProductImages[activeProductImageIndex] || activeProductImages[0] || "";

  useEffect(() => {
    setActivePreviewIndex(null);
  }, []);
  useEffect(() => {
    setActiveProductImageIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    if (!activeItem || !modalVideoRef.current) return;

    modalVideoRef.current.currentTime = 0;
    modalVideoRef.current.play().catch(() => {});
  }, [activeItem]);

  const closeModal = () => setActiveIndex(null);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? reelsData.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === reelsData.length - 1 ? 0 : prev + 1
    );
  };

  const leftPreview =
    activeIndex !== null && reelsData.length > 0
      ? reelsData[(activeIndex - 1 + reelsData.length) % reelsData.length]
      : null;

  const rightPreview =
    activeIndex !== null && reelsData.length > 0
      ? reelsData[(activeIndex + 1) % reelsData.length]
      : null;

  const notifyHeaderCartBadge = (items = []) => {
    if (typeof window === "undefined") return;

    const loginStatus = localStorage.getItem("isLoggedIn") === "true";

    if (loginStatus) {
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }

    window.dispatchEvent(
      new CustomEvent("guest-cart-updated", {
        detail: {
          items,
        },
      })
    );

    window.dispatchEvent(new Event("cart-updated"));
  };

  const getCartItemProductId = (item) => {
    return (
      item.productId?._id ||
      item.productId ||
      item.id ||
      item._id ||
      ""
    );
  };

  const makeCartItemKey = (item) => {
    const productId = getCartItemProductId(item);
    const selectedColor = item.selectedColor || item.variant || "default";

    return `${String(productId)}-${String(selectedColor)}`;
  };

  const addGuestItemAndIncreaseQtyForStateOnly = (newItem) => {
    const oldItems = cartData?.items?.length
      ? cartData.items
      : getCartItemsArray(getGuestCart());

    const newItemKey = makeCartItemKey(newItem);

    let found = false;

    const updatedItems = oldItems.map((item) => {
      const oldItemKey = makeCartItemKey(item);

      if (oldItemKey !== newItemKey) {
        return item;
      }

      found = true;

      const oldQty = Number(item.quantity || item.qty || 1);
      const addQty = Number(newItem.quantity || newItem.qty || 1);
      const finalQty = oldQty + addQty;

      return {
        ...item,
        quantity: finalQty,
        qty: finalQty,
      };
    });

    if (!found) {
      updatedItems.push({
        ...newItem,
        quantity: Number(newItem.quantity || newItem.qty || 1),
        qty: Number(newItem.quantity || newItem.qty || 1),
      });
    }

    return updatedItems;
  };

  const handleAddToGuestCart = async (product) => {
    if (!product) return;

    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");

    const cartItem = {
      productId: product.id,
      name: product.title,

      quantity: 1,
      qty: 1,

      selectedColor: null,
      variant: null,

      image: product.image,
      selectedColorImage: product.image,

      price: Number(product.price || 0),
      salePrice: Number(product.price || 0),

      mrp: Number(product.mrp || product.price || 0),
      originalPrice: Number(product.mrp || product.price || 0),

      slug: product.slug || "",
    };

    const updatedItems = addGuestItemAndIncreaseQtyForStateOnly(cartItem);
    const formattedCart = formatGuestCartForDrawer(updatedItems);

    setCartData(formattedCart);
    notifyHeaderCartBadge(formattedCart.items);

    setAddedProductId(product.id);

    setTimeout(() => {
      setAddedProductId(null);
    }, 1000);

    if (loginStatus && userId) {
      const payload = {
        userId,
        items: [
          {
            productId: product.id,
            quantity: 1,
            selectedColor: null,
            selectedColorImage: product.image || "",
          },
        ],
      };

      addToCartApi(payload)
        .then(() => {
          window.dispatchEvent(new Event("cart-updated"));
        })
        .catch((error) => {
          console.error("Reel background add to cart error:", error);
        });

      return;
    }

    saveGuestCart(updatedItems);
  };

  const formatBackendCartForDrawer = (cartValue) => {
    const rawItems = getCartItemsArray(cartValue);
    const formattedCart = formatGuestCartForDrawer(rawItems);

    return {
      ...formattedCart,
      _id: cartValue?._id || "user-cart",
      total: Number(cartValue?.total || formattedCart.total || 0),
      subtotal: Number(cartValue?.subtotal || formattedCart.subtotal || 0),
    };
  };

  const fetchCurrentCartForDrawer = async () => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");

    if (loginStatus && userId) {
      const backendCart = await getCartApi(userId);
      const formattedCart = formatBackendCartForDrawer(backendCart);

      setCartData(formattedCart);
      notifyHeaderCartBadge([]);

      return formattedCart;
    }

    const guestCart = getGuestCart();
    const formattedCart = formatGuestCartForDrawer(guestCart);

    setCartData(formattedCart);
    notifyHeaderCartBadge(formattedCart.items);

    return formattedCart;
  };

  const refreshCartData = async () => {
    return await fetchCurrentCartForDrawer();
  };

  const updateReelCartAfterDrawerChange = (updatedItems = []) => {
    const formattedCart = formatGuestCartForDrawer(updatedItems);

    setCartData(formattedCart);

    const loginStatus = localStorage.getItem("isLoggedIn") === "true";

    if (loginStatus) {

      window.dispatchEvent(new Event("cart-updated"));

      return formattedCart;
    }

    saveGuestCart(formattedCart.items);

    window.dispatchEvent(
      new CustomEvent("guest-cart-updated", {
        detail: {
          items: formattedCart.items,
        },
      })
    );

    window.dispatchEvent(new Event("cart-updated"));

    return formattedCart;
  };

  const handleCartDrawerChange = (updatedItems = []) => {
    const items = Array.isArray(updatedItems)
      ? updatedItems
      : [];

    const formattedCart = formatGuestCartForDrawer(items);

    setCartData({
      _id: "guest-cart",
      items: formattedCart.items ? [...formattedCart.items] : [],
      subtotal: formattedCart.subtotal || 0,
      total: formattedCart.total || 0,
    });

    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleOpenCartDrawer = () => {
    setOpenCart(true);

    fetchCurrentCartForDrawer().then((formattedCart) => {
      setCartData(formattedCart);

      const loginStatus =
        localStorage.getItem("isLoggedIn") === "true";

      if (loginStatus) {
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        window.dispatchEvent(
          new CustomEvent("guest-cart-updated", {
            detail: { items: formattedCart.items },
          })
        );

        window.dispatchEvent(new Event("cart-updated"));
      }
    });
  };

  const handleProductTitleClick = (product) => {
    if (!product) return;

    if (product.slug) {
      navigate(`/product/${product.slug}`, {
        state: {
          productId: product.id,
        },
      });
      return;
    }

    if (product.link) {
      window.location.href = product.link;
    }
  };

  const prevProductImage = (e) => {
    e.stopPropagation();

    if (!activeProductImages.length) return;

    setActiveProductImageIndex((prev) =>
      prev === 0 ? activeProductImages.length - 1 : prev - 1
    );
  };

  const nextProductImage = (e) => {
    e.stopPropagation();

    if (!activeProductImages.length) return;

    setActiveProductImageIndex((prev) =>
      prev === activeProductImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <section className="relative  pb-24   overflow-hidden">
        <div className="absolute right-0 top-[190px] w-[50%] opacity-[0.8] object-cover">
          <img
            className="w-full object-contain h-[400px]"
            src={BackImage1}
            alt=""
          />
        </div>

        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          <div className="mb-6">
            <h2 className="text-center text-[27px] md:text-[42px] leading-[1.05] font-[600] text-[#0c776b]">
              From Nature to Your Plate — See How Good Food Is Made
            </h2>
          </div>

          <div className="flex gap-5 overflow-x-auto md77:justify-center no-scrollbar pt-[20px] pb-16 px-1">
            {loading ? (
              <div className="w-full flex justify-center items-center py-16 text-sm text-[#0c776b]">
                Loading videos...
              </div>
            ) : (
              reelsData.map((item, index) => (
                <ReelCard
                  key={item.id}
                  item={item}
                  index={index}
                  activePreviewIndex={activePreviewIndex}
                  onClick={() => setActiveIndex(index)}
                  onAddToCart={handleAddToGuestCart}
                  addedProductId={addedProductId}
                  onProductTitleClick={handleProductTitleClick}
                  getProductCartCount={getProductCartCount}
                  onCartIconClick={handleOpenCartDrawer}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-[2px] flex items-center justify-center"
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-[#8f95a5] text-white flex items-center justify-center"
            >
              <X size={22} />
            </button>

            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white text-[#7c4fd2] flex items-center justify-center shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white text-[#7c4fd2] flex items-center justify-center shadow-lg"
            >
              <ChevronRight size={22} />
            </button>

            <div className="relative w-full max-w-[1180px] px-4 flex items-center justify-center gap-10">

              <div className="hidden lg:block w-[150px] h-[360px] rounded-2xl overflow-hidden opacity-70 bg-black">
                {leftPreview && (
                  <video
                    src={leftPreview.video}
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-black"
                  />
                )}
              </div>

              <div className=" flex">

                <motion.div
                  key={activeItem.id}
                  initial={{ scale: 0.94, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 20 }}
                  className="relative w-[330px] md:w-[360px] z-2  block"
                >
                  <div className="relative h-[600px] md:h-[620px] rounded-[22px] overflow-hidden bg-black  ">
                    <video
                      ref={modalVideoRef}
                      src={activeItem.video}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                    />
                  </div>

                  <div className="absolute left-4 right-4 bottom-4">
                    <ProductStripCard
                      products={activeItem.products}
                      onAddToCart={handleAddToGuestCart}
                      addedProductId={addedProductId}
                      onProductTitleClick={handleProductTitleClick}
                      getProductCartCount={getProductCartCount}
                      onCartIconClick={handleOpenCartDrawer}
                    />
                  </div>
                </motion.div>

                <motion.div
                  key={`info-${activeItem.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:block relative z-[1] h-fit my-auto left-[-5px] w-[320px] rounded-r-2xl bg-white border border-[#d8d8d8] shadow-[0_10px_30px_rgba(0,0,0,0.18)] overflow-hidden"
                >
                  <div className="p-3">

                    <div className="relative rounded-xl w-fit mx-auto overflow-hidden bg-white h-[220px]  brder">
                      {currentProductImage ? (
                        <img
                          src={currentProductImage}
                          alt={activeProduct?.title || "Product"}
                          className="w-full h-full object-contain p-2 "
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No Image
                        </div>
                      )}

                      {activeProductImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={prevProductImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                          >
                            <ChevronLeft size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={nextProductImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                          >
                            <ChevronRight size={15} />
                          </button>

                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                            {activeProductImages.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveProductImageIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full ${activeProductImageIndex === index
                                  ? "bg-[#0c776b]"
                                  : "bg-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {activeProductImages.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                        {activeProductImages.map((img, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProductImageIndex(index);
                            }}
                            className={`shrink-0 w-12 h-12 rounded-md border overflow-hidden bg-white ${activeProductImageIndex === index
                              ? "border-[#0c776b] border-2"
                              : "border-gray-200"
                              }`}
                          >
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-contain "
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="text-[16px] font-semibold text-[#222] leading-snug line-clamp-2">
                        {activeProduct?.title || activeItem?.title || "Product"}
                      </h3>

                      {activeProduct?.price && (
                        <p className="text-[16px] font-bold text-[#0c776b] mt-1">
                          ₹ {Number(activeProduct.price || 0).toLocaleString("en-IN")}
                        </p>
                      )}

                      <p className="text-[13px] leading-6 text-[#555] mt-3 line-clamp-5">
                        {activeItem?.description || "No description available."}
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>

              <div className="hidden lg:block w-[150px] h-[360px] rounded-2xl overflow-hidden opacity-70 bg-black">
                {rightPreview && (
                  <video
                    src={rightPreview.video}
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-black"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer
        isOpen={openCart}
        onClose={async () => {
          setOpenCart(false);

          const loginStatus = localStorage.getItem("isLoggedIn") === "true";
          const userId = localStorage.getItem("userId");

          if (loginStatus && userId) {
            try {
              const backendCart = await getCartApi(userId);
              const formattedCart = formatBackendCartForDrawer(backendCart);

              setCartData(formattedCart);

              window.dispatchEvent(new Event("cart-updated"));
            } catch (error) {
              console.error("Reels cart refresh after close error:", error);
            }

            return;
          }

          const guestCart = getGuestCart();
          const formattedCart = formatGuestCartForDrawer(guestCart);

          setCartData(formattedCart);

          window.dispatchEvent(
            new CustomEvent("guest-cart-updated", {
              detail: {
                items: formattedCart.items,
              },
            })
          );

          window.dispatchEvent(new Event("cart-updated"));
        }}
        cartData={cartData}
        onCartChange={handleCartDrawerChange}
      />
    </>
  );
}