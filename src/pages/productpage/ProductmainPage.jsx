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
import CartDrawer from '@/component/OrderProcess/CartDrawer';
import {
    addItemToGuestCart,
    getGuestCart,
    clearGuestCart,
} from '@/utils/cartStorage';
import Footer from '@/component/Footer';

import { ApiGet, ApiPost } from '@/helper/axios';
import ProductCategorySection from '@/component/allProducts/ProductCategorySection';
import { LoginModal } from '@/component/LoginModal';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl, getProductThumb } from '@/utils/media';

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

const formatGuestCartForDrawer = (items = []) => {
    const formattedItems = items.map((item) => {
        const productData =
            typeof item.productId === "object" && item.productId !== null
                ? item.productId
                : item;

        const sellingPrice = Number(
            item.sellingPrice ||
            item.salePrice ||
            item.price ||
            productData?.salePrice ||
            productData?.sellingPrice ||
            productData?.price ||
            0
        );

        const originalPrice = Number(
            item.originalPrice ||
            item.mrp ||
            productData?.price ||
            productData?.mrp ||
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

            categoryId:
                item.categoryId?._id ||
                item.categoryId ||
                productData?.categoryId?._id ||
                productData?.categoryId ||
                "",

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
                productData?.images?.[0]?.url ||
                productData?.images?.[0] ||
                "",

            price: sellingPrice,
            sellingPrice: sellingPrice,
            salePrice: sellingPrice,

            mrp: originalPrice,
            originalPrice: originalPrice,

            discountAmount: Math.max(originalPrice - sellingPrice, 0),

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

    const originalSubtotal = formattedItems.reduce(
        (sum, item) =>
            sum +
            Number(item.originalPrice || item.mrp || item.price || 0) *
            Number(item.quantity || item.qty || 1),
        0
    );

    return {
        _id: "guest-cart",
        items: formattedItems,
        subtotal,
        originalSubtotal,
        productDiscount: Math.max(originalSubtotal - subtotal, 0),
        total: subtotal,
    };
};

export default function ProductmainPage() {
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedCake, setSelectedCake] = useState(null);
    const navigate = useNavigate();
    const [maxPrice, setMaxPrice] = useState(0);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userId, setUserId] = useState(null);
    const [openCart, setOpenCart] = useState(false);
    const [cartData, setCartData] = useState(() =>
        formatGuestCartForDrawer(
            typeof window !== "undefined" ? getGuestCart() : []
        )
    );
    const [addedProductId, setAddedProductId] = useState(null);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
    const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);

    useEffect(() => {
        const syncGuestCart = () => {
            const guestCart = formatGuestCartForDrawer(getGuestCart());
            setCartData(guestCart);
        };

        syncGuestCart();

        window.addEventListener("guest-cart-updated", syncGuestCart);

        return () => {
            window.removeEventListener("guest-cart-updated", syncGuestCart);
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

    const getImageUrl = (img, size = "thumb") => getMediaUrl(img, size);

    const detectProductCategory = (item) => {
        const name = item?.name?.toLowerCase() || "";
        const categoryName = item?.categoryId?.name?.toLowerCase() || "";

        if (name.includes("ghee") || categoryName.includes("ghee")) {
            return {
                value: "ghee",
                label: "Ghee",
            };
        }

        if (name.includes("honey") || categoryName.includes("honey")) {
            return {
                value: "honey",
                label: "Honey",
            };
        }

        if (
            name.includes("mixme") ||
            name.includes("mix me") ||
            categoryName.includes("mix")
        ) {
            return {
                value: "mixme",
                label: "MixMe",
            };
        }

        if (name.includes("taral") || categoryName.includes("taral")) {
            return {
                value: "taral-drop",
                label: "Taral Drop",
            };
        }

        if (name.includes("moringa") || categoryName.includes("moringa")) {
            return {
                value: "moringa",
                label: "Moringa",
            };
        }

        if (
            name.includes("sugar") ||
            name.includes("bura") ||
            categoryName.includes("sugar")
        ) {
            return {
                value: "sugar",
                label: "Sugar",
            };
        }

        return {
            value: "other",
            label: "Other",
        };
    };

    const categoryOptions = useMemo(() => {
        const map = new Map();

        products.forEach((item) => {
            if (!map.has(item.category)) {
                map.set(item.category, {
                    value: item.category,
                    label: item.categoryLabel || item.category,
                });
            }
        });

        return Array.from(map.values());
    }, [products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await ApiGet('/admin/products');

                console.log("API PRODUCTS:", res);

                const data = res?.product?.products || res?.products || [];

                const formatted = data.map((item) => {
                    const detectedCategory = detectProductCategory(item);

                    const originalPrice = Number(
                        item?.originalPrice ||
                        0
                    );

                    const sellingPrice = Number(
                        item?.salePrice ||
                        0
                    );

                    const discount =
                        originalPrice > 0 && sellingPrice > 0 && originalPrice > sellingPrice
                            ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                            : 0;

                    return {
                        _id: item._id,
                        name: item.name,
                        slug: item.slug,

                        category: detectedCategory.value,
                        categoryLabel: detectedCategory.label,

                        price: item.salePrice,
                        sellingPrice: item.salePrice,
                        salePrice: item.salePrice,

                        mrp: item.originalPrice,
                        originalPrice: item.originalPrice,

                        categoryId: item?.categoryId?._id || item?.categoryId || "",

                        rating: item.rating || 4.5,
                        reviews: item.reviews || item.reviewCount || 100,

                        badge: "New",
                        discount: discount,

                        displayWeight: getDisplayWeight(item),

                        image1: getProductThumb(item),
                        image2: "",
                    };
                });

                setProducts(formatted);

                if (formatted.length > 0) {
                    const prices = formatted.map((p) => Number(p.price));
                    const max = Math.max(...prices);
                    setPriceRange([0, max]);
                    setMaxPrice(max);
                }

            } catch (err) {
                console.error("Product Fetch Error:", err);
            }
        };

        fetchProducts();
    }, []);

    console.log('products', products)

    const filteredCakes = useMemo(() => {
        return products.filter((cake) => {
            const matchesSearch = (cake?.name || "")
                .toLowerCase()
                .includes((searchTerm || "").toLowerCase());
            const matchesPrice =
                Number(cake.price) >= priceRange[0] &&
                Number(cake.price) <= priceRange[1];
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(cake.category);

            return matchesSearch && matchesPrice && matchesCategory;
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

    const addToCartApi = async (payload) => {
        const res = await ApiPost("/cart", payload);
        return res?.data?.data || res?.data;
    };

    const getCartApi = async (userId) => {
        const res = await ApiGet(`/cart/${userId}`);
        return res?.data?.data || res?.data || res;
    };
    const getLatestUserId = () => {
        const directUserId = localStorage.getItem("userId");

        if (directUserId) return directUserId;

        const userData = localStorage.getItem("user");

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                return parsedUser?._id || parsedUser?.id || null;
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

                const formattedCart = formatGuestCartForDrawer(
                    userCartRes?.items || []
                );

                const finalCart = {
                    ...formattedCart,
                    _id: userCartRes?._id || null,
                };

                setCartData(finalCart);
                return finalCart;
            }

            await addToCartApi({
                userId: latestUserId,
                items: guestItems.map((item) => ({
                    productId: item.productId,
                    categoryId: item.categoryId || "",

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

            const formattedCart = formatGuestCartForDrawer(
                userCartRes?.items || []
            );

            const finalCart = {
                ...formattedCart,
                _id: userCartRes?._id || null,
            };

            setCartData(finalCart);
            return finalCart;
        } catch (error) {
            console.error("Merge guest cart error:", error);
            return null;
        }
    };

    const handleProceedToCheckout = async (checkoutDataFromDrawer) => {
        try {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const latestUserId = getLatestUserId();

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

    const handleAddToGuestCart = async (cake) => {
        if (!cake?._id) return;

        const loginStatus =
            localStorage.getItem("isLoggedIn") === "true";
        const latestUserId = getLatestUserId();

        const sellingPrice = Number(
            cake.sellingPrice ||
            cake.salePrice ||
            cake.price ||
            0
        );

        const originalPrice = Number(
            cake.originalPrice ||
            cake.mrp ||
            cake.maxPrice ||
            sellingPrice ||
            0
        );

        const cartItem = {
            productId: cake._id,
            categoryId: cake.categoryId?._id || cake.categoryId || "",

            name: cake.name,
            quantity: 1,
            qty: 1,

            selectedColor: cake.displayWeight || null,
            variant: cake.displayWeight || null,

            image: cake.image1 || cake.image2 || "",
            selectedColorImage: cake.image1 || cake.image2 || "",

            price: sellingPrice,
            sellingPrice: sellingPrice,
            salePrice: sellingPrice,

            mrp: originalPrice,
            originalPrice: originalPrice,

            discountAmount: Math.max(originalPrice - sellingPrice, 0),

            slug: cake.slug || "",
        };

        try {

            setOpenCart(true);
            setAddedProductId(cake._id);

            if (loginStatus && latestUserId) {

                setCartData((prev) => {
                    const items = prev?.items || [];
                    const updated = [...items, cartItem];

                    return formatGuestCartForDrawer(updated);
                });

                window.dispatchEvent(new Event("cart-updated"));

                await addToCartApi({
                    userId: latestUserId,
                    items: [
                        {
                            productId: cartItem.productId,
                            categoryId: cartItem.categoryId,

                            quantity: cartItem.quantity,
                            selectedColor: cartItem.selectedColor,
                            selectedColorImage: cartItem.selectedColorImage,

                            price: cartItem.price,
                            sellingPrice: cartItem.sellingPrice,
                            salePrice: cartItem.salePrice,

                            mrp: cartItem.mrp,
                            originalPrice: cartItem.originalPrice,

                            name: cartItem.name,
                            image: cartItem.image,
                            slug: cartItem.slug,
                        },
                    ],
                });

                return;
            }

            const guestCart = addItemToGuestCart(cartItem);

            const formattedGuestCart = formatGuestCartForDrawer(
                guestCart?.items || []
            );

            setCartData(formattedGuestCart);

            window.dispatchEvent(
                new CustomEvent("guest-cart-updated", {
                    detail: {
                        _id: "guest-cart",
                        items: guestCart?.items || [],
                    },
                })
            );

        } catch (error) {
            console.error("Add to cart error:", error);
        } finally {

            setTimeout(() => {
                setAddedProductId(null);
            }, 300);
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

                <div className="relative pb-[50px] max-w-[1420px] mx-auto rounded-[40px] pt-[120px] bg-white w-full">

                    <div className=" flex">
                        <div className='  w-fit items-center lg:flex flex-col   hidden'>

                            <FilterSidebar
                                priceRange={priceRange}
                                maxPrice={maxPrice}
                                onPriceChange={setPriceRange}
                                selectedCategories={selectedCategories}
                                onCategoryChange={handleCategoryChange}
                                selectedFlavors={selectedFlavors}
                                onFlavorChange={handleFlavorChange}
                                categoryOptions={categoryOptions}
                                onClearFilters={handleClearFilters}
                                isMobileOpen={isMobileFilterOpen}
                                onMobileClose={() => setIsMobileFilterOpen(false)}
                                productCount={filteredCakes.length}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </div>

                        <main className="lg:flex-1 lg:px-0  mx-auto px-[15px]  ">
                            <section className=" md11:block hidden bg-gradient-to-b from-accent/2 to-background">
                                <div className=" w-[100%] mx-auto">
                                    {filteredCakes.length > 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className=" flex  overflow-x-auto md:grid grid-cols-2  md83:grid-cols-3 md127:grid-cols-4   md77:gap-x-4 md118:gap-x-2 gap-y-[20px] md:gap-y-[40px] pb-[40px] "
                                        >
                                            <AnimatePresence mode="wait">
                                                {filteredCakes.map((cake, index) => (
                                                    <ProductCard
                                                        key={cake._id}
                                                        cake={cake}
                                                        index={index}
                                                        addedProductId={addedProductId}
                                                        isWishlisted={wishlistIds.includes(getWishlistProductId(cake))}
                                                        wishlistLoading={
                                                            wishlistLoadingId === getWishlistProductId(cake)
                                                        }
                                                        onWishlistClick={handleWishlistClick}
                                                        onCartClick={async (cake) => {
                                                            setLoadingProductId(cake._id);
                                                            await handleAddToGuestCart(cake);
                                                            setLoadingProductId(null);
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
                            <div className=' w-[100%] mx-auto md11:hidden '>
                                <ProductCategorySection />
                            </div>

                        </main>
                    </div>
                </div>

                <CakeDetailModal
                    cake={selectedCake}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                    openLoginDrawer={() => setLoginDrawerOpen(true)}
                />

                <CartDrawer
                    isOpen={openCart}
                    onClose={() => {
                        setOpenCart(false);

                        const latestGuestCart = formatGuestCartForDrawer(getGuestCart());
                        setCartData(latestGuestCart);
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
                        const latestUserId = getLatestUserId();

                        setOpenLoginModal(false);

                        if (!latestUserId) {
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
                            const subtotal = mergedCart?.items?.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(item.sellingPrice || item.price || 0) *
                                    Number(item.quantity || item.qty || 1),
                                0
                            );

                            const originalSubtotal = mergedCart?.items?.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(item.originalPrice || item.mrp || item.price || 0) *
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

                                originalSubtotal:
                                    originalSubtotal ||
                                    pendingCheckoutData.originalSubtotal ||
                                    0,

                                subtotal: subtotal || pendingCheckoutData.subtotal,

                                productDiscount: Math.max(
                                    Number(originalSubtotal || 0) - Number(subtotal || 0),
                                    0
                                ),

                                total: Math.max(
                                    Number(subtotal || pendingCheckoutData.subtotal || 0) -
                                    Number(pendingCheckoutData.couponDiscount || 0),
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