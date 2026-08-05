/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";
import jar from "../../../public/imges/productDetails/jar1.png"
import {
  CheckCheckIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  StarHalfIcon,
} from "lucide-react"
import TrustIcons from "./TrustIcons"
import homeMade from "../../../public/imges/productDetails/newIdea/homemade-stamp1.jpg"
import homeMade1 from "../../../public/imges/productDetails/newIdea/homemade-stamp.png"
import PriceTag from "../../../public/imges/productDetails/newIdea/price-tag.png"
import sale from "../../../public/imges/productDetails/newIdea/promotion.png"
import { Star, StarHalf } from "lucide-react"
import CartDrawer from "../OrderProcess/CartDrawer";
import { ApiGet, ApiPost } from "@/helper/axios";
import { LoginModal } from "../LoginModal";
import { useNavigate } from "react-router-dom";
import DummyImage from "../../../public/imges/Products/webEx/image.png"
import DummyImage1 from "../../../public/imges/Products/webEx/image1.avif"
import DummyImage2 from "../../../public/imges/Products/webEx/image2.jpg"
import { addItemToGuestCart, getGuestCart, clearGuestCart } from "@/utils/cartStorage";

const addToCartApi = async (payload) => {
  const res = await ApiPost("/cart", payload);

  const data = res?.data?.data || res?.data;

  if (!data) {
    throw new Error("Failed to add to cart");
  }

  return data;
};

const getCartApi = async (userId) => {
  const res = await ApiGet(`/cart/${userId}`);

  const data = res?.data?.data || res?.data;

  if (!data) {
    throw new Error("Cart not found");
  }

  return data;
};

const rating = 4.5

