/* Developed by Grafizen International PVT. LTD. */
"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "../common/ui-product/button";

export function FooterCTA() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 text-balance">
            Still have questions?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base"
              >
                <a href="tel:+917055107030">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </a>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium text-base transition-colors"
              >
                <a
                  href="https://wa.me/917055107030"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-8 border-t border-border/30 text-center"
        >
          <p className="text-2xl font-serif font-bold text-primary mb-2">
            GAWDEE
          </p>
          <p className="text-sm text-muted-foreground">
            Pure A2 Gir Cow Ghee • Made with Love
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} GAWDEE. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}