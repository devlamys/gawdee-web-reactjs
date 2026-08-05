/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductGallery from '../../component/ProductDetailsPage/ProductGallery'
import ProductInfo from '../../component/ProductDetailsPage/ProductInfo'
import TrustIcons from '../../component/ProductDetailsPage/TrustIcons'
import BenefitsSection from '../../component/ProductDetailsPage/BenefitsSection'
import FAQSection from '../../component/ProductDetailsPage/FAQSection'
import ReviewsSection from '../../component/ProductDetailsPage/ReviewsSection'
import RelatedProducts from '../../component/ProductDetailsPage/RelatedProducts'
import Header from '@/component/Header'
import { ReactLenis } from "lenis/react";
import Footer from '@/component/Footer'
import ComboRelatedProduct from '@/component/ProductDetailsPage/ComboRelatedProduct'
import { ApiGet, ApiPost } from "@/helper/axios";
import AddReviewSection from "@/component/ProductDetailsPage/AddReviewSection";
import LoaderCom from "@/component/common/LoaderCom";
import ProductDescription from "@/component/ProductDetailsPage/ProductDescription";
import AoneContent from "@/component/ProductDetailsPage/AoneContent";
import { LoginModal } from "@/component/LoginModal";
import { addItemToGuestCart, getGuestCart, clearGuestCart } from "@/utils/cartStorage";

const getProductBySlug = async (slug) => {
  const res = await ApiGet(`/product/by-slug/${slug}`);
  console.log('res', res)
  const data = await res.data;

  if (!res.success) {
    throw new Error(res.message);
  }

  return data;
};

const getAllProducts = async () => {

  const res = await ApiGet("/products");
  console.log('response', res)

  return res?.data?.products || [];
};

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

