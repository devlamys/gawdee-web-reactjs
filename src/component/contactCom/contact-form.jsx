/* Developed by Grafizen International PVT. LTD. */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Navigation,
} from "lucide-react";

import { Button } from "../common/ui-product/button";
import { Input } from "../common/ui-product/input";
import { Textarea } from "../common/ui-product/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../common/ui-product/select";
import { ApiPost } from "@/helper/axios";
import toast from "react-hot-toast";

const subjects = [
  "General Inquiry",
  "Order Support",
  "Product Questions",
  "Delivery Issues",
  "Wholesale Inquiry",
  "Feedback",
];

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.subject) {
      toast.error("Please select subject");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      };

      const res = await ApiPost("/contact-us", payload);

      toast.success(res?.data?.message || "Message sent successfully");

      setIsSubmitted(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact Error:", err);
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="relative py-24  overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center relative mb-16"
        >

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="absolute left-[0px] right-0 top-[-80px]  md:block text-[92px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
          >
            Gawdee
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gray-900">
            Let's Start a Conversation
          </h2>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Questions about our A2 Gir Cow Ghee, delivery, or wholesale?
            Our team is happy to help you anytime.
          </p>

        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-green-100"
          >

            <div className="h-[350px]">

              <iframe
                src="https://www.google.com/maps?q=812,+B+Wing,+Om+Decora+9+Square,+Nana+Mauva+Road,+Street+9,+Beside+Marwadi,+Rajkot,+Gujarat+360005&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />

            </div>

            <div className="p-6">

              <div className="flex gap-4 mb-2">

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="text-[#0c776b] w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Gawdee Office
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    812, B Wing, Om Decora 9 Square,
                    Nana mauva road, St 9,
                    beside Marwadi, Rajkot,
                    Gujarat 360005
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <Button className="rounded-full bg-[#0c776b] hover:bg-[#0a6a5a]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Maps
                </Button>

                <Button variant="outline" className="rounded-full border-[#0c776b] text-[#0c776b]">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>

              </div>

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
            className="bg-white rounded-3xl p-5 lg:p-10 shadow-xl border border-green-100"
          >

            {isSubmitted ? (

              <div className="text-center py-12">

                <CheckCircle2 className="w-16 h-16 text-[#0c776b] mx-auto mb-6" />

                <h3 className="text-2xl font-semibold mb-2">
                  Message Sent Successfully
                </h3>

                <p className="text-gray-600">
                  Our team will respond within 24 hours.
                </p>

              </div>

            ) : (

              <form onSubmit={handleSubmit} className=" space-y-3 lg:space-y-6">

                <Input
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <Input
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />

                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleChange("subject", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>

                  <SelectContent className="bg-white font-Poppins">
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-[#0c776b] hover:bg-[#0a6a5a] disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}

                  {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                </Button>

              </form>

            )}

          </motion.div>

        </div>

      </div>

    </section>
  );
}