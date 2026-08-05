/* Developed by Grafizen International PVT. LTD. */
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";

import logoutimage from "../../public/imges/logout.png"
export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[99988] bg-black/50 backdrop-blur-md"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.82,
              y: 80,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.82,
              y: 80,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            className="fixed left-0 right-0 mx-auto top-0  w-[350px] bottom-0  h-fit my-auto z-[99999]  max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
          >

            <div className="relative overflow-hidden   bg-[#0c776b] px-2 pb-7 pt-7">

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -left-10 bottom-0 h-[150px] w-[150px] rounded-full bg-lime-300 blur-3xl"
              />

              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute -right-10 top-0 h-[140px] w-[140px] rounded-full bg-white blur-3xl"
              />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
<img src={logoutimage} className="w-[100px] mx-auto" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-2 text-center"
              >
                <h2 className="text-[20px] font-[700] tracking-tight text-white">
                  Logout Account
                </h2>

                <p className="mx-auto mt-1 max-w-[280px] text-[14px] leading-tight text-white/80">
                  Are you sure you want to logout from your account?
                </p>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 p-5">

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={onClose}
                className="flex-1 rounded-[16px] border border-gray-200 bg-white py-2 text-[14px] font-[600] text-gray-700 transition"
              >
                Cancel
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={onConfirm}
                className="flex-1 rounded-[16px] bg-[#0c776b] py-3 text-[14px] font-[600] text-white shadow-lg"
              >
                Yes, Logout
              </motion.button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}