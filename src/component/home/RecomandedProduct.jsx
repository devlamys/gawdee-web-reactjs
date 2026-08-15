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
import { getMediaUrl } from "@/utils/media";
import OptimizedImage from "@/component/common/OptimizedImage";
import CartDrawer from "../OrderProcess/CartDrawer";
import {
    ArrowRight,
    BadgePercent,
    Heart,
    Weight,
    CheckCircle,
} from "lucide-react";
import {
    addItemToGuestCart,
    getGuestCart,
    clearGuestCart,
} from "@/utils/cartStorage";
import { LoginModal } from "../LoginModal";

const cleanImageUrl = (url) => {
    if (!url || typeof url !== "string") return "";

    const trimmed = url.trim();

    if (
        trimmed === "null" ||
        trimmed === "undefined" ||
        trimmed === "false" ||
        trimmed === "#"
    ) {
        return "";
    }

    return trimmed;
};

const getImageUrl = (image, size = "thumb") => {
    return getMediaUrl(image, size) || "";
};

const getImageFromMediaObject = (image) => {
    if (!image) return "";

    const mediaUrl = getMediaUrl(image, "thumb");
    if (mediaUrl) return cleanImageUrl(mediaUrl);

    if (typeof image === "string") {
        return cleanImageUrl(image);
    }

    if (typeof image === "object") {
        return cleanImageUrl(
            image.thumb ||
            image.thumbnail ||
            image.medium ||
            image.large ||
            image.original ||
            image.url ||
            image.image ||
            image.imageUrl ||
            image.secure_url ||
            image.src ||
            image.path ||
            ""
        );
    }

    return "";
};

const getDatabaseProductImageByIndex = (product, index = 0) => {
    if (!product) return "";

    if (Array.isArray(product.images) && product.images[index]) {
        const imageUrl = getImageFromMediaObject(product.images[index]);
        if (imageUrl) return imageUrl;
    }

    if (index === 0) {
        return (
            getImageFromMediaObject(product.image1) ||
            getImageFromMediaObject(product.image) ||
            getImageFromMediaObject(product.thumbnail) ||
            getImageFromMediaObject(product.featuredImage) ||
            ""
        );
    }

    if (index === 1) {
        return (
            getImageFromMediaObject(product.image2) ||
            getImageFromMediaObject(product.hoverImage) ||
            ""
        );
    }

    return "";
};

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
                getDatabaseProductImageByIndex(productData, 0) ||
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

const ProductHoverImage = ({ image1, image2, title }) => {
    const [firstImageError, setFirstImageError] = useState(false);
    const [secondImageLoaded, setSecondImageLoaded] = useState(false);
    const [secondImageError, setSecondImageError] = useState(false);

    const canShowFirstImage = Boolean(image1 && !firstImageError);

    const canShowSecondImage = Boolean(
        image2 && secondImageLoaded && !secondImageError
    );

    return (
        <div className="relative z-10 w-full h-[180px] md:h-full flex items-center justify-center overflow-hidden">
            {canShowFirstImage ? (
                <img
                    src={image1}
                    alt={title || "Product"}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFirstImageError(true)}
                    className={`absolute inset-0 h-full w-full md:object-contain transition-all duration-500 ease-out ${canShowSecondImage
                        ? "opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.08]"
                        : "opacity-100 scale-100 group-hover:scale-[1.08]"
                        }`}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[12px] text-gray-400">
                    No Image
                </div>
            )}

            {image2 && !secondImageError && (
                <img
                    src={image2}
                    alt={`${title || "Product"} hover`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setSecondImageLoaded(true)}
                    onError={() => {
                        setSecondImageLoaded(false);
                        setSecondImageError(true);
                    }}
                    className={`absolute inset-0 h-full w-full object-contain transition-all duration-500 ease-out ${canShowSecondImage
                        ? "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                        : "opacity-0 scale-95"
                        }`}
                />
            )}
        </div>
    );
};

