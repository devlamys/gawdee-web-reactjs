/* Developed by Grafizen International PVT. LTD. */
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgePercent, ShoppingCart, Star } from "lucide-react";
import { ApiGet } from "@/helper/axios";
import { useNavigate } from "react-router-dom";

import desiGhee from "../../../public/imges/header/ghee.png";
import honey from "../../../public/imges/header/honey.png";
import sugar from "../../../public/imges/header/sugar.png";
import mixMe from "../../../public/imges/header/jar.png";
import drops from "../../../public/imges/header/drop.png";
import allProduct from "../../../public/imges/header/allproduct.png";
import CartDrawer from "@/component/OrderProcess/CartDrawer";
import { addItemToGuestCart } from "@/utils/cartStorage";
import OptimizedImage from "@/component/common/OptimizedImage";
import { getMediaUrl, getProductThumb } from "@/utils/media";

const getCategoryImage = (name = "") => {
  const lower = name.toLowerCase();

  if (lower.includes("ghee")) return desiGhee;
  if (lower.includes("honey")) return honey;
  if (lower.includes("mix me")) return mixMe;
  if (lower.includes("drops")) return drops;
  if (lower.includes("sugar")) return sugar;

  return allProduct;
};

const getImageUrl = (img, size = "thumb") => getMediaUrl(img, size);

const getProductImages = (product) => {
  const images = [];

  if (Array.isArray(product?.images)) {
    product.images.forEach((img) => {
      const url = getImageUrl(img);

      if (url && !images.includes(url)) {
        images.push(url);
      }
    });
  }

  if (Array.isArray(product?.attributes)) {
    const defaultAttribute = product.attributes.find(
      (item) => item?.isDefault === true
    );

    if (Array.isArray(defaultAttribute?.images)) {
      defaultAttribute.images.forEach((img) => {
        const url = getImageUrl(img);

        if (url && !images.includes(url)) {
          images.push(url);
        }
      });
    }
  }

  return images;
};

