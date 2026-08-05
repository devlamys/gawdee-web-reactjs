/* Developed by Grafizen International PVT. LTD. */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import ProductCard from '../../component/productPage/ProductCard';
import { FilterSidebar } from '../../component/productPage/FilterSidebar';

import Header from '@/component/Header';
import { ReactLenis } from "lenis/react";
import CakeDetailModal from '@/component/productPage/CakeDetailModal';
import image1 from "../../../public/imges/productcategores/image1.jpg"
import image2 from "../../../public/imges/productcategores/image2.jpg"
import image3 from "../../../public/imges/productcategores/image3.jpg"

import Footer from '@/component/Footer';

import ghee1 from "../../../public/imges/Products/webEx/ghee1.png"
import honey1 from "../../../public/imges/Products/webEx/honey.png"
import powder1 from "../../../public/imges/Products/webEx/powder1.png"
import powder2 from "../../../public/imges/Products/webEx/powder2.png"
import powder3 from "../../../public/imges/Products/webEx/powder3.png"
import bestSellerTag from "../../../public/imges/productDetails/newIdea/best-sellerstag.png"
import newest from "../../../public/imges/productDetails/newIdea/newest.png"
import trending from "../../../public/imges/productDetails/newIdea/trending-topic.png"
import ReelSection from '@/component/productPage/ReelSection';
import { useParams, useLocation } from "react-router-dom";
import CartDrawer from "@/component/OrderProcess/CartDrawer";
import { ApiGet, ApiPost } from "@/helper/axios";
import {
    addItemToGuestCart,
    getGuestCart,
    clearGuestCart,
} from "@/utils/cartStorage";
import { LoginModal } from "@/component/LoginModal";

import taral1 from "../../../public/imges/productcategores/taralCate/Taral1.jpg"
import taral2 from "../../../public/imges/productcategores/taralCate/Taral2.jpg"
import Ghee11 from "../../../public/imges/productcategores/ghee/Ghee1.jpg"
import Ghee22 from "../../../public/imges/productcategores/ghee/Ghee2.jpg"
import Honey1 from "../../../public/imges/productcategores/honey/Honey1.jpg"
import Honey2 from "../../../public/imges/productcategores/honey/Honey2.jpg"
import mix1 from "../../../public/imges/productcategores/mixmw/Mixmechoco1.jpg"
import mix2 from "../../../public/imges/productcategores/mixmw/Mixmechoco2.jpg"
import sugar1 from "../../../public/imges/productcategores/sugar/sugar1Banner.jpg"
import sugar2 from "../../../public/imges/productcategores/sugar/sugar2Banner.jpg"

