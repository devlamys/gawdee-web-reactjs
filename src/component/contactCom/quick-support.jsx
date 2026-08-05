/* Developed by Grafizen International PVT. LTD. */
"use client";

import { motion } from "framer-motion";
import { Package, Truck, ShoppingCart, ArrowRight } from "lucide-react";

const supportOptions = [
  {
    icon: Package,
    title: "Order Support",
    description: "Need help with your order?",
  },
  {
    icon: Truck,
    title: "Delivery Support",
    description: "Track or update delivery details.",
  },
  {
    icon: ShoppingCart,
    title: "Product Questions",
    description: "Ask anything about our products.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function QuickSupport() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
            Quick Help
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
            How Can We Help?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {supportOptions.map((option) => (
            <motion.button
              key={option.title}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px -15px rgba(46, 111, 78, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border/30 text-left group cursor-pointer transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <option.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}