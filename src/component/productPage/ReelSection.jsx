/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, PlayIcon } from "lucide-react";
import cover from "../../../public/imges/aboutus/cover.jpg"

const reels = [
  {
    id: 1,
    thumbnail:cover,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    thumbnail: cover,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1633945274405-b6c806dbb449",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1590080874088-eec64895b423",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1585238342028-4d88d0c40c16",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 6,
    thumbnail: cover,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 7,
    thumbnail: "https://images.unsplash.com/photo-1633945274405-b6c806dbb449",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 8,
    thumbnail:cover,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 9,
    thumbnail: "https://images.unsplash.com/photo-1590080874088-eec64895b423",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 10,
    thumbnail: "https://images.unsplash.com/photo-1585238342028-4d88d0c40c16",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
];

export default function ReelSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className=" pt-20 md:py-20 bg-white">

  <div className="relative text-center mb-10 md:mb-14">

  <motion.div
    initial={{ y: 80, opacity: 0 }}
    whileInView={{ y: 0, opacity: 0.6 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    viewport={{ once: false, margin: "-100px" }}
    className="absolute left-0 right-0 top-[-70px]  md:block text-[90px] lg:text-[130px] font-semibold uppercase text-transparent 
    [-webkit-text-stroke:2px_rgba(60,80,40,0.2)] 
    leading-none select-none pointer-events-none 
    [mask-image:linear-gradient(to_bottom,black_20%,transparent)]"
  >
    Trusted
  </motion.div>

  <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 relative z-10">
    Trusted by Thousands
  </h2>

  <p className="text-gray-500 mt-3 text-sm">
    Real stories. Real taste. Real trust.
  </p>

</div>

      <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">

        {reels.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="relative min-w-[180px] h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            onClick={() => setActiveVideo(item.video)}
          >

            <img
              src={item.thumbnail}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 p-3 rounded-full">
                <PlayIcon className="text-white" size={24} />
              </div>
            </div>

          </motion.div>
        ))}

      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setActiveVideo(null)}
          >

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-[90%] md:w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >

              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full rounded-xl"
              />

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}