const cakesData = [
    {
        _id: "1",
        name: "A2 Gir Cow Ghee Gawdee - 5LTR",
        category: "ghee",
        flavor: "natural",
        price: 7019,
        originalPrice: 7999,
        tagImage: newest,
        rating: 4.8,
        reviews: 198,
        badge: "Newest",
        discount: 12,
        image1: honey1,
        image2: ghee1,
    },
    {
        _id: "2",
        name: "A2 Gir Cow Ghee Gawdee - 1LTR",
        category: "ghee",
        flavor: "natural",
        price: 1499,
        originalPrice: 1799,
        rating: 4.7,
        reviews: 154,
        badge: "Best Seller",
        tagImage: bestSellerTag,
        discount: 10,
        image1: ghee1,
        image2: honey1,
    },
    {
        _id: "3",
        name: "Raw Forest Honey - 500GM",
        category: "honey",
        flavor: "natural",
        price: 599,
        originalPrice: 699,
        rating: 4.6,
        reviews: 112,
        badge: "Popular",
        tagImage: newest,
        discount: 8,
        image1: honey1,
        image2: powder1,
    },
    {
        _id: "4",
        name: "Raw Forest Honey - 1KG",
        category: "honey",
        flavor: "natural",
        price: 1099,
        originalPrice: 1299,
        rating: 4.7,
        reviews: 140,
        badge: "Trending",
        tagImage: trending,
        discount: 12,
        image1: honey1,
        image2: powder2,
    },
    {
        _id: "5",
        name: "Moringa Powder - 200GM",
        category: "superfood",
        flavor: "herbal",
        price: 300,
        originalPrice: 349,
        rating: 4.5,
        reviews: 85,
        badge: "Healthy",
        discount: 5,
        tagImage: newest,
        image1: powder2,
        image2: powder3,
    },
    {
        _id: "6",
        name: "Moringa Powder - 500GM",
        category: "superfood",
        flavor: "herbal",
        price: 599,
        originalPrice: 699,
        rating: 4.6,
        reviews: 98,
        badge: "Wellness",
        tagImage: bestSellerTag,
        discount: 8,
        image1: powder2,
        image2: powder1,
    },
    {
        _id: "7",
        name: "Gawdee Makke Powder - Choco",
        category: "superfood",
        flavor: "chocolate",
        price: 699,
        originalPrice: 799,
        rating: 4.4,
        reviews: 76,
        badge: "Energy",
        tagImage: newest,
        discount: 7,
        image1: powder3,
        image2: powder2,
    },
    {
        _id: "8",
        name: "Gawdee Makke Powder - Classic",
        category: "superfood",
        flavor: "natural",
        price: 649,
        originalPrice: 749,
        rating: 4.5,
        reviews: 68,
        badge: "Natural",
        discount: 6,
        image1: powder1,
        tagImage: newest,
        image2: powder3,
    },
    {
        _id: "9",
        name: "Date Palm Jaggery - 500GM",
        category: "sweetener",
        flavor: "jaggery",
        price: 399,
        originalPrice: 449,
        rating: 4.6,
        reviews: 110,
        badge: "Organic",
        discount: 5,
        image1: powder1,
        tagImage: trending,
        image2: powder2,
    },
    {
        _id: "10",
        name: "Date Palm Jaggery - 1KG",
        category: "sweetener",
        flavor: "jaggery",
        price: 699,
        originalPrice: 799,
        rating: 4.7,
        reviews: 130,
        badge: "Top Rated",
        discount: 9,
        image1: powder1,
        image2: powder3,
    },
    {
        _id: "11",
        name: "Khapli Wheat Flour - 1KG",
        category: "flour",
        flavor: "natural",
        price: 249,
        originalPrice: 299,
        rating: 4.5,
        reviews: 92,
        badge: "Healthy",
        discount: 6,
        image1: powder2,
        image2: powder3,
    },
    {
        _id: "12",
        name: "Khapli Wheat Flour - 5KG",
        category: "flour",
        flavor: "natural",
        price: 999,
        originalPrice: 1199,
        rating: 4.6,
        reviews: 118,
        badge: "Family Pack",
        discount: 10,
        image1: powder3,
        image2: powder1,
    },
];

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

const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") return image;

    return image?.url || image?.image || image?.path || image?.src || "";
};

const formatCartForDrawer = (items = [], cartId = "guest-cart") => {
    const formattedItems = items.map((item) => {
        const productData = item.productId || item;

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

            price: Number(
                item.price ||
                item.salePrice ||
                productData?.salePrice ||
                productData?.price ||
                0
            ),

            mrp: Number(
                item.mrp ||
                item.originalPrice ||
                productData?.price ||
                item.price ||
                0
            ),

            quantity: Number(item.quantity || item.qty || 1),
            qty: Number(item.qty || item.quantity || 1),

            slug: item.slug || productData?.slug || "",
        };
    });

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

