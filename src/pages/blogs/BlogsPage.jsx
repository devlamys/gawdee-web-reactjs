/* Developed by Grafizen International PVT. LTD. */
import React from "react"
import { useRef, useState, useEffect } from "react"

import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/component/Header"
import Footer from "@/component/Footer"
import { useNavigate } from "react-router-dom"
import { ApiGet } from "@/helper/axios"

export default function BlogsPage() {

    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await ApiGet("/blogs"); 

      console.log("BLOG API:", res);

      const data = res?.data[0]?.blogs || res?.blogs || [];

      const formatted = data.map((item) => ({
        _id: item._id,
        title: item.title,
        desc: item.shortDescription || item.content?.slice(0, 80),
        image: item.smallImage || item.banner,
        slug: item.slug,
      }));

      setBlogs(formatted);
    } catch (err) {
      console.error("Blog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
}, []);

const handleBlogDetails = (blog) => {
  navigate(`/blog-details/${blog.slug || blog._id}`, {
    state: { blogId: blog._id },
  });
};

    return (
        <>

            <Header />

            <div className="relative pt-[150px] pb-[80px] md:w-[90%] 2xl:w-[80%] mx-auto">

                <div className="mb-[30px] text-center overflow-hidden">

                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-fit mx-auto bg-gradient-to-r from-green-100 to-emerald-100 text-[#0c776b]  px-4 py-[6px] rounded-full text-xs font-medium tracking-wide shadow-sm"
                    >
                        🌿 Insights • Wellness • Tradition
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 text-[30px] md:text-[42px] font-bold text-gray-900 tracking-tight relative inline-block"
                    >
                        Stories That Matter

                        <motion.span
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "60%", opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="absolute left-1/2 -bottom-2 h-[3px] bg-gradient-to-r from-green-600 to-emerald-400 rounded-full -translate-x-1/2"
                        />
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-[14px] md:text-[15px] text-gray-500 mt-5 mx-auto max-w-[520px] leading-relaxed"
                    >
                        Explore stories, insights, and timeless traditions behind purity, wellness,
                        and natural living. Learn how Gawdee brings authenticity from farms to your life.
                    </motion.p>

                </div>

                <div

                    className=" flex flex-col justify-center items-center mx-auto lg:grid gap-[20px]  w-[90%] lg:w-[100%] md:grid-cols-5 2xl:grid-cols-5"
                >
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 80 }}
                            onClick={() => handleBlogDetails(blog)}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className=" w-[300px] lg:w-[245px] flex-shrink-0 snap-start h-[350px] relative rounded-2xl overflow-hidden group !cursor-pointer"
                        >

                            <img
                                src={blog.image}
                                className="w-full !cursor-pointer h-full object-cover group-hover:scale-110 transition duration-700"
                            />

                            <div className="absolute  !cursor-pointer inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute !cursor-pointer  bottom-0 p-3 text-white">
                                <h3 className="text-[13px] font-semibold  leading-[20px]">
                                    {blog.title}
                                </h3>

                                <p className="text-[12px] text-gray-300 mt-1">
                                    {blog.desc}
                                </p>

                                <div className="mt-3 text-[12px] font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleBlogDetails(blog)}>
                                    Read More <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
            <Footer />
        </>
    )
}