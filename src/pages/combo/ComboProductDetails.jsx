/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useParams, useLocation } from "react-router-dom";
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
import { ApiGet } from "@/helper/axios";
import AddReviewSection from "@/component/ProductDetailsPage/AddReviewSection";
import LoaderCom from "@/component/common/LoaderCom";
import ProductDescription from "@/component/ProductDetailsPage/ProductDescription";
import AoneContent from "@/component/ProductDetailsPage/AoneContent";

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

export default function ComboProductDetails() {

  const { slug } = useParams();

  const [product, setProduct] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {

    try {

      setLoading(true);

      const [productData, allProductsData] =
        await Promise.all([
          getProductBySlug(slug),
          getAllProducts(),
        ]);

      setProduct(productData);

      setAllProducts(allProductsData);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <div className="text-center   w-fit flex justify-center mx-auto my-auto h-[100vh] items-center ">  <LoaderCom /></div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
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

          <ComboRelatedProduct />

          <RelatedProducts product={product} allProducts={allProducts} />

          <section className="bg-gradient-to-r from-green-800 to-emerald-500 max-w-6xl w-[90%] lg:w-[70%] mb-[40px] lg:mb-[60px] mx-auto text-white  py-7 lg:py-8 rounded-[19px]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className=" text-[20px] leading-[24px] lg:leading-[34px]  lg:text-3xl font-[600] mb-2">
                Ready to Experience {product.name}?
              </h2>

              <p className="lg:text-sm  text-[12px] text-green-100 mb-4 lg:mb-5">
                Join thousands of happy customers who trust Gawdee
              </p>

              <button className="bg-white text-green-600 px-4 py-[6px] lg:py-2 gap-[10px] flex items-center mx-auto rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Order Now <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </section>

          <ReviewsSection product={product} />
          <AddReviewSection />

          <Footer />
        </div>

      </div>
    </>
  )
}