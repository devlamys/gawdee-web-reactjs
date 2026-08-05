/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Search,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  Zap,
  SearchCheck, BadgePercent
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import diabatis from "../../../public/imges/header/popup/diabetis.png"
import guthealth from "../../../public/imges/header/popup/gutHealth.png"
import imunity from "../../../public/imges/header/popup/imunity.png"
import weightLoss from "../../../public/imges/header/popup/weightLoss.png"
import { ApiGet } from "@/helper/axios"
import { useNavigate } from "react-router-dom"

export default function SearchOverlay({
  open,
  onClose,
  search,
  setSearch,
}) {
  const ref = useRef(null)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])

  const searchSuggestions = [
    { text: 'Organic Ghee', icon: '🌾' },
    { text: 'Amla Juice', icon: '🍯' },
    { text: 'Jaggery Powder', icon: '🥄' },
    { text: 'Cold Pressed Oil', icon: '🫒' },
    { text: 'Herbal Tea', icon: '☕' },
    { text: 'Whey Protein', icon: '💪' },
  ]

  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const res = await ApiGet("/products")

      const products =
        Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data?.products)
              ? res.data.products
              : Array.isArray(res?.products)
                ? res.products
                : []

      setAllProducts(products)
      setFilteredProducts(products)

    } catch (err) {
      console.error(err)
      setAllProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const trendingSearches = [
    'Organic Ghee',
    'Amla Products',
    'Jaggery',
    'Cold Pressed Oil',
    'Herbal Supplements',
    'Protein Powder',
  ]

  const concerns = [
    {
      name: 'Diabetes Care',
      icon: diabatis,
      desc: 'Helps manage sugar levels naturally',
      color: 'from-rose-400 to-rose-100',
      textColor: 'text-rose-700',
    },
    {
      name: 'Gut Health',
      icon: guthealth,
      desc: 'Supports digestion & gut balance',
      color: 'from-emerald-400 to-emerald-100',
      textColor: 'text-emerald-700',
    },
    {
      name: 'Immunity Boost',
      icon: imunity,
      desc: 'Strengthens body defense system',
      color: 'from-amber-400 to-amber-100',
      textColor: 'text-amber-700',
    },
    {
      name: 'Weight Loss',
      icon: weightLoss,
      desc: 'Boost metabolism & fat control',
      color: 'from-blue-400 to-blue-100',
      textColor: 'text-blue-700',
    },
  ]

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, onClose])

  const normalizeText = (text = "") =>
    String(text).toLowerCase().trim();

  const getSearchKeyword = (text = "") => {
    const value = normalizeText(text);

    if (value.includes("ghee")) return "ghee";
    if (value.includes("honey")) return "honey";
    if (value.includes("jaggery")) return "sugar";
    if (value.includes("sugar")) return "sugar";
    if (value.includes("mix")) return "mix";
    if (value.includes("amla")) return "mix";
    if (value.includes("drop")) return "drop";
    if (value.includes("taral")) return "drop";

    return value;
  };

  useEffect(() => {
    if (!open) return;

    const query = getSearchKeyword(search);

    if (!query) {
      setFilteredProducts(allProducts);
      setShowSuggestions(true);
      return;
    }

    const filtered = allProducts.filter((product) => {
      const name = normalizeText(product?.name);
      const categoryName = normalizeText(
        product?.category?.name ||
        product?.categoryId?.name ||
        product?.categoryName
      );
      const typeName = normalizeText(
        product?.type?.name ||
        product?.typeId?.name ||
        product?.typeName
      );
      const description = normalizeText(product?.description);

      return (
        name.includes(query) ||
        categoryName.includes(query) ||
        typeName.includes(query) ||
        description.includes(query)
      );
    });

    setFilteredProducts(filtered);
    setShowSuggestions(false);
  }, [search, allProducts, open]);

  const handleSearch = (e) => {
    const query = e.target.value
    setSearch(query)

    if (!query.trim()) {
      setFilteredProducts(allProducts) 
      setShowSuggestions(true)
      return
    }

    setShowSuggestions(false)

    const filtered = allProducts.filter((p) =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredProducts(filtered)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearch(getSearchKeyword(suggestion));
    setShowSuggestions(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug || product._id}`)
    onClose()
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])
  return (
    <AnimatePresence>
      {open && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99990]"
          />

          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed border rounded-b-[14px] rounded-t-0 md:rounded-[14px] z-[100000]  top-[11%] md:mx-0 mx-auto left-0 right-0 md:top-[8%] md:left-[55px] bg-white -translate-x-1/2 w-[100%] md:w-[80%] h-[82vh] md:h-[570px] max-w-[970px] 2xl:max-w-5xl 2xl:h-[770px] custom-scroll overflow-y-auto"
          >
            <div
              ref={ref}
              className="bg-white/98   rounded-2xl p-5"
            >

              <div className="block md:hidden mb-3">
                <div className="relative flex justify-center gap-[20px] w-[100%]">
                  <div className="absolute  z-5 left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className=" text-[#000]" size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products, ingredients, or health concerns..."

                    onChange={handleSearch}
                    className="w-full  text-[13px] pl-10 pr-4 py-2 rounded-[12px] border-1 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 bg-white/80 backdrop-blur-sm"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      rotate: 90,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    onClick={onClose}
                    className=" right-4 top-4 z-[20] flex-shrink-0 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:border-red-200 hover:bg-red-50"
                  >

                    <X
                      size={18}
                      className="text-slate-700"
                    />
                  </motion.button>
                </div>
              </div>

              <>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      Trending Searches
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((searchItem, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(searchItem)}
                        className="px-3 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[12px] hover:text-emerald-700 rounded-full font-medium transition-all duration-200 border border-transparent hover:border-emerald-300"
                      >
                        {searchItem}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-between gap-6">

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4  block md:hidden md:sticky md:w-[260px]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Shop By Health Concern
                      </h3>
                    </div>

                    <div className="flex  overflow-y-auto md:flex-col gap-4">
                      {concerns.map((concern, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05, y: -6 }}
                          whileTap={{ scale: 0.97 }}
                          className="relative p-3 rounded-xl w-[140px] flex-shrink-0 bg-gradient-to-br border flex shadow-sm text-left transition-all duration-300  overflow-hidden"
                        >
                          <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/30 blur-2xl rounded-full" />

                          <div className="relative gap-[10px] md:flex-row flex-col flex z-10">
                            <div className="rounded-xl flex items-center justify-center">
                              <img
                                src={concern.icon}
                                className="w-[40px] object-contain"
                                alt={concern.name}
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-center text-[13px]">
                                {concern.name}
                              </p>

                              <p className="text-[10px] text-center text-gray-600 leading-snug">
                                {concern.desc}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag size={18} className="text-blue-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        {search?.trim()
                          ? `Products matching "${search}"`
                          : "Top Rated Products"}
                      </h3>
                    </div>

                    {(() => {
                      const hasSearch = search?.trim();
                      const productsToShow = hasSearch
                        ? filteredProducts
                        : allProducts.slice(0, 3);

                      if (loading) {
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="w-full md:w-[190px] h-[390px] rounded-[15px] bg-slate-100 animate-pulse"
                              />
                            ))}
                          </div>
                        );
                      }

                      if (productsToShow.length === 0) {
                        return (
                          <div className="w-full min-h-[390px] flex flex-col items-center justify-center text-center rounded-[15px] border border-dashed border-slate-200 bg-slate-50">
                            <Search size={44} className="text-slate-300 mb-3" />
                            <p className="text-slate-700 text-sm font-semibold">
                              No products found
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              Try searching with different keywords
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {productsToShow.map((product) => (
                            <ProductCard
                              key={product._id || product.id}
                              product={product}
                              onClick={handleProductClick}
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4  hidden md:block md:sticky md:w-[260px]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Shop By Health Concern
                      </h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      {concerns.map((concern, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05, y: -6 }}
                          whileTap={{ scale: 0.97 }}
                          className="relative p-3 rounded-xl bg-gradient-to-br border flex shadow-md text-left transition-all duration-300 hover:shadow-xl overflow-hidden"
                        >
                          <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/30 blur-2xl rounded-full" />

                          <div className="relative gap-[10px] md:flex-row flex-col flex z-10">
                            <div className="rounded-xl flex items-center justify-center">
                              <img
                                src={concern.icon}
                                className="w-[40px] object-contain"
                                alt={concern.name}
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-[13px]">
                                {concern.name}
                              </p>

                              <p className="text-[10px] text-gray-600 leading-snug">
                                {concern.desc}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ProductCard({ product, onClick }) {
  const discount = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick(product)}
      className="w-full md:w-[190px] bg-white flex-shrink-0 rounded-[15px] border border-gray-200 shadow-sm group cursor-pointer"
    >

      <div className="relative bg-[#f6f6f6] rounded-[15px] overflow-hidden border-b h-[170px] flex items-center justify-center">

        {product.badge && (
          <div className={`absolute left-[-3px] z-10 flex items-center gap-1 top-3 text-white text-[11px] px-3 py-[6px] rounded-r-full shadow-md ${product.badgeColor}`}>
            {product.badge}
          </div>
        )}

        {discount > 0 && (
          <div className="absolute right-3 top-3 z-10 bg-[#e8f5e9] text-[#0c776b] text-[10px] px-3 py-[6px] rounded-full border border-[#0c776b]/20 font-semibold">
            🌿 {discount}% OFF
          </div>
        )}

        <img
          src={product.images[0]}
          className="w-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
        />

      </div>

      <div className="p-2">

        <h3 className="text-[12px] font-medium text-gray-800 leading-snug line-clamp-2 min-h-[30px]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-[12px] text-gray-600">
          ⭐ {product.rating || 4.6}
          <span>({product.reviews || 100})</span>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-lg font-semibold text-black">
            ₹{product.price}
          </span>

          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <div className="mt-2 bg-green-50 flex items-center gap-[6px] border-dashed border border-[#0c776b] text-[#0c776b] text-[8px] px-2 py-2 rounded-md">
          <BadgePercent size={14} />
          Best price with coupon
        </div>

        <button
          className="mt-3 w-full bg-[#1c4d3f] hover:bg-[#163d31] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Add to cart:", product)
          }}
        >
          Add <i className="fa-solid fa-cart-shopping"></i>
        </button>

      </div>

    </motion.div>
  )
}