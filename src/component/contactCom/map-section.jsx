/* Developed by Grafizen International PVT. LTD. */
"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { Button } from "../common/ui-product/button";

export function MapSection() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=B-wing+Anjani+Plaza+Chandrapur+Wankaner+Gujarat+363621";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=B-wing+Anjani+Plaza+Chandrapur+Wankaner+Gujarat+363621";

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
            Our Location
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
            Find Our Office
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-3xl overflow-hidden shadow-xl border border-border/30"
        >
          <div className="grid lg:grid-cols-5 gap-0">

            <div className="lg:col-span-3 h-72 lg:h-96 bg-secondary/50 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.2477366750584!2d70.94459181495575!3d22.616826985165686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39576f8b6c8e9ae5%3A0x8f5b3e4c9b5a1f0a!2sWankaner%2C%20Gujarat%20363621!5e0!3m2!1sen!2sin!4v1679900000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GAWDEE Office Location"
              />
            </div>

            <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    GAWDEE Office
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    B-wing, Second Floor,<br />
                    Anjani Plaza,<br />
                    Chandrapur, Wankaner,<br />
                    Gujarat 363621
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </a>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto rounded-full border-primary text-primary hover:bg-primary/10"
                  >
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}