export default function RecomandedProduct() {
    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [showAllMobile, setShowAllMobile] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState(null);

    const [openCart, setOpenCart] = useState(false);
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

    useEffect(() => {
        const syncCart = () => {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const userId = localStorage.getItem("userId");

            if (loginStatus && userId) {
                fetchCart();
                return;
            }

            const guestCart = formatCartForDrawer(getGuestCart(), "guest-cart");
            setCartData(guestCart);
        };

        syncCart();

        window.addEventListener("guest-cart-updated", syncCart);
        window.addEventListener("cart-updated", syncCart);
        window.addEventListener("storage", syncCart);

        return () => {
            window.removeEventListener("guest-cart-updated", syncCart);
            window.removeEventListener("cart-updated", syncCart);
            window.removeEventListener("storage", syncCart);
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

    const productList = products.length ? products : [];
    const visibleProducts = showAllMobile ? productList : productList.slice(0, 6);
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

    const handleAddToCart = async (item) => {
        const productId = item._id;

        try {
            setLoadingProductId(productId);

            const loginStatus =
                localStorage.getItem("isLoggedIn") === "true";
            const userId = localStorage.getItem("userId");

            const cartItem = {
                productId: item._id,
                name: item.title || item.name,
                quantity: 1,
                qty: 1,
                price: Number(item.price || 0),
                sellingPrice: Number(item.price || 0),
                originalPrice: Number(item.originalPrice || item.price || 0),
                image: item.image1 || "",
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
                return formatCartForDrawer(updated, "user-cart");
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

        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchNewProducts = async () => {
        try {
            const res = await ApiGet("/admin/products");

            const data =
                res?.data?.data ||
                res?.product?.products ||
                [];

            console.log('data', data)

            const mapped = data.map((item) => {
                const originalPrice = Number(item?.originalPrice || 0);
                const salePrice = Number(item?.salePrice || item?.price || 0);

                const discount =
                    originalPrice > 0 && salePrice > 0
                        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                        : 0;

                const productWeight =
                    item?.sku?.match(/\d+\s*(ml|ltr|liter|l|kg|g|gm)/i)?.[0] ||
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
                    reviews: item.reviews || 100,

                    badge: discount > 20 ? "HOT DEAL" : "NEW",
                    tagImage: newest,

                    discount: discount,

                    weight: productWeight,

                    image1: getDatabaseProductImageByIndex(item, 0),
                    image2: getDatabaseProductImageByIndex(item, 1),
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

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;

        const scrollAmount = 300;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

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
        <section className=" pt-[70px] lg:pt-28 pb-[64px] lg:pb-24 relative">
            <div className=" md:w-[90%] 2xl:w-[90%]  mx-auto relative">

                <div className="lg:mb-8  mx-auto relative">

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 0.7 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute w-fit mx-auto left-0 right-0 top-[-30px] lg:top-[-70px] md:block text-[38px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                    >
                        Recommended
                    </motion.div>

                    <h2 className="text-[28px] lg:text-5xl text-center font-[600] text-gray-900">
                        Recommended For You
                    </h2>

                    <p className="lg:mt-3 justify-center text-center w-fit mx-auto text-gray-600 text-[12px] px-[10px] lg:px-0 lg:text-lg text-center max-w-[650px]">
                        Handpicked wellness essentials crafted with purity, tradition, and natural goodness — thoughtfully selected for your everyday lifestyle.
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
                    className=" grid grid-cols-2 md57:grid-cols-3 md:flex md:overflow-x-auto  px-[10px] md:px-0  pb-[15px]  gap-3 md:gap-4 pt-[20px] scroll-smooth no-scrollbar"
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
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.28 }}
                                onClick={() => item.slug && navigate(`/product/${item.slug}`)}
                                className="group relative md:w-[270px] flex-shrink-0  rounded-[10px] md:rounded-[16px] overflow-hidden bg-white border border-[#ececec]  hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
                            >

                                <div className="relative md:h-[270px] overflow-hidden bg-[linear-gradient(180deg,#f7f7f7_0%,#efefef_100%)]">

                                    <div className="absolute top-[-40px] right-[-30px] w-[140px] h-[140px] rounded-full bg-[#d7edb7]/40 blur-3xl z-[1]" />

                                    <div className="absolute md:top-4 md:right-4 top-2 right-2 z-20 rounded-full bg-white/90 backdrop-blur-md px-2 md:px-3 py-[2px] md:py-[4px] text-[10px] font-[600] md:font-bold text-[#214d3b] border border-[#214d3b]/10">
                                        {item.discount}% OFF
                                    </div>

                                    <div className="relative z-10 h-full flex items-center justify-center">

                                        <ProductHoverImage
                                            image1={item.image1}
                                            image2={item.image2}
                                            title={item.title}
                                        />

                                    </div>

                                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-[140px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                        <div className="flex   flex-shrink-0 items-center w-fit gap-1 md:gap-2 bg-white/90 backdrop-blur-md rounded-full md:px-2 md:py-2 p-1.5 shadow-lg">

                                            <button
                                                type="button"
                                                onClick={(e) => handleWishlistClick(e, item)}
                                                disabled={productWishlistLoading}
                                                className={`w-[25px] md:w-[30px] border border-[#0c776b] h-[25px] md:h-[30px] flex-shrink-0 rounded-full transition flex items-center justify-center ${productWishlisted
                                                    ? "bg-[#0c776b] text-white"
                                                    : "bg-[#f5f5f5] text-[#0c776b] hover:bg-[#0c776b] hover:text-white"
                                                    } ${productWishlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                                            >
                                                <Heart
                                                    size={15}
                                                    fill={productWishlisted ? "currentColor" : "none"}
                                                />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(item);
                                                }}
                                                disabled={loadingProductId === item._id}
                                                className={`px-4 py-[5px] md:py-2 flex-shrink-0 rounded-full text-white text-[12px] font-medium transition ${loadingProductId === item._id
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#0c776b] hover:bg-[#16392c]"
                                                    }`}
                                            >
                                                {loadingProductId === item._id ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                                                        Adding...
                                                    </span>
                                                ) : (
                                                    "Add Cart"
                                                )}
                                            </button>

                                        </div>
                                    </div>

                                </div>

                                <div className=" p-2 md:p-4">

                                    <p className=" text-[8px] md:text-[11px] uppercase tracking-[0.15em] text-[#7a7a7a] font-medium">
                                        Recommended
                                    </p>

                                    <h3 className="mt-1 text-[12px] md:text-[14px] min-h-[32px] md:min-h-[18px] leading-[1.35] font-[500] text-[#1f1f1f]">
                                        {item.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-1 md:mt-2">
                                        <div className="flex items-center  md:gap-[2px] text-[11px] md:text-[15px] text-[#f6b100]">
                                            ⭐ ⭐ ⭐ ⭐ ⭐
                                        </div>

                                        <span className=" text-[10px] font-[500] md:text-[12px] text-gray-500">
                                            {item.rating} ({item.reviews})
                                        </span>
                                    </div>

                                    <div className="flex  justify-between items-center gap-3 mt-2">

                                        <div className="flex  items-end gap-1 md:gap-2 ">

                                            <span className=" text-[15px] md:text-[20px] font-[600] text-[#111]">
                                                ₹{item.price}
                                            </span>

                                            <span className=" text-[11px] md:text-[14px] font-[500] text-gray-400 line-through ">
                                                ₹{item.originalPrice}
                                            </span>

                                        </div>
                                        {item.weight && (
                                            <div className=" w-fit rounded-full h-fit  border border-[#0c776b]/20 bg-[#e8f5e9] px-2 md:px-3 py-[2px] md:py-[5px] text-[10px] md:text-[11px] font-semibold text-[#0c776b]">
                                                {item.weight}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 rounded-md bg-[#edf7e7] border border-[#d9ebce] px-1.5 md:px-3 py-2 text-[8px] md:text-[10px] text-[#214d3b] font-medium">
                                        <BadgePercent size={14} />
                                        Best Price ₹{item.price} with Coupon
                                    </div>

                                </div>

                            </motion.div>
                        );

                    })}
                </div>
                <div className=" w-fit mx-auto mt-[20px]">
                    {productList.length > 6 && (
                        <button
                            class="cursor-pointer md:hidden w-fit bg-gradient-to-b  from-[#0c776b] to-[#077468] shadow-[0px_4px_32px_0_rgba(34,197,94,0.5)] px-6 py-2 rounded-xl border-[1px] border-slate-500 text-white font-medium group" onClick={() => setShowAllMobile(!showAllMobile)}
                        >
                            <div class="relative overflow-hidden">
                                <p
                                    class="group-hover:-translate-y-7 flex items-center gap-[6px] duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                                >
                                    {showAllMobile ? "Show Less" : "View More"}

                                    <ArrowRight size={20} />    </p>
                                <p
                                    class="absolute top-7 left-0  flex items-center gap-[6px] group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                                >
                                    {showAllMobile ? "Show Less" : "View More"}

                                    <ArrowRight size={20} />
                                </p>
                            </div>
                        </button>
                    )}
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
                onClose={() => setOpenLoginModal(false)}
                onSuccess={async () => {
                    const latestUserId = localStorage.getItem("userId");

                    setOpenLoginModal(false);

                    const mergedCart = await mergeGuestCartWithUserCart(latestUserId);

                    if (pendingCheckoutData) {
                        const subtotal = mergedCart?.items?.reduce(
                            (sum, item) =>
                                sum +
                                Number(item.price || 0) *
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
                    }
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