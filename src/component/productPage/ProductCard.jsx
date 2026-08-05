/* Developed by Grafizen International PVT. LTD. */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgePercent, Heart } from 'lucide-react';
import newest from "../../../public/imges/productDetails/newIdea/newest.png";
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '@/component/common/OptimizedImage';
import { getProductThumb } from '@/utils/media';

export default function ProductCard({
  cake,
  index,
  onCartClick,
  addedProductId,
  isWishlisted = false,
  wishlistLoading = false,
  onWishlistClick,
}) {
  const navigate = useNavigate();

  const sellingPrice = Number(
    cake?.sellingPrice ||
    cake?.salePrice ||
    cake?.price ||
    0
  );

  const originalPrice = Number(
    cake?.originalPrice ||
    cake?.mrp ||
    cake?.maxPrice ||
    cake?.price ||
    sellingPrice ||
    0
  );

  const discount =
    originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const handleViewProduct = () => {
    navigate(`/product/${cake.slug}`, { state: { product: cake } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (onCartClick) {
      onCartClick({
        ...cake,

        price: sellingPrice,
        sellingPrice: sellingPrice,
        salePrice: sellingPrice,

        mrp: originalPrice,
        originalPrice: originalPrice,
      });
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();

    if (onWishlistClick) {
      onWishlistClick(e, cake);
    }
  };

  return (
    <motion.div
      key={index}
      onClick={handleViewProduct}
      className="md11:w-[275px] w-full bg-white relative flex-shrink-0 rounded-[15px] border border-gray-200 shadow-sm group cursor-pointer"
    >

      <div className="relative bg-[#f6f6f6] rounded-t-[15px] overflow-hidden border-b md11:h-[250px] flex items-center justify-center">
        <div className="absolute left-[-3px] shadow-lg z-6 flex gap-1 items-center top-3 border-l font-[500] border-[#0c776b] bg-[#0c776b] text-white text-[11px] px-2 py-[6px] rounded-r-full shadow-md">
          <img src={cake.tagImage || newest} className="w-[15px]" loading="lazy" decoding="async" />
          {cake.badge || "New"}
        </div>

        <OptimizedImage
          src={getProductThumb(cake) || cake.image1}
          alt={cake.name || "Product"}
          className="md11:w-[275px] md11:h-[250px]"
          imgClassName="object-cover"
          priority={index < 4}
        />
        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          className={`absolute right-4 top-11 z-20 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${isWishlisted
              ? "bg-[#0c776b] text-white"
              : "bg-white/90 text-[#0c776b] hover:bg-[#f2b18f] hover:text-white"
            } ${wishlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <Heart
            size={19}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {discount > 0 && (
          <div className="absolute flex right-3 top-3 z-10 bg-[#e8f5e9] text-[#0c776b] text-[8px] md:text-[8px] px-2 md:px-3 py-[3px] md:py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
            🌿 {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className=" text-[13px] md77:text-[15px] font-medium min-h-[37px] text-gray-800 leading-snug">
          {cake.name}
        </h3>

        <div className="flex items-center gap-2 mt-2 text-[12px] text-gray-600">
          ⭐ {cake.rating || 4.5}
          <span>({cake.reviews || 100} reviews)</span>
        </div>

        <div className="flex justify-between items-center gap-3 md77:mt-2">
          <div className="flex items-end gap-2 mt-2">
            <span className="text-lg leading-5 font-semibold text-black">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>

            {originalPrice > sellingPrice && (
              <span className="text-gray-400 line-through text-[12px]">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {cake.displayWeight && (
            <div className="w-fit rounded-full h-fit border border-[#0c776b]/20 bg-[#e8f5e9] px-3 py-[5px] text-[9px] md77:text-[11px] font-semibold text-[#0c776b]">
              {cake.displayWeight}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 border-dashed border border-[#0c776b] bg-green-50 px-2 py-1 rounded-md text-[7px] md77:text-[10px] text-[#0c776b]">
          <BadgePercent size={15} />
          Best Price ₹{sellingPrice.toLocaleString("en-IN")} with Coupon
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 w-full bg-[#1c4d3f] hover:bg-[#163d31] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
        >
          {addedProductId === cake._id ? (
            <>
              Added <i className="fa-solid fa-check"></i>
            </>
          ) : (
            <>
              Add <i className="fa-solid fa-cart-shopping"></i>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}