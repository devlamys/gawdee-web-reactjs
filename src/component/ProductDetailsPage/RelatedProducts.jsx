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
import { BadgePercent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartDrawer from "../OrderProcess/CartDrawer";
import { ApiGet, ApiPost } from "@/helper/axios";

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
    tagImage: bestSellerTag,
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

export default function RelatedProducts({
  product,
  allProducts = [],
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [cartData, setCartData] = useState([]);

  const userId = localStorage.getItem("userId");
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const addToCartApi = async (payload) => {

    const res = await ApiPost("/cart", payload);

    return res?.data?.data || res?.data;
  };

  const getCartApi = async () => {

    const res = await ApiGet(`/cart/${userId}`);

    return res?.data?.data || res?.data;
  };

  const fetchCart = async () => {

    try {

      const res = await getCartApi();

      const formatted = (res?.items || []).map((item) => ({
        id: item.productId?._id,

        name: item.productId?.name,

        image:
          item.selectedColorImage ||
          item.productId?.images?.[0],

        price: item.productId?.salePrice,

        mrp: item.productId?.price,

        qty: item.quantity,
      }));

      setCartData(formatted);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const relatedProducts = React.useMemo(() => {
    if (!product || !allProducts?.length) return [];

    const currentCategoryId =
      typeof product?.categoryId === "object"
        ? product?.categoryId?._id
        : product?.categoryId;

    const sameCategoryProducts = allProducts.filter((item) => {
      const itemCategoryId =
        typeof item?.categoryId === "object"
          ? item?.categoryId?._id
          : item?.categoryId;

      return (
        item?._id !== product?._id &&
        String(itemCategoryId) === String(currentCategoryId)
      );
    });

    const otherProducts = allProducts.filter((item) => {
      const itemCategoryId =
        typeof item?.categoryId === "object"
          ? item?.categoryId?._id
          : item?.categoryId;

      return (
        item?._id !== product?._id &&
        String(itemCategoryId) !== String(currentCategoryId)
      );
    });

    return [...sameCategoryProducts, ...otherProducts];
  }, [product, allProducts]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 320;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = async (item) => {

    try {

      if (!userId) {
        alert("Please login first");
        return;
      }

      setOpenCart(true);

      const payload = {
        userId,

        items: [
          {
            productId: item._id,

            quantity: 1,

            selectedColor: null,

            selectedColorImage:
              item?.images?.[0] ||
              item?.attributes?.[0]?.images?.[0],
          },
        ],
      };

      await addToCartApi(payload);

      await fetchCart();

    } catch (err) {

      console.error(err);
    }
  };

  return (
    <section className=" lg:pt-10 pb-[50px] lg:pb-24 relative">
      <div className=" w-[94%] mx-auto relative">

        <div className=" mb- lg:mb-4 w-fit mx-auto relative">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-0 w-fit lg:left-[-60px] top-[-40px] lg:top-[-70px] right-0 mx-auto  lg:w-[600px]  md:block text-[52px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Related
          </motion.div>

          <h2 className=" text-[26px] lg:text-5xl  lg:leading-normal leading-[35px] text-center font-[600] text-gray-900">
            Related Products
          </h2>

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
          className="flex overflow-x-auto   gap-4  pt-[10px] lg:pt-[20px] scroll-smooth no-scrollbar"
        >

          {showLeft && (
            <div className="absolute left-0 bottom-0 h-[500px] w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          )}

          {showRight && (
            <div className="absolute right-0 bottom-0 h-[500px] w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          )}
          {relatedProducts.map((item, index) => {

            const discount = Math.round(
              ((item.originalPrice - item.price) / item.originalPrice) * 100
            );

            return (

              <>

                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => item.slug && navigate(`/product/${item.slug}`)}
                  className="w-[255px] bg-white flex-shrink-0 rounded-[15px] border border-gray-200 shadow-sm  group"
                >

                  <div className="relative bg-[#f6f6f6] rounded-t-[15px]  overflow-hidden border-b h-[250px] flex items-center justify-center">

                    <div className="absolute left-[-3px] shadow-lg  z-6 flex  gap-1 items-center top-3  border-l  font-[500] border-[#0c776b] bg-[#0c776b] text-white text-[10px] px-2 py-[6px] rounded-r-full shadow-md">
                      <img src={item.tagImage || newest} className=" w-[15px]" /> {item.badge || "New"}
                    </div>

                    <img
                      src={
                        item?.images?.[0] ||
                        item?.attributes?.[0]?.images?.[0]
                      }
                      className="  w-[260px] h-[250px]  object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    <img
                      src={
                        item?.images?.[1] ||
                        item?.attributes?.[0]?.images?.[1] ||
                        item?.images?.[0]
                      }
                      className="absolute  w-[260px] h-[250px] top-[0px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                  </div>

                  <div className="p-3">

                    <h3 className="text-[15px] font-medium min-h-[38px] text-gray-800 leading-snug">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-[13px] text-gray-600">
                      ⭐ 4.5
                      <span>(101 reviews)</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-semibold text-black">
                        ₹{item.salePrice || item.price}
                      </span>

                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.originalPrice}
                      </span>
                    </div>

                    <div className="mt-3 bg-green-50 flex gap-[6px] border-dashed border border-green-600 text-[#0c776b]  text-[10px] px-1 py-2 rounded-md">
                      <BadgePercent size={15} />  Best Price ₹5,454 with coupon
                    </div>

                    <button className="mt-3 w-full bg-[#1c4d3f] hover:bg-[#163d31] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}>
                      Add <i class="fa-solid fa-cart-shopping"></i>
                    </button>

                  </div>

                </motion.div>

              </>);

          })}
        </div>
      </div>
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        cartData={cartData}
      />
    </section>

  );
}