export default function DesiGheeProduct() {
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedCake, setSelectedCake] = useState(null);

    const [maxPrice, setMaxPrice] = useState(0);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const { slug } = useParams();
    const location = useLocation();
    const categoryId = location.state?.categoryId;

    const formatCategoryName = (slug) => {
        if (!slug) return "Products";

        return slug
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const [userId, setUserId] = useState(null);
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
    const [addedProductId, setAddedProductId] = useState(null);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
    const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);

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
            const currentUserId = localStorage.getItem("userId");

            if (!loginStatus || !currentUserId) {
                const guestCart = formatCartForDrawer(getGuestCart(), "guest-cart");
                setCartData(guestCart);
                return guestCart;
            }

            const res = await getCartApi(currentUserId);

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

    useEffect(() => {
        const syncCart = () => {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const currentUserId = localStorage.getItem("userId");

            if (loginStatus && currentUserId) {
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
        const userData = localStorage.getItem("user");

        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserId(parsedUser?._id);
        }

        const loginStatus = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loginStatus);
    }, []);

    useEffect(() => {
        const checkLogin = () => {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loginStatus);
        };

        checkLogin();

        window.addEventListener("storage", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                let url = "";

                if (categoryId) {
                    url = `/product-by-category/${categoryId}`;
                } else if (slug) {
                    url = `/products?slug=${slug}`;
                } else {
                    url = `/products`;
                }

                const res = await ApiGet(url);

                console.log("API RESPONSE:", res);

                const data = res?.data?.products || res?.products || [];

                if (data.length > 0) {
                    setCategoryName(data[0]?.categoryId?.name || "");
                }

                const formatted = data.map((item) => ({
                    _id: item._id,
                    name: item.name,
                    slug: item.slug,

                    category: item.categoryId?.name?.toLowerCase() || "general",
                    flavor: "natural",

                    price: item.salePrice || item.price || 0,
                    originalPrice: item.price || 0,

                    rating: 4.5,
                    reviews: 100,

                    badge: "New",

                    discount: item.salePrice
                        ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                        : 0,

                    image1: getImageUrl(item.images?.[0]),
                    image2: getImageUrl(item.images?.[1] || item.images?.[0]),
                    displayWeight: getDisplayWeight(item),
                }));

                setProducts(formatted);

                if (formatted.length > 0) {
                    const prices = formatted.map((p) => Number(p.price));
                    const max = Math.max(...prices);

                    setPriceRange([0, max]);
                    setMaxPrice(max);
                }

            } catch (err) {
                console.error("Product fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, categoryId]);

    const filteredCakes = useMemo(() => {
        return products.filter((cake) => {
            const matchesSearch = cake.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesPrice =
                Number(cake.price) >= priceRange[0] &&
                Number(cake.price) <= priceRange[1];
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(cake.category.toLowerCase());
            const matchesFlavor =
                selectedFlavors.length === 0 ||
                selectedFlavors.includes(cake.flavor);

            return matchesSearch && matchesPrice && matchesCategory && matchesFlavor;
        });
    }, [products, searchTerm, priceRange, selectedCategories, selectedFlavors]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleFlavorChange = (flavor) => {
        setSelectedFlavors((prev) =>
            prev.includes(flavor)
                ? prev.filter((f) => f !== flavor)
                : [...prev, flavor]
        );
    };

    const handleClearFilters = () => {
        if (products.length > 0) {
            const prices = products.map(item => item.price);
            const maxPrice = Math.max(...prices);
            setPriceRange([0, maxPrice]);
        }

        setSelectedCategories([]);
        setSelectedFlavors([]);
        setSearchTerm('');
    };
    const categoryContent = {
        ghee: {
            tag: "🌿 A2 Gir Cow • Bilona • Pure Ghee",
            subText:
                "Traditionally prepared A2 Gir Cow Ghee made using the Bilona method — rich in aroma, golden in texture, and perfect for daily cooking, roti, sweets, and wellness.",
            images: [Ghee11, Ghee22],
        },

        honey: {
            tag: "🍯 Raw Honey • Forest Fresh • Natural Sweetness",
            subText:
                "Pure raw forest honey collected naturally with care — smooth, rich, and perfect for warm water, milk, desserts, breakfast bowls, and everyday natural sweetness.",
            images: [Honey1, Honey2],
        },

        drops: {
            tag: "💧 Ghee-Based Liquid • Traditional Use • No Additives",
            subText:
                "GAWDEE Taral Drop is a ghee-based liquid prepared through repeated natural separation of ghee fractions — made for traditional daily use with purity, simplicity, and care.",
            images: [taral1, taral2],
        },

        "mix-me": {
            tag: "🥛 Ragi • Dates • Daily Nutrition",
            subText:
                "A natural nutrition mix made with ragi, dates, and wholesome ingredients — perfect to mix with milk for kids, family, daily energy, and healthy nourishment.",
            images: [mix1, mix2],
        },

        sugar: {
            tag: "🍚 Sulphur-Free • Clean Sweetness • Daily Use",
            subText:
                "Clean and fine sugar made for everyday sweetness — ideal for tea, coffee, desserts, sweets, baking, and daily kitchen use with a smooth crystal texture.",
            images: [sugar1, sugar2],
        },
    };

    const activeCategoryContent =
        categoryContent[slug] || {
            tag: "🌿 Pure • Traditional • Authentic",
            subText:
                "Explore Gawdee products crafted with purity, care, and natural goodness for your everyday lifestyle.",
            images: [image1, image2],
        };

    useEffect(() => {
        const prices = cakesData.map(item => Number(item.price));
        const maxPrice = Math.max(...prices);

        setPriceRange([0, maxPrice]);
    }, []);

    const getLatestUserId = () => {
        const directUserId = localStorage.getItem("userId");

        if (directUserId && directUserId !== "undefined" && directUserId !== "null") {
            return directUserId;
        }

        const userData =
            localStorage.getItem("user") ||
            localStorage.getItem("gawdee_user");

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);

                return (
                    parsedUser?._id ||
                    parsedUser?.id ||
                    parsedUser?.userId ||
                    null
                );
            } catch (error) {
                return null;
            }
        }

        return null;
    };

    const isUserLoggedIn = () => {
        const loginStatus = localStorage.getItem("isLoggedIn") === "true";
        const latestUserId = getLatestUserId();

        return Boolean(loginStatus && latestUserId);
    };

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

    const getWishlistProductId = (item) => {
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
            const finalUserId = latestUserId || getLatestUserId();

            if (!loginStatus || !finalUserId) {
                setWishlistIds([]);
                return [];
            }

            const wishlistData = await getWishlistApi(finalUserId);
            const ids = extractWishlistProductIds(wishlistData);

            setWishlistIds(ids);
            return ids;
        } catch (error) {
            console.error("Fetch wishlist error:", error);
            setWishlistIds([]);
            return [];
        }
    };

    const toggleWishlistProduct = async (
        product,
        latestUserId = null,
        currentWishlistIds = wishlistIds
    ) => {
        const productId = getWishlistProductId(product);
        const finalUserId = latestUserId || getLatestUserId();

        if (!productId || !finalUserId) return;

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
                    userId: finalUserId,
                    productId,
                });
            } else {
                await addWishlistApi({
                    userId: finalUserId,
                    productId,
                });
            }

            window.dispatchEvent(new Event("wishlist-updated"));
        } catch (error) {
            console.error("Wishlist update error:", error);

            setWishlistIds((prev) => {
                if (alreadyWishlisted) {
                    return [...new Set([...prev, productId])];
                }

                return prev.filter((id) => id !== productId);
            });
        } finally {
            setWishlistLoadingId(null);
        }
    };

    const handleWishlistClick = async (e, product) => {
        e.stopPropagation();

        if (!isUserLoggedIn()) {
            setPendingWishlistProduct(product);
            setOpenLoginModal(true);
            return;
        }

        await toggleWishlistProduct(product);
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
                    price: item.price,
                    mrp: item.mrp,
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

    const handleAddToGuestCart = async (cake) => {
        try {
            if (!cake?._id) {
                console.error("Missing product id:", cake);
                alert("Product ID not found");
                return;
            }

            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const currentUserId = localStorage.getItem("userId");

            const cartItem = {
                productId: cake._id,
                name: cake.name,
                quantity: 1,
                qty: 1,

                selectedColor: cake.displayWeight || null,
                variant: cake.displayWeight || null,

                image: getImageUrl(cake.image1 || cake.image2),
                selectedColorImage: getImageUrl(cake.image1 || cake.image2),

                price: Number(cake.price || 0),
                mrp: Number(cake.originalPrice || cake.price || 0),
                originalPrice: Number(cake.originalPrice || cake.price || 0),

                slug: cake.slug || "",
            };

            if (loginStatus && currentUserId) {
                await addToCartApi({
                    userId: currentUserId,
                    items: [
                        {
                            productId: cartItem.productId,
                            quantity: cartItem.quantity,
                            selectedColor: cartItem.selectedColor,
                            selectedColorImage: cartItem.selectedColorImage,
                        },
                    ],
                });

                const latestCart = await fetchCart();

                setCartData(latestCart);
                setOpenCart(true);
                setAddedProductId(cake._id);

                window.dispatchEvent(new Event("cart-updated"));

                setTimeout(() => {
                    setAddedProductId(null);
                }, 1500);

                return;
            }

            const guestCart = addItemToGuestCart(cartItem);

            const formattedGuestCart = formatCartForDrawer(
                guestCart?.items || [],
                "guest-cart"
            );

            setCartData(formattedGuestCart);
            setOpenCart(true);
            setAddedProductId(cake._id);

            window.dispatchEvent(
                new CustomEvent("guest-cart-updated", {
                    detail: {
                        _id: "guest-cart",
                        items: guestCart?.items || [],
                    },
                })
            );

            setTimeout(() => {
                setAddedProductId(null);
            }, 1500);
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Failed to add item in cart");
        }
    };

    const handleProceedToCheckout = async (checkoutDataFromDrawer) => {
        try {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const latestUserId = getLatestUserId();

            localStorage.setItem(
                "checkoutData",
                JSON.stringify(checkoutDataFromDrawer)
            );

            if (checkoutDataFromDrawer?.cartId) {
                localStorage.setItem("cartId", checkoutDataFromDrawer.cartId);
            }

            if (!loginStatus || !latestUserId) {
                setPendingCheckoutData(checkoutDataFromDrawer);
                setOpenCart(false);

                setTimeout(() => {
                    setOpenLoginModal(true);
                }, 150);

                return;
            }

            setOpenCart(false);
            navigate("/checkout");
        } catch (error) {
            console.error("Proceed checkout error:", error);
            alert("Failed to proceed checkout");
        }
    };

    return (

        <>
            <div
                className="relative w-full min-h-screen bg-white overflow-x-hidden"
                style={{
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <Header />

                <div className="relative pb-[50px] max-w-[1400px]  mx-auto rounded-[40px] pt-[150px] bg-white w-full">

                    <div className="mb-[30px] text-center">

                        <div className=" w-fit mx-auto items-center gap-2 bg-gradient-to-r from-green-100 to-yellow-100 text-[#0c776b] px-4 py-[6px] rounded-full text-xs font-medium tracking-wide shadow-sm">
                            {activeCategoryContent.tag}
                        </div>

                        <h1 className="mt- text-[30px] md:text-[36px] font-bold text-gray-900 tracking-tight relative inline-block">

                            Gawdee {categoryName || formatCategoryName(slug)}

                            <span className="absolute left-1/2 -bottom-2 w-[60%] h-[3px] bg-gradient-to-r from-green-600 to-yellow-400 rounded-full -translate-x-1/2"></span>

                        </h1>

                        <p className="text-[14px] text-gray-500 mt-4 mx-auto max-w-[520px] leading-relaxed">

                            {activeCategoryContent.subText}

                        </p>

                    </div>

                    <section className="mt-[40px] px-4 md:px-6">
                        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCategoryContent.images?.slice(0, 2).map((img, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative rounded-[10px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-white"
                                >
                                    <img
                                        src={img.src || img}
                                        alt={`${categoryName || formatCategoryName(slug)} ${index + 1}`}
                                        className="w-full h-[210px] md118:h-[320px] object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <main className="w-[100%] px-[15px] md:px-0 pt-10 overflow-auto">

                        <section className="  mt-[30px] bg-gradient-to-b from-accent/2 to-background md77:px-3">
                            <div className=" md:w-[100%] 2xl:w-[100%]   mx-auto">
                                {filteredCakes.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid  grid-cols-2 md77:grid-cols-3    lg:grid-cols-5  gap-x-4 gap-y-[20px] md:gap-y-[40px] md11:gap-x-10 pb-[40px] "
                                    >
                                        <AnimatePresence mode="wait">
                                            {filteredCakes.map((cake, index) => (
                                                <ProductCard
                                                    key={cake._id}
                                                    cake={cake}
                                                    index={index}
                                                    addedProductId={addedProductId}
                                                    isWishlisted={wishlistIds.includes(getWishlistProductId(cake))}
                                                    wishlistLoading={wishlistLoadingId === getWishlistProductId(cake)}
                                                    onWishlistClick={handleWishlistClick}
                                                    onCartClick={(cake) => {
                                                        handleAddToGuestCart(cake);
                                                    }}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col items-center justify-center py-16"
                                    >
                                        <p className="text-2xl font-semibold text-foreground mb-2">
                                            No Product found
                                        </p>
                                        <p className="text-muted-foreground mb-4">
                                            Try adjusting your filters or search term
                                        </p>
                                        <motion.button
                                            onClick={handleClearFilters}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2.5 bg-[#0c776b] text-white rounded-lg transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
                                        >
                                            Clear All Filters
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        </section>
                    </main>

                </div>

                <CartDrawer
                    isOpen={openCart}
                    onClose={async () => {
                        setOpenCart(false);

                        const loginStatus = localStorage.getItem("isLoggedIn") === "true";
                        const currentUserId = localStorage.getItem("userId");

                        if (loginStatus && currentUserId) {
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
                        setOpenLoginModal(false);

                        const latestUserId = getLatestUserId();

                        if (!latestUserId) {
                            alert("Login successful, but user ID not found. Please try again.");
                            setPendingWishlistProduct(null);
                            return;
                        }

                        localStorage.setItem("isLoggedIn", "true");
                        setIsLoggedIn(true);
                        setUserId(latestUserId);

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
                            const finalItems =
                                mergedCart?.items?.length > 0
                                    ? mergedCart.items
                                    : pendingCheckoutData.items;

                            const subtotal = finalItems.reduce(
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
                                    items: finalItems,
                                },
                                items: finalItems,
                                subtotal,
                                total: Math.max(
                                    Number(subtotal || 0) -
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
                <Footer />
            </div>
        </>

    );
}