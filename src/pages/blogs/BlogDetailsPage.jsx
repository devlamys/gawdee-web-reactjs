/* Developed by Grafizen International PVT. LTD. */
'use client'

import { motion } from "framer-motion"
import Header from "@/component/Header"
import Footer from "@/component/Footer"
import { Calendar, User, ArrowRight } from "lucide-react"
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiGet } from "@/helper/axios";

export default function BlogDetailsPage() {

  const { slug } = useParams();
  const location = useLocation();
  const blogId = location.state?.blogId;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        let url = "";

        if (blogId) {
          url = `/admin/blog/${blogId}`;
        }

        else if (slug) {
          url = `/blog?slug=${slug}`;
        }

        const res = await ApiGet(url);

        console.log("BLOG DETAILS:", res);

        const data = res?.data || res?.blog;

        setBlog(data);
      } catch (err) {
        console.error("Blog details error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, blogId]);

  const renderBlogContent = (html = "") => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return Array.from(doc.body.childNodes).map((node, index) => {
      if (node.nodeName === "P") {
        return (
          <p key={index} className="mb-4 text-[13px] md:text-[16px] leading-[20px] md:leading-[28px] text-gray-700">
            {node.textContent}
          </p>
        );
      }

      if (node.nodeName === "STRONG") {
        return (
          <h3 key={index} className="mt-6 mb-3 text-xl md:text-[24px] font-[500] md:font-[500] text-black">
            {node.textContent}
          </h3>
        );
      }

      if (node.nodeName === "UL") {
        return (
          <ul key={index} className="mb-5 space-y-2 pl-5 list-disc text-gray-700">
            {Array.from(node.children).map((li, i) => (
              <li key={i} className="text-[16px] leading-[28px]">
                {li.textContent}
              </li>
            ))}
          </ul>
        );
      }

      if (node.nodeName === "OL") {
        return (
          <ol key={index} className="mb-5 space-y-2 pl-5 list-decimal text-gray-700">
            {Array.from(node.children).map((li, i) => (
              <li key={i} className="text-[16px] leading-[28px]">
                {li.textContent}
              </li>
            ))}
          </ol>
        );
      }

      if (node.textContent?.trim()) {
        return (
          <p key={index} className="mb-4 text-[13px] md:text-[16px] leading-[20px] md:leading-[28px] text-gray-700">
            {node.textContent}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <>
      <Header />

      <section className="max-w-7xl pt-[160px] mx-auto px-4 mb-16">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden md:h-[480px]"
        >

          <img
            src={blog?.bigImage}
            className="w-full h-full object-cover"
          />

        </motion.div>

      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
   <h2 className="text-xl md:text-4xl mb-4  font-[500] md:font-semibold">

          {blog?.title}
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="space-y-4 text-gray-700 leading-[20px] text-md"
        >

          <p>

            {renderBlogContent(blog?.content)}
          </p>

          <div className="bg-gray-50 border-l-4 border-[#0c776b] px-5  py-3 rounded-xl text-md shadow-md w-fit font-medium text-gray-900">
            Choose purity. Choose tradition. Choose Gawdee.
          </div>

        </motion.div>

      </section>

      <section className="relative w-[90%] md:w-[70%] 2xl:w-[1100px]  mb-[50px] mx-auto rounded-[15px] md:rounded-[30px] py-7 md:py-10 bg-gradient-to-r from-[#0c776b] to-emerald-500 text-white overflow-hidden">

        <div className="max-w-6xl mx-auto px-4 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-[600] md:font-bold"
          >
            Experience the Purity of Tradition
          </motion.h2>

          <p className="md:mt-4 mt-2 md:text-[15px] text-[13px] text-white/80 max-w-xl mx-auto">
            Discover our range of A2 Ghee and Raw Honey crafted with care and authenticity.
          </p>

          <button className="md:mt-6 mt-3 px-6 py-2 bg-white text-[#0c776b] rounded-full font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition">
            Shop Now <ArrowRight size={18} />
          </button>

        </div>

        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/20 rounded-full blur-3xl" />

      </section>

      <Footer />
    </>
  )
}