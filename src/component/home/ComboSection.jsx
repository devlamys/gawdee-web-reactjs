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
import { ArrowRight, BadgePercent, Heart, Weight } from "lucide-react";

const categories = [
    {
        title: "A2 Gir Cow Ghee Gawdee - 500ML",
        price: 944,
        originalPrice: 1099,
        rating: 4.6,
        reviews: 142,
        badge: "Best Seller",
        tagImage: bestSellerTag,
        discount: 14,
        image1: ghee1,
        image2: honey1,
    },
    {
        title: "A2 Gir Cow Ghee Gawdee - 5LTR",
        price: 7019,
        originalPrice: 7999,
        rating: 4.8,
        reviews: 198,
        badge: "Newst",
        tagImage: newest,
        discount: 12,
        image1: honey1,
        image2: ghee1,
    },
    {
        title: "Gawdee Makke Powder - Choco",
        price: 699,
        originalPrice: 799,
        rating: 4.2,
        reviews: 85,
        badge: "New Launch",
        tagImage: newest,
        discount: 13,
        image1: powder3,
        image2: powder1,
    },
    {
        title: "Taal Drop (Nasya) - Gawdee - 30ML",
        price: 249,
        originalPrice: 299,
        rating: 4.0,
        reviews: 64,
        badge: "Trending",
        tagImage: trending,
        discount: 17,
        image1: powder4,
        image2: powder2,
    },
    {
        title: "Moringa Powder - 200GM",
        price: 300,
        originalPrice: 349,
        rating: 4.5,
        reviews: 121,
        badge: "Healthy Choice",
        tagImage: trending,
        discount: 14,
        image1: powder2,
        image2: powder3,
    },
    {
        title: "Bilona-Churned Desi Buffalo Ghee - 5L",
        price: 6548,
        originalPrice: 6750,
        rating: 4.3,
        reviews: 253,
        badge: "Best Seller",
        tagImage: bestSellerTag,
        discount: 3,
        image1: ghee1,
        image2: honey1,
    },
    {
        title: "Ghee Giants Combo - 5L + 5L",
        price: 16653,
        originalPrice: 21350,
        rating: 4.8,
        reviews: 204,
        badge: "Newest",
        tagImage: newest,
        discount: 22,
        image1: powder1,
        image2: powder2,
    },
];

