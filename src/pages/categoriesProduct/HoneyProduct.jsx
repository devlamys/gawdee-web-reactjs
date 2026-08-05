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

export default function HoneyProduct() {
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedCake, setSelectedCake] = useState(null);

    const [maxPrice, setMaxPrice] = useState(0);

    const [products, setProducts] = useState(cakesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userId, setUserId] = useState(null);

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

    useEffect(() => {
        const prices = cakesData.map(item => Number(item.price));
        const maxPrice = Math.max(...prices);

        setPriceRange([0, maxPrice]);
    }, []);
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

  <div className="w-fit mx-auto items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-4 py-[6px] rounded-full text-xs font-medium tracking-wide shadow-sm">
    🍯 Raw • Natural • Unprocessed
  </div>

  <h1 className="mt- text-[30px] md:text-[36px] font-bold text-gray-900 tracking-tight relative inline-block">

    Gawdee Honey

    <span className="absolute left-1/2 -bottom-2 w-[60%] h-[3px] bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full -translate-x-1/2"></span>

  </h1>

  <p className="text-[14px] text-gray-500 mt-4 mx-auto max-w-[520px] leading-relaxed">
    Sourced from natural forests and collected with care, our raw honey is unprocessed, chemical-free, and packed with natural goodness and rich flavor.
  </p>

</div>

<section className="mt-[40px] px-4 md:px-6">

  <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <img
        src="https://img.freepik.com/premium-photo/jar-yellow-mustard-sits-wooden-table-front-barn_981168-10378.jpg?uid=P23936198&ga=GA1.1.1034849637.1766206864&semt=ais_hybrid&w=740&q=80"
        alt="Desi Ghee"
        className="w-full h-[260px] object-cover"
      />
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <img
        src="https://img.freepik.com/premium-vector/delicious-peanut-butter_1181252-513.jpg?uid=P23936198&ga=GA1.1.1034849637.1766206864&semt=ais_hybrid&w=740&q=80"
        alt="Bilona Ghee"
        className="w-full h-[260px] object-cover"
      />
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <img
        src="https://img.freepik.com/free-vector/jar-organic-cream-with-honey-3d-composition-with-reflection-textured-glowing-yellow-background-vector-illustration_1284-17999.jpg?uid=P23936198&ga=GA1.1.1034849637.1766206864&semt=ais_hybrid&w=740&q=80"
        alt="Pure Ghee"
        className="w-full h-[260px] object-cover"
      />
    </motion.div>

  </div>

</section>

                    <main className="w-[100%] md:px-0 px-[15px] pt-6 overflow-auto">

                        <section className="  mt-[30px] bg-gradient-to-b from-accent/2 to-background">
                            <div className=" md:w-[97%] 2xl:w-[100%]   mx-auto">
                                {filteredCakes.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5  gap-x-4 gap-y-[40px] pb-[40px] "
                                    >
                                        <AnimatePresence mode="wait">
                                            {filteredCakes.map((cake, index) => (
                                                <ProductCard
                                                    key={cake._id}
                                                    cake={cake}
                                                    index={index}
                                                    onCartClick={(cake) => {
                                                        setSelectedCake(cake);
                                                        setIsModalOpen(true);
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

                    <ReelSection />
                </div>

                <Footer />
            </div>
        </>

    );
}