const formatProduct = (item) => {
  const images = getProductImages(item);

  const originalPrice = Number(item?.originalPrice || 0);

  const salePrice = Number(item?.salePrice || item?.price || 0);

  const discount =
    originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  return {
    _id: item?._id,
    name: item?.name || "Gawdee Product",
    slug: item?.slug,

    categoryId: item?.categoryId?._id || item?.categoryId || "",
    categoryName: item?.categoryId?.name || "General",

    image1: getProductThumb(item) || images[0] || "",
    image2: "",

    price: salePrice,

    originalPrice: originalPrice,

    salePrice: salePrice,
    discount: discount,

    rating: item?.rating || 5,
    reviews: item?.reviewCount || 0,

    badge: discount > 0 ? `${discount}% OFF` : "",
    coupon:
      discount > 0
        ? `Best Price ₹${salePrice.toLocaleString("en-IN")} with coupon`
        : "Pure & Natural Product",
  };
};
export default function ProductCategorySection() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");

  const [categories, setCategories] = useState([
    {
      _id: "all",
      name: "All",
      slug: "all",
      image: allProduct,
    },
  ]);

  const [products, setProducts] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [cartData, setCartData] = useState({
    _id: "guest-cart",
    items: [],
  });
  const [addedProductId, setAddedProductId] = useState(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const res = await ApiGet("/admin/categories");

        const data =
          res?.category ||
          res?.categories ||
          res?.data?.category ||
          res?.data?.categories ||
          res?.data ||
          [];

        const categoryItems = Array.isArray(data)
          ? data.map((item) => ({
            _id: item._id,
            name: item.name,
            slug: item.slug,
            image: getCategoryImage(item.name),
          }))
          : [];

        setCategories([
          {
            _id: "all",
            name: "All",
            slug: "all",
            image: allProduct,
          },
          ...categoryItems,
        ]);
      } catch (error) {
        console.error("Category Fetch Error:", error);

        setCategories([
          {
            _id: "all",
            name: "All",
            slug: "all",
            image: allProduct,
          },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const res = await ApiGet("/admin/products");

        const data =
          res?.product?.products ||
          res?.products ||
          res?.data?.products ||
          res?.data ||
          [];

        const formattedProducts = Array.isArray(data)
          ? data.map(formatProduct)
          : [];

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Product Fetch Error:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;

    return products.filter(
      (product) => String(product.categoryId) === String(activeCategory)
    );
  }, [products, activeCategory]);

  const handleViewProduct = (product) => {
    if (!product?.slug) return;

    navigate(`/product/${product.slug}`, {
      state: {
        productId: product._id,
      },
    });
  };

  const handleAddToGuestCart = (product) => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      name: product.name,
      quantity: 1,
      qty: 1,

      selectedColor: null,
      variant: null,

      image: product.image1 || product.image2 || "",
      selectedColorImage: product.image1 || product.image2 || "",

      price: Number(product.salePrice || product.price || 0),

      mrp: Number(product.originalPrice || product.price || 0),

      slug: product.slug || "",
    };

    const guestCart = addItemToGuestCart(cartItem);

    setCartData(guestCart);
    setOpenCart(true);
    setAddedProductId(product._id);

    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section className=" w-[100%] overflow-hidden">
      <div className=" flex  flex-col w-fit md77:w-[100%] mx-auto">
        <div className="text-center px-4">
          <h2 className="text-[26px] md:text-[54px] leading-[1] font-[600]">
            Welcome To{" "}
            <span className="text-[#0c776b]">
              Gawdee
            </span>
          </h2>

          <p className="mt-2 text-[14px] font-[400]">
            You're One Step Closer to Purity
          </p>
        </div>

        <div className="mt-3  w-fit  ">
          <div className=" items-center overflow-x-auto  w-[100%] gap-8 border-b border-[#e6e6e6] px-4 pb-4">
            <div className="  gap-4 grid grid-cols-3  md83:grid-cols-7 md77:grid-cols-6">

              {loadingCategories ? (
                <div className="flex items-center  gap-8">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex flex-col items-center gap-2">
                      <div className="h-[64px] w-[64px] rounded-full bg-gray-100 animate-pulse" />
                      <div className="h-[14px] w-[60px] rounded bg-gray-100 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                categories.map((item, idx) => {
                  const active = activeCategory === item._id;

                  return (

                    <button
                      key={item._id || idx}
                      onClick={() => setActiveCategory(item._id)}
                      className="relative w-[100px] flex flex-col items-center "
                    >
                      <div
                        className={`flex h-[64px] w-[64px] items-center justify-center rounded-full transition-all ${active ? "bg-[#edf5ef]" : "bg-transparent"
                          }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[34px] h-[34px] object-contain invert"
                        />
                      </div>

                      <p
                        className={`text-[15px] font-[600] ${active ? "text-[#1f5d46]" : "text-gray-500"
                          }`}
                      >
                        {item.name}
                      </p>

                      {active && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute -bottom-[18px] h-[4px] w-[90px] rounded-full bg-[#1f5d46]"
                        />
                      )}
                    </button>

                  );
                })

              )}
            </div>
          </div>
        </div>

        <div className="mt-6 ">
          {loadingProducts ? (
            <div className="grid grid-cols-2 md77:grid-cols-5 mt-2 gap-3 px-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="w-[165px] h-[320px] rounded-[15px] bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md77:grid-cols-4 md83:grid-cols-5 mt-2 gap-3 ">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  onClick={() => handleViewProduct(product)}
                  whileTap={{ scale: 0.98 }}
                  className="w-[175px] bg-white flex-shrink-0 rounded-[10px] md:rounded-[15px] border border-gray-200 shadow-sm group cursor-pointer overflow-hidden"
                >
                  <div className="relative bg-[#f6f6f6] rounded-t-[10px] md:rounded-t-[15px] overflow-hidden border-b h-[160px] flex items-center justify-center">

                    {product.discount > 0 && (
                      <div className="absolute right-3 top-3 z-6 bg-[#e8f5e9] text-[#0c776b] text-[8px] md:text-[8px] px-2 md:px-3 py-[3px] md:py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
                        🌿 {product.discount}% OFF
                      </div>
                    )}

                    {product.image1 ? (
                      <>
                        <OptimizedImage
                          src={product.image1}
                          alt={product.name}
                          className="w-[175px] h-full"
                          imgClassName="object-contain"
                          priority={index < 4}
                        />
                      </>
                    ) : (
                      <div className="text-[11px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className=" p-2 md:p-3">
                    <h3 className="text-[13px] font-[500] min-h-[37px] text-gray-800 leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-600">
                      <Star
                        size={12}
                        fill="#FACC15"
                        className="text-yellow-400"
                      />
                      <span>{product.rating}</span>
                      <span>({product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-lg leading-5 font-semibold text-black">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>

                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through text-[12px]">
                          ₹
                          {Number(product.originalPrice || 0).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 bg-green-50 flex gap-[6px] border-dashed border border-[#0c776b] text-[#0c776b] text-[8px] px-1 py-2 rounded-md">
                      <BadgePercent size={12} />
                      {product.coupon}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToGuestCart(product);
                      }}
                      className="mt-2 w-full bg-[#0c776b] hover:bg-[#0a6259] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
                    >
                      {addedProductId === product._id ? (
                        <>
                          Added <i className="fa-solid fa-check"></i>
                        </>
                      ) : (
                        <>
                          Add <ShoppingCart size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 text-sm">
              No products found.
            </div>
          )}
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