export default function RecomandedProduct() {
    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [showAllMobile, setShowAllMobile] = useState(false);

    const [openCart, setOpenCart] = useState(false);
    const [cartData, setCartData] = useState([]);

    const userId = localStorage.getItem("userId");

    const addToCartApi = async (payload) => {
        const res = await ApiPost("/cart", payload);
        return res?.data?.data || res?.data;
    };

    const getCartApi = async () => {
        const res = await ApiGet(`/cart/${userId}`);
        return res?.data?.data || res?.data;
    };

    const productList = products.length ? products : [];
    const visibleProducts = showAllMobile ? productList : productList.slice(0, 6);
    const fetchCart = async () => {
        try {
            const res = await getCartApi();

            const formatted = (res?.items || []).map((item) => ({
                id: item.productId?._id,
                name: item.productId?.name,
                image:
                    item.selectedColorImage ||
                    item.productId?.productImages?.[0],
                price: item.productId?.originalPrice,
                salePrice: item.productId?.salePrice,
                qty: item.quantity,
                cartId: item._id,
            }));

            setCartData(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            if (!userId) {
                alert("Please login first");
                return;
            }

            if (!item?._id) {
                console.error("Missing product id:", item);
                alert("Product ID not found");
                return;
            }

            const payload = {
                userId,
                items: [
                    {
                        productId: item._id,
                        quantity: 1,
                        selectedColor: null,
                        selectedColorImage: item.image1,
                    },
                ],
            };

            const res = await addToCartApi(payload);

            if (res) {
                await fetchCart();
                setOpenCart(true); 
            }

        } catch (err) {
            console.error(err);
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

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;

        const scrollAmount = 320;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
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
                Bundled
                    </motion.div>

                    <h2 className="text-[28px]  leading-7 lg:text-5xl text-center font-[600] text-gray-900">
Premium Combo Collection
                    </h2>

                    <p className="lg:mt-3 mt-2 justify-center text-center w-fit mx-auto text-gray-600 text-[12px] px-[10px] lg:px-0 lg:text-lg text-center max-w-[650px]">
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
                    className=" grid grid-cols-2 md:flex md:overflow-x-auto  px-[10px] md:px-0  pb-[15px]  gap-3 md:gap-4 pt-[20px] scroll-smooth no-scrollbar"
                >

                    {showLeft && (
                        <div className="absolute left-0 bottom-0 h-[500px] md:w-20 w-[30px] bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                    )}

                    {showRight && (
                        <div className="absolute right-0 bottom-0 h-[500px] md:w-20 w-[30px] bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                    )}

                    {visibleProducts
                        .map((item, index) => {

                            const discount = Math.round(
                                ((item.originalPrice - item.price) / item.originalPrice) * 100
                            );
                            console.log('discount', products)

                            return (
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.28 }}
                                    onClick={() => item.slug && navigate(`/product/${item.slug}`)}
                                    className="group relative md:w-[275px] flex-shrink-0  rounded-[10px] md:rounded-[16px] overflow-hidden bg-white border border-[#ececec] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
                                >

                                    <div className="relative md:h-[250px] overflow-hidden bg-[linear-gradient(180deg,#f7f7f7_0%,#efefef_100%)]">

                                        <div className="absolute top-[-40px] right-[-30px] w-[140px] h-[140px] rounded-full bg-[#d7edb7]/40 blur-3xl z-[1]" />

                                        <div className="absolute md:top-4 md:right-4 top-2 right-2 z-20 rounded-full bg-white/90 backdrop-blur-md px-2 md:px-3 py-[2px] md:py-[4px] text-[10px] font-[600] md:font-bold text-[#214d3b] border border-[#214d3b]/10">
                                            {item.discount}% OFF
                                        </div>

                                        <div className="relative z-10 h-full flex items-center justify-center">

                                            <OptimizedImage
                                                src={item.image1}
                                                alt={item.title || "Product"}
                                                className="w-[275px] h-full"
                                                imgClassName="object-contain transition-all duration-500 group-hover:scale-[1.08]"
                                            />

                                        </div>

                                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-[140px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <div className="flex   flex-shrink-0 items-center w-fit gap-1 md:gap-2 bg-white/90 backdrop-blur-md rounded-full md:px-2 md:py-2 p-1.5 shadow-lg">

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className=" w-[25px] md:w-[30px] border border-[#0c776b] h-[25px] md:h-[30px] flex-shrink-0 rounded-full bg-[#f5f5f5] hover:bg-[#0c776b] hover:text-white  text-[#0c776b] transition flex items-center justify-center"
                                                >
                                                    <Heart className="" size={15} />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(item);
                                                    }}
                                                    className="px-4 py-[5px] md:py-2 flex-shrink-0 rounded-full bg-[#0c776b] text-white text-[12px] font-medium hover:bg-[#16392c] transition"
                                                >
                                                    Add Cart
                                                </button>

                                            </div>
                                        </div>

                                    </div>

                                    <div className=" p-2 md:p-4">

                                        <p className=" text-[8px] md:text-[11px] uppercase tracking-[0.15em] text-[#7a7a7a] font-medium">
                                            Recommended
                                        </p>

                                        <h3 className="mt-1 text-[12px] md:text-[14px] min-h-[32px] md:min-h-[38px] leading-[1.35] font-[500] text-[#1f1f1f]">
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

                    <CartDrawer
                        isOpen={openCart}
                        onClose={() => setOpenCart(false)}
                        cartData={cartData}
                    />
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
        </section>
    );
}