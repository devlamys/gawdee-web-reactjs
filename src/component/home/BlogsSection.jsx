/* Developed by Grafizen International PVT. LTD. */
'use client'
import { useRef, useState, useEffect } from "react"

import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import blogBack from "../../../public/imges/blogs/blog-back.png"
import { useNavigate } from "react-router-dom"
import { ApiGet } from "@/helper/axios";
export default function BlogsSection() {
    const scrollRef = useRef(null)
    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(true)
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

    const handleBlogDetails = (blog) => {
  navigate(`/blog-details/${blog.slug || blog._id}`, {
    state: { blogId: blog._id },
  });
};

    const handleViewMore = () => {
      navigate("/blogs");
    };

    useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await ApiGet("/blogs"); 

      console.log("BLOG LIST:", res);

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

    const scroll = (direction) => {
        if (!scrollRef.current) return

        const container = scrollRef.current

        const card = container.querySelector("div > div")
        if (!card) return

        const cardWidth = card.offsetWidth + 24 

        container.scrollBy({
            left: direction === "left" ? -cardWidth : cardWidth,
            behavior: "smooth",
        })
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const handleScroll = () => {
            setShowLeft(el.scrollLeft > 10)

            setShowRight(
                el.scrollLeft + el.clientWidth < el.scrollWidth - 10
            )
        }

        handleScroll()
        el.addEventListener("scroll", handleScroll)

        return () => el.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <section className="pt-20 lg:pb-[20px] pb-[100px] relative bg-white ">

            <div className="max-w-7xl mx-auto px-4 mb-14">

                <img src={blogBack} className=" w-[300px] right-0  lg:block hidden top-[-100px] opacity-[0.4] absolute" />
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="  md:mb-10 relative"
                >

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 0.7 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="absolute md:-left-5 top-[-70px]  md:block  text-[38px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                    >
                        Blogs
                    </motion.div>
                    <h2 className=" text-[34px] lg:text-5xl font-[600] text-gray-900">
                        Stories That Matter 🌿
                    </h2>
                    <p className="mt-3 text-[14px] lg:text-lg text-gray-600 max">
                        Explore insights, traditions, and wellness knowledge behind Gawdee’s purity.
                    </p>
                </motion.div>

            </div>

            <div className=" max-w-7xl mx-auto   relative">

                {showLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 text-white  -translate-y-1/2 z-20   bg-gradient-to-br from-[#0c776b] to-[#05655a]  border shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                        <ChevronLeft size={23} />
                    </button>
                )}

                {showRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute text-white right-2 top-1/2 -translate-y-1/2 z-20   bg-gradient-to-br from-[#0c776b] to-[#05655a]  border shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                        <ChevronRight size={23} />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-6 px-4 overflow-x-auto no-scrollbar scroll-smooth"
                >
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={i}
                             onClick={() => handleBlogDetails(blog)}

                            className=" w-[270px] lg:w-[300px] cursor !cursor-pointer flex-shrink-0 snap-start h-[360px] md83:h-[397px] md118:h-[400px] relative rounded-xl overflow-hidden group "
                        >

                            <img
                                src={blog.image}
                                className="w-full h-full object-contain cursor !cursor-pointer  group-hover:scale-110 transition duration-700"
                            />

                            <div className="absolute inset-0 cursor !cursor-pointer  bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute cursor !cursor-pointer  bottom-[-20px] md:bottom-[0px] p-3 md77:p-3 md118::p-6 text-white">
                                <h3 className=" text-[15px]  md77:text-[16px] md118:text-xl font-semibold">
                                    {blog.title}
                                </h3>

                                <p className="  text-[12px] md77:text-[13px]  md118:text-sm text-gray-300 mt-2">
                                    {blog.desc}
                                </p>

                                <div className="mt-1 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleBlogDetails(blog)}>
                                    Read More <ArrowRight size={17} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

            <div className=" 2xl:pl-0 pl-[20px] max-w-7xl mx-auto mt-[30px] mx-auto  ">

                <button
                    class="cursor-pointer w-fit bg-gradient-to-b from-[#0c776b] to-[#077468] shadow-[0px_4px_32px_0_rgba(34,197,94,0.5)] px-6 py-2 rounded-xl border-[1px] border-slate-500 text-white font-medium group" onClick={handleViewMore}
                >
                    <div class="relative overflow-hidden">
                        <p
                            class="group-hover:-translate-y-7 flex items-center gap-[6px] duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                        >
                            View More

                            <ArrowRight size={20} />    </p>
                        <p
                            class="absolute top-7 left-0  flex items-center gap-[6px] group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                        >
                            View More

                            <ArrowRight size={20} />    
                        </p>
                    </div>
                </button>
            </div>

        </section>
    )
}