export default function ProductDetails() {

  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [orderNowLoading, setOrderNowLoading] = useState(false); 

  const getCachedProduct = () => {
    try {
      const routeProduct = location.state?.product;

      if (routeProduct) {
        return routeProduct;
      }

      const cachedProduct = localStorage.getItem(`product-${slug}`);

      if (cachedProduct) {
        return JSON.parse(cachedProduct);
      }

      return null;
    } catch {
      return null;
    }
  };

  const [product, setProduct] = useState(getCachedProduct);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {

      setLoading(false);

      const [productData, allProductsData] = await Promise.all([
        getProductBySlug(slug),
        getAllProducts(),
      ]);

      setProduct(productData);
      setAllProducts(allProductsData);

      localStorage.setItem(`product-${slug}`, JSON.stringify(productData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLatestUserId = () => {
    const directUserId = localStorage.getItem("userId");

    if (directUserId) return directUserId;

    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        return parsedUser?._id || null;
      } catch {
        return null;
      }
    }

    return null;
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  const makeOrderNowCartItem = () => {
    const attributes =
      product?.attributes?.length > 0
        ? product.attributes
        : product?.variants?.length > 0
          ? product.variants
          : [];

    const selectedVariant =
      attributes.find((item) => item?.isDefault) || attributes[0] || null;

    const variantImage =
      selectedVariant?.image ||
      selectedVariant?.images?.[0] ||
      product?.images?.[0];

    const selectedVariantName =
      selectedVariant?.name ||
      selectedVariant?.weight ||
      selectedVariant?.size ||
      selectedVariant?.title ||
      selectedVariant?.value ||
      null;

    const selectedPrice = Number(
      selectedVariant?.salePrice ||
      selectedVariant?.sellingPrice ||
      selectedVariant?.price ||
      product?.salePrice ||
      product?.price ||
      0
    );

    const selectedMrp = Number(
      selectedVariant?.mrp ||
      selectedVariant?.regularPrice ||
      selectedVariant?.maxPrice ||
      product?.mrp ||
      product?.maxPrice ||
      product?.price ||
      selectedPrice
    );

    return {
      productId: product._id,
      name: product?.name,
      quantity: 1,
      qty: 1,

      selectedColor: selectedVariantName,
      variant: selectedVariantName,

      image: getImageUrl(variantImage),
      selectedColorImage: getImageUrl(variantImage),

      price: selectedPrice,
      mrp: selectedMrp,

      slug: product?.slug || "",
    };
  };

  const formatCartResponse = (res) => {
    const formatted = (res?.items || []).map((item) => ({
      cartItemId: item?._id,
      productId: item.productId?._id || item.productId,

      name:
        item?.name ||
        item.productId?.title ||
        item.productId?.name ||
        product?.name,

      selectedColor: item.selectedColor || null,
      variant: item.selectedColor || null,

      image:
        item.selectedColorImage ||
        item.productId?.productImages?.[0]?.url ||
        item.productId?.productImages?.[0] ||
        "",

      price: Number(item.price || 0),
      mrp: Number(item.mrp || item.price || 0),

      quantity: Number(item.quantity || 1),
      qty: Number(item.quantity || 1),
    }));

    const subtotal = formatted.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
      0
    );

    return {
      _id: res?._id,
      items: formatted,
      subtotal,
      total: subtotal,
    };
  };

  const mergeGuestCartWithUserCart = async (latestUserId) => {
    try {
      if (!latestUserId) return null;

      const guestItems = getGuestCart();

      if (guestItems.length > 0) {
        const payload = {
          userId: latestUserId,
          items: guestItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity || item.qty || 1,
            selectedColor: item.selectedColor || null,
            selectedColorImage: item.selectedColorImage || item.image || "",
            price: item.price,
            mrp: item.mrp,
          })),
        };

        await addToCartApi(payload);
        clearGuestCart();
      }

      const userCartRes = await getCartApi(latestUserId);
      return formatCartResponse(userCartRes);
    } catch (error) {
      console.error("Merge guest cart error:", error);
      return null;
    }
  };

  const handleOrderNow = async () => {
    try {
      setOrderNowLoading(true);

      const latestUserId = getLatestUserId();
      const cartItem = makeOrderNowCartItem();

      if (!latestUserId) {
        const guestCart = addItemToGuestCart(cartItem);

        const subtotal = guestCart.items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
          0
        );

        setPendingCheckoutData({
          cart: guestCart,
          cartId: guestCart._id,
          items: guestCart.items,
          subtotal,
          discount: 0,
          total: subtotal,
          coupon: null,
        });

        setOpenLoginModal(true);
        return;
      }

      await addToCartApi({
        userId: latestUserId,
        items: [cartItem],
      });

      const cartRes = await getCartApi(latestUserId);
      const formattedCart = formatCartResponse(cartRes);

      const checkoutData = {
        cartId: formattedCart._id,
        cart: {
          _id: formattedCart._id,
          items: formattedCart.items,
        },
        items: formattedCart.items,
        subtotal: formattedCart.subtotal,
        discount: 0,
        total: formattedCart.total,
        coupon: null,
      };

      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      localStorage.setItem("cartId", formattedCart._id);

      navigate("/checkout");
    } catch (error) {
      console.error("Order now error:", error);
      alert(error.message || "Failed to proceed checkout");
    } finally {
      setOrderNowLoading(false);
    }
  };

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product && error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <div
        className="relative w-full min-h-screen bg-white overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Header />

        <div className="bg-white  pt-[60px] lg:pt-[100px]">

          <div className="bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto px-6 pt-12">
              <div className=" flex w-fit mx-auto gap-10">

                <ProductGallery product={product} />

              </div>
            </div>
          </div>

          <AoneContent product={product} />

          <ProductDescription product={product} />
          <BenefitsSection product={product} />

          <FAQSection product={product} />

          <RelatedProducts product={product} allProducts={allProducts} />

          <section className="bg-gradient-to-r from-green-800 to-emerald-500 max-w-6xl w-[90%] lg:w-[70%] mb-[40px] lg:mb-[60px] mx-auto text-white  py-7 lg:py-8 rounded-[19px]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className=" text-[20px] leading-[24px] lg:leading-[34px]  lg:text-3xl font-[600] mb-2">
                Ready to Experience {product.name}?
              </h2>

              <p className="lg:text-sm  text-[12px] text-green-100 mb-4 lg:mb-5">
                Join thousands of happy customers who trust Gawdee
              </p>

              <button
                type="button"
                onClick={handleOrderNow}
                disabled={orderNowLoading}
                className={`bg-white text-green-600 px-4 py-[6px] lg:py-2 gap-[10px] flex items-center mx-auto rounded-lg font-semibold hover:bg-gray-100 transition-colors ${orderNowLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {orderNowLoading ? (
                  <>
                    Processing...
                    <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  <>
                    Order Now <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </section>

          <ReviewsSection product={product} />
          <AddReviewSection />

          <LoginModal
            isOpen={openLoginModal}
            onClose={() => setOpenLoginModal(false)}
            onSuccess={async () => {
              const latestUserId = getLatestUserId();

              setOpenLoginModal(false);

              const mergedCart = await mergeGuestCartWithUserCart(latestUserId);

              if (pendingCheckoutData) {
                const subtotal =
                  mergedCart?.items?.reduce(
                    (sum, item) =>
                      sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
                    0
                  ) ||
                  pendingCheckoutData.subtotal ||
                  0;

                const finalCheckoutData = {
                  ...pendingCheckoutData,
                  cartId: mergedCart?._id || pendingCheckoutData.cartId,
                  cart: {
                    _id: mergedCart?._id || pendingCheckoutData.cartId,
                    items: mergedCart?.items || pendingCheckoutData.items,
                  },
                  items: mergedCart?.items || pendingCheckoutData.items,
                  subtotal,
                  total: Math.max(
                    Number(subtotal || 0) - Number(pendingCheckoutData.discount || 0),
                    0
                  ),
                };

                localStorage.setItem("checkoutData", JSON.stringify(finalCheckoutData));

                if (finalCheckoutData.cartId) {
                  localStorage.setItem("cartId", finalCheckoutData.cartId);
                }

                setPendingCheckoutData(null);
                navigate("/checkout");
              }
            }}
          />

          <Footer />
        </div>

      </div>
    </>
  )
}