export default function ProductGallery({ product }) {

  const imagesMain = [
    DummyImage, DummyImage1, DummyImage2
  ];

  const [index, setIndex] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [addCartLoading, setAddCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [productCoupons, setProductCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const isActionLoading = addCartLoading || buyNowLoading;
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [buyNowAfterLogin, setBuyNowAfterLogin] = useState(false);
  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  const getVariantName = (variant) => {
    if (!variant) return "";

    const value =
      variant?.name ||
      variant?.variantName ||
      variant?.label ||
      variant?.weight ||
      variant?.size ||
      variant?.capacity ||
      variant?.volume ||
      variant?.title ||
      variant?.value ||
      "";

    const unit =
      variant?.weightUnit ||
      variant?.unit ||
      variant?.sizeUnit ||
      variant?.capacityUnit ||
      "";

    if (!value) return "";

    const valueString = String(value).trim();
    const unitString = String(unit).trim();

    if (
      unitString &&
      !valueString.toLowerCase().includes(unitString.toLowerCase())
    ) {
      return `${valueString} ${unitString}`.trim();
    }

    return valueString;
  };

  const getCleanProductName = (name = "") => {
    if (!name) return "";

    return String(name)
      .replace(/\b\d+(\.\d+)?\s?(ml|l|ltr|liter|litre|kg|g|gm)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const getCartDisplayName = () => {
    const baseName = getCleanProductName(product?.name || product?.title || "");
    const variantName = hasVariants ? getVariantName(selectedVariant) : "";

    if (variantName) {
      return `${baseName} ${variantName}`.trim();
    }

    return baseName;
  };

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;

    const num = Number(String(value).replace(/[₹,\s]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const attributes =
    product?.attributes?.length > 0
      ? product.attributes
      : product?.variants?.length > 0
        ? product.variants
        : [];

  const hasVariants = Array.isArray(attributes) && attributes.length > 0;

  const selectedVariant = hasVariants
    ? attributes[activeVariantIndex] || attributes[0]
    : null;

  const getSelectedVariantDetails = () => {
    if (!hasVariants || !selectedVariant) {
      const defaultVariantName =
        product?.displayWeight ||
        product?.variantName ||
        product?.sku?.match(
          /\d+(?:\.\d+)?\s*(ml|ltr|liter|litre|l|kg|g|gm|gram|grams)/i
        )?.[0] ||
        (product?.weight && product?.weightUnit
          ? `${product.weight} ${product.weightUnit}`
          : "");

      return {
        variantId: null,
        variantName: defaultVariantName,
        variantLabel: defaultVariantName,
        variantValue: defaultVariantName,
      };
    }

    const variantName = getVariantName(selectedVariant);

    return {
      variantId: selectedVariant?._id || selectedVariant?.id || null,
      variantName,
      variantLabel: variantName,
      variantValue: variantName,
    };
  };

  const getSellingPrice = (variant = null) => {
    if (variant) {
      return (
        toNumber(variant?.salePrice) ||
        toNumber(variant?.sellingPrice) ||
        toNumber(variant?.discountPrice) ||
        toNumber(variant?.offerPrice) ||
        toNumber(variant?.specialPrice) ||
        toNumber(variant?.price) ||
        0
      );
    }

    return (
      toNumber(product?.salePrice) ||
      toNumber(product?.sellingPrice) ||
      toNumber(product?.discountPrice) ||
      toNumber(product?.offerPrice) ||
      toNumber(product?.specialPrice) ||
      toNumber(product?.price) ||
      0
    );
  };

  const getOriginalPrice = (variant = null) => {
    if (variant) {
      return (
        toNumber(variant?.mrp) ||
        toNumber(variant?.originalPrice) ||
        toNumber(variant?.regularPrice) ||
        toNumber(variant?.maxPrice) ||
        toNumber(variant?.compareAtPrice) ||
        toNumber(variant?.price) ||
        0
      );
    }

    return (
      toNumber(product?.mrp) ||
      toNumber(product?.originalPrice) ||
      toNumber(product?.regularPrice) ||
      toNumber(product?.maxPrice) ||
      toNumber(product?.compareAtPrice) ||
      toNumber(product?.price) ||
      0
    );
  };

  const displaySalePrice = hasVariants
    ? getSellingPrice(selectedVariant)
    : getSellingPrice();

  const displayPrice = hasVariants
    ? getOriginalPrice(selectedVariant)
    : getOriginalPrice();

  const showMainOriginalPrice =
    Number(displayPrice) > 0 &&
    Number(displaySalePrice) > 0 &&

    Number(displayPrice) > Number(displaySalePrice);

  const getVariantSalePrice = (variant) => getSellingPrice(variant);
  const getVariantPrice = (variant) => getOriginalPrice(variant);

  const getVariantUnit = (variant) => {
    return (
      variant?.weight ||
      variant?.unit ||
      variant?.capacity ||
      variant?.volume ||
      variant?.size ||
      ""
    );
  };

  console.log('displayPrice', displayPrice)
  console.log('selectedVariant', selectedVariant)

  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images.map((img) =>
        typeof img === "string"
          ? img
          : img?.url
      )
      : selectedVariant?.image
        ? [
          typeof selectedVariant.image === "string"
            ? selectedVariant.image
            : selectedVariant.image?.url,
        ]
        : product?.images?.length > 0
          ? product.images.map((img) =>
            typeof img === "string"
              ? img
              : img?.url
          )
          : [];

  const fetchProductCoupons = async () => {
    try {
      if (!product?._id) return;

      setCouponLoading(true);

      const res = await ApiGet(`/admin/coupon/product/${product._id}`);
      console.log("Product coupons response:", res);

      const data =
        res?.data?.data ||
        res?.data?.coupons ||
        res?.coupons ||
        res?.data ||
        [];

      const couponsArray = Array.isArray(data) ? data : [];

      const websiteVisibleCoupons = couponsArray.filter(
        (coupon) =>
          coupon?.isActive !== false &&
          coupon?.showOnWebsite === true
      );

      setProductCoupons(websiteVisibleCoupons);
    } catch (error) {
      console.error("Fetch product coupon error:", error);
      setProductCoupons([]);
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCoupons();
  }, [product?._id]);

  useEffect(() => {
    if (!imagesMain || imagesMain.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagesMain.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imagesMain.length]);

  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)

  const getOptimizedImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return (
      image?.thumbnail ||
      image?.medium ||
      image?.webp ||
      image?.url ||
      image?.image ||
      ""
    );
  };

  const productMainImage =
    getOptimizedImageUrl(images?.[active]) ||
    getOptimizedImageUrl(product?.images?.[0]) ||
    "";

  const makeCartPayload = () => {
    const variantImage = hasVariants
      ? selectedVariant?.image || selectedVariant?.images?.[0]
      : product?.images?.[0];

    const productImage = product?.images?.[0];

    const {
      variantId,
      variantName,
      variantLabel,
      variantValue,
    } = getSelectedVariantDetails();

    const finalSellingPrice = hasVariants
      ? getSellingPrice(selectedVariant)
      : getSellingPrice();

    const finalOriginalPrice = hasVariants
      ? getOriginalPrice(selectedVariant)
      : getOriginalPrice();

    const finalImage =
      getImageUrl(variantImage) ||
      getImageUrl(productImage);

    const cartItem = {
      productId: product._id,

      name: getCartDisplayName(),
      productName: getCleanProductName(product?.name || product?.title || ""),
      variantName: hasVariants ? getVariantName(selectedVariant) : "",

      quantity: qty,
      qty,

      selectedColor: hasVariants ? getVariantName(selectedVariant) : "",
      variant: hasVariants ? getVariantName(selectedVariant) : "",

      image: finalImage,
      selectedColorImage: finalImage,

      price: finalSellingPrice,
      sellingPrice: finalSellingPrice,
      salePrice: finalSellingPrice,

      mrp: finalOriginalPrice,
      originalPrice: finalOriginalPrice,

      discountAmount: Math.max(
        Number(finalOriginalPrice || 0) - Number(finalSellingPrice || 0),
        0
      ),
    };

    console.log("SELECTED VARIANT:", selectedVariant);
    console.log("FINAL CART ITEM:", cartItem);

    return {
      userId: userId || localStorage.getItem("userId") || null,
      items: [cartItem],
    };
  };

  const showCartMessage = (message = "Item added successfully in cart") => {
    setToastMessage(message);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage("");
    }, 2500);
  };

  const handleAddToCart = async () => {
    try {
      setAddCartLoading(true);

      const payload = makeCartPayload();
      const cartItem = payload.items[0];

      setOpenCart(true);

      if (!userId) {
        const guestCart = addItemToGuestCart(cartItem);

        const fixedGuestCart = {
          _id: guestCart?._id || "guest-cart",
          items: (guestCart?.items || []).map((item) => {
            const sellingPrice = Number(item.price || 0);
            const originalPrice = Number(
              item.originalPrice || item.mrp || item.price || 0
            );

            return {
              ...item,
              price: sellingPrice,
              mrp: originalPrice,
              originalPrice,
              discountAmount: Math.max(originalPrice - sellingPrice, 0),
            };
          }),
        };

        setCartData(fixedGuestCart);

        showCartMessage("Item added successfully in cart");

        return;
      }

      setCartData((prev) => {
        const items = prev?.items || [];

        const updated = [...items, cartItem];

        return {
          ...prev,
          items: updated,
        };
      });

      addToCartApi(payload)
        .then(() => {
          fetchCart(); 
        })
        .catch((err) => {
          console.error(err);
        });

      showCartMessage("Item added successfully in cart");
    } catch (err) {
      console.error(err);
      showCartMessage(err.message || "Failed to add item in cart");
    } finally {
      setAddCartLoading(false);
    }
  };

  const handleProceedToCheckout = async (checkoutDataFromDrawer) => {
    try {
      const latestUserId = localStorage.getItem("userId");

      if (!latestUserId) {
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

  const handleBuyNow = async () => {
    try {
      setBuyNowLoading(true);

      const latestUserId = localStorage.getItem("userId");
      const payload = makeCartPayload();
      const cartItem = payload.items[0];

      if (!latestUserId) {
        const guestCart = addItemToGuestCart(cartItem);

        const subtotal = guestCart.items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
          0
        );

        setCartData(guestCart);
        setPendingCheckoutData({
          cart: guestCart,
          cartId: guestCart._id,
          items: guestCart.items,
          subtotal,
          discount: 0,
          total: subtotal,
          coupon: null,
        });

        setBuyNowAfterLogin(true);
        setOpenLoginModal(true);
        return;
      }

      await addToCartApi(payload);

      const updatedCart = await fetchCart();

      if (!updatedCart?._id) {
        throw new Error("Cart not found after adding product");
      }

      const checkoutData = {
        cartId: updatedCart._id,
        cart: {
          _id: updatedCart._id,
          items: updatedCart.items,
        },
        items: updatedCart.items,
        subtotal: updatedCart.subtotal,
        discount: 0,
        total: updatedCart.total,
        coupon: null,
      };

      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      localStorage.setItem("cartId", updatedCart._id);

      navigate("/checkout");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to proceed checkout");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const formatCartResponse = (res) => {
    const formatted = (res?.items || []).map((item) => {
      const sellingPrice = Number(
        item?.price ||
        item?.salePrice ||
        item?.productId?.salePrice ||
        product?.salePrice ||
        0
      );

      const originalPrice = Number(
        item?.originalPrice ||
        item?.mrp ||
        item?.productId?.originalPrice ||
        item?.productId?.mrp ||
        item?.productId?.maxPrice ||
        item?.productId?.price ||
        product?.mrp ||
        product?.maxPrice ||
        product?.price ||
        sellingPrice
      );

      return {
        cartItemId: item?._id,

        productId: item.productId?._id || item.productId,

        name:
          item?.name ||
          `${getCleanProductName(
            item?.productName ||
            item?.productId?.title ||
            item?.productId?.name ||
            product?.name ||
            ""
          )} ${item?.variantName ||
          item?.selectedColor ||
          item?.variant ||
          ""
            }`.trim(),

        variantId:
          item?.variantId ||
          item?.selectedVariantId ||
          item?.variant?._id ||
          null,

        variantName:
          item?.variantName ||
          item?.variantLabel ||
          item?.variantValue ||
          item?.selectedVariant ||
          item?.selectedColor ||
          item?.variant?.name ||
          item?.variant ||
          "",

        variantLabel:
          item?.variantLabel ||
          item?.variantName ||
          item?.variantValue ||
          item?.selectedVariant ||
          item?.selectedColor ||
          item?.variant?.name ||
          item?.variant ||
          "",

        variantValue:
          item?.variantValue ||
          item?.variantName ||
          item?.variantLabel ||
          item?.selectedColor ||
          item?.variant?.name ||
          item?.variant ||
          "",

        selectedColor:
          item?.selectedColor ||
          item?.variantName ||
          item?.variantLabel ||
          item?.selectedVariant ||
          "",

        selectedVariant:
          item?.selectedVariant ||
          item?.variantName ||
          item?.variantLabel ||
          item?.selectedColor ||
          "",

        variant:
          item?.variantName ||
          item?.variantLabel ||
          item?.selectedVariant ||
          item?.selectedColor ||
          item?.variant?.name ||
          item?.variant ||
          "",

        image:
          item.selectedColorImage ||
          item.productId?.images?.[0] ||
          item.productId?.productImages?.[0]?.url ||
          item.productId?.productImages?.[0] ||
          product?.images?.[0] ||
          "",

        price: sellingPrice,

        mrp: originalPrice,
        originalPrice,

        discountAmount: Math.max(originalPrice - sellingPrice, 0),

        quantity: Number(item.quantity || 1),
        qty: Number(item.quantity || 1),
      };
    });

    const subtotal = formatted.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    const originalSubtotal = formatted.reduce((sum, item) => {
      return (
        sum +
        Number(item.originalPrice || item.mrp || item.price || 0) *
        Number(item.quantity || 1)
      );
    }, 0);

    return {
      _id: res?._id,
      items: formatted,
      subtotal,
      originalSubtotal,
      discount: Math.max(originalSubtotal - subtotal, 0),
      total: subtotal,
    };
  };

  const fetchCart = async () => {
    try {

      if (!userId) {
        const guestItems = getGuestCart();

        const guestCart = {
          _id: "guest-cart",
          items: guestItems.map((item) => {
            const sellingPrice = Number(
              item.price || item.salePrice || product?.salePrice || product?.price || 0
            );

            const originalPrice = Number(
              item.originalPrice || item.mrp || product?.price || sellingPrice
            );

            return {
              ...item,
              price: sellingPrice,
              mrp: originalPrice,
              originalPrice,
              discountAmount: Math.max(originalPrice - sellingPrice, 0),
            };
          }),
        };

        setCartData(guestCart);
        return guestCart;
      }

      const res = await getCartApi(userId);

      const formattedCart = formatCartResponse(res);

      setCartData({
        _id: formattedCart._id,
        items: formattedCart.items,
      });

      return formattedCart;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const mergeGuestCartWithUserCart = async (latestUserId) => {
    try {
      if (!latestUserId) return null;

      const guestItems = getGuestCart();

      if (guestItems.length === 0) {
        const userCartRes = await getCartApi(latestUserId);
        const formattedCart = formatCartResponse(userCartRes);

        setCartData({
          _id: formattedCart._id,
          items: formattedCart.items,
        });

        return formattedCart;
      }

      const payload = {
        userId: latestUserId,
        items: guestItems.map((item) => {
          const variantName =
            item?.variantName ||
            item?.variantLabel ||
            item?.variantValue ||
            item?.selectedVariant ||
            item?.selectedColor ||
            item?.variant ||
            "";

          const sellingPrice = Number(
            item?.price ||
            item?.salePrice ||
            item?.sellingPrice ||
            product?.salePrice ||
            product?.price ||
            0
          );

          const originalPrice = Number(
            item?.originalPrice ||
            item?.mrp ||
            product?.mrp ||
            product?.price ||
            sellingPrice
          );

          return {
            productId: item?.productId,
            quantity: Number(item?.quantity || item?.qty || 1),

            variantId: item?.variantId || null,
            variantName,
            variantLabel: variantName,
            variantValue: variantName,

            selectedVariant: variantName,
            selectedColor: variantName,
            variant: variantName,

            image:
              item?.variantImage ||
              item?.selectedColorImage ||
              item?.image ||
              "",

            selectedColorImage:
              item?.variantImage ||
              item?.selectedColorImage ||
              item?.image ||
              "",

            variantImage:
              item?.variantImage ||
              item?.selectedColorImage ||
              item?.image ||
              "",

            price: sellingPrice,
            sellingPrice,
            salePrice: sellingPrice,

            mrp: originalPrice,
            originalPrice,

            discountAmount: Math.max(
              originalPrice - sellingPrice,
              0
            ),
          };
        }),
      };

      await addToCartApi(payload);

      clearGuestCart();

      const userCartRes = await getCartApi(latestUserId);
      const formattedCart = formatCartResponse(userCartRes);

      setCartData({
        _id: formattedCart._id,
        items: formattedCart.items,
      });

      return formattedCart;
    } catch (error) {
      console.error("Merge guest cart error:", error);
      return null;
    }
  };

  const hasProductCoupon =
    Array.isArray(productCoupons) &&
    productCoupons.length > 0 &&
    productCoupons[0]?.couponCode;

  const handleCopyCoupon = async (couponCode) => {
    if (!couponCode) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(couponCode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = couponCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedCoupon(couponCode);

      setTimeout(() => {
        setCopiedCoupon("");
      }, 1500);
    } catch (error) {
      console.error("Copy coupon error:", error);
      alert("Coupon copy failed");
    }
  };

  return (

    <section className=" w-[100%] 2xl:w-[1500px] mx-auto  h-fit  ">

      <div className=" flex  lg:flex-row  flex-col w-fit md77:h-[600px] md11:h-fit  mx-auto gap-[29px]   ">

        <div className=" lg:hidden block">

          <h1 className="md:text-[35px] 2xl:text-[37px] font-[600]">
            {product?.name}
          </h1>

          <p className="text-gray-700 text-justify mt-1 mb-[5px] font-[500] text-sm">
            {product?.description}
          </p>

          <p className="text-gray-600  text-justify text-[12px] leading-[16px]">
            {product?.content}
          </p>

          <div className=" flex md:hidden pt-[10px] lg:flex-row   gap-">

            <div className="flex items-center gap-1">

              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(rating)) {
                  return (
                    <Star
                      key={i}
                      className="size-5 text-yellow-400 fill-yellow-400   "
                    />
                  )
                }

                if (i === Math.floor(rating) && rating % 1 !== 0) {
                  return (
                    <StarHalfIcon
                      key={i}
                      className="size-5 text-yellow-400 fill-yellow-400   "
                    />
                  )
                }

                return (
                  <Star
                    key={i}
                    className="size-4 text-gray-300"
                  />
                )
              })}

            </div>

            <span className="text-[10px] text-gray-700 font-medium">
              <b className=" text-[14px]  font-[600]">{rating} </b>(100 reviews)
            </span>

          </div>
        </div>

        <div className="  w-fit">

          <div className="   md77:flex gap-8 md11:block top-[140px]   ">

            <div className="relative md77:w-fit md11:w-full">

              <div
                onClick={() => setImagePopupOpen(true)}
                className="bg-white border md:mx-0 mx-auto max-w-[340px] lg:max-w-full w-[340px] overflow-hidden 2xl:h-[450px] md11:w-[470px] md11:h-[470px] 2xl:w-[450px] rounded-2xl shadow-lg cursor-pointer"
              >
                <div className="absolute right-3 top-3 z-6 bg-[#e8f5e9] text-[#0c776b] text-[8px] md:text-[8px] px-2 md:px-3 py-[3px] md:py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
                  🌿 5% OFF
                </div>

                <img
                  src={productMainImage}
                  alt={product?.name || "Gawdee product image"}
                  width="470"
                  height="470"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  className="w-full"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full  flex justify-center items-center w-[30px] h-[30px] shadow hover:bg-white !cursor-pointer transition z-[100]"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full  flex justify-center items-center w-[30px] h-[30px] shadow hover:bg-white !cursor-pointer transition z-[100]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div>

              <div className="flex gap-3 mt-6  md77:mt-0 md11:mt-6 md11:max-w-[470px] h-fit  md77:grid grid-cols-3 md11:flex  sc md11:overflow-x-auto">

                {images.map((img, i) => (
                  <img
                    key={i}
                    src={getOptimizedImageUrl(img)}
                    alt={`${product?.name || "Product"} thumbnail ${i + 1}`}
                    width="70"
                    height="70"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setActive(i)}
                    className={`w-[70px] h-[70px] md11:w-[70px] md11:h-[70px]  md77:w-[100px] md77:h-[100px] border rounded-lg cursor-pointer 
${active === i ? "border-green-600" : "border-gray-200"}
`}
                  />
                ))}

              </div>

              <div className=" md77:flex hidden  md11:hidden items-center lg:items-start mt-5 lg:gap-0 gap-[20px] relative  ">
                <div className=" hidden md:flex lg:flex-row  flex-col items-center gap-">

                  <div className="flex items-center gap-1">

                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(rating)) {
                        return (
                          <Star
                            key={i}
                            className="size-5 text-yellow-400 fill-yellow-400   "
                          />
                        )
                      }

                      if (i === Math.floor(rating) && rating % 1 !== 0) {
                        return (
                          <StarHalfIcon
                            key={i}
                            className="size-5 text-yellow-400 fill-yellow-400   "
                          />
                        )
                      }

                      return (
                        <Star
                          key={i}
                          className="size-4 text-gray-300"
                        />
                      )
                    })}

                  </div>

                  <span className="text-[10px] text-gray-700 font-medium">
                    <b className=" text-[14px]  font-[600]">{rating} </b>(100 reviews)
                  </span>

                </div>
                <div className="  absolute lg:block hidden  mx-auto right-0 left-0 top-[-10px] w-[1.5px] h-[90px] bg-gray-200 ">
                </div>
                <div className=" hidden md:flex     lg:absolute lg:gap-[30px] gap-[30px]  right-[20px] lg:right-[40px] w-fit">

                  <img className=" lg:w-[70px] w-[50px]  object-contain  " src={homeMade1} />
                  <img className=" lg:w-[80px] w-[50px] lg:h-[80px] object-contain  " src={homeMade} />
                </div>

                {hasProductCoupon && (
                  <div className="relative flex lg:hidden items-center w-[280px] justify-between bg-gradient-to-r from-green-800 shadow-lg to-emerald-500 text-white rounded-xl px-5 py-3">

                    <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                      <span className="glaze"></span>
                    </span>

                    <div>
                      <p className="text-xs uppercase tracking-wide opacity-80">
                        Special Offer
                      </p>

                      <h3 className="text-[14px] font-[600] mt-[5px]">
                        {productCoupons[0]?.amountType === "percentage"
                          ? `Save ${productCoupons[0]?.amount}% on this order`
                          : `Save ₹${productCoupons[0]?.amount} on this order`}
                      </h3>

                      <p className="text-xs opacity-80 -mt-[3px]">
                        Use code below at checkout
                      </p>

                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleCopyCoupon(productCoupons[0]?.couponCode)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleCopyCoupon(productCoupons[0]?.couponCode);
                          }
                        }}
                        className="relative flex items-center w-fit mt-2 border-white text-[13px] border border-dashed gap-2 text-white px-3 py-1 rounded-md font-semibold cursor-pointer select-none"
                      >
                        <span>{productCoupons[0]?.couponCode}</span>

                        <Copy size={16} className="hover:scale-110 transition" />

                        {copiedCoupon === productCoupons[0]?.couponCode && (
                          <span className="absolute left-0 top-full mt-1 text-[11px] bg-white text-green-700 px-2 py-[2px] rounded shadow whitespace-nowrap z-20">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="absolute right-4">
                      <img src={sale} className="object-contain w-[55px]" />
                    </div>

                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                  </div>
                )}

              </div>

              <div className="md77:flex  hidden md11:hidden items-end pt-2 lg:mb-0 mb-3 lg:pt-0 gap-3">
                <div className="text-[35px] font-Rose flex items-center gap-[10px] leading-[35px] font-[600] text-gray-900">
                  <img className="w-[25px] object-contain" src={PriceTag} />

                  ₹{Number(displaySalePrice || displayPrice || 0).toLocaleString("en-IN")}
                </div>

                {showMainOriginalPrice && (
                  <span className="line-through font-[500] text-gray-400">
                    ₹{Number(displayPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className=" space-2 lg:space-y-4 md11:w-[500px] md11:max-w-[600px]">

          <div className=" lg:block hidden">

            <h1 className="md:text-[35px] 2xl:text-[37px] font-[600]">
              {product?.name}
            </h1>

            <p className="text-gray-700 text-justify mt-1 mb-[5px] font-[500] text-sm">
              {product?.description}
            </p>

            <p className="text-gray-600  text-justify text-[12px] leading-[16px]">
              {product?.content}
            </p>

          </div>

          <div className=" flex md77:hidden md11:flex  items-center lg:items-start lg:gap-0 gap-[20px] relative  ">
            <div className=" hidden md:flex lg:flex-row flex-col items-center gap-">

              <div className="flex items-center gap-1">

                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(rating)) {
                    return (
                      <Star
                        key={i}
                        className="size-5 text-yellow-400 fill-yellow-400   "
                      />
                    )
                  }

                  if (i === Math.floor(rating) && rating % 1 !== 0) {
                    return (
                      <StarHalfIcon
                        key={i}
                        className="size-5 text-yellow-400 fill-yellow-400   "
                      />
                    )
                  }

                  return (
                    <Star
                      key={i}
                      className="size-4 text-gray-300"
                    />
                  )
                })}

              </div>

              <span className="text-[10px] text-gray-700 font-medium">
                <b className=" text-[14px]  font-[600]">{rating} </b>(100 reviews)
              </span>

            </div>
            <div className="  absolute lg:block hidden  mx-auto right-0 left-0 top-[-10px] w-[1.5px] h-[90px] bg-gray-200 ">
            </div>
            <div className=" hidden md:flex  lg:flex-row flex-col top-[-10px] lg:absolute lg:gap-[30px] gap-[10px]  right-[20px] lg:right-[40px] w-fit">

              <img className=" lg:w-[70px] w-[60px]  object-contain  " src={homeMade1} />
              <img className=" lg:w-[80px] w-[60px] lg:h-[80px] object-contain  " src={homeMade} />
            </div>

            {hasProductCoupon && (
              <div className="relative flex lg:hidden items-center w-[280px] justify-between bg-gradient-to-r from-green-800 shadow-lg to-emerald-500 text-white rounded-xl px-5 py-3">

                <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <span className="glaze"></span>
                </span>

                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80">
                    Special Offer
                  </p>

                  <h3 className="text-[14px] font-[600] mt-[5px]">
                    {productCoupons[0]?.amountType === "percentage"
                      ? `Save ${productCoupons[0]?.amount}% on this order`
                      : `Save ₹${productCoupons[0]?.amount} on this order`}
                  </h3>

                  <p className="text-xs opacity-80 -mt-[3px]">
                    Use code below at checkout
                  </p>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCopyCoupon(productCoupons[0]?.couponCode)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleCopyCoupon(productCoupons[0]?.couponCode);
                      }
                    }}
                    className="relative flex items-center w-fit mt-2 border-white text-[13px] border border-dashed gap-2 text-white px-3 py-1 rounded-md font-semibold cursor-pointer select-none"
                  >
                    <span>{productCoupons[0]?.couponCode}</span>

                    <Copy size={16} className="hover:scale-110 transition" />

                    {copiedCoupon === productCoupons[0]?.couponCode && (
                      <span className="absolute left-0 top-full mt-1 text-[11px] bg-white text-green-700 px-2 py-[2px] rounded shadow whitespace-nowrap z-20">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute right-4">
                  <img src={sale} className="object-contain w-[55px]" />
                </div>

                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
              </div>
            )}

          </div>

          <div className="flex  md77:hidden md11:flex items-end pt-5 lg:mb-0 mb-3 lg:pt-0 gap-3">
            <div className="text-[35px] font-Rose flex items-center gap-[10px] leading-[35px] font-[600] text-gray-900">
              <img className="w-[25px] object-contain" src={PriceTag} />

              ₹{Number(displaySalePrice || displayPrice || 0).toLocaleString("en-IN")}
            </div>

            {showMainOriginalPrice && (
              <span className="line-through font-[500] text-gray-400">
                ₹{Number(displayPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div>

            <div className="grid grid-cols-2 md77:grid-cols-4 md11:grid-cols-2 gap-3">
              {attributes.length > 0 ? (
                attributes.map((v, i) => {
                  const isActive = activeVariantIndex === i;
                  const salePrice = getVariantSalePrice(v);
                  const price = getVariantPrice(v);
                  const showVariantStrike =
                    Number(price) > 0 &&
                    Number(salePrice) > 0 &&
                    Number(price) > Number(salePrice);
                  const unit = getVariantUnit(v);
                  return (
                    <button
                      type="button"
                      key={v?._id || i}
                      onClick={() => {
                        setActiveVariantIndex(i);
                        setActive(0);
                      }}
                      className={`relative flex items-center border rounded-xl p-3 gap-[10px] cursor-pointer text-left  transition-all overflow-hidden ${isActive
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-300"
                        }`}
                    >
                      <div className="w-[42px] h-[42px] rounded-[5px] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          className="w-full h-full object-contain"
                          src={
                            typeof v?.image === "string"
                              ? v.image
                              : v?.image?.url ||
                              (typeof v?.images?.[0] === "string"
                                ? v.images[0]
                                : v?.images?.[0]?.url) ||
                              ""
                          }
                          alt={getVariantName(v)}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-emerald-600  truncate">
                          {getVariantName(v)}
                        </p>

                        <div className="flex items-center gap-[8px] mt-1 flex-wrap">
                          <p className="font-bold text-gray-900 leading-none">
                            ₹{Number(salePrice || price || 0).toLocaleString("en-IN")}
                          </p>

                          {showVariantStrike && (
                            <p className="text-xs text-gray-500 line-through leading-none">
                              ₹{Number(price).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>

                      </div>

                      {isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                          <CheckCheckIcon size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm"></p>
              )}
            </div>
          </div>

          <div className="flex justify-evenly lg:relative fixed z-[1000] md:z-0 bg-white/50 backdrop-blur-[10px] py-[10px] lg:bottom-auto bottom-[0px]  lg:w-fit w-[100%] lg:px-0 px-3 left-0 right-0 mx-auto items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 bg-white px-1 py-1 rounded-full shadow-sm border w-fit">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-full bg-green-100 text-[#0c776b]  flex items-center justify-center hover:scale-110 transition"
              >
                <Minus size={14} />
              </button>

              <span className="px-3 text-base font-Rose font-bold text-gray-800">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-full bg-green-100 text-[#0c776b]  flex items-center justify-center hover:scale-110 transition"
              >
                <Plus size={16} />
              </button>

            </div>
            <div className="flex gap-3 md:gap-4 lg:gap-6 items-center justify-end ">

              <button
                onClick={handleAddToCart}
                disabled={addCartLoading}
                className={`bg-green-600  lg:text-[15px] text-[14px] flex items-center justify-center text-white px-4 py-[10px] md:py-3 gap-[6px] font-[500] rounded-[10px] transition-all duration-300
    ${addCartLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.03]"}
  `}
              >
                {addCartLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <p className="   lg:block hidden ">           Add to cart</p>
                    <p className=" md:text-[15px] text-[13px]   lg:hidden   block ">           Cart</p>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buyNowLoading}
                className={`relative buy-now-btn flex gap-[7px] md:text-[15px] text-[13px] px-3 lg:px-6 py-[10px] lg:py-3 rounded-[10px] font-semibold text-white bg-yellow-500 transition-all duration-300
    ${buyNowLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.03]"}
  `}
              >
                {buyNowLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Buy Now
                    <span className="pulse-ring"></span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
        <div className="mt-[px] w-fit md:mx-0 mx-auto flex flex-col">
          {hasProductCoupon && (
            <div className="relative hidden lg:flex items-center w-[280px] justify-between bg-gradient-to-r from-green-800 shadow-lg to-emerald-500 text-white rounded-xl px-5 py-3">

              <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <span className="glaze"></span>
              </span>

              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">
                  Special Offer
                </p>

                <h3 className="text-[14px] font-[600] mt-[5px]">
                  {productCoupons[0]?.amountType === "percentage"
                    ? `Save ${productCoupons[0]?.amount}% on this order`
                    : `Save ₹${productCoupons[0]?.amount} on this order`}
                </h3>

                <p className="text-xs opacity-80 -mt-[3px]">
                  Use code below at checkout
                </p>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCopyCoupon(productCoupons[0]?.couponCode)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCopyCoupon(productCoupons[0]?.couponCode);
                    }
                  }}
                  className="relative flex items-center w-fit mt-2 border-white text-[13px] border border-dashed gap-2 text-white px-3 py-1 rounded-md font-semibold cursor-pointer select-none"
                >
                  <span>{productCoupons[0]?.couponCode}</span>

                  <Copy size={16} className="hover:scale-110 transition" />

                  {copiedCoupon === productCoupons[0]?.couponCode && (
                    <span className="absolute left-0 top-full mt-1 text-[11px] bg-white text-green-700 px-2 py-[2px] rounded shadow whitespace-nowrap z-20">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute right-4">
                <img src={sale} className="object-contain w-[55px]" />
              </div>

              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
              <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
            </div>
          )}

          <div className={hasProductCoupon ? "lg:mt-[20px]" : "lg:mt-0"}>
            <div className="relative md:block hidden h-[260px] md:h-[330px] rounded-3xl overflow-hidden shadow-xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imagesMain[index]}
                  src={imagesMain[index]}
                  initial={{ opacity: 1, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="flex justify-center absolute bottom-4 mx-auto left-0 right-0 mt-4 gap-2">
                {imagesMain.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition ${i === index ? "bg-[#0c776b] scale-125" : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl text-center w-[300px]">

            <h2 className="text-lg font-semibold mb-2">
              Login Required
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Please login to add items to cart
            </p>

            <button
              onClick={() => {
                setShowLogin(false);
                setOpenLoginModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Go to Login
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        cartData={cartData}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={async () => {
          const latestUserId = localStorage.getItem("userId");

          setUserId(latestUserId);
          setOpenLoginModal(false);

          const mergedCart = await mergeGuestCartWithUserCart(latestUserId);

          if (pendingCheckoutData) {
            const subtotal = mergedCart?.items?.reduce(
              (sum, item) =>
                sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
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

            localStorage.setItem("checkoutData", JSON.stringify(finalCheckoutData));

            if (finalCheckoutData.cartId) {
              localStorage.setItem("cartId", finalCheckoutData.cartId);
            }

            setPendingCheckoutData(null);
            setBuyNowAfterLogin(false);
            setOpenCart(false);
            navigate("/checkout");
            return;
          }

          setBuyNowAfterLogin(false);
        }}
      />

      <AnimatePresence>
        {imagePopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center"
            onClick={() => setImagePopupOpen(false)}
          >

            <button
              onClick={() => setImagePopupOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition z-[100]"
            >
              ✕
            </button>

            {images?.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition z-[100]"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent rounded-2xl max-w-[90vw] max-h-[90vh] flex justify-center items-center"
            >
              <img
                src={
                  typeof images?.[active] === "string"
                    ? images?.[active]
                    : images?.[active]?.url ||
                    (typeof product?.images?.[0] === "string"
                      ? product?.images?.[0]
                      : product?.images?.[0]?.url) ||
                    ""
                }
                alt="Fullscreen Product"
                className="max-w-[85vw] max-h-[82vh] object-contain select-none"
              />
            </motion.div>

            {images?.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition z-[100]"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
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
      </AnimatePresence>

    </section>

  )
}